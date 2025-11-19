import { instance } from '../../../axios/instance';

export interface OutfitRecommendation {
  rec_1: string;
  rec_2: string;
  rec_3: string;
  explanation: string;
}

export const outfitAPI = {
  // 좌표 기반 의상 추천 (현재 날씨용)
  getRecommendationByCoords: async (lat: number, lon: number) => {
    const response = await instance.post<OutfitRecommendation>(`/recommend/coords/`, {
      latitude: lat,
      longitude: lon,
    });
    return response.data;
  },

  // 주소 기반 의상 추천 (즐겨찾기 지역용)
  getRecommendationByLocation: async (city: string, district: string) => {
    const response = await instance.post<OutfitRecommendation>(`/recommend/location/`, {
      city,
      district,
    });
    return response.data;
  },
};
