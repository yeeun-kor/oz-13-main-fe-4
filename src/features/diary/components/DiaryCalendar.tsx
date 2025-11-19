import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import DiaryModal from './DiaryModal';
import * as styles from './DiaryCalendar.styles';
import { DiaryData, Modal } from '../types/types';
import { getCalendarDays, isToday } from '../utils/calendar';
import { useCalendarDate } from '../hooks/useCalendarDate';
import { DAYS, MONTHS } from '../constants/calender';
import { useEffect, useState } from 'react';
import { useDiaryDetail, useDiariesForCalendar } from '../hooks/useDiaryQueries';

const DiaryCalendar = () => {
  const { year, month, goToPrevMonth, goToNextMonth } = useCalendarDate();
  const calendarDays = getCalendarDays(year, month);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 새 일기 작성용
  const [mode, setMode] = useState<Modal>('create');
  const [selectedDiary, setSelectedDiary] = useState<DiaryData | undefined>(undefined);
  const [selectedDiaryId, setSelectedDiaryId] = useState<number | undefined>(undefined); // 상세 조회용
  const { data: diaries = [] } = useDiariesForCalendar(year, month);
  const { data: diaryDetail } = useDiaryDetail(selectedDiaryId ?? undefined);

  // 특정 날짜의 일기를 찾는 함수
  const getDiaryByDate = (year: number, month: number, date: number) => {
    if (!diaries || !Array.isArray(diaries)) return;
    const padMonth = String(month + 1).padStart(2, '0');
    const padDate = String(date).padStart(2, '0');
    const targetDate = `${year}-${padMonth}-${padDate}`;
    return diaries.find((d) => d.date === targetDate);
  };

  // 일기 작성
  const handleAddDiary = (date: number) => {
    const selected = new Date(year, month, date); // 여기는 Month 1~12로 넘어옴
    setSelectedDate(selected);
    setMode('create');
    setSelectedDiary(undefined);
    setIsModalOpen(true);
  };

  // 기존 일기 보기
  const handleViewDiary = (diaryDetail: DiaryData) => {
    setSelectedDiaryId(diaryDetail.id);
    setSelectedDiary(undefined);
    setMode('view');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDiary(undefined);
    setSelectedDiaryId(undefined);
    setSelectedDate(null);
  };

  const handleSaveDiary = () => {
    handleCloseModal();
  };

  const handleModeChange = () => {
    if (mode === 'view') {
      // view → edit
      setMode('edit');
    } else if (mode === 'edit') {
      // edit → view
      setMode('view');
    }
  };

  useEffect(() => {
    if (diaryDetail) {
      setSelectedDiary(diaryDetail);
    }
  }, [diaryDetail]);

  console.log('다이어리 기록용', diaries);
  console.log('상세보기', diaryDetail);

  return (
    <>
      <div css={styles.containerStyle}>
        {/* 캘린더 헤더 */}
        <div css={styles.headerStyle}>
          <button type='button' css={styles.navButtonStyle} onClick={goToPrevMonth}>
            <IoChevronBack />
          </button>
          <h2 css={styles.titleStyle}>
            {year}년 {MONTHS[month]}
          </h2>
          <button type='button' css={styles.navButtonStyle} onClick={goToNextMonth}>
            <IoChevronForward />
          </button>
        </div>

        {/* 요일 (mon - sun)*/}
        <div css={styles.daysHeaderStyle}>
          {DAYS.map((day) => (
            <div key={day} css={styles.dayLabelStyle}>
              {day}
            </div>
          ))}
        </div>

        {/* 캘린더 바디 */}
        <div css={styles.calendarBodyStyle}>
          {calendarDays.map((day, index) => {
            const existingDiary = day.isCurrentMonth ? getDiaryByDate(year, month, day.date) : null;

            return (
              <div
                key={index}
                css={day.isCurrentMonth ? styles.currentMonthDateStyle : styles.otherMonthDateStyle}
              >
                {day.isCurrentMonth ? (
                  <>
                    <div
                      css={
                        isToday(day.date, day.isCurrentMonth, year, month)
                          ? styles.todayCircleStyle
                          : undefined
                      }
                    >
                      <span>{day.date}</span>
                    </div>

                    {existingDiary ? (
                      // 일기가 있으면 제목 표시
                      <button
                        type='button'
                        css={styles.diaryTitleButtonStyle}
                        onClick={() => handleViewDiary(existingDiary)}
                      >
                        {existingDiary.title}
                      </button>
                    ) : (
                      // 일기가 없으면 작성 버튼
                      <button
                        type='button'
                        css={styles.addDiaryButtonStyle}
                        onClick={() => handleAddDiary(day.date)}
                      >
                        + 일기 작성
                      </button>
                    )}
                  </>
                ) : (
                  day.date
                )}
              </div>
            );
          })}
        </div>
      </div>
      <DiaryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        onSave={handleSaveDiary}
        mode={mode}
        selectedDiary={selectedDiary}
        onModalChange={handleModeChange}
      />
    </>
  );
};

export default DiaryCalendar;
