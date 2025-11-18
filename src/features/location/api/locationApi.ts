// api/locationApi.ts

import { instance } from '../../../axios/instance';
import {
  CreateFavoriteRequest,
  FavoriteLocation,
  ReorderRequest,
  UpdateAliasRequest,
} from '../types/location';

export const locationApi = {
  // 즐겨찾기 추가
  addFavorite: (data: CreateFavoriteRequest) =>
    instance.post<FavoriteLocation>('/locations/favorites/', data),

  // 즐겨찾기 목록 조회
  getFavorites: () => instance.get<FavoriteLocation[]>('/locations/favorites/'),

  // 즐겨찾기 삭제
  deleteFavorite: (id: number) => instance.delete(`/locations/favorites/${id}/`),

  // 별칭 변경
  updateAlias: (id: number, data: UpdateAliasRequest) =>
    instance.patch<FavoriteLocation>(`/locations/favorites/${id}/`, data),

  // 순서 변경
  reorderFavorites: (data: ReorderRequest[]) =>
    instance.patch<FavoriteLocation[]>('/locations/favorites/reorder/', data),
};
