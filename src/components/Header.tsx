import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLocationStore } from '../features/location/store/locationStore';
import { useCurrentWeather } from '../features/main/hooks/useCurrentWeather';
import fe_logo from '../assets/fe_logo.webp';
const HeaderAppBar = styled(AppBar)({
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0',
});
const Logo = styled('img')({
  height: '70px',
  cursor: 'pointer',
  marginBottom: '4px',
});
const LocationButton = styled(Button)({
  color: '#666666',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: '400',
  '& .MuiButton-startIcon': {
    color: '#ff6b6b',
  },
});
const NavBar = styled(Box)({
  backgroundColor: '#2c4a8f',
  padding: '12px 0',
  position: 'relative',
});
const NavButton = styled(Button)({
  color: '#ffffff',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
const AdminButton = styled(Button)({
  color: '#ffffff',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  position: 'absolute',
  right: '24px',
  top: '50%',
  transform: 'translateY(-50%)',
});
export const Header = () => {
  const navigator = useNavigate();
  const { user, clearAuth } = useAuthStore();

  console.log('userStore👀', user);

  const handleLogOut = () => {
    clearAuth();
    alert('로그아웃 성공!!!! ');
    navigator('/');
  };
  const { location } = useLocationStore();
  const { weather } = useCurrentWeather();

  return (
    <>
      <HeaderAppBar position='static'>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <LocationButton startIcon={<LocationOnIcon />}>
            {location || weather?.location_name}
          </LocationButton>
          <Link to='/'>
            <Logo src={fe_logo} alt='AWS' />
          </Link>

          <Box sx={{ width: '120px' }} />
        </Toolbar>
      </HeaderAppBar>
      <NavBar>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <NavButton href='/'>Today</NavButton>
          <NavButton href='/diary'>날씨 일기장</NavButton>
          {user === null ? (
            <>
              <NavButton href='/login'>로그인</NavButton>
              <NavButton href='/signup'>회원가입</NavButton>
            </>
          ) : (
            <>
              <NavButton href='/mypage'>마이페이지</NavButton>
              <NavButton onClick={handleLogOut}>로그아웃</NavButton>
            </>
          )}
          {/* {userState === 'admin' && <AdminButton>관리자전용</AdminButton>} */}
        </Box>
      </NavBar>
    </>
  );
};
