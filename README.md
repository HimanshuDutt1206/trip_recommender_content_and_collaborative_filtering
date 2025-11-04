# 🗺️ Travel Destination Recommender

A travel destination recommendation system using 10-dimensional vector matching and collaborative filtering to suggest personalized destinations.

## 🌟 Features

- **10-Dimensional Preference System**: Culture, Adventure, Nature, Beaches, Nightlife, Cuisine, Wellness, Urban, Seclusion, Budget
- **Dual Recommendation Engine**: 
  - Content-based filtering (cosine similarity)
  - Collaborative filtering (similar users' preferences)
- **User Feedback System**: Like destinations to improve recommendations
- **Similar Traveler Matching**: Discover destinations from users with similar taste
- **560+ Destinations**: Comprehensive global travel database

## 🏗️ Architecture

**Backend (FastAPI)**:
- Python with Pandas, NumPy
- Cosine similarity for content-based recommendations
- Jaccard similarity for collaborative filtering
- In-memory storage with 5 simulated user personas

**Frontend (React)**:
- React 18 with Tailwind CSS
- Interactive preference sliders
- Dual recommendation display with user feedback interface

## 📊 How It Works

**Content-Based Filtering**:
1. User preferences → 10D vector
2. Cosine similarity with all destinations
3. Top 5 recommendations by match percentage

**Collaborative Filtering**:
1. User likes destinations → preference profile
2. Find similar users using Jaccard similarity
3. Recommend destinations liked by similar users
4. 5 personas: Adventure Enthusiast, Cultural Explorer, Beach Lover, Urban Professional, Nature Seeker

## 🚀 Quick Start

### Prerequisites
- Python 3.8+, Node.js 16+, npm

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd travel-destination-recommender

# Backend
pip install -r requirements.txt

# Frontend
npm install
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
```

### Running
```bash
# Terminal 1: Backend
python main.py
# API: http://localhost:8000

# Terminal 2: Frontend
npm start
# App: http://localhost:3000
```

## 📡 API Endpoints

- `POST /api/recommendations` - Content-based recommendations
- `POST /api/user-feedback` - Record user likes
- `POST /api/collaborative-recommendations` - Collaborative filtering
- `GET /` - Health check

## 🗂️ Project Structure

```
├── main.py                 # FastAPI backend with dual recommendation engine
├── cities.csv             # Destination database
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
├── src/
│   └── App.jsx            # React component with collaborative UI
└── public/
    └── index.html         # HTML template
```

## 🎯 Usage

1. Adjust preference sliders for each dimension
2. Select budget level (Budget/Mid-range/Luxury)
3. Get personalized recommendations
4. Like destinations to improve recommendations
5. Explore collaborative recommendations from similar travelers

---

**Happy Travels! 🌍✈️**
