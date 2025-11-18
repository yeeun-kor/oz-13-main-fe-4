const API_BASE_URL = 'http://localhost:5173/api';

interface OutfitRecommendation {
  rec_1: string;
  rec_2: string;
  rec_3: string;
  explanation: string;
}

export const outfitAPI = {
  // 위치 기반 의상 추천
  getRecommendationByCoords: async (lat: number, lon: number): Promise<OutfitRecommendation> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommend/outfit?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('의상 추천을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('getRecommendation error:', error);
      throw error;
    }
  },
  getRecommendationByLocation: async (location: string): Promise<OutfitRecommendation> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommend/outfit?location=${location}`);
      if (!response.ok) throw new Error('의상 추천을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('getRecommendation error:', error);
      throw error;
    }
  },
};
