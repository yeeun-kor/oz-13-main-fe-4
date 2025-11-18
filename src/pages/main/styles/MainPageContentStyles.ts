import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Container)({
  paddingTop: '24px',
  paddingBottom: '24px',
  minWidth: '90vw',
});

export const ComponentsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

export const PlaceholderCard = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  minHeight: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#CCCCCC',
  fontSize: '14px',
});

export const FullWidthCard = styled(PlaceholderCard)({
  gridColumn: '1 / -1',
  minHeight: '120px',
});

export const RecommendCard = styled(PlaceholderCard)({
  minHeight: '350px',
  gridColumn: '1 / -1',
});
