import { Box, styled, Typography } from '@mui/material';

export const RecommendationCard = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px 40px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  gridColumn: '1 / -1',
  minHeight: '100px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export const IconBox = styled(Box)({
  width: '80px',
  height: '80px',
  backgroundColor: '#F0F7FF',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const ContentSection = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
});

export const HeaderText = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#666666',
  textAlign: 'left',
});

export const MainRecommendation = styled(Typography)({
  fontSize: '22px',
  fontWeight: 700,
  color: '#333333',
  textAlign: 'left',
  lineHeight: 1.5,
  wordBreak: 'keep-all',
});

export const LoadingText = styled(Typography)({
  fontSize: '18px',
  fontWeight: 500,
  color: '#999999',
  textAlign: 'left',
});
