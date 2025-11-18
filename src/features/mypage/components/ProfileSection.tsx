// features/mypage/components/ProfileSection.tsx
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import BaseModal from '../../../components/Modal/BaseModal';
import { useNicknameValidateMutation } from '../../auth/hooks/useNicknameValidateMutation';
import { useMypageForm } from '../hooks/useMypageForm';
import { ProfileSectionProps } from '../types/mypage.types';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function ProfileSection({ isEditMode, onEditModeChange }: ProfileSectionProps) {
  const { form, validationState, updateValidation, resetValidation } = useMypageForm();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const nicknameValidate = useNicknameValidateMutation();
  const [nicknameShowModal, setNicknameShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleNicknameValidate = () => {
    const nickname = watch('nickname');
    if (!nickname) {
      setModalMessage('닉네임을 입력해주세요');
      setNicknameShowModal(true);
      return;
    }

    nicknameValidate.mutate(
      { nickname },
      {
        onSuccess: (data) => {
          setModalMessage(data.message ?? '닉네임 확인완료');
          setNicknameShowModal(true);
          updateValidation('isNicknameValidated', true);
        },
        onError(error) {
          setModalMessage(`${error.message}.다시 입력해주세요`);
          setNicknameShowModal(true);
          updateValidation('isNicknameValidated', false);
        },
      }
    );
  };

  return (
    <Stack spacing={2}>
      <Divider>
        <Typography variant='h6' sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}>
          회원정보
        </Typography>
      </Divider>

      <Stack
        component='section'
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <FormGrid>
          <FormLabel htmlFor='name'>이름</FormLabel>
          <TextField
            {...register('name')}
            autoComplete='name'
            fullWidth
            id='name'
            placeholder='홍길동'
            name='name'
            type='name'
            size='medium'
            disabled
          />
        </FormGrid>

        <BaseModal
          isOpen={nicknameShowModal}
          onClose={() => setNicknameShowModal(false)}
          title='닉네임 중복 확인'
          subtitle={modalMessage}
          footer={
            <Button onClick={() => setNicknameShowModal(false)} variant='contained' type='button'>
              확인
            </Button>
          }
        />

        <FormGrid>
          <FormLabel htmlFor='nickname'>닉네임</FormLabel>
          <Stack direction='row' spacing={1}>
            <TextField
              {...register('nickname')}
              error={!!errors.nickname}
              helperText={errors.nickname?.message}
              disabled={!isEditMode}
              id='nickname'
              placeholder='동해번쩍 서해번쩍'
              name='nickname'
              type='name'
              fullWidth
              autoComplete='name'
              size='medium'
            />
            <Button
              variant='contained'
              color='info'
              onClick={handleNicknameValidate}
              disabled={!isEditMode || validationState.isNicknameValidated}
              type='button'
              sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
            >
              중복확인
            </Button>
          </Stack>
        </FormGrid>

        <FormGrid size={{ xs: 12 }}>
          <FormLabel>성별</FormLabel>
          <Controller
            name='gender'
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel
                  value='F'
                  label='여성'
                  control={<Radio disabled={!isEditMode} />}
                />
                <FormControlLabel
                  value='M'
                  label='남성'
                  control={<Radio disabled={!isEditMode} />}
                />
              </RadioGroup>
            )}
          />
        </FormGrid>

        <FormGrid flex={1}>
          <FormControl>
            <FormLabel htmlFor='named-select'>연령대</FormLabel>
            <Controller
              name='age'
              control={control}
              render={({ field }) => (
                <Select {...field} disabled={!isEditMode} id='named-select'>
                  <MenuItem value={'ten'}>10대</MenuItem>
                  <MenuItem value={'twenty'}>20대</MenuItem>
                  <MenuItem value={'thirty'}>30대</MenuItem>
                  <MenuItem value={'fourthy'}>40대</MenuItem>
                  <MenuItem value={'fifth'}>50대</MenuItem>
                  <MenuItem value={'sixth'}>60대</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </FormGrid>
      </Stack>
    </Stack>
  );
}
