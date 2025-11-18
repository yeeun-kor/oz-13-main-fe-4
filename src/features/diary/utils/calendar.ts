export const getCalendarDays = (year: number, month: number) => {
  // 이번 달 총 일수
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 이번 달 1일이 무슨 요일인지
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // 지난 달 마지막 날
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // 이전 달 날짜들 ( 회색으로 표시할 날짜들 )
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    date: prevMonthLastDate - firstDayOfMonth + i + 1,
    isCurrentMonth: false,
  }));

  // 이번 달 날짜들
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    isCurrentMonth: true,
  }));

  // 다음 달 날짜들 (총 42칸을 채우기 위함)
  const totalCells = 42;
  const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => ({
    date: i + 1,
    isCurrentMonth: false,
  }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

// 오늘 날짜인지 확인
export const isToday = (
  date: number,
  isCurrentMonth: boolean,
  year: number,
  month: number
): boolean => {
  const today = new Date();

  return (
    isCurrentMonth &&
    year === today.getFullYear() &&
    month === today.getMonth() &&
    date === today.getDate()
  );
};

// Date객체 -> "YYYY-MM-DD" (DB 저장용 ISO 형식)
export const getISODate = (selectedDate: Date | null): string => {
  if (!selectedDate) return '';
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Date객체 -> "YYYY년 MM월 DD일" (화면 표시용)
export const getFormattedDate = (selectedDate: Date | null): string => {
  if (!selectedDate) return '';
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

// "YYYY-MM-DD" -> "YYYY년 MM월 DD일"
export const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${year}년 ${month}월 ${day}일`;
};
