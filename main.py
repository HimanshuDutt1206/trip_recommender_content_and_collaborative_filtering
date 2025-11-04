from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import numpy as np
# Import cosine similarity using numpy implementation to avoid scipy dependency
def cosine_similarity(X, Y):
    """Compute cosine similarity between X and Y using numpy only."""
    X_norm = X / np.linalg.norm(X, axis=1, keepdims=True)
    Y_norm = Y / np.linalg.norm(Y, axis=1, keepdims=True)
    return np.dot(X_norm, Y_norm.T)

# Simulated user database with travel personas
simulated_users = {
    "adventure_enthusiast_001": {
        "liked_cities": ["Queenstown", "Interlaken", "Reykjavik", "Banff", "Patagonia"],
        "preferences": {"adventure": 0.9, "nature": 0.8, "culture": 0.3}
    },
    "cultural_explorer_002": {
        "liked_cities": ["Rome", "Paris", "Kyoto", "Cairo", "Athens"],
        "preferences": {"culture": 0.9, "cuisine": 0.8, "urban": 0.7}
    },
    "beach_lover_003": {
        "liked_cities": ["Maldives", "Bali", "Santorini", "Maui", "Phuket"],
        "preferences": {"beaches": 0.9, "wellness": 0.8, "seclusion": 0.7}
    },
    "urban_professional_004": {
        "liked_cities": ["Tokyo", "New York", "London", "Singapore", "Dubai"],
        "preferences": {"urban": 0.9, "nightlife": 0.8, "cuisine": 0.7}
    },
    "nature_seeker_005": {
        "liked_cities": ["Yellowstone", "Yosemite", "Norwegian Fjords", "Amazon", "Serengeti"],
        "preferences": {"nature": 0.9, "adventure": 0.7, "seclusion": 0.8}
    }
}

# In-memory storage for user feedback (in production, use a database)
user_feedback = {}

# A1. Project Setup and Dependencies
app = FastAPI(title="Travel Destination Recommender", version="1.0.0")

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A2. Data Loading, Encoding, and Preprocessing
print("Loading cities data...")
CITIES_DF = pd.read_csv('cities.csv')
print(f"Loaded {len(CITIES_DF)} cities")

# Create budget mapping dictionary
budget_mapping = {'Budget': 1, 'Mid-range': 2, 'Luxury': 3}

# Apply budget mapping to create numerical budget_score column
CITIES_DF['budget_score'] = CITIES_DF['budget_level'].map(budget_mapping)

# Define the 10 numerical columns for City Vector
vector_columns = ['culture', 'adventure', 'nature', 'beaches', 'nightlife', 'cuisine', 'wellness', 'urban', 'seclusion', 'budget_score']

# Extract CITY_VECTORS matrix
CITY_VECTORS = CITIES_DF[vector_columns].values
print(f"City vectors matrix shape: {CITY_VECTORS.shape}")

# A3. Pydantic User Input Models
class RecommendationRequest(BaseModel):
    culture: float
    adventure: float
    nature: float
    beaches: float
    nightlife: float
    cuisine: float
    wellness: float
    urban: float
    seclusion: float
    budget_level_preference: int

class UserFeedback(BaseModel):
    user_id: str
    city_id: str
    liked: bool

class CollaborativeRequest(BaseModel):
    user_id: str
    liked_cities: List[str]

# Collaborative filtering algorithms
def find_similar_users(user_liked_cities: List[str], all_simulated_users: Dict) -> List[tuple]:
    """
    Find users with similar taste based on Jaccard similarity
    """
    user_city_set = set(user_liked_cities)
    similarities = {}
    
    for user_id, user_data in all_simulated_users.items():
        simulated_city_set = set(user_data["liked_cities"])
        
        # Jaccard similarity: intersection / union
        intersection = len(user_city_set.intersection(simulated_city_set))
        union = len(user_city_set.union(simulated_city_set))
        
        if union > 0:
            similarity = intersection / union
            similarities[user_id] = similarity
    
    # Sort by similarity (descending)
    return sorted(similarities.items(), key=lambda x: x[1], reverse=True)

