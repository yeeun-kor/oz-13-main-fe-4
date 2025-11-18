// src/mocks/data/users.ts

import { User } from '../../features/auth/types/auth';

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    name: '홍길동',
    nickname: '동번서번',
    gender: 'M',
    age: 'twenty',
    is_verified: true,
    favorite_regions: ['서울시 강남구', '대전광역시 중구', '수원시 장안구'],
    created_at: '2025-01-15T10:30:00Z',
  },
];

// 비밀번호는 별도 관리 (실제론 해시값)
export const mockPasswords = new Map([['test@example.com', 'test123']]);

// 이메일 인증 코드 저장 (이메일 -> 코드)
export const emailVerificationCodes = new Map<string, string>();

// 닉네임 중복 체크용
export const usedNicknames = new Set(['동번서번']);

// 이메일 인증 완료 여부
export const verifiedEmails = new Set(['test@example.com']);

//리프레쉬 토큰 저장(메모리)
export const refreshTokenStore = new Map<string, string>();
