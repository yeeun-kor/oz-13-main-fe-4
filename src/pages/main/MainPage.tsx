import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { CurrentWeather } from '../../features/main/components/CurrentWeather';
import { TodayOutfitRecommendation } from '../../features/main/components/TodayOutfitRecommendation';
import { HourlyWeather } from '../../features/main/components/HourlyWeather';
import { AIRecommendation } from '../../features/main/components/AIRecommendation';
import { FavoriteLocationOutfitRecommendation } from '../../features/main/components/FavoriteLocationOutfitRecommendation';
import FavoriteRegionModal from '../../components/Modal/FavoriteRegionModal';
import { useFavoriteLocations } from '../../features/location/hooks/useFavoriteLocations';
import { FavoriteLocation } from '../../features/favorite/api/favoriteAPI';
import {
  ComponentsGrid,
  MainContainer,
  RecommendCard,
} from '../../features/main/styles/MainPageContentStyles';
import { EmptyFavorites } from '../../features/main/components/EmptyFavorite';
import { FavoritesSection } from '../../features/main/components/FavoriteSection';
import { useAuthStore } from '../../features/auth/store/authStore';

export const MainPage = () => {
  const { favorites, isLoading, addFavorite, deleteFavorite, updateAlias, reorderFavorites } =
    useFavoriteLocations();
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { access } = useAuthStore();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleFavoriteSelect = (id: number) => {
    setSelectedFavoriteId(id);
  };

  const handleAddClick = () => {
    if (favorites.length >= 3) {
      showSnackbar('즐겨찾기는 최대 3개까지 등록 가능합니다.', 'error');
      return;
    }
    setModalOpen(true);
  };

  const handleSave = (data: { city: string; district: string }) => {
    addFavorite(data);
    setModalOpen(false);
    showSnackbar('추가되었습니다.', 'success');
  };

  const handleAliasUpdate = (id: number, alias: string) => {
    updateAlias({ id, alias });
    showSnackbar('별칭이 변경되었습니다.', 'success');
  };

  const handleDelete = (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    deleteFavorite(id);

    if (selectedFavoriteId === id) {
      const remaining = favorites.filter((f) => f.id !== id);
      setSelectedFavoriteId(remaining.length > 0 ? remaining[0].id : null);
    }

    showSnackbar('삭제되었습니다.', 'success');
  };

  const handleReorder = (newFavorites: FavoriteLocation[]) => {
    const reorderData = newFavorites.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    reorderFavorites(reorderData);
    showSnackbar('순서가 변경되었습니다.', 'success');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const selectedFavorite = favorites.find((f) => f.id === selectedFavoriteId);

  if (isLoading) {
    return <MainContainer>로딩 중...</MainContainer>;
  }

  return (
    <MainContainer>
      <ComponentsGrid>
        <CurrentWeather onEditLocation={handleAddClick} />
        <TodayOutfitRecommendation />
        <HourlyWeather />
        <AIRecommendation />

        {/* 로그인 상태일 때만 즐겨찾기 관련 컨텐츠 표시 */}
        {access && favorites.length === 0 && (
          <EmptyFavorites
            onSuccess={() => showSnackbar('추가되었습니다.', 'success')}
            onError={(msg) => showSnackbar(msg, 'error')}
          />
        )}

        {access && favorites.length > 0 && (
          <>
            <FavoritesSection
              favorites={favorites}
              selectedFavoriteId={selectedFavoriteId}
              onFavoriteSelect={handleFavoriteSelect}
              onAddClick={handleAddClick}
              onAliasUpdate={handleAliasUpdate}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />

            <RecommendCard>
              {selectedFavorite && (
                <FavoriteLocationOutfitRecommendation favorite={selectedFavorite} />
              )}
            </RecommendCard>
          </>
        )}
      </ComponentsGrid>

      <FavoriteRegionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </MainContainer>
  );
};
