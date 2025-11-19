import { css } from '@emotion/react';
import { useAuthStore } from '../../features/auth/store/authStore';
import Chatbot from '../../features/chat/components/Chatbot';
import DiaryCalendar from '../../features/diary/components/DiaryCalendar';

const Diary = () => {
  const { user } = useAuthStore();
  const DiaryPageCss = css`
    margin: 20px 0;
  `;
  return (
    <div css={DiaryPageCss}>
      <DiaryCalendar />
      {user && <Chatbot />}
    </div>
  );
};

export default Diary;
