// features/mypage/hooks/usePasswordForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUpdatePasswordMutation } from '../../auth/hooks/useMypageMutation';
import { FormFieldPassword, passwordSchema } from '../../auth/types/zodTypes';

export const usePasswordForm = () => {
  const updatePasswordMutation = useUpdatePasswordMutation();

  const form = useForm<FormFieldPassword>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const handlePasswordSubmit = (
    formData: FormFieldPassword,
    onSuccess: () => void,
    onError: (message: string) => void
  ) => {
    updatePasswordMutation.mutate(
      {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirm: formData.newPasswordConfirm,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
        onError: (error) => {
          onError(error.message);
        },
      }
    );
  };

  return {
    form,
    handlePasswordSubmit,
  };
};
