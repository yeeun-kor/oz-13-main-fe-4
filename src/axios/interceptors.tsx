import { refreshToken } from '../features/auth/api/auth';
import { useAuthStore } from '../features/auth/store/authStore';
import { diaryInstance, instance } from './instance';

// 토큰 갱신 중복 요청 방지 플래그
let isRefreshing = false;

// 토큰 갱신 대기 중인 요청 큐
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * 대기 중인 요청들을 일괄 처리
 * - 토큰 갱신 성공 시: 새 토큰으로 모든 요청 재시도
 * - 토큰 갱신 실패 시: 모든 요청 reject
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * 인증이 필요한 요청인지 판단
 * - 일기장(diary) API: 인증 필수
 * - 기타 API: 토큰 있으면 사용, 없어도 진행
 */
const requiresAuth = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('/diary'); // 일기장 관련 API만 인증 필수
};

// 모든 인스턴스에 인터셉터 적용
[instance, diaryInstance].forEach((axiosInstance) => {
  /**
   * === 요청 인터셉터 ===
   * 토큰이 있으면 자동으로 헤더에 추가
   * 없어도 요청은 진행 (서버에서 인증 여부 판단)
   */
  axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().access;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 토큰 없어도 요청은 진행 (비회원 접근 허용)

    return config;
  });

  /**
   * === 응답 인터셉터 ===
   * 401 에러 시 토큰 갱신 시도
   */
  axiosInstance.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 반환

    async (error) => {
      const originalRequest = error.config;

      // 401 Unauthorized 처리
      if (error.response?.status === 401) {
        // 1️⃣ 비밀번호 변경 실패는 로그아웃 안 함
        if (originalRequest.url === '/auth/password') {
          return Promise.reject(error);
        }

        // 2️⃣ refresh API 자체가 실패한 경우 (Refresh Token 만료)
        if (originalRequest.url?.includes('/auth/refresh')) {
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // 3️⃣ 인증이 필수가 아닌 API는 로그인 없이 실패 처리
        //    (소셜 로그인 개발 중이므로 강제 리다이렉션 방지)
        if (!requiresAuth(originalRequest.url)) {
          // 비회원 접근 가능한 API는 에러만 반환하고 로그인 페이지로 보내지 않음
          return Promise.reject(error);
        }

        // 4️⃣ 이미 토큰 갱신 중인 경우 대기열에 추가
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // 5️⃣ 토큰 갱신 시도
        originalRequest._retry = true; // 무한 루프 방지
        isRefreshing = true;

        try {
          // Refresh Token으로 새 Access Token 발급 (쿠키로 자동 전송)
          const response = await refreshToken();
          const newAccessToken = response.data?.access;

          if (!newAccessToken) {
            throw new Error('Access token not found in response');
          }

          // 새 토큰을 Zustand store에 저장 (localStorage 자동 동기화)
          useAuthStore.getState().setAccessToken(newAccessToken);

          // 원래 요청의 헤더를 새 토큰으로 갱신
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 대기 중인 요청들도 새 토큰으로 재시도
          processQueue(null, newAccessToken);

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh Token도 만료됨 - 로그아웃 처리
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 401 외 다른 에러는 그대로 반환
      return Promise.reject(error);
    }
  );
});
