import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '../../location/store/locationStore';
import { weatherAPI } from '../../weather/api/weatherAPI';

export const useCurrentWeather = () => {
  const { latitude, longitude } = useLocationStore();

  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentWeather', latitude, longitude],
    queryFn: () => {
      if (!latitude || !longitude) {
        throw new Error('위치 정보가 없습니다.');
      }
      return weatherAPI.getCurrentWeather(latitude, longitude);
    },
    enabled: !!latitude && !!longitude,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    weather,
    isLoading,
    error,
    refetch,
  };
};
