import { MapPin, Calendar, Navigation } from 'lucide-react';
import { useState } from 'react';
import InteractiveMap from './InteractiveMap';

interface LocationSelectorProps {
  onLocationChange: (locationName: string, lat: number, lon: number) => void;
  onDateChange: (date: string) => void;
  selectedDate: string;
  selectedLat: number | null;
  selectedLon: number | null;
}

const popularLocations = [
  { name: 'New York, NY', lat: 40.7128, lon: -74.0060 },
  { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
  { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
  { name: 'Miami, FL', lat: 25.7617, lon: -80.1918 },
  { name: 'Denver, CO', lat: 39.7392, lon: -104.9903 },
  { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 }
];

function LocationSelector({ onLocationChange, onDateChange, selectedDate, selectedLat, selectedLon }: LocationSelectorProps) {
  const [locationInput, setLocationInput] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleQuickSelect = (location: typeof popularLocations[0]) => {
    setLocationInput(location.name);
    onLocationChange(location.name, location.lat, location.lon);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const locationName = data.city || data.locality || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          setLocationInput(locationName);
          onLocationChange(locationName, latitude, longitude);
        } catch (error) {
          const locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocationInput(locationName);
          onLocationChange(locationName, latitude, longitude);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        alert('Unable to retrieve your location: ' + error.message);
      }
    );
  };

  const handleMapLocationSelect = (locationName: string, lat: number, lon: number) => {
    setLocationInput(locationName);
    onLocationChange(locationName, lat, lon);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Select Your Location
          </h2>
        </div>

        <InteractiveMap
          onLocationSelect={handleMapLocationSelect}
          selectedLat={selectedLat}
          selectedLon={selectedLon}
        />

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selected Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Click on the map or use current location"
                className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                readOnly
              />
              <button
                onClick={handleCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg transform hover:scale-105 whitespace-nowrap"
              >
                <Navigation className="w-5 h-5" />
                {isGettingLocation ? 'Getting...' : 'My Location'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quick Select Popular Locations
            </label>
            <div className="grid grid-cols-3 gap-2">
              {popularLocations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleQuickSelect(loc)}
                  className="px-3 py-2 text-sm bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 text-orange-800 font-medium rounded-lg transition-all transform hover:scale-105 shadow-sm"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Select Date
          </h2>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-lg"
        />
      </div>
    </div>
  );
}

export default LocationSelector;
