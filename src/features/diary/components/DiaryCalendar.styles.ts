import { css } from '@emotion/react';

export const containerStyle = css`
  margin: 0 auto;
  min-width: 700px;
  max-width: 1200px;
  min-height: 700px;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

export const headerStyle = css`
  padding: 25px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export const navButtonStyle = css`
  background: transparent;
  border: none;
  font-size: 24px;
  color: #666;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

export const titleStyle = css`
  font-size: 24px;
  font-weight: 600;
  color: #1f1e1e;
  margin: 0;
`;

export const daysHeaderStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #ddd;
`;

export const dayLabelStyle = css`
  color: #718096;
  text-align: center;
  padding: 8px 0;
  font-weight: 500;
`;

export const calendarBodyStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
`;

export const dateStyle = css`
  position: relative;
  text-align: left;
  padding: 10px 0 0 10px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  min-height: 100px;
  cursor: pointer;
`;

export const currentMonthDateStyle = css`
  ${dateStyle}
  background-color: white;
`;

export const otherMonthDateStyle = css`
  ${dateStyle}
  color: #bbb;
  background-color: #fafafa;
`;

export const todayCircleStyle = css`
  position: absolute;
  top: 8px;
  left: 8px;
  color: white;
  background-color: #1976d2;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  font-weight: 700;
  padding: 2px;
`;

const buttonStyle = css`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 16px;
  padding: 6px 5px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  width: 80%;
  border: none;
`;

export const addDiaryButtonStyle = css`
  ${buttonStyle}
  background-color: var(--color-background);
  color: #10498a;

  &:hover {
    background-color: #1976d2;
    color: white;
  }
`;

export const diaryTitleButtonStyle = css`
  ${buttonStyle}
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: var(--color-background);
    color: black;
  }
`;
