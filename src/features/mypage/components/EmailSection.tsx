// features/mypage/components/EmailSection.tsx
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import BaseModal from '../../../components/Modal/BaseModal';
import {
  useSendEmailCodeMutation,
  useVerifyEmailCodeMutation,
} from '../../auth/hooks/useEmailVerificationMutation';
import { ProfileSectionProps } from '../types/mypage.types';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function EmailSection({
  isEditMode,
  onEditModeChange,
  form,
  validationState,
  updateValidation,
}: ProfileSectionProps) {
  const {
    register,
    watch,
    formState: { errors, defaultValues },
  } = form;

  const sendEmailCode = useSendEmailCodeMutation();
  const verifyEmailCode = useVerifyEmailCodeMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleEmailValidate = async () => {
    const email = watch('email') as string;
    const currentEmail = defaultValues?.email as string;

    // 현재 이메일과 동일한지 확인
    if (email === currentEmail) {
      setModalTitle('이메일 변경');
      setModalMessage('현재 사용 중인 이메일과 동일합니다. 새로운 이메일을 입력해주세요.');
      setShowModal(true);
      return;
    }

    sendEmailCode.mutate(
      { email },
      {
        onSuccess: () => {
          setModalTitle('이메일 중복 검사');
          setModalMessage('인증 메일이 발송되었습니다!');
          setShowModal(true);
          updateValidation('isEmailVerified', true);
        },
        onError: (error) => {
          setModalTitle('이메일 중복 검사');
          setModalMessage(`${error.message}. 새로운 이메일을 입력해주세요`);
          setShowModal(true);
        },
      }
    );
  };

  const handleEmailCodeValidate = async () => {
    const code = watch('emailCode');
    const email = watch('email') as string;

    if (!code) {
      setModalTitle('이메일 중복 검사');
      setModalMessage('인증코드를 입력하세요');
      setShowModal(true);
      return;
    }

    verifyEmailCode.mutate(
      { code, email },
      {
        onSuccess: () => {
          setModalTitle('이메일 중복 검사');
          setModalMessage('인증이 완료되었습니다');
          setShowModal(true);
          updateValidation('isEmailCodeChecked', true);
        },
        onError: (error) => {
          setModalMessage(error.message);
          setShowModal(true);
          updateValidation('isEmailCodeChecked', false);
        },
      }
    );
  };

  return (
    <Stack spacing={2}>
      <Divider>
        <Typography variant='h6' sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}>
          이메일 변경
        </Typography>
      </Divider>

      <FormGrid>
        <FormLabel htmlFor='email'>이메일</FormLabel>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            id='email'
            placeholder='your@email.com'
            autoComplete='email'
            disabled={!isEditMode}
          />
          <Button
            variant='contained'
            color='success'
            type='button'
            onClick={handleEmailValidate}
            disabled={!isEditMode || validationState.isEmailVerified}
            sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
          >
            인증코드 보내기
          </Button>
        </Stack>
      </FormGrid>

      {validationState.isEmailVerified && (
        <FormControl>
          <FormLabel htmlFor='emailCode'>이메일 인증코드</FormLabel>
          <TextField
            {...register('emailCode')}
            fullWidth
            id='emailCode'
            placeholder='123456'
            variant='outlined'
            disabled={validationState.isEmailCodeChecked}
          />
          <Button
            variant='contained'
            color='success'
            type='button'
            onClick={handleEmailCodeValidate}
            disabled={validationState.isEmailCodeChecked}
          >
            인증코드 확인
          </Button>
        </FormControl>
      )}

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
