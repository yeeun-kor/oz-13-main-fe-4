import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

const containerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 80vh;
  text-align: center;
  background-color: #f9f9f9;
`;

const titleStyle = css`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 80px;
`;

const textStyle = css`
  font-size: 18px;
  margin-bottom: 30px;
`;

const linkStyle = css`
  font-size: 16px;
  color: #2c4a8f;
  text-decoration: none;
  border: 1px solid #2c4a8f;
  padding: 8px 16px;
  border-radius: 8px;
  &:hover {
    background-color: #2c4a8f;
    color: white;
  }
`;

const NeedLoginPage = () => {
  return (
    <div css={containerStyle}>
      <h2 css={titleStyle}>로그인이 필요한 페이지입니다.</h2>
      <p css={textStyle}>계속 진행하려면 로그인이 필요합니다.</p>
      <Link css={linkStyle} to='/login'>
        로그인하러 가기
      </Link>
    </div>
  );
};

export default NeedLoginPage;