def get_collaborative_recommendations_helper(user_liked_cities: List[str], similar_users: List[tuple]) -> List[tuple]:
    """
    Get recommendations from similar users in order of similarity
    """
    recommendations = []
    cities_to_show = 5
    
    # Process users in order of similarity (most similar first)
    for user_id, similarity_score in similar_users:
        if len(recommendations) >= cities_to_show:
            break
            
        user_data = simulated_users[user_id]
        
        # Add cities from this user in the order they appear in their liked list
        for city in user_data["liked_cities"]:
            if city not in user_liked_cities and city not in [r[0] for r in recommendations]:
                recommendations.append((city, similarity_score))
                if len(recommendations) >= cities_to_show:
                    break
    
    return recommendations

# A4. Recommendation Endpoint Logic
@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
    # Construct USER_VECTOR (10-dimensional)
    user_vector = np.array([
        request.culture,
        request.adventure,
        request.nature,
        request.beaches,
        request.nightlife,
        request.cuisine,
        request.wellness,
        request.urban,
        request.seclusion,
        request.budget_level_preference
    ]).reshape(1, -1)
    
    # Calculate Cosine Similarity
    similarities = cosine_similarity(user_vector, CITY_VECTORS)[0]
    
    # Get indices sorted by similarity (descending)
    sorted_indices = np.argsort(similarities)[::-1]
    
    # Select top 5 indices
    top_5_indices = sorted_indices[:5]
    
    # Prepare response
    recommendations = []
    for idx in top_5_indices:
        city_data = CITIES_DF.iloc[idx]
        recommendation = {
            "city": city_data['city'],
            "country": city_data['country'],
            "short_description": city_data['short_description'],
            "budget_level": city_data['budget_level'],
            "similarity_score": float(similarities[idx])
        }
        recommendations.append(recommendation)
    
    return {"recommendations": recommendations}

@app.post("/api/user-feedback")
async def record_user_feedback(feedback: UserFeedback):
    """
    Record user feedback for a city (like/dislike)
    """
    # Initialize user feedback if not exists
    if feedback.user_id not in user_feedback:
        user_feedback[feedback.user_id] = {"liked": [], "disliked": []}
    
    # Update feedback
    if feedback.liked:
        if feedback.city_id not in user_feedback[feedback.user_id]["liked"]:
            user_feedback[feedback.user_id]["liked"].append(feedback.city_id)
        # Remove from disliked if it was there
        if feedback.city_id in user_feedback[feedback.user_id]["disliked"]:
            user_feedback[feedback.user_id]["disliked"].remove(feedback.city_id)
    else:
        if feedback.city_id not in user_feedback[feedback.user_id]["disliked"]:
            user_feedback[feedback.user_id]["disliked"].append(feedback.city_id)
        # Remove from liked if it was there
        if feedback.city_id in user_feedback[feedback.user_id]["liked"]:
            user_feedback[feedback.user_id]["liked"].remove(feedback.city_id)
    
    return {"status": "success", "liked_cities": user_feedback[feedback.user_id]["liked"]}

@app.post("/api/collaborative-recommendations")
async def get_collaborative_recommendations_endpoint(request: CollaborativeRequest):
    """
    Get collaborative filtering recommendations based on similar users
    """
    print(f"Received collaborative request for user: {request.user_id}, liked cities: {request.liked_cities}")
    
    # Find similar users based on liked cities
    similar_users = find_similar_users(request.liked_cities, simulated_users)
    print(f"Similar users found: {similar_users}")
    
    # Get recommendations from similar users
    collaborative_recs = get_collaborative_recommendations_helper(
        request.liked_cities,
        similar_users
    )
    print(f"Collaborative recommendations: {collaborative_recs}")
    
    # Convert to full city data format
    recommendations = []
    for city_name, score in collaborative_recs:  # Already limited to 5 in the function
        # Find city data in our dataframe
        city_data = CITIES_DF[CITIES_DF['city'] == city_name]
        if not city_data.empty:
            city_info = city_data.iloc[0]
            recommendation = {
                "city": city_info['city'],
                "country": city_info['country'],
                "short_description": city_info['short_description'],
                "budget_level": city_info['budget_level'],
                "similarity_score": float(score)  # Use collaborative score instead of cosine similarity
            }
            recommendations.append(recommendation)
        else:
            print(f"City not found in dataframe: {city_name}")
    
    print(f"Final recommendations: {recommendations}")
    return {"recommendations": recommendations}

@app.get("/")
async def root():
    return {"message": "Travel Destination Recommender API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
