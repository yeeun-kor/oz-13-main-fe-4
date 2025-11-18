import { useMutation } from '@tanstack/react-query';
import { validateNickname } from '../api/auth';

export const useNicknameValidateMutation = () => {
  return useMutation({
    mutationFn: validateNickname,
  });
};
