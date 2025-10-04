export interface WeatherQuery {
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  parameters: string[];
}

export interface WeatherDataPoint {
  parameter: string;
  mean: number;
  probability: number;
  threshold: number;
  unit: string;
  historicalRange: {
    min: number;
    max: number;
  };
}

export interface WeatherResults {
  location: string;
  date: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  data: WeatherDataPoint[];
}

export interface WeatherParameter {
  id: string;
  name: string;
  description: string;
  icon: string;
}
