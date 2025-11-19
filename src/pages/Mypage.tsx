// pages/Mypage.tsx
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseModal from '../components/Modal/BaseModal';
import FavoriteLocationSection from '../features/location/components/FavoriteLocationSection';
import EmailSection from '../features/mypage/components/EmailSection';
import PasswordSection from '../features/mypage/components/PasswordSection';
import ProfileSection from '../features/mypage/components/ProfileSection';
import { useMypageForm } from '../features/mypage/hooks/useMypageForm';
import { CardMui, ContainerMui } from '../styles/AuthStyle';

export default function Mypage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const {
    form,
    handleProfileSubmit,
    resetValidation,
    validationState,
    updateValidation,
    isLoading,
    error,
  } = useMypageForm();

  // 로딩 중일 때
  if (isLoading) {
    return <div>로딩중...</div>;
  }

  // 에러 발생 시
  if (error) {
    return <div>에러 발생</div>;
  }

  const onSubmit = form.handleSubmit((data) => {
    handleProfileSubmit(
      data,
      () => {
        setModalTitle('회원정보 수정');
        setModalMessage('마이페이지 수정 완료');
        setShowModal(true);
        setIsEditMode(false);
      },
      (message) => {
        setModalTitle('회원정보 수정 오류');
        setModalMessage(message);
        setShowModal(true);
      }
    );
  });
  const handleDelete = () => {
    navigate('/signup');
  };
  return (
    <ContainerMui direction='column' justifyContent='space-between'>
      <CardMui sx={{ gap: 4 }}>
        <Typography
          component='h1'
          variant='h4'
          sx={{
            width: '100%',
            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
            alignItems: 'center',
            py: 4,
          }}
        >
          마이페이지
        </Typography>

        {/* 전체 폼 */}
        <Stack component='form' spacing={{ xs: 4, md: 8 }} onSubmit={onSubmit}>
          {/* 수정/완료 버튼 */}
          <Box component='section' className='Button-Box'>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifySelf: 'flex-end',
                gap: 2,
              }}
            >
              {!isEditMode ? (
                <Button
                  type='button'
                  sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
                  variant='contained'
                  size='small'
                  color='primary'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditMode(true);
                  }}
                >
                  수정하기
                </Button>
              ) : (
                <>
                  <Button
                    type='submit'
                    sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
                    variant='contained'
                    size='small'
                    color='success'
                  >
                    수정완료
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditMode(false);
                      resetValidation();
                      form.reset();
                    }}
                    sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
                    variant='contained'
                    size='small'
                    color='secondary'
                    type='button'
                  >
                    취소
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          {/* 회원정보 섹션 */}
          <ProfileSection
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
            form={form}
            validationState={validationState}
            updateValidation={updateValidation}
          />

          {/* 이메일 변경 섹션 */}
          <EmailSection
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
            form={form}
            validationState={validationState}
            updateValidation={updateValidation}
          />

          {/* 모달 */}
          <BaseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalTitle}
            subtitle={modalMessage}
            footer={
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={() => setShowModal(false)}
              >
                확인
              </Button>
            }
          />
        </Stack>

        {/* 비밀번호 변경 섹션 (독립 폼) */}
        <PasswordSection />

        {/* 즐겨찾는 지역 섹션 */}
        <FavoriteLocationSection />

        {/* 회원탈퇴 */}
        <Divider sx={{ my: 4 }} />
        <Stack sx={{ alignItems: 'end' }}>
          <Button
            type='button'
            variant='outlined'
            color='inherit'
            size='small'
            onClick={handleDelete}
          >
            회원탈퇴
          </Button>
        </Stack>
      </CardMui>
    </ContainerMui>
  );
}
