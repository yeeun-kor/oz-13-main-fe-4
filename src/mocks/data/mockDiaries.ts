export interface DiaryData {
  id: number;
  date: string;
  title: string;
  emotion: 'happy' | 'sad' | 'angry' | 'excited';
  notes: string;
  image_url: string | null;
  weather: {
    condition: string;
    temperature: number;
    icon: number;
  };
}
export interface DairyCalendar {
  id: number;
  date: string;
  title: string;
}

export const mockDiaries: DiaryData[] = [
  {
    id: 14,
    date: '2025-11-07',
    title: '친구와 서울 여행',
    emotion: 'happy',
    notes: '날씨도 좋고 사진도 잘 나왔다!',
    image_url: 'https://s3.amazonaws.com/diary/ootd_123.jpg',
    weather: { condition: 'Cloudy', temperature: 18, icon: 1 },
  },
];

export const mockDiariesforCalendar: DairyCalendar[] = mockDiaries.map((d) => ({
  id: d.id,
  date: d.date,
  title: d.title,
}));
