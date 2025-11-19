import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ThumbUp from '@mui/icons-material/ThumbUp';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { outfitAPI } from '../../recommendation/api/outfitAPI';
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
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { useLocationStore } from '../../location/store/locationStore';
import { useCurrentOutfit } from '../hooks/useCurrentOutfit';

export const TodayOutfitRecommendation = () => {
  const { weather } = useCurrentWeather();
  const { latitude, longitude } = useLocationStore();
  const [outfits, setOutfits] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { outfit } = useCurrentOutfit();

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!latitude || !longitude) return;

      try {
        if (!outfit) return null;
        setOutfits([outfit.rec_1, outfit.rec_2, outfit.rec_3]);
        setExplanation(outfit.explanation);
      } catch (error) {
        console.error('의상 추천 가져오기 실패:', error);
      }
    };
    fetchRecommendation();
  }, [latitude, longitude, outfit]);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? outfits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === outfits.length - 1 ? 0 : prev + 1));
  };

  if (outfits.length === 0 || !weather) return null;

  const items = parseOutfitString(outfits[selectedIndex]);

  return (
    <OutfitCard>
      <OutfitHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThumbUp sx={{ color: '#5B9EFF', fontSize: 28 }} />
          <OutfitTitle>오늘의 추천 코디</OutfitTitle>
        </Box>
        <TemperatureInfo>{Math.round(weather.temperature)}°C 맞춤</TemperatureInfo>
      </OutfitHeader>

      <StyleLabel>{explanation}</StyleLabel>
      <OutfitGridContainer>
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
