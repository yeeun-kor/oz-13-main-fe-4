import { instance } from '../../../axios/instance';

export interface CurrentWeatherResponse {
  id: number;
  location_name: string;
  base_time: string;
  valid_time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  rain_probability: number | null;
  rain_volume: number | null;
  wind_speed: number;
  condition: string;
  icon: string;
}

export const locationApi = {
  getCurrentLocation: async (latitude: number, longitude: number) => {
    const response = await instance.get<CurrentWeatherResponse>(
      `/weather/current/?lat=${latitude}&lon=${longitude}`
    );

    return {
      locationName: response.data.location_name,
    };
  },
};
