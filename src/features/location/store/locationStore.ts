import { create } from 'zustand';

interface LocationState {
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  setLocation: (locationName: string) => void;
  setCoordinates: (latitude: number, longitude: number) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  latitude: null,
  longitude: null,
  setLocation: (locationName: string) => set({ location: locationName }),
  setCoordinates: (latitude: number, longitude: number) => set({ latitude, longitude }),
  clearLocation: () => set({ location: null, latitude: null, longitude: null }),
}));
