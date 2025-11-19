import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import FavoriteRegionModal from '../../../components/Modal/FavoriteRegionModal';
import { useFavoriteLocations } from '../hooks/useFavoriteLocations';
import FavoriteLocationCard from './FavoriteLocationCard';

const MAX_FAVORITES = 3;

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
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

export default function FavoriteLocationSection() {
  const { favorites, isLoading, deleteFavorite, updateAlias, reorderFavorites } =
    useFavoriteLocations();
  const [modalOpen, setModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
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
    const reorderData = newFavorites.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    reorderFavorites(reorderData);
  };

  const handleDelete = (id: number) => {
    if (confirm('이 즐겨찾기를 삭제하시겠습니까?')) {
      deleteFavorite(id);
    }
  };

  const handleAliasUpdate = (id: number, alias: string) => {
    updateAlias({ id, alias });
  };

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSave = () => {
    setModalOpen(false);
  };

  if (isLoading) return <div>로딩 중...</div>;

  const slots = Array.from({ length: MAX_FAVORITES }, (_, index) => {
    const favorite = safeFavorites[index];

    if (favorite?.id) {
      return (
        <CardSlot key={favorite.id}>
          <FavoriteLocationCard
            favorite={favorite}
            onAliasUpdate={handleAliasUpdate}
            onDelete={handleDelete}
          />
        </CardSlot>
      );
    } else if (index === safeFavorites.length && safeFavorites.length < MAX_FAVORITES) {
      return (
        <CardSlot key={`add-${index}`}>
          <AddButton onClick={handleAddClick}>+</AddButton>
        </CardSlot>
      );
    } else {
      return <CardSlot key={`empty-${index}`} />;
    }
  });

  const validFavorites = safeFavorites.filter((f) => f?.id);

  return (
    <Container>
      <Divider>
        <Typography variant='h6' sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}>
          즐겨찾는 지역 수정
        </Typography>
      </Divider>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={validFavorites.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <GridLayout>{slots}</GridLayout>
        </SortableContext>
      </DndContext>

      <FavoriteRegionModal isOpen={modalOpen} onClose={handleModalClose} onSave={handleModalSave} />
    </Container>
  );
}
