import { getActivityRecommendation } from '../../utils/activityRecommendation';
import { USE_MOCK } from './apiConfig';

interface WeatherContext {
  temperature: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
}

interface ClaudeAPIResponse {
  success: boolean;
  recommendation: string;
  metadata?: {
    temperature: number;
    condition: string;
    location: string;
  };
}

interface ClaudeAPIError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

interface CachedRecommendation {
  recommendation: string;
  timestamp: number;
}

function getCacheKey(weather: WeatherContext): string {
  const roundedTemp = Math.round(weather.temperature / 5) * 5;
  return `ai-rec-${weather.location}-${weather.condition}-${roundedTemp}`;
}

// 캐시 만료 시간 (30분)
const CACHE_DURATION = 30 * 60 * 1000;

// 캐시에서 가져오기
function getFromCache(key: string): string | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const data: CachedRecommendation = JSON.parse(cached);
    const now = Date.now();

    // 캐시가 만료되었는지 확인
    if (now - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    console.log('💾 캐시에서 추천 로드:', key);
    return data.recommendation;
  } catch (error) {
    console.error('캐시 읽기 오류:', error);
    return null;
  }
}

// 캐시에 저장하기
function saveToCache(key: string, recommendation: string): void {
  try {
    const data: CachedRecommendation = {
      recommendation,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    console.log('💾 캐시에 저장:', key);
  } catch (error) {
    console.error('캐시 저장 오류:', error);
  }
}

/**
 * AI 기반 활동 추천 가져오기
 * - dev 모드: 룰 기반 추천 사용
 * - prod 모드: Vercel Function → Claude API 호출
 * - 캐싱: 동일한 조건에 대해 30분간 캐시 사용
 */
export const getAIRecommendation = async (weather: WeatherContext): Promise<string> => {
  // 캐시 키 생성
  const cacheKey = getCacheKey(weather);

  const cachedRecommendation = getFromCache(cacheKey);
  if (cachedRecommendation) {
    return cachedRecommendation;
  }

  if (USE_MOCK) {
    // 실제 API 호출처럼 딜레이 추가 (UX 테스트용)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const recommendation = getActivityRecommendation(weather);

    saveToCache(cacheKey, recommendation);
    return recommendation;
  }

  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams({
      temperature: weather.temperature.toString(),
      condition: weather.condition,
      location: weather.location,
    });

    // 선택적 파라미터 추가
    if (weather.humidity !== undefined) {
      params.append('humidity', weather.humidity.toString());
    }
    if (weather.windSpeed !== undefined) {
      params.append('windSpeed', weather.windSpeed.toString());
    }

    // Vercel Function 호출
    const response = await fetch(`/api/claude-recommendation?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 응답 파싱
    const data: ClaudeAPIResponse | ClaudeAPIError = await response.json();

    // 에러 응답 처리
    if (!response.ok || !data.success) {
      const errorData = data as ClaudeAPIError;
      console.error('❌ Claude API 에러:', errorData.error);
      throw new Error(errorData.error?.message || 'API 호출 실패');
    }

    // 성공 응답
    const successData = data as ClaudeAPIResponse;
    console.log('✅ Claude API 성공:', successData.recommendation);

    // 캐시 저장
    saveToCache(cacheKey, successData.recommendation);

    return successData.recommendation;
  } catch (error) {
    console.error('❌ Claude API 호출 실패:', error);

    // dev: 룰 기반 추천
    console.log(' dev: 룰 기반 추천으로 전환');
    const recommendation = getActivityRecommendation(weather);

    // 캐시 저장
    saveToCache(cacheKey, recommendation);

    return recommendation;
  }
};

/**
 * 캐시 초기화
 */
export const clearRecommendationCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter((key) => key.startsWith('ai-rec-'));
    cacheKeys.forEach((key) => localStorage.removeItem(key));
    console.log(`🗑️ ${cacheKeys.length}개의 캐시 삭제 완료`);
  } catch (error) {
    console.error('캐시 초기화 오류:', error);
  }
};
