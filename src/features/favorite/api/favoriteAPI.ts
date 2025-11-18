import { instance } from '../../../axios/instance';

export interface FavoriteLocation {
  id: number;
  city: string;
  district: string;
  alias: string;
  order: number;
}

export interface AddFavoriteRequest {
  city: string;
  district: string;
  alias?: string;
}

export interface UpdateAliasRequest {
  alias: string;
}

export interface ReorderRequest {
  id: number;
  order: number;
}

// 즐겨찾기 목록 조회
export const getFavorites = async (): Promise<FavoriteLocation[]> => {
  const response = await instance.get<FavoriteLocation[]>('/locations/favorites');
  return response.data;
};

// 즐겨찾기 추가
export const addFavorite = async (
  data: AddFavoriteRequest
): Promise<{ message: string; id: number }> => {
  const response = await instance.post<{ message: string; id: number }>(
    '/locations/favorites',
    data
  );
  return response.data;
};

// 즐겨찾기 삭제
export const deleteFavorite = async (id: number): Promise<void> => {
  await instance.delete(`/locations/favorites/${id}`);
};

// 즐겨찾기 별칭 수정
export const updateFavoriteAlias = async (
  id: number,
  data: UpdateAliasRequest
): Promise<{ message: string }> => {
  const response = await instance.patch<{ message: string }>(`/locations/favorites/${id}`, data);
  return response.data;
};

// 즐겨찾기 순서 변경
export const reorderFavorites = async (items: ReorderRequest[]): Promise<{ message: string }> => {
  const response = await instance.patch<{ message: string }>('/locations/favorites/reorder', items);
  return response.data;
};
