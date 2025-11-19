import { useQuery } from '@tanstack/react-query';
import { weatherAPI } from '../../weather/api/weatherAPI';

export const useCurrentWeatherByLocation = ({
  city,
  district,
}: {
  city: string;
  district: string;
}) => {
  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentWeather', city, district],
    queryFn: () => {
      if (!city || !district) {
        throw new Error('위치 정보가 없습니다.');
      }
      return weatherAPI.getCurrentWeatherByLocation(city, district);
    },
    enabled: !!city && !!district,
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
