import { Button } from '@mui/material';
import * as styles from './DiaryModal.styles';

interface DiaryModalActionsProps {
  isLoading: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  mode: string;
}

const DiaryModalActions = ({
  isLoading,
  handleCancel,
  handleSave,
  handleEdit,
  handleDelete,
  mode,
}: DiaryModalActionsProps) => {
  if (mode === 'view') {
    return (
      <div css={styles.buttonWrapper}>
        <Button variant='contained' color='error' onClick={handleDelete}>
          삭제
        </Button>
        <Button variant='outlined' color='primary' onClick={handleCancel}>
          닫기
        </Button>
        <Button variant='contained' color='primary' onClick={handleEdit}>
          수정
        </Button>
      </div>
    );
  }

  return (
    <div css={styles.buttonWrapper}>
      <Button variant='outlined' color='primary' disabled={isLoading} onClick={handleCancel}>
        취소
      </Button>
      <Button variant='contained' color='primary' onClick={handleSave} disabled={isLoading}>
        {mode === 'edit' ? '수정 완료' : '저장'}
      </Button>
    </div>
  );
};

export default DiaryModalActions;
