import { css } from '@emotion/react';

export const modalContainer = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const header = css`
  margin-top: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const dateTitle = css`
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
`;

export const closeButton = css`
  background: transparent;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  &:hover {
    color: #374151;
  }
`;

export const fileInput = css`
  display: none;
`;

export const imageContainer = css`
  margin: 10px 0;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border-color: #9ca3af;
  }
`;

export const uploadPlaceholder = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;

  svg {
    font-size: 48px;
  }
`;

export const imageLabel = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const previewImage = css`
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
  border-radius: 10px;
`;

export const titleWrapper = css`
  width: 40%;
  margin-bottom: 20px;
  padding-left: 5px;
`;

export const inputWrapper = css`
  width: 100%;
  margin-bottom: 20px;
`;

export const weatherSection = css`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 2px;
`;

export const weatherIcon = css`
  font-size: 40px;
  color: rgb(245, 166, 7);
`;

export const weatherText = css`
  display: flex;
  flex-direction: column;
  align-items: start;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
`;

export const emotionSection = css`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 10px 0;
`;

export const emotionTitle = css`
  padding-left: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
`;

export const emotionContainer = css`
  display: flex;
  gap: 15px;
  justify-content: space-around;
`;

export const emotionButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 10px;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;

  img {
    width: 50px;
    height: 50px;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

export const emotionButtonSelected = css`
  background-color: var(--color-background);
  color: white;
  border: none;
`;

export const buttonWrapper = css`
  display: flex;
  justify-content: end;
  width: 100%;
  gap: 8px;
`;

export const disabledTextField = css`
  & .MuiInputBase-input.Mui-disabled {
    -webkit-text-fill-color: #000000;
  }

  & .MuiInputLabel-root.Mui-disabled {
    color: rgba(0, 0, 0, 0.6);
  }
`;
