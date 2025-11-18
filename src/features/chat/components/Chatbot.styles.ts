import { css } from '@emotion/react';

export const chatContainer = css`
  position: fixed;
  bottom: 6%;
  right: 3%;
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background: rgb(248, 247, 247);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 20;
`;

export const header = css`
  background: #2c4a8f;
  color: white;
  padding: 15px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const headerContent = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const profileWrapper = css`
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const chatEmoji = css`
  color: #2c4a8f;
  font-size: 40px;
`;

export const headerInfo = css`
  display: flex;
  flex-direction: column;
`;

export const headerTitle = css`
  font-size: 22px;
  margin: 0;
  padding: 2px;
`;

export const onlineStatus = css`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  margin: 0;
`;

export const onlineDot = css`
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
`;

export const chatBody = css`
  flex: 1;
  overflow-y: auto;
  padding: 10px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f8f7f7;
  box-shadow: inset 0 5px 15px -8px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const messageWrapper = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const messageWrapperUser = css`
  ${messageWrapper};
  flex-direction: row-reverse;
`;

export const messageAvatar = css`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2c4a8f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const messageBubble = css`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
`;

export const messageBubbleUser = css`
  ${messageBubble};
  background: #2c4a8f;
  color: white;
`;

export const inputContainer = css`
  padding: 14px;
  background: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

export const inputWrapper = css`
  position: relative;
  display: flex;
  align-items: center;
`;

export const input = css`
  width: 100%;
  padding: 12px 80px 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2c4a8f;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const sendButton = css`
  position: absolute;
  right: 6px;
  padding: 8px 16px;
  background: #2c4a8f;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #233b73;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const keywordContainer = css`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  box-shadow: inset 0 -5px 15px -8px rgba(0, 0, 0, 0.1);
`;

export const keywordButton = css`
  padding: 10px 16px;
  background: white;
  color: #2c4a8f;
  border: 1px solid #2c4a8f;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #2c4a8f;
    color: white;
  }
`;

export const welcomeMessage = css`
  text-align: center;
  padding: 20px 10px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
`;

export const toggleButton = css`
  position: fixed;
  bottom: 5%;
  right: 5%;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #2c4a8f;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  box-shadow: 0 4px 12px rgba(44, 74, 143, 0.4);
  transition: all 0.3s ease;
  z-index: 20;
  color: white;

  &:hover {
    background: #233b73;
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(72, 107, 188, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const closeButton = css`
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
