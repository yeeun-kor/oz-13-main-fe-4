import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { AxiosError } from 'axios';
import { CurrentWeather } from '../../features/main/components/CurrentWeather';

import { HourlyWeather } from '../../features/main/components/HourlyWeather';
import { TodayOutfitRecommendation } from '../../features/main/components/TodayOutfitRecommendation';
import { FavoriteLocationOutfitRecommendation } from '../../features/main/components/FavoriteLocationOutfitRecommendation';

import {
  getFavorites,
  addFavorite,
  deleteFavorite,
  updateFavoriteAlias,
  reorderFavorites,
  type FavoriteLocation,
} from '../../features/favorite/api/favoriteAPI';
import {
  ComponentsGrid,
  FullWidthCard,
  MainContainer,
  RecommendCard,
} from '../../features/main/styles/MainPageContentStyles';
import { EmptyFavorites } from '../../features/main/components/EmptyFavorite';
import { FavoritesSection } from '../../features/main/components/FavoriteSection';
import FavoriteRegionModal from '../../components/Modal/FavoriteRegionModal';
import { AIRecommendation } from '../../features/main/components/AIRecommendation';

const MAX_FAVORITES = 3;

export const MainPage = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();

      if (!Array.isArray(data)) {
        console.error('Invalid favorites data:', data);
        setFavorites([]);
        setSelectedFavoriteId(null);
        return;
      }

      setFavorites(data);

      if (data.length > 0 && selectedFavoriteId === null) {
        setSelectedFavoriteId(data[0]?.id || null);
      } else if (data.length === 0) {
        setSelectedFavoriteId(null);
      } else if (selectedFavoriteId !== null) {
        const exists = data.some((f) => f.id === selectedFavoriteId);
        if (!exists && data.length > 0) {
          setSelectedFavoriteId(data[0].id);
        }
      }
    } catch (error) {
      console.error('즐겨찾기 로드 실패:', error);
      setFavorites([]);
      setSelectedFavoriteId(null);
      showSnackbar('즐겨찾기를 불러올 수 없습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteSelect = (id: number) => {
    if (!Array.isArray(favorites)) {
      console.error('Invalid favorites state');
      return;
    }

    const exists = favorites.some((f) => f.id === id);
    if (exists) {
      setSelectedFavoriteId(id);
    }
  };

  const handleAddSuccess = () => {
    loadFavorites();
    showSnackbar('추가되었습니다.', 'success');
  };

  const handleAddError = (message: string) => {
    showSnackbar(message, 'error');
  };

  const handleAddClick = () => {
    if (!Array.isArray(favorites)) {
      console.error('Invalid favorites state');
      showSnackbar('데이터 오류가 발생했습니다.', 'error');
      return;
    }

    if (favorites.length >= MAX_FAVORITES) {
      showSnackbar('즐겨찾기는 최대 3개까지 등록 가능합니다.', 'error');
      return;
    }
    setModalOpen(true);
  };

  const handleSave = async (data: { city: string; district: string }) => {
    if (!data?.city || !data?.district) {
      showSnackbar('지역을 선택해주세요.', 'error');
      return;
    }

    try {
      await addFavorite(data);
      setModalOpen(false);
      await loadFavorites();
      showSnackbar('추가되었습니다.', 'success');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string; message: string }>;
      const message = axiosError.response?.data?.message || '추가에 실패했습니다.';
      showSnackbar(message, 'error');
    }
  };

  const handleAliasUpdate = async (id: number, alias: string) => {
    if (!Array.isArray(favorites)) {
      console.error('Invalid favorites state');
      showSnackbar('데이터 오류가 발생했습니다.', 'error');
      return;
    }

    if (!alias?.trim()) {
      showSnackbar('별칭을 입력해주세요.', 'error');
      return;
    }

    const favorite = favorites.find((f) => f.id === id);
    if (!favorite) {
      showSnackbar('즐겨찾기를 찾을 수 없습니다.', 'error');
      return;
    }

    try {
      await updateFavoriteAlias(id, { alias: alias.trim() });
      setFavorites((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.map((item) => (item.id === id ? { ...item, alias: alias.trim() } : item));
      });
      showSnackbar('별칭이 변경되었습니다.', 'success');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string; message: string }>;
      const message = axiosError.response?.data?.message || '별칭 변경에 실패했습니다.';
      showSnackbar(message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!Array.isArray(favorites)) {
      console.error('Invalid favorites state');
      showSnackbar('데이터 오류가 발생했습니다.', 'error');
      return;
    }

    const favorite = favorites.find((f) => f.id === id);
    if (!favorite) {
      showSnackbar('즐겨찾기를 찾을 수 없습니다.', 'error');
      return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteFavorite(id);

      const newFavorites = favorites.filter((item) => item.id !== id);
      setFavorites(newFavorites);

      if (selectedFavoriteId === id) {
        setSelectedFavoriteId(newFavorites.length > 0 ? newFavorites[0].id : null);
      }

      showSnackbar('삭제되었습니다.', 'success');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string; message: string }>;
      const message = axiosError.response?.data?.message || '삭제에 실패했습니다.';
      showSnackbar(message, 'error');
    }
  };

  const handleReorder = async (newFavorites: FavoriteLocation[]) => {
    if (!Array.isArray(newFavorites)) {
      console.error('Invalid newFavorites:', newFavorites);
      showSnackbar('순서 변경에 실패했습니다.', 'error');
      return;
    }

    const oldFavorites = [...favorites];
    setFavorites(newFavorites);

    try {
      const reorderData = newFavorites.map((item, index) => ({
        id: item?.id,
        order: index,
      }));

      if (reorderData.some((item) => !item.id)) {
        throw new Error('Invalid reorder data');
      }

      await reorderFavorites(reorderData);
      showSnackbar('순서가 변경되었습니다.', 'success');
    } catch (error) {
      console.error('순서 변경 실패:', error);
      setFavorites(oldFavorites);
      showSnackbar('순서 변경에 실패했습니다.', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const selectedFavorite =
    Array.isArray(favorites) && selectedFavoriteId !== null
      ? favorites.find((f) => f?.id === selectedFavoriteId) || null
      : null;

  if (loading) {
    return <MainContainer>로딩 중...</MainContainer>;
  }

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  return (
    <MainContainer>
      <ComponentsGrid>
        <CurrentWeather
          location='서울'
          temperature={18}
          condition='scattered clouds'
          iconCode='03d'
          precipitation={30}
          feelsLike={16}
          onEditLocation={() => {
            console.log('위치 변경');
          }}
        />
        <TodayOutfitRecommendation temperature={18} />
        <HourlyWeather />
        <AIRecommendation temperature={15} condition={'clear'} location={'seoul'} />

        {safeFavorites.length === 0 ? (
          <EmptyFavorites onSuccess={handleAddSuccess} onError={handleAddError} />
        ) : (
          <>
            <FavoritesSection
              favorites={safeFavorites}
              selectedFavoriteId={selectedFavoriteId}
              onFavoriteSelect={handleFavoriteSelect}
              onAddClick={handleAddClick}
              onAliasUpdate={handleAliasUpdate}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />

            <RecommendCard>
              {selectedFavorite && (
                <FavoriteLocationOutfitRecommendation
                  favorite={selectedFavorite}
                  temperature={18}
                />
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
