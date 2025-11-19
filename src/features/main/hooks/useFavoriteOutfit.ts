import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '../../location/store/locationStore';
import { useAuthStore } from '../../auth/store/authStore';
import { outfitAPI } from '../../recommendation/api/outfitAPI';

export const useFavoriteOutfit = ({ city, district }: { city: string; district: string }) => {
  const { access } = useAuthStore();

  const {
    data: outfit,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['favoriteOutfit', city, district],
    queryFn: () => {
      if (!access) {
        throw new Error('접근 권한이 없습니다.');
      }
      if (!city || !district) {
        throw new Error('위치 정보가 없습니다.');
      }
      return outfitAPI.getRecommendationByLocation(city, district);
    },
    enabled: !!access && !!city && !!district,
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
