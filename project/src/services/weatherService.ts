export interface WeatherApiResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    clouds: number;
    weather: Array<{
      main: string;
      description: string;
    }>;
  };
  daily?: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
      day: number;
    };
    humidity: number;
    wind_speed: number;
    clouds: number;
    pop: number;
    rain?: number;
  }>;
}

const OPENWEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

export async function getWeatherData(lat: number, lon: number): Promise<WeatherApiResponse> {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
      const response2 = await fetch(url2);
      const data = await response2.json();

      return {
        current: {
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          clouds: data.clouds.all,
          weather: data.weather
        }
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function getForecastData(lat: number, lon: number): Promise<any> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
}

export function calculateWeatherProbabilities(currentWeather: WeatherApiResponse, targetDate: string) {
  const now = new Date();
  const target = new Date(targetDate);
  const daysUntil = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const current = currentWeather.current;

  const baseTemp = current.temp;
  const tempVariation = 15;
  const seasonalFactor = Math.cos((new Date(targetDate).getMonth() - 6) * Math.PI / 6);

  const extremeHeatThreshold = 90;
  const extremeColdThreshold = 32;
  const heavyPrecipThreshold = 0.5;
  const highWindThreshold = 20;
  const highHumidityThreshold = 80;
  const heavyCloudThreshold = 75;

  const tempMean = baseTemp + (seasonalFactor * 10);
  const extremeHeatProb = Math.max(0, Math.min(100, ((tempMean - extremeHeatThreshold) / tempVariation) * 100 + 30));
  const extremeColdProb = Math.max(0, Math.min(100, ((extremeColdThreshold - tempMean) / tempVariation) * 100 + 10));

  const precipProbBase = daysUntil <= 7 && currentWeather.daily ?
    (currentWeather.daily[0]?.pop || 0) * 100 :
    Math.random() * 40 + 20;

  const results = [
    {
      parameter: 'Extreme Heat',
      mean: tempMean,
      probability: extremeHeatProb,
      threshold: extremeHeatThreshold,
      unit: '°F',
      historicalRange: {
        min: tempMean - 20,
        max: tempMean + 20
      }
    },
    {
      parameter: 'Extreme Cold',
      mean: tempMean,
      probability: extremeColdProb,
      threshold: extremeColdThreshold,
      unit: '°F',
      historicalRange: {
        min: tempMean - 25,
        max: tempMean + 15
      }
    },
    {
      parameter: 'Heavy Precipitation',
      mean: 0.3,
      probability: precipProbBase,
      threshold: heavyPrecipThreshold,
      unit: 'inches',
      historicalRange: {
        min: 0,
        max: 2.5
      }
    },
    {
      parameter: 'High Wind Speed',
      mean: current.wind_speed,
      probability: Math.max(0, Math.min(100, ((current.wind_speed - highWindThreshold) / 10) * 100 + 40)),
      threshold: highWindThreshold,
      unit: 'mph',
      historicalRange: {
        min: 5,
        max: 35
      }
    },
    {
      parameter: 'High Humidity',
      mean: current.humidity,
      probability: Math.max(0, Math.min(100, ((current.humidity - highHumidityThreshold) / 20) * 100 + 50)),
      threshold: highHumidityThreshold,
      unit: '%',
      historicalRange: {
        min: 40,
        max: 95
      }
    },
    {
      parameter: 'Heavy Cloud Cover',
      mean: current.clouds,
      probability: Math.max(0, Math.min(100, ((current.clouds - heavyCloudThreshold) / 25) * 100 + 45)),
      threshold: heavyCloudThreshold,
      unit: '%',
      historicalRange: {
        min: 10,
        max: 100
      }
    }
  ];

  return results;
}
