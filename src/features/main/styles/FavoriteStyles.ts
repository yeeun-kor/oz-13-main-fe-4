import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// ============================================
// FavoriteLocationOutfitRecommendation 스타일
// ============================================

export const OutfitRecommendationContainer = styled(Box)({
  border: '3px solid #1976D2',
  borderRadius: '16px',
  padding: '32px',
  backgroundColor: '#FFF', // 테두리 안만 하얀색
});

export const OutfitRecommendationHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

export const OutfitRecommendationTitle = styled(Typography)({
  fontSize: 20,
  fontWeight: 700,
  color: '#333',
});

export const OutfitRecommendationSubtitle = styled(Typography)({
  fontSize: 14,
  color: '#666',
  marginBottom: '24px',
});

export const OutfitRecommendationItemContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

export const OutfitRecommendationIndicatorContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '16px',
});

export const OutfitRecommendationIndicatorDot = styled(Box)<{ active: boolean }>(({ active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? '#1976D2' : '#CCCCCC',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.2)',
    backgroundColor: active ? '#1976D2' : '#999999',
  },
}));
