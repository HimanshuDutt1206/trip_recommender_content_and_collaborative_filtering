from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
# Import cosine similarity using numpy implementation to avoid scipy dependency
def cosine_similarity(X, Y):
    """Compute cosine similarity between X and Y using numpy only."""
    X_norm = X / np.linalg.norm(X, axis=1, keepdims=True)
    Y_norm = Y / np.linalg.norm(Y, axis=1, keepdims=True)
    return np.dot(X_norm, Y_norm.T)

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

# A3. Pydantic User Input Model
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

@app.get("/")
async def root():
    return {"message": "Travel Destination Recommender API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
