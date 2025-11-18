import { useMutation } from '@tanstack/react-query';
import { getMe, logIn } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const useLogInMutation = () => {
  return useMutation({
    mutationFn: logIn,
    onSuccess: async (response) => {
      if (!response.data) return;

      // 1. 토큰 먼저 저장 (getMe 호출 시 헤더에 필요)
      useAuthStore.getState().setAccessToken(response.data.access);

      try {
        // 2. 사용자 정보 가져오기 (로그인 및 마이페이지에서 사용)
        const userResponse = await getMe();

        if (!userResponse.data) return;

        // 3. 전부 저장(전역상태로 사용자정보와ㅏ 액세스토ㅋ큰 저장)
        useAuthStore
          .getState()
          .setAuth(userResponse.data, response.data.access, response.data.is_auto_login);
      } catch (error) {
        console.error('사용자 정보 조회 실패', error);
      }
    },
  });
};
