import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteDiaryApi,
  getDiariesForCalendar,
  getDiaryForDetail,
  patchDiaryApi,
  postDiaryApi,
} from '../api/diary';
import { DiaryData } from '../types/types';

// 일기 생성
export const useCreateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      diary,
      image,
      lat,
      lon,
    }: {
      diary: DiaryData;
      image: File | null;
      lat?: number;
      lon?: number;
    }) => postDiaryApi(diary, image, lat, lon),
    onSuccess: (response) => {
      console.log('일기 작성 성공 : ', response);

      // 서버 응답을 그대로 사용 (weather 정보 포함)
      queryClient.setQueriesData<DiaryData[]>({ queryKey: ['diary', 'calendar'] }, (oldData) => {
        if (!oldData) return oldData;

        // 서버에서 받은 전체 응답을 사용
        return [...oldData, response];
      });

      // 전체 재조회 (서버에서 정확한 데이터 가져옴)
      queryClient.invalidateQueries({ queryKey: ['diary'], exact: false });
    },
    onError: (error: Error) => {
      console.log('일기 작성 실패 : ', error.message);
    },
  });
};

// 캘린더용 일기 조회
export const useDiariesForCalendar = (year: number, month: number) => {
  const { data, isLoading, error } = useQuery<DiaryData[], Error>({
    queryKey: ['diary', 'calendar', year, month],
    queryFn: () => getDiariesForCalendar(year, month),
    enabled: year !== undefined && month !== undefined,
  });
  console.log('fetching diaries for:', year, month);
  return { data, isLoading, error };
};

// 일기 상세 조회
export const useDiaryDetail = (id?: number) => {
  return useQuery<DiaryData, Error>({
    queryKey: ['diary', 'detail', id],
    queryFn: () => getDiaryForDetail(id!),
    enabled: id !== undefined,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

// 일기 수정
export const useEditDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, diary, image }: { id: number; diary: DiaryData; image: File | null }) =>
      patchDiaryApi(diary, id, image),
    onSuccess: (updatedDiary: DiaryData) => {
      console.log('일기 수정 성공:', updatedDiary);

      // 모든 calendar 캐시 무효화 (year, month와 상관없이 모든 캘린더 새로고침)
      queryClient.invalidateQueries({ queryKey: ['diary', 'calendar'] });

      // detail 캐시도 업데이트
      queryClient.setQueryData(['diary', 'detail', updatedDiary.id], updatedDiary);
    },
    onError: (error: Error) => {
      console.log('일기 수정 실패 : ', error.message);
    },
  });
};

// 일기 삭제
export const useDeleteDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDiaryApi(id),
    onSuccess: (id) => {
      console.log('일기 삭제 성공 : ', id);

      // calendar 데이터에서 삭제된 일기 제거
      queryClient.setQueriesData<DiaryData[]>({ queryKey: ['diary', 'calendar'] }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((diary) => diary.id !== id);
      });

      // detail 캐시 제거
      queryClient.removeQueries({ queryKey: ['diary', 'detail', id] });
    },
    onError: (error: Error) => {
      console.log('일기 삭제 실패 : ', error.message);
    },
  });
};
