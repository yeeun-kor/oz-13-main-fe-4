import BaseModal from '../../../components/Modal/BaseModal';
import * as styles from './DiaryModal.styles';
import { DiaryData, DiaryError, DiaryModalProps, Emotion } from '../types/types';
import DiaryModalHeader from './DiaryModalHeader';
import DiaryModalActions from './DiaryModalActions';
import DiaryModalFields from './DiaryModalFields';
import DeleteConfirmModal from '../../../components/Modal/DeleteConfirmModal';
import { useEffect, useState } from 'react';
import { getISODate } from '../utils/calendar';
import { EMOTIONS } from '../constants/emotions';
import { useCreateDiary, useDeleteDiary, useEditDiary } from '../hooks/useDiaryQueries';

const DiaryModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  mode,
  selectedDiary,
  onModalChange,
}: DiaryModalProps) => {
  const [diary, setDiary] = useState<DiaryData>({
    // id는 서버에서 생성하므로 초기값 없음
    date: getISODate(selectedDate), // ISO 형식으로 DB에 저장
    title: '',
    emotion: 'happy',
    notes: '',
    weather: {
      condition: 'cloudy',
      temperature: 18,
      icon: 0,
    },
    image_url: null,
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<DiaryError>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const createDiary = useCreateDiary();
  const editDiary = useEditDiary();
  const deleteDiary = useDeleteDiary();
  const isLoading = createDiary.isPending || editDiary.isPending || deleteDiary.isPending;
  // const { location, fetchLocation } = useCurrentLocation();

  // const BASE_URL = 'https://openweathermap.org/img/wn';
  // const iconUrl = `${BASE_URL}/${diary.weather.icon}@2x.png`;

  // 모드별 초기화
  useEffect(() => {
    // view , edit
    if ((mode === 'view' || mode === 'edit') && selectedDiary) {
      setDiary(selectedDiary);
      setPreview(selectedDiary.image_url || null);
      setImage(null);
    } else if (mode === 'create') {
      // create
      setDiary({
        date: getISODate(selectedDate),
        title: '',
        emotion: 'happy',
        notes: '',
        weather: {
          condition: 'cloudy',
          temperature: 18,
          icon: 0,
        },
        image_url: null,
      });
      setPreview(null);
      setImage(null);
    }

    setErrors({});
  }, [mode, selectedDiary, selectedDate]);

  // 이미지 업로드
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 이전 미리보기 url 해제
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);

    // 새 미리보기 url 생성
    const newUrl = URL.createObjectURL(file);
    setPreview(newUrl);
    setImage(file);
  };
  // 제목 입력
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiary((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  // 일기 내용 입력
  const handleNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiary((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  // 감정 선택
  const handleEmotion = (index: number) => {
    const emotionName = EMOTIONS[index].name as Emotion;

    setDiary((prev) => ({
      ...prev,
      emotion: emotionName,
    }));
  };

  // 취소 버튼: 변경사항이 있으면 확인 후 닫기
  const handleCancel = () => {
    const hasChanges =
      mode === 'create'
        ? diary.title || diary.notes || image
        : mode === 'edit'
          ? JSON.stringify(diary) !== JSON.stringify(selectedDiary) || image
          : false;

    if (hasChanges) {
      const confirmClose = window.confirm('작성 중인 내용이 있습니다. 정말 닫으시겠습니까?');
      if (!confirmClose) return;
    }

    onClose();
  };

  // 저장 버튼: 유효성 검사 후 저장
  const handleSave = () => {
    if (!onSave) return;

    const newErrors: DiaryError = {};

    if (!diary.title.trim()) newErrors.title = '제목을 입력해주세요';
    if (!diary.notes.trim()) newErrors.notes = '일기 내용을 입력해주세요';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (mode === 'create') {
      createDiary.mutate(
        { diary, image },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else if (mode === 'edit' && selectedDiary && selectedDiary.id) {
      editDiary.mutate(
        {
          id: selectedDiary.id,
          diary,
          image,
        },
        {
          onSuccess: () => {
            onModalChange();
            onClose();
          },
        }
      );
    }
  };

  // 삭제 버튼: 삭제 확인 모달 열기
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인: 실제 삭제 수행
  const handleConfirmDelete = () => {
    if (!diary.id) return;

    deleteDiary.mutate(diary.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        onClose();
      },
    });
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <div css={styles.modalContainer}>
          {/* 헤더 */}
          <DiaryModalHeader date={diary.date} />

          {/* 입력 필드들 */}
          <DiaryModalFields
            disabled={mode === 'view'}
            handleImage={handleImage}
            preview={preview}
            handleTitle={handleTitle}
            diary={diary}
            errors={errors}
            handleEmotion={handleEmotion}
            handleNotes={handleNotes}
          />

          {/* 버튼 */}
          <DiaryModalActions
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleSave={handleSave}
            handleEdit={onModalChange}
            handleDelete={handleDelete}
            mode={mode}
          />
        </div>
      </BaseModal>
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDiary.isPending}
      />
    </>
  );
};

export default DiaryModal;
