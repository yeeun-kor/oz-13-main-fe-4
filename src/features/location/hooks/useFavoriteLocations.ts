// hooks/useFavoriteLocations.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { locationApi } from '../api/locationApi';
import { CreateFavoriteRequest, ReorderRequest } from '../types/location';

export const useFavoriteLocations = () => {
  const queryClient = useQueryClient();

  // 목록 조회
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['favoriteLocations'],
    queryFn: async () => {
      const response = await locationApi.getFavorites();
      return response.data;
    },
  });
  console.log('favorites 상태:', favorites);
  console.log('error:', error);
  // 추가
  const addMutation = useMutation({
    mutationFn: (data: CreateFavoriteRequest) => locationApi.addFavorite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: number) => locationApi.deleteFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  // 별칭 변경
  const updateAliasMutation = useMutation({
    mutationFn: ({ id, alias }: { id: number; alias: string }) =>
      locationApi.updateAlias(id, { alias }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  // 순서 변경
  const reorderMutation = useMutation({
    mutationFn: (data: ReorderRequest[]) => locationApi.reorderFavorites(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  return {
    favorites,
    isLoading,
    addFavorite: addMutation.mutate,
    deleteFavorite: deleteMutation.mutate,
    updateAlias: updateAliasMutation.mutate,
    reorderFavorites: reorderMutation.mutate,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
