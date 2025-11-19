import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const diaryInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

//로그인시 유효성 검사 메세지는 숨겨
//패스워드 확인도 같이 보내나ㅏ?
