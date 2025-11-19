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
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import BaseModal from '../../../components/Modal/BaseModal';
import { useNicknameValidateMutation } from '../../auth/hooks/useNicknameValidateMutation';
import { ProfileSectionProps } from '../types/mypage.types';

export default function ProfileSection({
  isEditMode,
  onEditModeChange,
  form,
  validationState,
  updateValidation,
}: ProfileSectionProps) {
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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
        <FormControl fullWidth>
          <FormLabel htmlFor='name'>이름</FormLabel>
          <TextField
            {...register('name')}
            autoComplete='name'
            fullWidth
            id='name'
            placeholder='홍길동'
            disabled
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor='nickname'>닉네임</FormLabel>
          <Stack direction='row' spacing={1}>
            <TextField
              {...register('nickname')}
              error={!!errors.nickname}
              helperText={errors.nickname?.message}
              disabled={!isEditMode}
              id='nickname'
              placeholder='동해번쩍 서해번쩍'
              fullWidth
              color={errors.nickname ? 'error' : 'primary'}
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
        </FormControl>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel htmlFor='gender'>성별</FormLabel>
          <Controller
            name='gender'
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row css={{ justifyContent: 'space-around' }}>
                <FormControlLabel
                  value='M'
                  control={<Radio disabled={!isEditMode} />}
                  label='남자'
                />
                <FormControlLabel
                  value='W'
                  control={<Radio disabled={!isEditMode} />}
                  label='여자'
                />
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <FormLabel htmlFor='age_group'>연령대</FormLabel>
          <Controller
            name='age_group'
            control={control}
            render={({ field }) => (
              <Select {...field} disabled={!isEditMode} id='age_group'>
                <MenuItem value={'10'}>10대</MenuItem>
                <MenuItem value={'20'}>20대</MenuItem>
                <MenuItem value={'30'}>30대</MenuItem>
                <MenuItem value={'40'}>40대</MenuItem>
                <MenuItem value={'50'}>50대</MenuItem>
                <MenuItem value={'60'}>60대</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
}
