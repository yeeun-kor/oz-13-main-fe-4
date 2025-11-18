import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HourlyWeatherCard = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px 24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  gridColumn: '1 / -1',
  overflow: 'hidden',
});

export const HourlyScrollContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: '8px',
  cursor: 'grab',
  userSelect: 'none',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE/Edge
  '&:active': {
    cursor: 'grabbing',
  },
  // Chrome, Safari, Opera
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export const HourlyItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  minWidth: '100px',
  padding: '16px 12px',
  backgroundColor: '#F0F7FF',
  borderRadius: '16px',
  flexShrink: 0,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#E3F2FF',
    transform: 'translateY(-2px)',
  },
});

export const HourLabel = styled(Typography)({
  fontSize: '14px',
  fontWeight: 500,
  color: '#666666',
  whiteSpace: 'nowrap',
});

export const WeatherIconBox = styled(Box)({
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const TemperatureLabel = styled(Typography)({
  fontSize: '16px',
  fontWeight: 600,
  color: '#333333',
  whiteSpace: 'nowrap',
});
