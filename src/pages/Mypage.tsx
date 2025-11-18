import { zodResolver } from '@hookform/resolvers/zod';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CssBaseline,
  Divider,
  FormControl,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { red } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BaseModal from '../components/Modal/BaseModal';
import {
  useSendEmailCodeMutation,
  useVerifyEmailCodeMutation,
} from '../features/auth/hooks/useEmailVerificationMutation';
import { useGetMeQuery } from '../features/auth/hooks/useGetMeQuery';
import {
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from '../features/auth/hooks/useMypageMutation';
import { useNicknameValidateMutation } from '../features/auth/hooks/useNicknameValidateMutation';
import {
  FormFieldPassword,
  MyPageFormData,
  mypageSchema,
  passwordSchema,
} from '../features/auth/types/zodTypes';
import AppTheme from '../styles/AppTheme';
import { CardMui, ContainerMui } from '../styles/AuthStyle';
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function Mypage() {
  //쿼리 갱신
  const queryClient = useQueryClient();

  const sendEmailCode = useSendEmailCodeMutation(); //이메일 중복 확인
  const verityEmailCode = useVerifyEmailCodeMutation(); //이메일 인증 코드 확인
  const nicknameValidate = useNicknameValidateMutation(); //닉네임중복 query
  const [isNicknameValidated, setIsNicknameValidated] = useState(false); //닉네임 중복검사 확인 상태
  const [nicknameShowModal, setNickanameShowModal] = useState(false); //닉네임 모달창 상태()
  const [showModal, setShowModal] = useState(false); // 이메일 모달창 상태
  const [modalMessage, setModalMessage] = useState(''); //모달메시지
  const [modalTitle, setModalTitle] = useState(''); //모달메시지
  // src/pages/auth/SignUp.tsx
  const [isEmailVerified, setIsEmailVerified] = useState(false); //이메일 중복 상태
  const [isEmailCodeChecked, setIsEmailCodeChecked] = useState(false); //이메일 인증코드 상태
  const [isEditMode, setIsEditMode] = useState(false); //수정모드 상태
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false); //비밀번호 수정모드 상태
  // Mutation hooks
  const updateProfileMutation = useUpdateProfileMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  // 초기화 폼 분리(비밀번호,유저정보)
  // 기본 정보 폼
  const {
    reset,
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm<MyPageFormData>({
    resolver: zodResolver(mypageSchema), // ⭐ 조드의 타입 스키마 받아옴 이게 핵심!
    mode: 'onChange', // ✅ 실시간 검증
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      gender: '',
      age: '',
      emailCode: '',
    },
  });

  // 비밀번호 폼 (별도)
  const passwordForm = useForm<FormFieldPassword>({
    resolver: zodResolver(passwordSchema), // ✅ Zod 검증 추가
    mode: 'onChange', // ✅ 실시간 검증
    defaultValues: { oldPassword: '', newPassword: '', newPasswordConfirm: '' },
  });

  // 닉네임 중복 검사
  const handleNicknameValidate = () => {
    const nickname = watch('nickname'); // react-hook-form의  사용
    if (!nickname) {
      setModalMessage('닉네임을 입력해주세요');
      setNickanameShowModal(true);
      return;
    }

    nicknameValidate.mutate(
      { nickname },
      {
        onSuccess: (data) => {
          setModalMessage(data.message ?? '닉네임 확인완료');
          setNickanameShowModal(true);
          setIsNicknameValidated(true);
        },
        onError(error) {
          console.log('전체 에러:', error);
          console.log('에러 타입:', typeof error);
          setModalMessage(`${error.message}.다시 입력해주세요`);
          setNickanameShowModal(true);
          setIsNicknameValidated(false);
        },
      }
    );
  };

  //이메일 중복 검사
  const handleEmailValidate = async () => {
    const email = watch('email') as string;
    // 이메일 필드만 검증

    sendEmailCode.mutate(
      { email },
      {
        onSuccess: () => {
          setModalTitle('이메일 중복 검사');
          setModalMessage('인증 메일이 발송되었습니다!');
          setShowModal(true);
          setIsEmailVerified(true);
        },
        onError: (error) => {
          setModalTitle('이메일 중복 검사');
          setModalMessage(`${error.message}. 새로운 이메일을 입력해주세요`);
          setShowModal(true);
        },
      }
    );
  };

  //이메일 중복 코드 검사
  const handleEmailCodeValidate = async () => {
    const code = watch('emailCode');
    const email = watch('email') as string;

    if (!code) {
      setModalTitle('이메일 중복 검사');
      setModalMessage('인증코드를 입력하세요');
      setShowModal(true);
      return;
    }
    verityEmailCode.mutate(
      { code, email },
      {
        onSuccess: () => {
          setModalTitle('이메일 중복 검사');

          setModalMessage('인증이 완료되었습니다');
          setShowModal(true);
          setIsEmailCodeChecked(true);
        },
        onError: (error) => {
          setModalMessage(error.message);
          setShowModal(true);
          setIsEmailCodeChecked(false);
        },
      }
    );
  };

  // Hook 호출 (자동으로 API 실행됨)
  const { data, isLoading, error } = useGetMeQuery();
  // 초기화 후 데이터 들어오면 폼에 데이터 채우기.
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data?.name,
        nickname: data.data?.nickname,
        email: data.data?.email,
        gender: data.data?.gender,
        age: data.data?.age,
      });
    }
  }, [data, reset]); // 👈 reset 제거

  //  로딩 중일 때
  if (isLoading) {
    return <div>로딩중...</div>;
  }

  //  에러 발생 시
  if (error) {
    return <div>에러 발생</div>;
  }

  // 회원정보 수정완료 핸들러
  const handleProfileSubmit: SubmitHandler<MyPageFormData> = (data) => {
    updateProfileMutation.mutate(
      {
        nickname: data.nickname,
        email: data.email,
        gender: data.gender,
        age: data.age,
      },
      {
        onSuccess: () => {
          setModalTitle('회원정보 수정');
          setModalMessage('마이페이지 수정 완료');
          setShowModal(true);
          setIsEditMode(false);
          //쿼리 갱신
          queryClient.invalidateQueries({ queryKey: ['me'] });
        },

        onError: (error) => {
          setModalTitle('회원정보 수정 오류');
          setModalMessage(error.message);
          setShowModal(true);
        },
      }
    );
  };

  // 비밀번호 수정 완료
  const handlePasswordSubmit: SubmitHandler<FormFieldPassword> = (formData) => {
    updatePasswordMutation.mutate(
      {
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
        new_password_confirm: formData.newPasswordConfirm,
      },
      {
        onSuccess: () => {
          setModalTitle('비밀번호 수정');
          setModalMessage('비밀번호 변경 완료');
          setShowModal(true);
          setIsPasswordEditMode(false);
          passwordForm.reset();
        },
        onError: (error) => {
          setModalTitle('비밀번호 수정');
          setModalMessage(error.message);
          setShowModal(true);
        },
      }
    );
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ContainerMui direction='column' justifyContent='space-between'>
        <CardMui>
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
          </Typography>{' '}
          {/* 스택 시작  */}
          <Stack
            component='form'
            spacing={{ xs: 4, md: 8 }}
            onSubmit={(e) => {
              handleSubmit(handleProfileSubmit)(e);
            }}
          >
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
                    color='secondary'
                    onClick={(e) => {
                      e.preventDefault(); // 👈 추가
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
                        setIsEmailVerified(false);
                        setIsEmailCodeChecked(false);
                        setIsNicknameValidated(false);
                        reset();
                      }}
                      sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
                      variant='contained'
                      size='small'
                      color='warning'
                      type='button'
                    >
                      취소
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
            <Stack>
              <Divider>
                <Typography
                  variant='h6'
                  sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}
                >
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
                  onClose={() => setNickanameShowModal(false)}
                  title='닉네임 중복 확인'
                  subtitle={modalMessage}
                  footer={
                    <Button
                      onClick={() => setNickanameShowModal(false)}
                      variant='contained'
                      type='button'
                    >
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
                      disabled={!isEditMode} // ✅ 수정모드 아니면 비활성화
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
                      disabled={!isEditMode || isNicknameValidated}
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
            <Stack>
              <Divider>
                <Typography
                  variant='h6'
                  sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}
                >
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
                    disabled={!isEditMode} // ✅ 수정모드 아니면 비활성화
                  />
                  <Button
                    variant='contained'
                    color='success'
                    type='button'
                    onClick={handleEmailValidate}
                    disabled={!isEditMode || isEmailVerified}
                    sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
                  >
                    인증코드 보내기
                  </Button>
                </Stack>
              </FormGrid>
            </Stack>
            {isEmailVerified ? (
              <FormControl>
                <FormLabel htmlFor='emailCode'>이메일 인증코드</FormLabel>
                <TextField
                  {...register('emailCode')}
                  fullWidth
                  id='emailCode'
                  placeholder='123456'
                  variant='outlined'
                  disabled={isEmailCodeChecked}
                />
                <Button
                  variant='contained'
                  color='success'
                  type='button'
                  onClick={handleEmailCodeValidate}
                  disabled={isEmailCodeChecked}
                >
                  인증코드 확인
                </Button>
              </FormControl>
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
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
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  확인
                </Button>
              }
            />
          </Stack>
          <Stack>
            <Divider>
              <Typography
                variant='h6'
                sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}
              >
                비밀번호 변경
              </Typography>
            </Divider>
            {/* ✅ 별도 form으로 분리 */}
            <Stack
              component='form'
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              spacing={2}
            >
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
                    color='secondary'
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
                        passwordForm.reset(); // ✅ passwordForm의 reset
                      }}
                      variant='contained'
                      color='warning'
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
                  <FormLabel htmlFor='oldPassword'>현재 비밀번호</FormLabel>
                  <TextField
                    {...passwordForm.register('oldPassword')} // ✅ register 추가
                    error={!!passwordForm.formState.errors.oldPassword}
                    helperText={passwordForm.formState.errors.oldPassword?.message} // 👈 추가
                    disabled={!isPasswordEditMode}
                    fullWidth
                    placeholder='••••••'
                    type='password'
                    id='oldPassword'
                  />
                </FormGrid>
                <FormGrid flex={1}>
                  <FormLabel htmlFor='newPassword'>새 비밀번호</FormLabel>
                  <TextField
                    {...passwordForm.register('newPassword')} // ✅ register 추가
                    error={!!passwordForm.formState.errors.newPassword}
                    helperText={passwordForm.formState.errors.newPassword?.message}
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
                    {...passwordForm.register('newPasswordConfirm')} // ✅ register 추가
                    error={!!passwordForm.formState.errors.newPasswordConfirm}
                    helperText={passwordForm.formState.errors.newPasswordConfirm?.message}
                    disabled={!isPasswordEditMode}
                    fullWidth
                    placeholder='••••••'
                    type='password'
                    id='newPasswordConfirm'
                  />
                </FormGrid>
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            <Divider>
              <Typography
                variant='h6'
                sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}
              >
                즐겨찾는 지역 수정
              </Typography>
            </Divider>
            {/* 도전 */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Grid
                spacing={2}
                container
                sx={{
                  '--Grid-borderWidth': '1px',
                  borderColor: 'divider',
                  '& > div': {
                    borderColor: 'divider',
                  },
                }}
              >
                {[...Array(3)].map((_, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: red[500] }} aria-label='recipe'>
                            Icon
                          </Avatar>
                        }
                        sx={{ textAlign: 'left' }}
                        action={<CancelIcon aria-label='close' />}
                        title='수원시 장안구'
                        subheader='KT위즈파크'
                      />
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          variant='contained'
                          color='secondary'
                          type='button'
                          size='small'
                          sx={{
                            minWidth: 'fit-content',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          수정
                        </Button>{' '}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </CardMui>
      </ContainerMui>
    </AppTheme>
  );
}
