# 🗺️ 10-Dimensional Travel Destination Recommender

A sophisticated travel destination recommendation system that uses 10-dimensional vector matching to suggest personalized travel destinations based on user preferences.

## 🌟 Features

- **10-Dimensional Preference System**: Culture, Adventure, Nature, Beaches, Nightlife, Cuisine, Wellness, Urban, Seclusion, and Budget
- **Intelligent Matching**: Cosine similarity algorithm for accurate destination recommendations
- **Modern UI**: React frontend with Tailwind CSS for a beautiful, responsive interface
- **Real-time API**: FastAPI backend with fast recommendation processing
- **560+ Destinations**: Comprehensive database of global travel destinations

## 🏗️ Architecture

### Backend (FastAPI)
- **Python** with FastAPI framework
- **Pandas** for data processing
- **NumPy** for vector operations
- **Custom cosine similarity** implementation
- **Pydantic** for data validation

### Frontend (React)
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Responsive design** for all devices
- **Real-time API integration**
- **Interactive sliders** for preference input

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-destination-recommender
   ```

2. **Set up the backend**
   ```bash
   # Install Python dependencies from requirements.txt
   pip install -r requirements.txt
   
   # The backend is ready to run!
   ```

3. **Set up the frontend**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Build Tailwind CSS
   npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## 📊 How It Works

### 10-Dimensional Vector System

Each destination is represented as a 10-dimensional vector:

1. **Culture** (1-5): Historical sites, museums, local traditions
2. **Adventure** (1-5): Outdoor activities, extreme sports, exploration
3. **Nature** (1-5): Natural landscapes, wildlife, outdoor experiences
4. **Beaches** (1-5): Coastal areas, water activities, beach quality
5. **Nightlife** (1-5): Entertainment venues, bars, clubs, evening activities
6. **Cuisine** (1-5): Food quality, dining experiences, local specialties
7. **Wellness** (1-5): Spas, relaxation, health activities
8. **Urban** (1-5): City experiences, shopping, metropolitan amenities
9. **Seclusion** (1-5): Privacy, quiet areas, escape from crowds
10. **Budget Score** (1-3): Budget (1), Mid-range (2), Luxury (3)

### Recommendation Algorithm

1. **User Input**: Preferences are collected via interactive sliders
2. **Vector Creation**: User preferences are converted to a 10D vector
3. **Cosine Similarity**: Calculate similarity between user vector and all destination vectors
4. **Ranking**: Destinations are ranked by similarity score
5. **Results**: Top 5 recommendations are returned with match percentages

## 🎯 Usage Example

1. **Adjust Your Preferences**: Use the sliders to set your preferences for each dimension
2. **Select Budget**: Choose your budget level (Budget, Mid-range, or Luxury)
3. **Get Recommendations**: Click "Get Recommendations" to receive personalized suggestions
4. **Explore Results**: View detailed information about each recommended destination

## 📡 API Endpoints

### POST `/api/recommendations`
Request body:
```json
{
  "culture": 4.0,
  "adventure": 3.0,
  "nature": 2.0,
  "beaches": 5.0,
  "nightlife": 3.0,
  "cuisine": 4.0,
  "wellness": 2.0,
  "urban": 3.0,
  "seclusion": 1.0,
  "budget_level_preference": 2
}
```

Response:
```json
{
  "recommendations": [
    {
      "city": "San Sebastián",
      "country": "Spain",
      "short_description": "Golden beaches meet vibrant pintxo bars...",
      "budget_level": "Mid-range",
      "similarity_score": 0.9859510600014839
    }
  ]
}
```

### GET `/`
Health check endpoint returning API status.

## 🗂️ Project Structure

```
travel-destination-recommender/
├── main.py                 # FastAPI backend application
├── cities.csv             # Destination database
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── public/
│   └── index.html         # HTML template
└── src/
    ├── App.jsx            # Main React component
    ├── index.css          # Tailwind CSS styles
    └── index.js           # React entry point
```

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing and vector operations
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **React 18**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **React Scripts**: Build and development tooling

## 🎨 Design Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Sliders**: Smooth, intuitive preference input
- **Real-time Updates**: Instant feedback as you adjust preferences
- **Beautiful Cards**: Elegant display of recommendation results
- **Smooth Transitions**: Modern animations and micro-interactions
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📈 Performance

- **Fast API Response**: < 100ms recommendation generation
- **Efficient Vector Math**: Optimized cosine similarity calculations
- **Lightweight Frontend**: Fast loading and smooth interactions
- **Scalable Architecture**: Easy to extend with more destinations

## 🔧 Customization

### Adding New Destinations
1. Update `cities.csv` with new destination data
2. Ensure all 10 dimensions are scored (1-5 for attributes, 1-3 for budget)
3. Restart the backend server

### Modifying Preference Weights
Edit the vector calculation in `main.py` to adjust the importance of different dimensions.

### Styling Changes
Modify `tailwind.config.js` and `src/index.css` for custom styling.

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**: Ensure Python dependencies are installed
2. **Frontend not loading**: Check that `npm install` completed successfully
3. **API connection error**: Verify both servers are running on correct ports
4. **No recommendations**: Check that all preference sliders are set

### Port Conflicts
- Backend: Default port 8000 (change in `main.py`)
- Frontend: Default port 3000 (change via `PORT` environment variable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Acknowledgments

- Destination data sourced from various travel databases
- Built with modern web development best practices
- Inspired by recommendation systems in travel technology

---

**Happy Travels! 🌍✈️**
