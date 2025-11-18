import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import * as React from 'react';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
          sx: { backgroundImage: 'none', p: 3 },
        },
      }}
    >
      <DialogTitle>비밀번호 교체</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DialogContentText>
          이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </DialogContentText>
        <OutlinedInput
          required
          margin='dense'
          id='email'
          name='email'
          label='Email address'
          placeholder='Email address'
          type='email'
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose} variant='outlined' type='submit'>
          취소
        </Button>
        <Button variant='contained' type='submit'>
          메일 보내기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
