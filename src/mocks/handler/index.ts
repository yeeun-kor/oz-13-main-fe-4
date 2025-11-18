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

  // 즐겨찾기 추가
  http.post('/api/location/favorite', async ({ request }) => {
    const body = await request.json();
    const { location_id, alias, is_default } = body as {
      location_id?: number;
      alias?: string;
      is_default?: boolean;
    };
    console.log(
      `Adding favorite with location_id=${location_id}, alias=${alias}, is_default=${is_default}`
    );
    // 이미 즐겨찾기에 등록된 지역인지 확인
    const exists = favoritesDB.find((fav) => fav.location_id === location_id);
    if (exists) {
      return HttpResponse.json(locationError.favoriteDuplicate, { status: 409 });
    }

    const location = locationDB.find((loc) => loc.location_id === location_id);
    if (!location) {
      return HttpResponse.json(locationError.invalidUpate, { status: 400 });
    }
    let nextFavoriteId = favoritesDB.length;

    return HttpResponse.json(
      {
        message: '즐겨찾기에 추가되었습니다.',
        favorite_id: nextFavoriteId++,
      },
      { status: 200 }
    );
  }),

  // 즐겨찾기 목록 조회
  http.get('/api/location/favorite', () => {
    return HttpResponse.json(favoritesDB, { status: 200 });
  }),

  // 즐겨찾기 삭제
  http.delete('/api/location/favorite/:favorite_id', ({ params }) => {
    const favoriteId = parseInt(params.favorite_id as string);

    const favorite = favoritesDB.find((fav) => fav.favorite_id === favoriteId);

    if (!favorite) {
      return HttpResponse.json(locationError.notFound, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // 즐겨찾기 수정
  http.patch('/api/location/favorite/:favorite_id', async ({ request, params }) => {
    const favoriteId = parseInt(params.favorite_id as string);
    const body = await request.json();
    const { alias, is_default } = body as {
      alias?: string;
      is_default?: boolean;
    };
    console.log(`Updating favorite ${favoriteId} with alias=${alias}, is_default=${is_default}`);

    const favorite = favoritesDB.find((fav) => fav.favorite_id === favoriteId);

    if (!favorite) {
      return HttpResponse.json(locationError.notFound, { status: 404 });
    }

    return HttpResponse.json(
      {
        message: '즐겨찾기 정보가 수정되었습니다.',
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
