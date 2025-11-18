import { Box, Typography, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { FavoriteLocation } from '../../favorite/api/favoriteAPI';

interface FavoriteLocationCardProps {
  favorite: FavoriteLocation;
  isSelected: boolean;
  temperature: number;
  precipitationProbability: number;
  feelsLike: number;
  onClick: () => void;
  onAliasUpdate: (id: number, alias: string) => void;
  onDelete: (id: number) => void;
}

const CardContainer = styled(Box)<{ isSelected: boolean }>(({ isSelected }) => ({
  width: '20rem',
  flexShrink: 0,
  backgroundColor: isSelected ? '#E3F2FD' : '#FFF',
  border: isSelected ? '3px solid #1976D2' : '2px solid #E0E0E0',
  borderRadius: '12px',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#1976D2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
});

const DragHandle = styled(Box)({
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  color: '#999',
  '&:active': {
    cursor: 'grabbing',
  },
});

const DisplayName = styled(Typography)({
  fontSize: '16px',
  fontWeight: 700,
  color: '#333',
  textAlign: 'center',
  marginBottom: '12px',
  wordBreak: 'keep-all',
});

const EditContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '12px',
});

const WeatherRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 12px',
  backgroundColor: '#E3F2FD',
  borderRadius: '8px',
  marginBottom: '4px',
});

const WeatherLabel = styled(Typography)({
  fontSize: '13px',
  color: '#666',
});

const WeatherValue = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  color: '#1976D2',
});

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '4px',
});

export const FavoriteLocationCard = ({
  favorite,
  isSelected,
  temperature,
  precipitationProbability,
  feelsLike,
  onClick,
  onAliasUpdate,
  onDelete,
}: FavoriteLocationCardProps) => {
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

  const handleSave = () => {
    if (editValue.trim()) {
      onAliasUpdate(favorite.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(favorite.id);
  };

  return (
    <CardContainer ref={setNodeRef} style={style} isSelected={isSelected} onClick={onClick}>
      <CardHeader>
        <DragHandle {...attributes} {...listeners}>
          <DragIndicatorIcon fontSize='small' />
        </DragHandle>

        {!isEditing && (
          <ActionButtons>
            <IconButton size='small' onClick={handleEditClick}>
              <EditIcon fontSize='small' sx={{ color: '#1976D2' }} />
            </IconButton>
            <IconButton size='small' onClick={handleDelete}>
              <DeleteIcon fontSize='small' sx={{ color: '#EF5350' }} />
            </IconButton>
          </ActionButtons>
        )}
      </CardHeader>

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

      <WeatherRow>
        <WeatherLabel>기온</WeatherLabel>
        <WeatherValue>{temperature}°C</WeatherValue>
      </WeatherRow>

      <WeatherRow>
        <WeatherLabel>강수확률</WeatherLabel>
        <WeatherValue>{precipitationProbability}%</WeatherValue>
      </WeatherRow>

      <WeatherRow>
        <WeatherLabel>체감온도</WeatherLabel>
        <WeatherValue>{feelsLike}°C</WeatherValue>
      </WeatherRow>
    </CardContainer>
  );
};
