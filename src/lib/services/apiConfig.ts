export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

if (isDevelopment) {
  console.log('apiConfig ::', {
    USE_MOCK,
    API_BASE_URL,
    HAS_CLAUDE_KEY: !!CLAUDE_API_KEY,
  });
}
