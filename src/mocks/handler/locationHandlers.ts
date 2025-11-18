// mocks/handlers/locationHandlers.ts
import { http, HttpResponse } from 'msw';
import { CreateFavoriteRequest, FavoriteLocation } from '../../features/location/types/location';
import { mockFavoriteLocations } from '../data/user';

let favoriteIdCounter = 4; // 기존 mock 데이터의 마지막 id + 1

export const locationHandlers = [
  // 즐겨찾기 목록 조회
  http.get('/api/locations/favorites', ({ cookies }) => {
    const userId = Number(cookies.user_id) || 1; // 실제로는 JWT에서 추출
    const favorites = mockFavoriteLocations[userId] || [];
    return HttpResponse.json(favorites);
  }),

  // 즐겨찾기 추가
  http.post<never, CreateFavoriteRequest>(
    '/api/locations/favorites',
    async ({ request, cookies }) => {
      const userId = Number(cookies.user_id) || 1;
      const body = await request.json();

      const newFavorite: FavoriteLocation = {
        id: favoriteIdCounter++,
        city: body.city,
        district: body.district,
        alias: body.alias || '',
        order: mockFavoriteLocations[userId]?.length || 0,
      };

      if (!mockFavoriteLocations[userId]) {
        mockFavoriteLocations[userId] = [];
      }
      mockFavoriteLocations[userId].push(newFavorite);

      return HttpResponse.json(newFavorite, { status: 201 });
    }
  ),

  // 즐겨찾기 삭제
  http.delete('/api/locations/favorites/:id', ({ params, cookies }) => {
    const userId = Number(cookies.user_id) || 1;
    const id = Number(params.id);

    if (mockFavoriteLocations[userId]) {
      mockFavoriteLocations[userId] = mockFavoriteLocations[userId].filter((fav) => fav.id !== id);
    }

    return HttpResponse.json({ message: 'Deleted successfully' });
  }),

  // 별칭 변경
  http.patch<{ id: string }, { alias: string }>(
    '/api/locations/favorites/:id',
    async ({ params, request, cookies }) => {
      const userId = Number(cookies.user_id) || 1;
      const id = Number(params.id);
      const { alias } = await request.json();

      const favorite = mockFavoriteLocations[userId]?.find((fav) => fav.id === id);
      if (favorite) {
        favorite.alias = alias;
        return HttpResponse.json(favorite);
      }

      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
  ),
];
