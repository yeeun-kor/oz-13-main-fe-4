// src/mocks/data/users.ts

import { User } from '../../features/auth/types/auth';
import { FavoriteLocation } from '../../features/location/types/location';

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    name: '홍길동',
    nickname: '동번서번',
    gender: 'M',
    age: 'twenty',
    is_verified: true,
    created_at: '2025-01-15T10:30:00Z',
  },
  {
    id: 2,
    email: 'newuser@example.com',
    name: '김신입',
    nickname: '신입유저',
    gender: 'F',
    age: 'twenty',
    is_verified: true,
    created_at: '2025-01-18T14:20:00Z',
  },
];
// 즐겨찾기 목록 (userId별로 관리)
export const mockFavoriteLocations: Record<number, FavoriteLocation[]> = {
  1: [
    {
      id: 1,
      city: '서울',
      district: '강남구',
      alias: '회사',
      order: 0,
    },
    {
      id: 2,
      city: '경북',
      district: '경산시',
      alias: '본가',
      order: 1,
    },
    {
      id: 3,
      city: '경기',
      district: '수원시',
      alias: 'KT위즈파크',
      order: 2,
    },
  ],
  2: [], // 신규 유저는 즐겨찾기 없음
};
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
