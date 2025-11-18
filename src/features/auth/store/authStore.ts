import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { User } from '../types/auth';

//- JWT 인증 상태 관리
type AuthState = {
  user: User | null; //유저 정보
  access: string | null; //액세스 토큰
  isAutoLogin: boolean; //자동 로그인 여부
  setAuth: (user: User, accesstoken: string, isAutoLogin: boolean) => void; // 로그인 시 user, tokens, 자동로그인 여부 저장
  setAccessToken: (accesstoken: string) => void; //새로 발급받은 액세스토큰 업데이트
  clearAuth: () => void; //로그아웃 시 호출
  getAccessToken: () => string | null; //액세스 토큰 반환
};

//- Zustand 동적 스토어
const dynamicStorage: StateStorage = {
  getItem: (name: string) => {
    const localValue = localStorage.getItem(name);
    const sessionValue = sessionStorage.getItem(name);
    return localValue || sessionValue;
  },
  setItem: (name: string, value: string) => {
    try {
      const state = JSON.parse(value);
      if (state.state?.isAutoLogin) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch (error) {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access: null,
      isAutoLogin: false,

      setAuth: (user, accessToken, isAutoLogin) => {
        set({
          user,
          access: accessToken,
          isAutoLogin,
        });
      },

      setAccessToken: (accessToken) => {
        set({
          access: accessToken,
        });
      },

      getAccessToken: () => get().access,

      clearAuth: () => {
        set({
          user: null,
          access: null,
          isAutoLogin: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => dynamicStorage),
    }
  )
);
