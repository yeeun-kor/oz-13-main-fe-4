import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const useGetMeQuery = () => {
  // 1. Zustand에서 access 토큰 가져오기
  const { access } = useAuthStore();

  return useQuery({
    // 2. 캐시 키 설정
    queryKey: ['me'],

    // 3. 실제 API 호출 함수
    queryFn: getMe,

    // 4. 실행 조건
    enabled: !!access,
  });
};
