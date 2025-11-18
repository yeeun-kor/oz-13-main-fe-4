export interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_probability: number;
  rain_volume: number;
  main: string;
  condition: string;
  icon: string; // iconCode - (ex '01d', '10n')
}

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  icon: string;
  condition?: string;
  main?: string;
  rain_probability: number;
  feels_like: number;
}
