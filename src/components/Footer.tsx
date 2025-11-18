import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterBox = styled(Box)({
  backgroundColor: '#2c4a8f',
  color: '#ffffff',
  padding: '16px 0',
  textAlign: 'center',
  fontSize: '12px',
});
export const Footer = () => {
  return (
    <FooterBox>
      <Typography variant='caption'>AWS: AI Weather Style © 2025. All rights reserved.</Typography>
    </FooterBox>
  );
};
