// features/mypage/components/PasswordSection.tsx
import { Box, Button, Divider, FormLabel, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import BaseModal from '../../../components/Modal/BaseModal';
import { usePasswordForm } from '../hooks/usePasswordForm';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function PasswordSection() {
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const { form, handlePasswordSubmit } = usePasswordForm();
  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = form.handleSubmit((data) => {
    handlePasswordSubmit(
      data,
      () => {
        setModalTitle('비밀번호 수정');
        setModalMessage('비밀번호 변경 완료');
        setShowModal(true);
        setIsPasswordEditMode(false);
      },
      (message) => {
        setModalTitle('비밀번호 수정');
        setModalMessage(`${message}. 현재 비밀번호와 일치하게 입력해주세요 `);
        setShowModal(true);
      }
    );
  });

  return (
    <Stack spacing={2}>
      <Divider>
        <Typography variant='h6' sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}>
          비밀번호 변경
        </Typography>
      </Divider>

      <Stack component='form' onSubmit={onSubmit} spacing={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            gap: 2,
          }}
        >
          {!isPasswordEditMode ? (
            <Button
              onClick={() => setIsPasswordEditMode(true)}
              variant='contained'
              color='primary'
              size='small'
              type='button'
            >
              수정하기
            </Button>
          ) : (
            <>
              <Button type='submit' variant='contained' color='success' size='small'>
                수정완료
              </Button>
              <Button
                onClick={() => {
                  setIsPasswordEditMode(false);
                  form.reset();
                }}
                variant='contained'
                color='secondary'
                size='small'
                type='button'
              >
                취소
              </Button>
            </>
          )}
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormGrid flex={1}>
            <FormLabel htmlFor='currentPassword'>현재 비밀번호</FormLabel>
            <TextField
              {...register('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              disabled={!isPasswordEditMode}
              fullWidth
              placeholder='••••••'
              type='password'
              id='currentPassword'
            />
          </FormGrid>
          <FormGrid flex={1}>
            <FormLabel htmlFor='newPassword'>새 비밀번호</FormLabel>
            <TextField
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              disabled={!isPasswordEditMode}
              fullWidth
              placeholder='••••••'
              type='password'
              id='newPassword'
            />
          </FormGrid>
          <FormGrid flex={1}>
            <FormLabel htmlFor='newPasswordConfirm'>새 비밀번호 확인</FormLabel>
            <TextField
              {...register('newPasswordConfirm')}
              error={!!errors.newPasswordConfirm}
              helperText={errors.newPasswordConfirm?.message}
              disabled={!isPasswordEditMode}
              fullWidth
              placeholder='••••••'
              type='password'
              id='newPasswordConfirm'
            />
          </FormGrid>
        </Stack>
      </Stack>

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
  );
}
