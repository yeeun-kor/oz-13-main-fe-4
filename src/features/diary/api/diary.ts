import axios from 'axios';
import { DiaryData } from '../types/types';
import { diaryInstance } from '../../../axios/instance';

export const postDiaryApi = async (diary: DiaryData, image: File | null) => {
  const formData = new FormData();

  formData.append('date', diary.date);
  formData.append('title', diary.title);
  formData.append('emotion', diary.emotion);
  formData.append('notes', diary.notes);

  if (image) {
    formData.append('image_url', image);
  }

  const { data } = await diaryInstance.post('/diary', formData);
  return data;
};

export const getDiariesForCalendar = async (year: number, month: number): Promise<DiaryData[]> => {
  console.log('getDiariesForCalendar 실행됨', year, month);

  // JavaScript Date는 month를 0~11로 사용하지만, 서버는 1~12를 받음
  const { data } = await diaryInstance.get<DiaryData[]>('/diary', {
    params: { year, month: month + 1 },
  });

  console.log('서버 응답 데이터 : ', data);
  return data;
};

export const getDiaryForDetail = async (id: number) => {
  const { data } = await diaryInstance.get<DiaryData>(`/diary/${id}`);
  return data;
};

export const patchDiaryApi = async (diary: DiaryData, id: number, image: File | null) => {
  const formData = new FormData();
  formData.append('title', diary.title);
  formData.append('notes', diary.notes);
  formData.append('emotion', diary.emotion);

  if (image) {
    formData.append('image_url', image);
  }

  const { data } = await diaryInstance.patch<DiaryData>(`/diary/${id}`, formData);
  return data;
};

export const deleteDiaryApi = async (id: number) => {
  const response = await diaryInstance.delete(`/diary/${id}`);

  if (response.status === 204) {
    return id;
  }

  return response.data;
};
