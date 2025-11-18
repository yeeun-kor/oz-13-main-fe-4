import * as styles from './DiaryModal.styles';
import { formatDateForDisplay } from '../utils/calendar';

interface DiaryModalHeaderProps {
  date: string;
}

const DiaryModalHeader = ({ date }: DiaryModalHeaderProps) => {
  return (
    <div css={styles.header}>
      <h3 css={styles.dateTitle}>{formatDateForDisplay(date)}</h3>
    </div>
  );
};

export default DiaryModalHeader;
