import { Stack, styled } from '@mui/material';
import MuiCard from '@mui/material/Card';

export const CardMui = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  fontFamily: 'Pretendard',
  flexDirection: 'column',
  alignSelf: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  py: 8,
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('md')]: {
    width: '640px',
  },
}));

export const ContainerMui = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  fontFamily: 'Pretendard',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}));
