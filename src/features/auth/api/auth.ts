// src/features/auth/api/authApi.ts

import axios from 'axios';
import { instance } from '../../../axios/instance';
import {
  RequestEmailSendDTO,
  RequestEmailVerifyDTO,
  RequestLoginDTO,
  RequestNicknameValidateDTO,
  RequestPasswordChangeDTO,
  RequestProfileUpdateDTO,
  RequestSignUpDTO,
  RequestSocialLoginDTO,
  ResponseEmailSendDTO,
  ResponseEmailVerifyDTO,
  ResponseLoginDTO,
  ResponseMeDTO,
  ResponsePasswordChangeDTO,
  ResponseProfileUpdateDTO,
  ResponseRefreshToken,
  ResponseSocialLoginDTO,
  SocialProvider,
} from '../types/auth';

//- ==================== 닉네임 검증 ====================
export async function validateNickname(data: RequestNicknameValidateDTO) {
  try {
    const res = await instance.post('/auth/nickname/validate', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // ✅ 에러 구조를 평탄화해서 throw
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '닉네임 검증 실패');
    }
    throw new Error('네트워크 오류');
  }
}

//- ==================== 이메일 검증 ====================
export async function sendEmailCode(data: RequestEmailSendDTO): Promise<ResponseEmailSendDTO> {
  try {
    const res = await instance.post('/auth/email/send', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '이메일 검증 실패');
    }
    throw new Error('네트워크 오류');
  }
}

//- ==================== 이메일 코드 검증 ====================
export async function verifyEmailCode(
  data: RequestEmailVerifyDTO
): Promise<ResponseEmailVerifyDTO> {
  try {
    const res = await instance.post('/auth/email/verify', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '이메일 코드 검증 실패');
    }
    throw new Error('네트워크 오류');
  }
}

//- ==================== 회원가입 ====================
export async function signUp(data: RequestSignUpDTO): Promise<{ message: string }> {
  try {
    const res = await instance.post('/auth/signup', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '회원가입 실패');
    }
    throw new Error('네트워크 오류');
  }
}
//- ==================== 로그인 ====================
export async function logIn(data: RequestLoginDTO): Promise<ResponseLoginDTO> {
  try {
    const res = await instance.post('/auth/login', data);
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '로그인 실패');
    }
    throw new Error('네트워크 오류');
  }
}

//- ==================== 리프레쉬토큰 ====================
export async function refreshToken(): Promise<ResponseRefreshToken> {
  try {
    const res = await instance.post('/auth/refresh');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('네트워크 오류');
  }
}

//- ==================== 로그아웃 ====================
export async function logOut(): Promise<void> {
  try {
    await instance.post('/auth/logout');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('네트워크 오류');
  }
}
//- ====================  마이페이지 조회 ====================
export async function getMe(): Promise<ResponseMeDTO> {
  try {
    const res = await instance.get('/auth/me');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '마이페이지 조회 실패');
    }
    throw new Error('네트워크 오류');
  }
}

//- ====================  프로필 수정 ====================
export async function updateProfile(
  data: RequestProfileUpdateDTO
): Promise<ResponseProfileUpdateDTO> {
  try {
    const res = await instance.patch('/auth/profile', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '프로필 수정 실패');
    }
    throw new Error('네트워크 오류');
  }
}
//- ====================  비밀번호 수정 ====================
export async function updatePassword(
  data: RequestPasswordChangeDTO
): Promise<ResponsePasswordChangeDTO> {
  try {
    const res = await instance.patch('/auth/password', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '비밀번호 수정 실패');
    }
    throw new Error('네트워크 오류');
  }
}

//- ==================== 소셜 로그인 ====================
export async function socialLogin(
  provider: SocialProvider,
  data: RequestSocialLoginDTO
): Promise<ResponseSocialLoginDTO> {
  try {
    console.log('📤 소셜 로그인 요청:', provider, data);
    const res = await instance.post(`/social/${provider}/login`, data);
    console.log('✅ 소셜 로그인 응답:', res.data);
    return res.data;
  } catch (error) {
    console.log('❌ 전체 에러:', error);
    console.log('❌ 에러 타입:', typeof error); // 추가
    console.log('❌ isAxiosError:', axios.isAxiosError(error)); // 추가

    if (axios.isAxiosError(error) && error.response) {
      console.log('❌ Axios 에러 - 응답 데이터:', error.response.data);
      const apiError = error.response.data;
      throw new Error(apiError.error?.message || '소셜 로그인 실패');
    }

    // 👇 일반 에러 객체인 경우 추가 처리
    console.log('❌ 일반 에러 객체:', JSON.stringify(error, null, 2));
    throw new Error('네트워크 오류');
  }
}
