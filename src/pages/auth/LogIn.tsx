import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { GoogleButton, KakaoButton, NaverButton } from '../../components/Button';
import ForgotPassword from '../../components/Modal/ForgotPassword';
import { useLogInMutation } from '../../features/auth/hooks/useLogInMutation';
import { useSocialLoginMutation } from '../../features/auth/hooks/useSocialLoginMutation';
import { FormFieldLogin, logInSchema } from '../../features/auth/types/zodTypes';
import { CardMui, ContainerMui } from '../../styles/AuthStyle';
import { initKakao, loginWithKakao } from '../../utils/kakaoAuth';

export default function LogIn() {
  const navigator = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false); // ✅ 자동로그인 상태

  const logInMutation = useLogInMutation();
  const socialLogInMutation = useSocialLoginMutation();

  // 카카오 SDK 초기화
  useEffect(() => {
    initKakao();
  }, []);

  //2. react-hook-form 사용
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFieldLogin>({
    resolver: zodResolver(logInSchema), // ⭐ 조드의 타입 스키마 받아옴 이게 핵심!
    mode: 'onBlur', //🎃onBlur추가
    defaultValues: {
      email: '',
      password: '',
    },
  });
  //로그인 버튼 클릭시! SubmitHandler는 (data) 하나만 받는다.
  //isAutoLogin 상태값은 state에서 가져와야한다.
  const onSubmit: SubmitHandler<FormFieldLogin> = (data) => {
    logInMutation.mutate(
      { ...data, is_auto_login: isAutoLogin },
      {
        onSuccess: () => {
          alert(`로그인성공!`);
          navigator('/');
        },
      }
    );
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    // 인증 후 /auth/kakao/callback 으로 돌아옴
    loginWithKakao();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ContainerMui direction='column' justifyContent='space-between'>
      <CardMui variant='outlined'>
        <Typography
          component='h1'
          variant='h4'
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mb: 5 }}
        >
          로그인
        </Typography>
        {/* 로그인 실패!  */}
        {logInMutation.error && <Typography color='error'>로그인에 실패했습니다.</Typography>}
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor='email' sx={{ textAlign: 'left', mb: 3 }}>
              이메일(아이디)
            </FormLabel>
            <TextField
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              color={errors.email ? 'error' : 'primary'}
              id='email'
              type='email'
              name='email'
              placeholder='your@email.com'
              autoComplete='email'
              fullWidth
              variant='outlined'
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='password' sx={{ textAlign: 'left', mb: 3 }}>
              비밀번호
            </FormLabel>
            <TextField
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              name='password'
              placeholder='••••••'
              type='password'
              id='password'
              autoComplete='current-password'
              fullWidth
              variant='outlined'
              color={errors.password ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                value='remember'
                color='primary'
                checked={isAutoLogin}
                onChange={(e) => setIsAutoLogin(e.target.checked)}
              />
            }
            label='로그인 정보 저장'
          />
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button type='submit' fullWidth variant='contained' color='info'>
            로그인
          </Button>
        </Box>
        <Divider sx={{ my: 3 }}>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <GoogleButton fullWidth onClick={() => alert('Sign in with Google')}>
            구글 로그인
          </GoogleButton>
          <KakaoButton fullWidth onClick={handleKakaoLogin}>
            카카오 로그인
          </KakaoButton>
          <NaverButton fullWidth onClick={() => alert('Sign in with 네이버')}>
            네이버 로그인
          </NaverButton>
          <Typography sx={{ textAlign: 'center' }}>
            계정이 없으신가요?{' '}
            <Link href='/signup' variant='body2' sx={{ alignSelf: 'center' }}>
              회원가입
            </Link>
          </Typography>
        </Box>
      </CardMui>
    </ContainerMui>
  );
}
