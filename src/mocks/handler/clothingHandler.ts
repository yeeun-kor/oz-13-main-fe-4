import { http, HttpResponse } from 'msw';
import { mockCurrentWeather } from '../data/weather';
import { getOutfitRecommendation } from '../data/clothing';

export const outfitHandlers = [
  // 의상 추천 API
  http.get('/api/recommend/outfit', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const location = url.searchParams.get('location');

    // if (!lat || !lon) {
    //   return HttpResponse.json({ error: '위치 정보가 필요합니다' }, { status: 400 });
    // }

    const temperature = mockCurrentWeather.temperature;
    const condition = mockCurrentWeather.condition;

    // 의상 추천 생성
    const recommendation = getOutfitRecommendation(temperature, condition);

    return HttpResponse.json(recommendation);
  }),

  // 특정 온도/날씨 조건으로 추천 받기 (테스트용)
  http.post('/api/recommend/outfit', async ({ request }) => {
    const body = (await request.json()) as { temperature: number; condition?: string };

    if (typeof body.temperature !== 'number') {
      return HttpResponse.json({ error: '온도 정보가 필요합니다' }, { status: 400 });
    }

    const recommendation = getOutfitRecommendation(body.temperature, body.condition || 'Clear');

    return HttpResponse.json(recommendation);
  }),
];
