import { css } from '@emotion/react';
import { useEffect } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 10;
`;

const modalStyle = css`
  margin-top: 60px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const titleStyle = css`
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1a1a1a;
  line-height: 1.4;
`;

const subtitleStyle = css`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  line-height: 1.5;
`;

const footerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 24px;
`;

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  children,
}: BaseModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div css={overlayStyle} onClick={onClose}>
      <div css={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title && <h2 css={titleStyle}>{title}</h2>}
        {subtitle && <p css={subtitleStyle}>{subtitle}</p>}
        {children}
        {footer && <div css={footerStyle}>{footer}</div>}
      </div>
    </div>
  );
};
export default BaseModal;
