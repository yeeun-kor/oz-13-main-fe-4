import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useEffect } from 'react';
import { outfitAPI } from '../../recommendation/api/clothingAPI';
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

interface FavoriteLocationOutfitRecommendationProps {
  favorite: FavoriteLocation;
  temperature: number;
}

export const FavoriteLocationOutfitRecommendation = ({
  favorite,
  temperature,
}: FavoriteLocationOutfitRecommendationProps) => {
  const [outfits, setOutfits] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // 즐겨찾기 변경 시 의상 추천 다시 가져오기
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        // 지역명으로 API 호출 (city 또는 district 사용 가능)
        const location = `${favorite.city} ${favorite.district}`.trim();
        const data = await outfitAPI.getRecommendationByLocation(location);

        setOutfits([data.rec_1, data.rec_2, data.rec_3]);
        setExplanation(data.explanation);
        setSelectedIndex(0); // 새로운 데이터 로드 시 첫 번째로 리셋
      } catch (error) {
        console.error('의상 추천 가져오기 실패:', error);
        // 에러 시 빈 배열
        setOutfits([]);
        setExplanation('의상 추천을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (favorite) {
      fetchRecommendation();
    }
  }, [favorite.id, favorite.city, favorite.district, favorite]); // favorite 변경 시 재호출

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? outfits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === outfits.length - 1 ? 0 : prev + 1));
  };
  const displayName = favorite.alias || `${favorite.city} ${favorite.district}`;

  // 로딩 중
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

  // 데이터 없음
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

  // 현재 선택된 의상 파싱
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
