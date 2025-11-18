import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import styled from '@emotion/styled';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addFavorite } from '../../favorite/api/favoriteAPI';
import FavoriteRegionModal from '../../../components/Modal/FavoriteRegionModal';

interface EmptyFavoritesProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const Container = styled('div')({
  gridColumn: '1 / -1',
  backgroundColor: '#E3F2FD',
  borderRadius: '16px',
  padding: '40px 32px',
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '32px',
});

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  alignSelf: 'flex-start',
});

const AddButton = styled('button')({
  width: '120px',
  height: '120px',
  backgroundColor: '#1E3A8A',
  color: '#FFF',
  fontSize: '48px',
  border: 'none',
  borderRadius: '16px',
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
  '&:disabled': {
    backgroundColor: '#999',
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const BenefitsBox = styled(Box)({
  backgroundColor: '#FFF',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  maxWidth: '800px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
});

const Title = styled(Typography)({
  fontSize: '20px',
  fontWeight: 700,
  color: '#333',
  textAlign: 'center',
  marginBottom: '8px',
});

const Subtitle = styled(Typography)({
  fontSize: '14px',
  color: '#666',
  textAlign: 'center',
  marginBottom: '32px',
});

const BenefitsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const BenefitCard = styled(Box)({
  backgroundColor: '#E3F2FD',
  borderRadius: '12px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '12px',
});

const IconCircle = styled(Box)({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: '#1976D2',
  color: '#FFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  marginBottom: '8px',
});

const BenefitTitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: 700,
  color: '#333',
});

const BenefitDescription = styled(Typography)({
  fontSize: '13px',
  color: '#666',
  lineHeight: '1.5',
});

export const EmptyFavorites = ({ onSuccess, onError }: EmptyFavoritesProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleSave = async (data: { city: string; district: string }) => {
    if (!data?.city || !data?.district) {
      const message = '지역을 선택해주세요.';
      if (onError) onError(message);
      return;
    }

    setLoading(true);
    try {
      await addFavorite(data);
      setModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string; message: string }>;
      const message = axiosError.response?.data?.message || '추가에 실패했습니다.';
      if (onError) onError(message);
      console.error('즐겨찾기 추가 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Header>
          <FavoriteIcon sx={{ color: '#EF5350', fontSize: 20 }} />
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#333' }}>
            즐겨 찾는 지역
          </Typography>
        </Header>

        <AddButton onClick={handleAddClick} disabled={loading}>
          {loading ? '...' : '+'}
        </AddButton>

        <BenefitsBox>
          <Title>즐겨찾는 지역을 추가해보세요!</Title>
          <Subtitle>자주 가는 장소의 날씨를 한눈에 확인하고, 맞춤 의상을 추천받으세요</Subtitle>

          <BenefitsGrid>
            <BenefitCard>
              <IconCircle>🎯</IconCircle>
              <BenefitTitle>최대 3곳 등록</BenefitTitle>
              <BenefitDescription>
                집, 회사, 자주 가는 장소 등 날씨가 중요한 장소를 등록하세요
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <IconCircle>💡</IconCircle>
              <BenefitTitle>맞춤 의상 추천</BenefitTitle>
              <BenefitDescription>
                각 지역의 날씨를 분석해 맞춤형 코디를 제안드려요
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <IconCircle>⭐</IconCircle>
              <BenefitTitle>별칭 설정</BenefitTitle>
              <BenefitDescription>
                "본가", "회사", "피부과" 등 편한 이름으로 저장하세요
              </BenefitDescription>
            </BenefitCard>
          </BenefitsGrid>
        </BenefitsBox>
      </Container>

      <FavoriteRegionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};
