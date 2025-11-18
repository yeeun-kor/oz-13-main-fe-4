import { useMutation } from '@tanstack/react-query';
import { sendEmailCode, verifyEmailCode } from '../api/auth';

export const useSendEmailCodeMutation = () => {
  return useMutation({
    mutationFn: sendEmailCode,
  });
};

export const useVerifyEmailCodeMutation = () => {
  return useMutation({
    mutationFn: verifyEmailCode,
  });
};
