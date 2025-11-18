export const locationDB = [
  {
    location_id: 1,
    city: 'Seoul',
    district: 'Gangnam-gu',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    location_id: 2,
    city: 'Busan',
    district: 'Haeundae-gu',
    latitude: 35.1796,
    longitude: 129.0756,
  },
  {
    location_id: 3,
    city: 'Jeju',
    district: 'Jeju-si',
    latitude: 33.4996,
    longitude: 126.5312,
  },
];

export const favoritesDB = [
  {
    favorite_id: 12,
    location_id: 1,
    city: 'Seoul',
    district: 'Gangnam-gu',
    latitude: 37.5665,
    longitude: 126.978,
    alias: '본가',
    is_default: true,
  },
  {
    favorite_id: 13,
    location_id: 2,
    city: 'Busan',
    district: 'Haeundae-gu',
    latitude: 35.1796,
    longitude: 129.0756,
    alias: '회사',
    is_default: false,
  },
];
/**

{"error":"토큰 필요"}	auth_required
{"error":"중복 등록"}	favorite_duplicate
{"error":"잘못된 요청"}	invalid_update
{"error":"존재하지 않음"}	not_found
 */
export const locationError = {
  authRequred: { error: '토큰 필요' },
  favoriteDuplicate: { error: '중복 등록' },
  invalidUpate: { error: '잘못된 요청' },
  notFound: { error: '존재하지 않음' },
};
