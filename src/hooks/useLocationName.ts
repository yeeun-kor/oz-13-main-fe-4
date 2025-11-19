import { useCallback, useState } from 'react';
import { getCurrentPosition } from '../utils/geolocation';
import { locationApi } from '../features/location/api/locationApi';
import { useLocationStore } from '../features/location/store/locationStore';

export const useLocationName = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLocation, setCoordinates } = useLocationStore();

  const fetchLocationName = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const { lat, lon } = position;

      setCoordinates(lat, lon);

      const { locationName } = await locationApi.getCurrentLocation(lat, lon);
      setLocation(locationName);

      return {
        lat,
        lon,
        locationName,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위치를 가져올 수 없습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLocation, setCoordinates]);

  return { loading, error, fetchLocationName };
};
