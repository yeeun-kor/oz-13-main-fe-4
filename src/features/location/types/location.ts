// types/location.ts
export interface FavoriteLocation {
  id: number;
  city: string;
  district: string;
  alias?: string;
  order: number;
}

export interface CreateFavoriteRequest {
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
