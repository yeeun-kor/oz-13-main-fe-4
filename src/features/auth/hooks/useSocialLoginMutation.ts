import { useMutation } from '@tanstack/react-query';
import { socialLogin } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { RequestSocialLoginDTO, SocialProvider } from '../types/auth';

type SocialLoginParams = {
  provider: SocialProvider;
  data: RequestSocialLoginDTO;
};

export const useSocialLoginMutation = () => {
  return useMutation({
    mutationFn: ({ provider, data }: SocialLoginParams) => socialLogin(provider, data),
    onSuccess: async (response) => {
      if (!response.data) return;

      const { user, access } = response.data;

      // 소셜 로그인 성공 시 사용자 정보와 액세스 토큰 저장
      // 소셜 로그인은 자동 로그인이 없으므로 false로 설정
      useAuthStore.getState().setAuth(user, access, false);
    },
  });
};
