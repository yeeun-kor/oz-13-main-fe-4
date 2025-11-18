import { http, HttpResponse } from 'msw';

const STORAGE_KEY = 'msw_favorites';
const MAX_FAVORITES = 3;

interface FavoriteLocation {
  id: number;
  city: string;
  district: string;
  alias: string;
  order: number;
}

// localStorage에서 즐겨찾기 가져오기
const getFavoritesFromStorage = (): FavoriteLocation[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// localStorage에 즐겨찾기 저장
const saveFavoritesToStorage = (favorites: FavoriteLocation[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

// 다음 ID 생성
const getNextId = (): number => {
  const favorites = getFavoritesFromStorage();
  if (favorites.length === 0) return 1;
  return Math.max(...favorites.map((f) => f.id)) + 1;
};

export const favoriteHandlers = [
  // 즐겨찾기 목록 조회
  http.get('/api/locations/favorites', () => {
    const favorites = getFavoritesFromStorage();
    // order 순으로 정렬
    const sorted = favorites.sort((a, b) => a.order - b.order);

    console.log('📍 [MSW] GET /api/locations/favorites:', sorted);
    return HttpResponse.json(sorted);
  }),

  // 즐겨찾기 추가
  http.post('/api/locations/favorites', async ({ request }) => {
    const body = (await request.json()) as {
      city: string;
      district: string;
      alias: string;
    };

    const favorites = getFavoritesFromStorage();

    // 최대 개수 체크
    if (favorites.length >= MAX_FAVORITES) {
      console.log('❌ [MSW] 즐겨찾기 최대 개수 초과');
      return HttpResponse.json(
        {
          error: 'limit_exceeded',
          message: '즐겨찾기는 최대 3개까지 등록 가능합니다.',
        },
        { status: 400 }
      );
    }

    // 중복 체크 (같은 city + district)
    const isDuplicate = favorites.some((f) => f.city === body.city && f.district === body.district);

    if (isDuplicate) {
      console.log('❌ [MSW] 중복된 지역:', body.city, body.district);
      return HttpResponse.json(
        {
          error: 'already_exists',
          message: '이미 즐겨찾기에 등록된 지역입니다.',
        },
        { status: 400 }
      );
    }

    // 새 즐겨찾기 생성
    const newFavorite: FavoriteLocation = {
      id: getNextId(),
      city: body.city,
      district: body.district,
      alias: body.alias,
      order: favorites.length, // 마지막 순서
    };

    favorites.push(newFavorite);
    saveFavoritesToStorage(favorites);

    console.log('✅ [MSW] POST /api/locations/favorites:', newFavorite);
    return HttpResponse.json({
      message: '즐겨찾기에 추가되었습니다.',
      id: newFavorite.id,
    });
  }),

  // 즐겨찾기 삭제
  http.delete('/api/locations/favorites/:id', ({ params }) => {
    const id = Number(params.id);
    const favorites = getFavoritesFromStorage();

    const index = favorites.findIndex((f) => f.id === id);

    if (index === -1) {
      console.log('❌ [MSW] 존재하지 않는 즐겨찾기:', id);
      return HttpResponse.json(
        {
          error: 'not_found',
          message: '존재하지 않는 즐겨찾기입니다.',
        },
        { status: 404 }
      );
    }

    // 삭제
    favorites.splice(index, 1);

    // order 재정렬
    favorites.forEach((f, idx) => {
      f.order = idx;
    });

    saveFavoritesToStorage(favorites);

    console.log('🗑️ [MSW] DELETE /api/locations/favorites/' + id);
    return new HttpResponse(null, { status: 204 });
  }),

  // 별칭 수정
  http.patch('/api/locations/favorites/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { alias?: string; order?: number };

    const favorites = getFavoritesFromStorage();
    const favorite = favorites.find((f) => f.id === id);

    if (!favorite) {
      console.log('❌ [MSW] 존재하지 않는 즐겨찾기:', id);
      return HttpResponse.json(
        {
          error: 'not_found',
          message: '존재하지 않는 즐겨찾기입니다.',
        },
        { status: 404 }
      );
    }

    // order 변경 시도 체크 (이 엔드포인트에서는 불가)
    if (body.order !== undefined) {
      console.log('❌ [MSW] order 변경은 /reorder에서만 가능');
      return HttpResponse.json(
        {
          error: 'order_not_allowed_here',
          message: 'order 변경은 /reorder 엔드포인트를 사용해야 합니다.',
        },
        { status: 400 }
      );
    }

    // 별칭 수정
    if (body.alias !== undefined) {
      favorite.alias = body.alias;
      saveFavoritesToStorage(favorites);
      console.log('✏️ [MSW] PATCH /api/locations/favorites/' + id, body);
    }

    return HttpResponse.json({
      message: '즐겨찾기 정보가 수정되었습니다.',
    });
  }),

  // 순서 변경
  http.patch('/api/locations/favorites/reorder', async ({ request }) => {
    const body = (await request.json()) as Array<{ id: number; order: number }>;

    const favorites = getFavoritesFromStorage();

    // 모든 ID가 유효한지 체크
    const validIds = new Set(favorites.map((f) => f.id));
    const invalidId = body.find((item) => !validIds.has(item.id));

    if (invalidId) {
      console.log('❌ [MSW] 잘못된 즐겨찾기 ID:', invalidId.id);
      return HttpResponse.json(
        {
          error: 'invalid_favorite_id',
          message: '잘못된 즐겨찾기 ID가 포함되어 있습니다.',
        },
        { status: 400 }
      );
    }

    // 순서 업데이트
    body.forEach((item) => {
      const favorite = favorites.find((f) => f.id === item.id);
      if (favorite) {
        favorite.order = item.order;
      }
    });

    // order 순으로 정렬
    favorites.sort((a, b) => a.order - b.order);
    saveFavoritesToStorage(favorites);

    console.log('🔄 [MSW] PATCH /api/locations/favorites/reorder:', body);
    return HttpResponse.json({
      message: '즐겨찾기 순서가 변경되었습니다.',
    });
  }),
];
