import { useQuery } from '@tanstack/react-query';
import { weatherAPI } from '../../weather/api/weatherAPI';
import { useLocationStore } from '../../location/store/locationStore';

export const useHourlyWeather = () => {
  const { latitude, longitude } = useLocationStore();

  const {
    data: forecast,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['hourlyWeather', latitude, longitude],
    queryFn: () => {
      if (!latitude || !longitude) {
        throw new Error('위치 정보가 없습니다.');
      }
      return weatherAPI.getForecast(latitude, longitude);
    },
    enabled: !!latitude && !!longitude,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  });

  return {
    forecast,
    isLoading,
    error,
    refetch,
  };
};
