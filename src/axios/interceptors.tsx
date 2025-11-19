import { refreshToken } from '../features/auth/api/auth';
import { useAuthStore } from '../features/auth/store/authStore';
import { diaryInstance, instance } from './instance';

// 토큰 갱신 중인지 확인하는 플래그 (무한 루프 방지)
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 배열
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
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

//- 모든 인스턴스에 인터셉터 적용
[instance, diaryInstance].forEach((axiosInstance) => {
  //- 요청인터셉터
  axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().access;

    if (token) {
      // 토큰이 존재하면 Authorization 헤더에 추가
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 수정된 요청 설정 반환
    return config;
  });

  //- 응답인터셉터(instance 기반으로 동작)
  axiosInstance.interceptors.response.use(
    (response) => {
      // 성공적인 응답은 그대로 반환
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      // 401 에러
      if (error.response?.status === 401) {
        // 401이지만 password 변경 실패는 로그아웃 안 함
        if (error.config?.url === '/auth/password' && error.response?.status === 401) {
          return Promise.reject(error);
        }
        // refresh API 자체가 실패한 경우 무한 루프 방지
        if (originalRequest.url?.includes('/auth/refresh')) {
          // Refresh Token이 만료됨 - 로그인 페이지로 리다이렉션
          useAuthStore.getState().clearAuth(); // Zustand store 클리어 (localStorage도 자동 클리어)
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // 이미 토큰 갱신 중인 경우 대기열에 추가
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // 재시도 플래그 설정 (무한 루프 방지)
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 새 Access Token 발급 요청 (Refresh Token은 쿠키로 자동 전송됨)
          const response = await refreshToken();
          const newAccessToken = response.data?.access;

          if (!newAccessToken) {
            throw new Error('Access token not found in response');
          }

          // 새로 발급받은 JWT access 토큰을 Zustand store에 저장 (localStorage도 자동 동기화)
          useAuthStore.getState().setAccessToken(newAccessToken);

          // 원래 요청의 Authorization 헤더를 새 토큰으로 갱신
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken);

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh Token이 만료되었거나, 발급 실패 시
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth(); // Zustand store 클리어 (localStorage도 자동 클리어)
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error); // 기타 에러는 그대로 반환
    }
  );
});
