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
      age_group: '',
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
        age_group: data.data?.age_group,
      });
    }
  }, [data]);

  //프로필 수정 핸들러
  const handleProfileSubmit = (
    formData: MyPageFormData,
    onSuccess: () => void,
    onError: (message: string) => void
  ) => {
    console.log('🔍 handleProfileSubmit 호출됨');
    console.log('📝 전송할 데이터:', {
      nickname: formData.nickname,
      email: formData.email,
      gender: formData.gender,
      age_group: formData.age_group,
    });

    updateProfileMutation.mutate(
      {
        nickname: formData.nickname,
        email: formData.email,
        gender: formData.gender,
        age_group: formData.age_group,
      },
      {
        onSuccess: () => {
          console.log('✅ 프로필 수정 성공');
          queryClient.invalidateQueries({ queryKey: ['me'] });
          onSuccess();
        },
        onError: (error) => {
          console.error('❌ 프로필 수정 실패:', error);
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
