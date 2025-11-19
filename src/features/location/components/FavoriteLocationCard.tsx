import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { FavoriteLocation } from '../../favorite/api/favoriteAPI';

interface FavoriteLocationCardProps {
  favorite: FavoriteLocation;
  onAliasUpdate: (id: number, alias: string) => void;
  onDelete: (id: number) => void;
}

const CardContainer = styled(Box)({
  backgroundColor: '#FFF',
  border: '2px solid #E0E0E0',
  borderRadius: '12px',
  padding: '24px',
  cursor: 'grab',
  transition: 'all 0.2s',
  width: '100%',
  minHeight: '60px', // 최소 높이 설정
  '&:hover': {
    borderColor: '#1976D2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  '&:active': {
    cursor: 'grabbing',
  },
});

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
});

const LocationInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
});

const DisplayName = styled(Typography)({
  fontSize: '16px',
  fontWeight: 700,
  color: '#333',
  wordBreak: 'keep-all',
});

const EditContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
});

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '4px',
});

export default function FavoriteLocationCard({
  favorite,
  onAliasUpdate,
  onDelete,
}: FavoriteLocationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: favorite.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const displayName = favorite.alias || `${favorite.city} ${favorite.district}`;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(favorite.alias || '');
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onAliasUpdate(favorite.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editValue.trim()) {
        onAliasUpdate(favorite.id, editValue.trim());
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue('');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(favorite.id);
  };

  return (
    <CardContainer ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardHeader>
        <LocationInfo>
          <WbSunnyTwoToneIcon fontSize='large' color='warning' />
          {isEditing ? (
            <EditContainer>
              <TextField
                size='small'
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder={`${favorite.city} ${favorite.district}`}
                fullWidth
                onClick={(e) => e.stopPropagation()}
                sx={{ flex: 1 }}
              />
              <IconButton size='small' onClick={handleSave} color='primary'>
                <CheckIcon fontSize='small' />
              </IconButton>
              <IconButton size='small' onClick={handleCancel}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </EditContainer>
          ) : (
            <DisplayName>{displayName}</DisplayName>
          )}
        </LocationInfo>

        {!isEditing && (
          <ActionButtons>
            <IconButton size='small' onClick={handleEditClick}>
              <BorderColorTwoToneIcon fontSize='medium' sx={{ color: '#1976D2' }} />
            </IconButton>
            <IconButton size='small' onClick={handleDelete}>
              <HighlightOffTwoToneIcon fontSize='medium' sx={{ color: '#EF5350' }} />
            </IconButton>
          </ActionButtons>
        )}
      </CardHeader>
    </CardContainer>
  );
}
