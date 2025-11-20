import { create } from 'zustand';

interface WeatherState {
  feels_like: number | null;
  condition: string | null;
  humidity: number | null;
  temperature: number | null;
  setFeelsLike: (feelsLike: number) => void;
  setCondition: (condition: string) => void;
  setHumidity: (humidity: number) => void;
  setTemperature: (temperature: number) => void;
  clearWeather: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  feels_like: null,
  condition: null,
  humidity: null,
  temperature: null,
  setFeelsLike: (feelsLike: number) => set({ feels_like: feelsLike }),
  setCondition: (condition: string) => set({ condition }),
  setHumidity: (humidity: number) => set({ humidity }),
  setTemperature: (temperature: number) => set({ temperature }),
  clearWeather: () => set({ feels_like: null, condition: null, humidity: null, temperature: null }),
}));
