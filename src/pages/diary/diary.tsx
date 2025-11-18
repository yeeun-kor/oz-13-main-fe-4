import { css } from '@emotion/react';
import DiaryCalendar from '../../features/diary/components/DiaryCalendar';

const Diary = () => {
  const DiaryPageCss = css`
    margin: 20px 0;
  `;
  return (
    <div css={DiaryPageCss}>
      <DiaryCalendar />
    </div>
  );
};

export default Diary;
