import React, { useState } from 'react';

function App() {
  // B1. Core State Management
  const [preferences, setPreferences] = useState({
    culture: 3.0,
    adventure: 3.0,
    nature: 3.0,
    beaches: 3.0,
    nightlife: 3.0,
    cuisine: 3.0,
    wellness: 3.0,
    urban: 3.0,
    seclusion: 3.0,
    budget_level_preference: 2
  });

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLikedCities, setUserLikedCities] = useState([]);
  const [showCollaborative, setShowCollaborative] = useState(false);
  const [collaborativeRecommendations, setCollaborativeRecommendations] = useState([]);
  const [isLoadingCollaborative, setIsLoadingCollaborative] = useState(false);

  // B2. User Input Form Handlers
  const handleSliderChange = (attribute, value) => {
    setPreferences(prev => ({
      ...prev,
      [attribute]: parseFloat(value)
    }));
  };

  const handleBudgetChange = (budgetLevel) => {
    const budgetMapping = { 'Budget': 1, 'Mid-range': 2, 'Luxury': 3 };
    setPreferences(prev => ({
      ...prev,
      budget_level_preference: budgetMapping[budgetLevel]
    }));
  };

  // B3. API Integration
  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeCity = async (cityId, liked) => {
    // Update local state
    const updatedLikes = liked
      ? [...userLikedCities, cityId]
      : userLikedCities.filter(id => id !== cityId);
    
    setUserLikedCities(updatedLikes);
    
    // Send feedback to backend
    try {
      const response = await fetch('http://localhost:8000/api/user-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'current_user',
          city_id: cityId,
          liked: liked
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to record feedback');
      }
      
      const data = await response.json();
      console.log('Feedback recorded:', data);
    } catch (error) {
      console.error('Error recording feedback:', error);
    }
    
    // Enable collaborative button if user has liked at least 1 city
    if (updatedLikes.length > 0) {
      setShowCollaborative(true);
    }
  };

  const handleCollaborativeRecommendations = async () => {
    setIsLoadingCollaborative(true);
    try {
      console.log('Fetching collaborative recommendations for cities:', userLikedCities);
      const response = await fetch('http://localhost:8000/api/collaborative-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'current_user',
          liked_cities: userLikedCities
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch collaborative recommendations');
      }
      
      const data = await response.json();
      console.log('Collaborative recommendations received:', data);
      setCollaborativeRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching collaborative recommendations:', error);
    } finally {
      setIsLoadingCollaborative(false);
    }
  };

  // B4. Results Display Components
  const CityCard = ({ city, country, short_description, budget_level, similarity_score, isCollaborative = false }) => {
    const matchPercentage = Math.round(similarity_score * 100);
    const isLiked = userLikedCities.includes(city);
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{city}, {country}</h3>
          <span className={`${isCollaborative ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} text-sm font-semibold px-3 py-1 rounded-full`}>
            {isCollaborative ? 'Similar Travelers' : `${matchPercentage}% Match`}
          </span>
        </div>
        
        <div className="mb-3">
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
            budget_level === 'Budget' ? 'bg-green-100 text-green-800' :
            budget_level === 'Mid-range' ? 'bg-yellow-100 text-yellow-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {budget_level}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{short_description}</p>
        
        {!isCollaborative && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleLikeCity(city, !isLiked)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLiked
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isLiked ? '❤️ Liked' : '🤍 Like'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const attributeLabels = {
    culture: 'Culture',
    adventure: 'Adventure',
    nature: 'Nature',
    beaches: 'Beaches',
    nightlife: 'Nightlife',
    cuisine: 'Cuisine',
    wellness: 'Wellness',
    urban: 'Urban',
    seclusion: 'Seclusion'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🗺️ Travel Destination Recommender</h1>
          <p className="text-gray-600">Find your perfect travel destination based on your preferences</p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Travel Preferences</h2>
            
            {/* Sliders for 9 Attributes */}
            <div className="space-y-4 mb-6">
              {Object.entries(attributeLabels).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <span className="text-sm text-gray-500">{preferences[key].toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={preferences[key]}
                    onChange={(e) => handleSliderChange(key, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>

            {/* Budget Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 block mb-3">Budget Level</label>
              <div className="flex space-x-2">
                {['Budget', 'Mid-range', 'Luxury'].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => handleBudgetChange(budget)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      (budget === 'Budget' && preferences.budget_level_preference === 1) ||
                      (budget === 'Mid-range' && preferences.budget_level_preference === 2) ||
                      (budget === 'Luxury' && preferences.budget_level_preference === 3)
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={fetchRecommendations}
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? 'Finding Destinations...' : 'Get Recommendations'}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Destinations</h2>
            
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {!isLoading && recommendations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">✈️</div>
                <p>Set your preferences and click "Get Recommendations" to discover amazing destinations!</p>
              </div>
            )}
            
            {!isLoading && recommendations.length > 0 && (
              <div className="space-y-4">
                {recommendations.map((city, index) => (
                  <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                    <CityCard {...city} />
                  </div>
                ))}
              </div>
            )}

            {/* Collaborative Recommendations Section */}
            {showCollaborative && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">🎯 Discover Similar Travelers' Favorites</h3>
                  <button
                    onClick={handleCollaborativeRecommendations}
                    disabled={isLoadingCollaborative}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isLoadingCollaborative
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isLoadingCollaborative ? 'Loading...' : 'Explore Travelers Like You'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collaborative Recommendations Section - Below Main Content */}
        {showCollaborative && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">🎯 Travelers Like You Also Loved</h2>
              
              {isLoadingCollaborative && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              )}
              
              {!isLoadingCollaborative && collaborativeRecommendations.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Top 5 cities from travelers with similar taste, ordered by similarity:</p>
                  {collaborativeRecommendations.map((city, index) => (
                    <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in border border-purple-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{city.city}, {city.country}</h3>
                          <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {Math.round(city.similarity_score * 100)}% Similar
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                            city.budget_level === 'Budget' ? 'bg-green-100 text-green-800' :
                            city.budget_level === 'Mid-range' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {city.budget_level}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{city.short_description}</p>
                        
                        <div className="text-xs text-gray-500">
                          Recommended from similar travelers (similarity: {Math.round(city.similarity_score * 100)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoadingCollaborative && collaborativeRecommendations.length === 0 && userLikedCities.length > 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">👥</div>
                  <p>Click "Explore Travelers Like You" above to see personalized recommendations</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
