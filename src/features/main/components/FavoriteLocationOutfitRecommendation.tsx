import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useEffect } from 'react';
import { outfitAPI } from '../../recommendation/api/outfitAPI';
import { parseOutfitString } from '../../../utils/clothingParser';
import { OutfitItemIcon } from './OutfitItemIcon';
import {
  OutfitRecommendationContainer,
  OutfitRecommendationHeader,
  OutfitRecommendationTitle,
  OutfitRecommendationSubtitle,
  OutfitRecommendationItemContainer,
  OutfitRecommendationIndicatorContainer,
  OutfitRecommendationIndicatorDot,
} from '../styles/FavoriteStyles';
import { FavoriteLocation } from '../../favorite/api/favoriteAPI';
import { useFavoriteOutfit } from '../hooks/useFavoriteOutfit';

interface FavoriteLocationOutfitRecommendationProps {
  favorite: FavoriteLocation;
}

export const FavoriteLocationOutfitRecommendation = ({
  favorite,
}: FavoriteLocationOutfitRecommendationProps) => {
  const [outfits, setOutfits] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { outfit, error, refetch } = useFavoriteOutfit({
    city: favorite.city,
    district: favorite.district,
  });

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        if (!outfit) return;
        setOutfits([outfit.rec_1, outfit.rec_2, outfit.rec_3]);
        setExplanation(outfit.explanation);
        setSelectedIndex(0);
      } catch (error) {
        console.error('의상 추천 가져오기 실패:', error);
        setOutfits([]);
        setExplanation('의상 추천을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (favorite) {
      fetchRecommendation();
    }
  }, [favorite.id, favorite.city, favorite.district, favorite, outfit]);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? outfits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === outfits.length - 1 ? 0 : prev + 1));
  };

  const displayName = favorite.alias || `${favorite.city} ${favorite.district}`;

  if (loading) {
    return (
      <OutfitRecommendationContainer>
        <OutfitRecommendationHeader>
          <OutfitRecommendationTitle>
            지금, {displayName}에 가시는 건가요?
          </OutfitRecommendationTitle>
        </OutfitRecommendationHeader>
        <OutfitRecommendationSubtitle>로딩 중...</OutfitRecommendationSubtitle>
      </OutfitRecommendationContainer>
    );
  }

  if (outfits.length === 0) {
    return (
      <OutfitRecommendationContainer>
        <OutfitRecommendationHeader>
          <OutfitRecommendationTitle>
            지금, {displayName}에 가시는 건가요?
          </OutfitRecommendationTitle>
        </OutfitRecommendationHeader>
        <OutfitRecommendationSubtitle>의상 추천을 불러올 수 없습니다.</OutfitRecommendationSubtitle>
      </OutfitRecommendationContainer>
    );
  }

  const items = parseOutfitString(outfits[selectedIndex]);

  return (
    <OutfitRecommendationContainer>
      <OutfitRecommendationHeader>
        <OutfitRecommendationTitle>지금, {displayName}에 가시는 건가요?</OutfitRecommendationTitle>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handlePrev} size='small' aria-label='이전 코디'>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNext} size='small' aria-label='다음 코디'>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </OutfitRecommendationHeader>

      <OutfitRecommendationSubtitle>{explanation}</OutfitRecommendationSubtitle>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <OutfitRecommendationItemContainer>
              <OutfitItemIcon item={item} showName />
            </OutfitRecommendationItemContainer>

            {index < items.length - 1 && (
              <Box sx={{ fontSize: 24, color: '#666', fontWeight: 700 }}>+</Box>
            )}
          </Box>
        ))}
      </Box>

      <OutfitRecommendationIndicatorContainer>
        {outfits.map((_, index) => (
          <OutfitRecommendationIndicatorDot
            key={index}
            active={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </OutfitRecommendationIndicatorContainer>
    </OutfitRecommendationContainer>
  );
};
