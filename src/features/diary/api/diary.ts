import { DiaryData } from '../types/types';
import { diaryInstance } from '../../../axios/instance';

export const postDiaryApi = async (
  diary: DiaryData,
  image: File | null,
  lat?: number,
  lon?: number
) => {
  const formData = new FormData();

  formData.append('date', diary.date);
  formData.append('title', diary.title);
  formData.append('emotion', diary.emotion);
  formData.append('notes', diary.notes);
  formData.append('lat', (lat ?? 0).toString());
  formData.append('lon', (lon ?? 0).toString());

  if (image) {
    formData.append('image', image);
  }

  const { data } = await diaryInstance.post('/diaries/', formData);
  console.log('✅ POST 응답:', data);
  return data;
};

export const getDiariesForCalendar = async (year: number, month: number): Promise<DiaryData[]> => {
  console.log('getDiariesForCalendar 실행됨', year, month);

  // JavaScript Date는 month를 0~11로 사용하지만, 서버는 1~12를 받음
  const { data } = await diaryInstance.get<DiaryData[]>('/diaries/', {
    params: { year, month: month + 1 },
  });

  console.log('서버 응답 데이터 : ', data);
  return data;
};

export const getDiaryForDetail = async (id: number) => {
  const { data } = await diaryInstance.get<DiaryData>(`/diaries/${id}/`);
  return data;
};

export const patchDiaryApi = async (diary: DiaryData, id: number, image: File | null) => {
  const formData = new FormData();
  formData.append('title', diary.title);
  formData.append('notes', diary.notes);
  formData.append('emotion', diary.emotion);

  if (image) {
    formData.append('image', image);
  }

  const { data } = await diaryInstance.patch<DiaryData>(`/diaries/${id}/`, formData);
  return data;
};

export const deleteDiaryApi = async (id: number) => {
  const response = await diaryInstance.delete(`/diaries/${id}/`);

  if (response.status === 204) {
    return id;
  }

  return response.data;
};
