export interface GeolocationPosition {
  lat: number;
  lon: number;
}
/**
 * 현재 위치 조회 서비스
 * @returns Promise<GeolocationPosition>
 *
 * @example 사용예시 :
 *  const [location, setLocation] = useState<GeolocationPosition | null>(null);
 *  const position = await getCurrentPosition();
 *  setLocation(position);
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치서비스를 지원하지 않는 환경입니다.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error('위치 권한이 거부되었습니다.'));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error('위치 정보를 사용할 수 없습니다.'));
            break;
          case err.TIMEOUT:
            reject(new Error('요청 시간 초과되었습니다.'));
            break;
          default:
            reject(new Error('알 수 없는 오류가 발생했습니다.'));
        }
      }
    );
  });
};
