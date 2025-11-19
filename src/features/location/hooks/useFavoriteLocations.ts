import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
  updateFavoriteAlias,
  reorderFavorites,
  AddFavoriteRequest,
  ReorderRequest,
} from '../../favorite/api/favoriteAPI';
import { useAuthStore } from '../../auth/store/authStore';

export const useFavoriteLocations = () => {
  const queryClient = useQueryClient();
  const { access } = useAuthStore();

  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['favoriteLocations'],
    queryFn: getFavorites,
    enabled: !!access,
  });

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  const updateAliasMutation = useMutation({
    mutationFn: ({ id, alias }: { id: number; alias: string }) =>
      updateFavoriteAlias(id, { alias }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteLocations'] });
    },
  });

  return {
    favorites,
    isLoading,
    error,
    addFavorite: addMutation.mutate,
    deleteFavorite: deleteMutation.mutate,
    updateAlias: updateAliasMutation.mutate,
    reorderFavorites: reorderMutation.mutate,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
