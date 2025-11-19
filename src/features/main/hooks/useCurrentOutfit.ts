import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '../../location/store/locationStore';
import { useAuthStore } from '../../auth/store/authStore';
import { outfitAPI } from '../../recommendation/api/outfitAPI';

export const useCurrentOutfit = () => {
  const { latitude, longitude } = useLocationStore();
  const { access } = useAuthStore();

  const {
    data: outfit,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentOutfit', latitude, longitude],
    queryFn: () => {
      if (!latitude || !longitude) {
        throw new Error('위치 정보가 없습니다.');
      }
      return outfitAPI.getRecommendationByCoords(latitude, longitude);
    },
    enabled: !!latitude && !!longitude,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    outfit,
    isLoading,
    error,
    refetch,
  };
};
