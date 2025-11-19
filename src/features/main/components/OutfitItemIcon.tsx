import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ClothingItem } from '../types/clothing';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

const IconContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

const IconImage = styled('img')({
  width: '80px',
  height: '80px',
  objectFit: 'contain',
});

const ItemName = styled(Typography)({
  fontSize: '12px',
  color: '#666666',
  textAlign: 'center',
  maxWidth: '100px',
  wordBreak: 'keep-all',
});
interface OutfitItemIconProps {
  item: ClothingItem;
  showName?: boolean;
}
export const OutfitItemIcon = ({ item, showName = true }: OutfitItemIconProps) => {
  const refCallback = useIntersectionObserver();

  return (
    <IconContainer>
      <IconImage ref={refCallback} data-src={item.icon} alt={item.name} loading='lazy' />
      {showName && <ItemName>{item.name}</ItemName>}
    </IconContainer>
  );
};
