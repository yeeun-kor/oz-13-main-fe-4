import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const OutfitCard = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px 40px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  minHeight: '350px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const OutfitHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

export const OutfitTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 700,
  color: '#333333',
});

export const TemperatureInfo = styled(Typography)({
  fontSize: '18px',
  fontWeight: 500,
  color: '#333333',
});

export const StyleLabel = styled(Typography)({
  fontSize: '18px',
  fontWeight: 400,
  color: '#666666',
  textAlign: 'center',
  marginBottom: '12px',
});

export const OutfitGridContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  flex: 1,
  position: 'relative',
});

export const OutfitGrid = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '32px',
  flex: 1,
});

export const OutfitItem = styled(Box)({
  backgroundColor: '#C8DDFF',
  borderRadius: '16px',
  width: '180px',
  height: '240px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '@media (max-width: 768px)': {
    width: '100px',
    height: '130px',
  },
});

export const PlusIcon = styled(Typography)({
  fontSize: '40px',
  fontWeight: 300,
  color: '#999999',
  marginTop: '-20px',
});

export const ClothingIconPlaceholder = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#5B9EFF',
  fontSize: '48px',
});

export const NavigationButton = styled(IconButton)({
  backgroundColor: '#F5F5F5',
  color: '#5B9EFF',
  width: '48px',
  height: '48px',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: '#E0E0E0',
    color: '#4A8EEE',
  },
  '&:active': {
    backgroundColor: '#D0D0D0',
  },
  '@media (max-width: 768px)': {
    width: '36px',
    height: '36px',
  },
});

export const IndicatorContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginTop: '8px',
});
