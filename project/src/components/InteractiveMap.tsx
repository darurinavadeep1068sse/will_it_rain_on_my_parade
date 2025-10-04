import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  onLocationSelect: (locationName: string, lat: number, lon: number) => void;
  selectedLat: number | null;
  selectedLon: number | null;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  const customIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

function InteractiveMap({ onLocationSelect, selectedLat, selectedLon }: InteractiveMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (selectedLat !== null && selectedLon !== null) {
      setMapCenter([selectedLat, selectedLon]);
      setZoom(10);
    }
  }, [selectedLat, selectedLon]);

  const handleLocationSelect = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      const locationName = data.city || data.locality || data.countryName || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      onLocationSelect(locationName, lat, lon);
    } catch (error) {
      const locationName = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      onLocationSelect(locationName, lat, lon);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-700">
          Click anywhere on the map to select a location
        </p>
      </div>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '500px', width: '100%', borderRadius: '12px' }}
        className="shadow-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={handleLocationSelect} />
        {selectedLat !== null && selectedLon !== null && (
          <Marker
            position={[selectedLat, selectedLon]}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;
