import { CheckCircle2, Circle, Thermometer, CloudRain, Wind, Sun, Cloud, Droplets } from 'lucide-react';
import { WeatherParameter } from '../types/weather';

interface ParameterSelectorProps {
  selectedParameters: string[];
  onParametersChange: (parameters: string[]) => void;
}

const weatherParameters: WeatherParameter[] = [
  {
    id: 'extreme-heat',
    name: 'Extreme Heat',
    description: 'High temperature conditions above 90°F',
    icon: 'thermometer'
  },
  {
    id: 'extreme-cold',
    name: 'Extreme Cold',
    description: 'Low temperature conditions below 32°F',
    icon: 'thermometer'
  },
  {
    id: 'heavy-precipitation',
    name: 'Heavy Precipitation',
    description: 'Rainfall exceeding 2 inches per day',
    icon: 'cloud-rain'
  },
  {
    id: 'high-wind',
    name: 'High Wind Speed',
    description: 'Wind speeds exceeding 20 mph',
    icon: 'wind'
  },
  {
    id: 'humidity',
    name: 'High Humidity',
    description: 'Relative humidity above 80%',
    icon: 'droplets'
  },
  {
    id: 'cloud-cover',
    name: 'Heavy Cloud Cover',
    description: 'Cloud cover exceeding 75%',
    icon: 'cloud'
  }
];

const iconMap: Record<string, React.ReactNode> = {
  thermometer: <Thermometer className="w-6 h-6" />,
  'cloud-rain': <CloudRain className="w-6 h-6" />,
  wind: <Wind className="w-6 h-6" />,
  sun: <Sun className="w-6 h-6" />,
  cloud: <Cloud className="w-6 h-6" />,
  droplets: <Droplets className="w-6 h-6" />
};

function ParameterSelector({ selectedParameters, onParametersChange }: ParameterSelectorProps) {
  const toggleParameter = (parameterId: string) => {
    if (selectedParameters.includes(parameterId)) {
      onParametersChange(selectedParameters.filter(p => p !== parameterId));
    } else {
      onParametersChange([...selectedParameters, parameterId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Parameters</h2>
      <p className="text-sm text-gray-600 mb-4">
        Select the weather conditions you want to analyze
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        {weatherParameters.map((param) => {
          const isSelected = selectedParameters.includes(param.id);

          return (
            <button
              key={param.id}
              onClick={() => toggleParameter(param.id)}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                {iconMap[param.icon]}
              </div>

              <div className="flex-grow text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {param.name}
                  </h3>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <p className="text-xs text-gray-600">{param.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedParameters.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{selectedParameters.length}</span> parameter{selectedParameters.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}

export default ParameterSelector;
