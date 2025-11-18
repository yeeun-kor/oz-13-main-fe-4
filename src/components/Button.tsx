import { styled } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { amber, green, indigo } from '@mui/material/colors';
import Stack from '@mui/material/Stack';

export const NaverButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(green[600]),
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700],
  },
}));
export const KakaoButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(amber[600]),
  backgroundColor: amber[500],
  '&:hover': {
    backgroundColor: amber[700],
  },
}));
export const GoogleButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(indigo[600]),
  backgroundColor: indigo[500],
  '&:hover': {
    backgroundColor: indigo[700],
  },
}));
export default function ColorButtons() {
  return (
    <Stack direction='column' spacing={2}>
      <h1>버튼 사용법</h1>
      <Button variant='contained' color='success'>
        인증완료
      </Button>
      <Button variant='contained' color='primary' disabled>
        이메일 인증하기
      </Button>
      <Button variant='contained' color='primary'>
        이메일 인증하기
      </Button>
      <Button variant='outlined' color='primary'>
        취소
      </Button>
      <NaverButton>네이버 로그인</NaverButton>
      <KakaoButton>카카오 로그인</KakaoButton>
      <GoogleButton>구글 로그인</GoogleButton>
    </Stack>
  );
}
