import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetMeQuery } from '../../auth/hooks/useGetMeQuery';
import { useUpdateProfileMutation } from '../../auth/hooks/useMypageMutation';
import { MyPageFormData, mypageSchema } from '../../auth/types/zodTypes';
import { ValidationState } from '../types/mypage.types';

export const useMypageForm = () => {
  const queryClient = useQueryClient(); //캐싱확인
  //상태관리 (배열로 관리)
  const [validationState, setValidationState] = useState<ValidationState>({
    isNicknameValidated: false,
    isEmailVerified: false,
    isEmailCodeChecked: false,
  });

  //리액트쿼리 성공,실패 로직
  const updateProfileMutation = useUpdateProfileMutation();
  //실시간 수정된 사항 patch
  const { data, isLoading, error } = useGetMeQuery();

  //react-hook-form reset
  const form = useForm<MyPageFormData>({
    resolver: zodResolver(mypageSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      gender: '',
      age: '',
      emailCode: '',
    },
  });

  //최신정보 로드시 useEffect최신화
  useEffect(() => {
    if (data?.data) {
      form.reset({
        name: data.data?.name,
        nickname: data.data?.nickname,
        email: data.data?.email,
        gender: data.data?.gender,
        age: data.data?.age,
      });
    }
  }, [data, form.reset]);

  //프로필 수정 핸들러
  const handleProfileSubmit = (
    formData: MyPageFormData,
    onSuccess: () => void,
    onError: (message: string) => void
  ) => {
    updateProfileMutation.mutate(
      {
        nickname: formData.nickname,
        email: formData.email,
        gender: formData.gender,
        age: formData.age,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['me'] });
          onSuccess();
        },
        onError: (error) => {
          onError(error.message);
        },
      }
    );
  };

  // 검증 상태 업데이트 헬퍼
  const updateValidation = (key: keyof ValidationState, value: boolean) => {
    setValidationState((prev) => ({ ...prev, [key]: value }));
  };

  // 검증 상태 초기화
  const resetValidation = () => {
    setValidationState({
      isNicknameValidated: false,
      isEmailVerified: false,
      isEmailCodeChecked: false,
    });
  };

  return {
    form,
    validationState,
    updateValidation,
    resetValidation,
    handleProfileSubmit,
    userData: data,
    isLoading,
    error,
  };
};
