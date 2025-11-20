// src/utils/kakaoAuth.ts

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

/**
 * 카카오 SDK 초기화
 */
export const initKakao = (): void => {
  console.log('initKakao 호출됨');
  console.log('window.Kakao:', window.Kakao);

  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }

  if (!window.Kakao.isInitialized()) {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY;
    console.log('VITE_KAKAO_APP_KEY:', kakaoAppKey);

    if (!kakaoAppKey) {
      console.error('VITE_KAKAO_APP_KEY가 설정되지 않았습니다.');
      return;
    }

    window.Kakao.init(kakaoAppKey);
    console.log('Kakao SDK 초기화 완료:', window.Kakao.isInitialized());
  } else {
    console.log('Kakao SDK 이미 초기화됨');
  }
};

/**
 * 카카오 로그인 (리다이렉트 방식)
 * 카카오 인증 페이지로 리다이렉트됩니다
 */
export const loginWithKakao = (): void => {
  console.log('loginWithKakao 호출됨');
  console.log('window.Kakao:', window.Kakao);
  console.log('window.Kakao.isInitialized():', window.Kakao?.isInitialized());

  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    alert('카카오 SDK가 로드되지 않았습니다.');
    return;
  }

  if (!window.Kakao.isInitialized()) {
    console.error('Kakao SDK가 초기화되지 않았습니다.');
    alert('카카오 SDK가 초기화되지 않았습니다.');
    return;
  }

  console.log('카카오 로그인 페이지로 리다이렉트...');

  // 카카오 로그인 페이지로 리다이렉트
  const redirectUri = `${window.location.origin}/auth/kakao/callback`;
  window.Kakao.Auth.authorize({
    redirectUri: redirectUri,
  });
};

/**
 * 카카오 로그아웃
 */
export const logoutKakao = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao || !window.Kakao.Auth.getAccessToken()) {
      resolve();
      return;
    }

    window.Kakao.Auth.logout(() => {
      console.log('카카오 로그아웃 성공');
      resolve();
    });
  });
};
