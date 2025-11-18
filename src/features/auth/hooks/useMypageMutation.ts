// useUpdateProfileMutation.ts
import { useMutation } from '@tanstack/react-query';
import { updatePassword, updateProfile } from '../api/auth';

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

// useUpdatePasswordMutation.ts
export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};
