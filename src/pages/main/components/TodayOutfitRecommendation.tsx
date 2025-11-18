import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ThumbUp from '@mui/icons-material/ThumbUp';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { outfitAPI } from '../../../features/recommendation/api/clothingAPI';
import { parseOutfitString } from '../../../utils/clothingParser';
import {
  NavigationButton,
  OutfitCard,
  OutfitGrid,
  OutfitGridContainer,
  OutfitHeader,
  OutfitTitle,
  PlusIcon,
  StyleLabel,
  TemperatureInfo,
} from '../styles/TodayOutfitStyles';
import { OutfitItemIcon } from './OutfitItemIcon';

interface TodayOutfitRecommendationProps {
  temperature: number;
  outfits?: Array<{
    id: string;
    imageUrl?: string;
    type: string;
  }>;
}

export const TodayOutfitRecommendation = ({ temperature }: TodayOutfitRecommendationProps) => {
  // 기본 3개 아이템 생성 (데이터 없을 시)
  // const displayOutfits = outfits.length > 0 ? outfits : Array(3).fill(null);
  const [outfits, setOutfits] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const lat = 37.5172;
  const lon = 127.0473;
  const location = '서울';
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        // const data = await outfitAPI.getRecommendationByCoords(lat, lon);
        const data = await outfitAPI.getRecommendationByLocation(location);
        setOutfits([data.rec_1, data.rec_2, data.rec_3]);
        setExplanation(data.explanation);
      } catch (error) {
        console.error('의상 추천 가져오기 실패:', error);
      }
    };
    fetchRecommendation();
  }, [lat, lon]);
  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? outfits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === outfits.length - 1 ? 0 : prev + 1));
  };
  if (outfits.length === 0) return null;

  const items = parseOutfitString(outfits[selectedIndex]);
  return (
    <OutfitCard>
      <OutfitHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThumbUp sx={{ color: '#5B9EFF', fontSize: 28 }} />
          <OutfitTitle>오늘의 추천 코디</OutfitTitle>
        </Box>
        <TemperatureInfo>{temperature}°C 맞춤</TemperatureInfo>
      </OutfitHeader>

      <StyleLabel>{explanation}</StyleLabel>
      <OutfitGridContainer>
        {/* 왼쪽 화살표 */}
        <NavigationButton onClick={handlePrevious} aria-label='이전 코디'>
          <ChevronLeftIcon sx={{ fontSize: 32 }} />
        </NavigationButton>

        <OutfitGrid>
          {items.map((item, index) => (
            <>
              <OutfitItemIcon key={index} item={item} showName />
              {index < items.length - 1 && <PlusIcon>+</PlusIcon>}
            </>
          ))}
        </OutfitGrid>
        <NavigationButton onClick={handleNext} aria-label='다음 코디'>
          <ChevronRightIcon sx={{ fontSize: 32 }} />
        </NavigationButton>
      </OutfitGridContainer>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
        {outfits.map((_, index) => (
          <Box
            key={index}
            onClick={() => setSelectedIndex(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: selectedIndex === index ? '#5B9EFF' : '#CCCCCC',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </OutfitCard>
  );
};
