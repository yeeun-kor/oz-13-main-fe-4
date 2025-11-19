export interface DiaryCalendarProps {
  startingDate: Date;
}

export interface DiaryData {
  id?: number; // 서버에서 생성되므로 optional
  date: string;
  title: string;
  emotion: Emotion;
  notes: string;
  weather?: {
    id: number;
    base_time: string;
    valid_time: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    rain_probability: number;
    rain_volume: number;
    wind_speed: number;
    condition: string;
    icon: string;
  };
  icon?: string;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryDataReq {
  date: string;
  title: string;
  emotion: string;
  notes: string;
  lon: string;
  lat: string;
  image: File | null;
}

export interface DiaryModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedDiary: DiaryData | undefined;
  mode: Modal;
  onClose: () => void;
  onSave?: (diary: DiaryData, image: File | null) => void;
  onModalChange: () => void;
}

export interface DiaryModalFieldsProps {
  preview: string | null;
  diary: DiaryData;
  errors?: DiaryError;
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmotion: (index: number) => void;
  handleNotes: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export interface DiaryError {
  title?: string;
  notes?: string;
}

export type Modal = 'create' | 'edit' | 'view';

export type Emotion = 'happy' | 'sad' | 'angry' | 'excited';
