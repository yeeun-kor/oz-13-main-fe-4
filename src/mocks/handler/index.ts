import { http, HttpResponse } from 'msw';
import { favoritesDB, locationDB, locationError } from '../data/location';
import {
  mockCurrentWeather,
  mockForecastData,
  mockHistoryData,
  mockWeatherByLocation,
  weatherErrors,
} from '../data/weather';

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: 1,
      name: 'John Doe',
    });
  }),

  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      body: body,
      token: 'mock-token',
    });
  }),
];
/**
 * location API 핸들러
 *    위치 검색 (자동 탐색)
      시·구 직접 선택 
      즐겨찾기 CRUD
 */
export const locationHandlers = [
  // 시·구 직접 선택 (즐겨찾기용)
  http.post('/api/location/select', async ({ request }) => {
    const body = await request.json();
    const { city, district } = body as { city?: string; district?: string };

    if (!city || !district) {
      return HttpResponse.json(locationError.authRequred, { status: 400 });
    }

    const location = locationDB.find((loc) => loc.city === city && loc.district === district);

    if (!location) {
      return HttpResponse.json(locationError.invalidUpate, { status: 400 });
    }

    return HttpResponse.json(
      {
        location_id: location.location_id,
        city: location.city,
        district: location.district,
      },
      { status: 200 }
    );
  }),
];
export const weatherHandlers = [
  // 현재 날씨 조회 (지역 기반)
  http.get('/api/weather/current', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const district = url.searchParams.get('district');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    // 좌표 기반 조회
    if (lat && lon) {
      if (!lat || !lon) {
        return HttpResponse.json(weatherErrors.locationFailed, { status: 400 });
      }

      return HttpResponse.json(mockCurrentWeather);
    }

    // 지역 기반 조회
    if (city && district) {
      const locationKey = `${city}-${district}`;
      const weatherData = mockWeatherByLocation[locationKey] || mockCurrentWeather;

      return HttpResponse.json(weatherData);
    }

    // 에러 케이스 (city 또는 district 없음)
    return HttpResponse.json(weatherErrors.apiCallFailed, { status: 404 });
  }),

  // 단기 예보 조회
  http.get('/api/weather/forecast', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (!lat || !lon) {
      return HttpResponse.json(weatherErrors.invalidParams, { status: 400 });
    }

    return HttpResponse.json(mockForecastData);
  }),

  // 과거/일별 요약 조회
  http.get('/api/weather/history/:location_id', ({ request, params }) => {
    const { location_id } = params;
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    // location_id가 없고 좌표도 없는 경우
    if (!location_id && (!lat || !lon)) {
      return HttpResponse.json(weatherErrors.locationNotFound, { status: 404 });
    }

    return HttpResponse.json(mockHistoryData);
  }),
];
