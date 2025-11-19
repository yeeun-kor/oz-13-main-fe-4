import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import styled from '@emotion/styled';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FavoriteLocationCard } from './FavoriteLocationCard';
import { FavoriteLocation } from '../../favorite/api/favoriteAPI';

const MAX_FAVORITES = 3;

interface FavoritesSectionProps {
  favorites: FavoriteLocation[];
  selectedFavoriteId: number | null;
  onFavoriteSelect: (id: number) => void;
  onAddClick: () => void;
  onAliasUpdate: (id: number, alias: string) => void;
  onDelete: (id: number) => void;
  onReorder: (newFavorites: FavoriteLocation[]) => void;
}

const Container = styled('div')({
  gridColumn: '1 / -1',
  backgroundColor: '#FFF',
  borderRadius: '16px',
  padding: '24px 40px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
});

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '24px',
});

const GridLayout = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
  '@media (max-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const CardSlot = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
});

const AddButton = styled('button')({
  width: '100px',
  height: '100px',
  backgroundColor: '#1E3A8A',
  color: '#FFF',
  fontSize: '48px',
  border: 'none',
  borderRadius: '48px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#1E40AF',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
});

export const FavoritesSection = ({
  favorites,
  selectedFavoriteId,
  onFavoriteSelect,
  onAddClick,
  onAliasUpdate,
  onDelete,
  onReorder,
}: FavoritesSectionProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !Array.isArray(safeFavorites)) return;

    const oldIndex = safeFavorites.findIndex((item) => item?.id === active.id);
    const newIndex = safeFavorites.findIndex((item) => item?.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newFavorites = arrayMove(safeFavorites, oldIndex, newIndex);
    onReorder(newFavorites);
  };

  const slots = Array.from({ length: MAX_FAVORITES }, (_, index) => {
    const favorite = safeFavorites[index];

    if (favorite?.id) {
      return (
        <CardSlot key={favorite.id}>
          <FavoriteLocationCard
            favorite={favorite}
            selected={selectedFavoriteId === favorite.id}
            onClick={() => onFavoriteSelect(favorite.id)}
            onAliasUpdate={onAliasUpdate}
            onDelete={onDelete}
          />
        </CardSlot>
      );
    } else if (index === safeFavorites.length && safeFavorites.length < MAX_FAVORITES) {
      return (
        <CardSlot key={`add-${index}`}>
          <AddButton onClick={onAddClick}>+</AddButton>
        </CardSlot>
      );
    } else {
      return <CardSlot key={`empty-${index}`} />;
    }
  });

  const validFavorites = safeFavorites.filter((f) => f?.id);

  return (
    <Container>
      <Header>
        <FavoriteIcon sx={{ color: '#EF5350', fontSize: 20 }} />
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#333' }}>
          즐겨 찾는 지역
        </Typography>
      </Header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={validFavorites.map((f) => f.id)}
          strategy={horizontalListSortingStrategy}
        >
          <GridLayout>{slots}</GridLayout>
        </SortableContext>
      </DndContext>
    </Container>
  );
};
