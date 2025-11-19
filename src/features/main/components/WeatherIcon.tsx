// src/components/WeatherIcon/WeatherIcon.tsx
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getWeatherIconUrl } from '../../../utils/weatherIcon';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

const IconImage = styled('img')<{ size: number }>(({ size }) => ({
  width: `${size}px`,
  height: `${size}px`,
  objectFit: 'contain',
}));

const IconContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  quality?: '1x' | '2x' | '4x';
  alt?: string;
}

export const WeatherIcon = ({
  iconCode,
  size = 50,
  quality = '2x',
  alt = '날씨 아이콘',
}: WeatherIconProps) => {
  const refCallback = useIntersectionObserver();
  const iconUrl = getWeatherIconUrl(iconCode, quality);

  if (!iconUrl) {
    return null;
  }

  return (
    <IconContainer>
      <IconImage ref={refCallback} data-src={iconUrl} alt={alt} size={size} loading='lazy' />
    </IconContainer>
  );
};
