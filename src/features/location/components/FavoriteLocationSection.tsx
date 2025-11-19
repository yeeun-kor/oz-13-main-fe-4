// features/mypage/components/FavoriteLocationSection.tsx
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { blue } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import FavoriteRegionModal from '../../../components/Modal/FavoriteRegionModal';
import { useFavoriteLocations } from '../hooks/useFavoriteLocations';
import { FavoriteLocation } from '../types/location';

const MAX_FAVORITES = 3;

// 정렬 가능한 카드 컴포넌트
function SortableFavoriteCard({
  favorite,
  onDelete,
  onEditStart,
  editingId,
  editAlias,
  setEditAlias,
  onEditSave,
  onEditCancel,
}: {
  favorite: FavoriteLocation;
  onDelete: (id: number) => void;
  onEditStart: (id: number, alias: string) => void;
  editingId: number | null;
  editAlias: string;
  setEditAlias: (value: string) => void;
  onEditSave: (id: number) => void;
  onEditCancel: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: favorite.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Grid ref={setNodeRef} style={style} size={{ xs: 12, md: 4 }}>
      <Card
        {...attributes}
        {...listeners}
        sx={{ cursor: 'grab', border: `solid,${blue[500]},0.3px` }}
      >
        <CardHeader
          avatar={<WbSunnyTwoToneIcon fontSize='large' color='warning' />}
          action={
            <IconButton onClick={() => onDelete(favorite.id)} sx={{ border: 'none' }}>
              <CancelIcon fontSize='large' />
            </IconButton>
          }
          title={
            <Typography variant='h6' component='div' sx={{ my: 2 }}>
              {favorite.city} {favorite.district}
            </Typography>
          }
          subheader={
            editingId === favorite.id ? (
              <TextField
                value={editAlias}
                onChange={(e) => setEditAlias(e.target.value)}
                size='small'
                autoFocus
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onEditSave(favorite.id);
                  if (e.key === 'Escape') onEditCancel();
                }}
              />
            ) : (
              <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                {favorite.alias || '별칭 없음'}
              </Typography>
            )
          }
        />
        <CardActions sx={{ justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {editingId === favorite.id ? (
            <>
              <Button size='small' onClick={() => onEditSave(favorite.id)} variant='contained'>
                저장
              </Button>
              <Button size='small' onClick={onEditCancel}>
                취소
              </Button>
            </>
          ) : (
            <Button
              variant='contained'
              color='primary'
              size='small'
              startIcon={<EditIcon />}
              onClick={() => onEditStart(favorite.id, favorite.alias || '')}
            >
              별칭 수정
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function FavoriteLocationSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAlias, setEditAlias] = useState('');

  const { favorites, isLoading, addFavorite, deleteFavorite, updateAlias, reorderFavorites } =
    useFavoriteLocations();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동해야 드래그 시작
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = favorites.findIndex((item) => item.id === active.id);
      const newIndex = favorites.findIndex((item) => item.id === over.id);

      // 새로운 순서로 배열 재정렬
      const newFavorites = [...favorites];
      const [movedItem] = newFavorites.splice(oldIndex, 1);
      newFavorites.splice(newIndex, 0, movedItem);

      // 서버에 순서 변경 요청
      const reorderData = newFavorites.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      reorderFavorites(reorderData);
    }
  };

  const handleSave = (region: { city: string; district: string }) => {
    addFavorite({
      city: region.city,
      district: region.district,
      alias: '',
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('이 즐겨찾기를 삭제하시겠습니까?')) {
      deleteFavorite(id);
    }
  };

  const handleEditStart = (id: number, currentAlias: string) => {
    setEditingId(id);
    setEditAlias(currentAlias);
  };

  const handleEditSave = (id: number) => {
    updateAlias({ id, alias: editAlias });
    setEditingId(null);
  };

  const emptySlots = MAX_FAVORITES - favorites.length;

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <Box>
      <Divider>
        <Typography variant='h6' sx={{ fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}>
          즐겨찾는 지역 수정
        </Typography>
      </Divider>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={favorites.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <Grid spacing={2} container>
              <FavoriteRegionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
              />

              {/* 드래그 가능한 즐겨찾기 카드 */}
              {favorites.map((favorite) => (
                <SortableFavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  onDelete={handleDelete}
                  onEditStart={handleEditStart}
                  editingId={editingId}
                  editAlias={editAlias}
                  setEditAlias={setEditAlias}
                  onEditSave={handleEditSave}
                  onEditCancel={() => setEditingId(null)}
                />
              ))}

              {/* 빈 슬롯 */}
              {[...Array(emptySlots)].map((_, index) => (
                <Grid key={`empty-${index}`} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 120,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    <AddIcon fontSize='large' />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}
