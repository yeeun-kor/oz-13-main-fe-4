import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocialLoginMutation } from '../../features/auth/hooks/useSocialLoginMutation';
import { initKakao } from '../../utils/kakaoAuth';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const socialLoginMutation = useSocialLoginMutation();
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했으면 무시
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleKakaoCallback = async () => {
      try {
        // URL에서 인가 코드 추출
        const code = new URL(window.location.href).searchParams.get('code');

        if (!code) {
          console.error('카카오 인가 코드가 없습니다.');
          alert('카카오 로그인에 실패했습니다.');
          navigate('/login');
          return;
        }

        console.log('카카오 인가 코드:', code);

        // Kakao SDK 초기화 (페이지 새로고침 시 초기화가 안 될 수 있음)
        initKakao();

        // 인가 코드를 바로 서버에 전달
        // 서버가 인가 코드로 액세스 토큰을 받아서 처리
        socialLoginMutation.mutate(
          {
            provider: 'kakao',
            data: { token: code }, // 인가 코드를 서버에 전달
          },
          {
            onSuccess: () => {
              console.log('소셜 로그인 성공');
              navigate('/');
            },
            onError: (error) => {
              console.error('소셜 로그인 실패:', error);
              alert('로그인에 실패했습니다.');
              navigate('/login');
            },
          }
        );
      } catch (error) {
        console.error('카카오 콜백 처리 실패:', error);
        alert('카카오 로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      }
    };

    handleKakaoCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 한 번만 실행

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant='h6'>카카오 로그인 처리 중...</Typography>
    </Box>
  );
}
