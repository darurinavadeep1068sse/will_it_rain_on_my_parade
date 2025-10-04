import { useState } from 'react';
import LocationSelector from './components/LocationSelector';
import WeatherResults from './components/WeatherResults';
import { WeatherQuery, WeatherResults as WeatherResultsType } from './types/weather';
import { getWeatherData, calculateWeatherProbabilities } from './services/weatherService';

function App() {
  const today = new Date().toISOString().split('T')[0];

  const [query, setQuery] = useState<WeatherQuery>({
    locationName: '',
    latitude: null,
    longitude: null,
    date: today,
    parameters: []
  });

  const [results, setResults] = useState<WeatherResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (locationName: string, lat: number, lon: number) => {
    setQuery(prev => ({
      ...prev,
      locationName,
      latitude: lat,
      longitude: lon
    }));
  };

  const handleDateChange = (date: string) => {
    setQuery(prev => ({ ...prev, date }));
  };

  const handleAnalyze = async () => {
    if (!query.latitude || !query.longitude || !query.date) {
      alert('Please select a location and date before analyzing');
      return;
    }

    setIsLoading(true);

    try {
      const weatherData = await getWeatherData(query.latitude, query.longitude);

      const weatherProbabilities = calculateWeatherProbabilities(weatherData, query.date);

      const analysisResults: WeatherResultsType = {
        location: query.locationName,
        date: query.date,
        coordinates: { lat: query.latitude, lon: query.longitude },
        data: weatherProbabilities
      };

      setResults(analysisResults);
    } catch (error) {
      console.error('Error analyzing weather:', error);
      alert('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-4">
            <h1 className="text-5xl font-bold text-white">
              Will It Rain On My Parade?
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Discover the likelihood of weather conditions for your outdoor events using NASA Earth observation data
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <LocationSelector
              onLocationChange={handleLocationChange}
              onDateChange={handleDateChange}
              selectedDate={query.date}
              selectedLat={query.latitude}
              selectedLon={query.longitude}
            />

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-xl p-6 border border-green-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">Weather Analysis</h2>
              <p className="text-sm text-gray-700 mb-4 font-medium">
                Click the button below to analyze all weather parameters for your selected location and date.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !query.latitude || !query.date}
                className="w-full bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 hover:from-green-600 hover:via-teal-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                {isLoading ? '🔄 Analyzing Weather Data...' : '🌤️ Analyze Weather Probability'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 sticky top-8 border border-yellow-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">ℹ️</span>
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">About This Tool</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-medium">
                  🌍 This tool uses real-time weather data and historical patterns to predict weather probabilities for your chosen location and date.
                </p>
                <p className="font-medium">
                  📊 The analysis automatically evaluates all critical weather parameters including temperature extremes, precipitation, wind, humidity, and cloud cover.
                </p>
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <p className="text-xs text-gray-700 font-semibold">
                    🚀 NASA Space Apps Challenge 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {results && (
          <WeatherResults results={results} />
        )}
      </div>
    </div>
  );
}

export default App;
