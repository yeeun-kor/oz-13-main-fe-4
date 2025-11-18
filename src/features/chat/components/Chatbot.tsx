import * as styles from './Chatbot.styles';
import { CgBot } from 'react-icons/cg';
import { IoSend, IoClose } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
}

const KEYWORDS = ['오늘 날씨', '추천 옷차림', '이번주 날씨'];

const KEYWORD_RESPONSES: { [key: string]: string } = {
  '오늘 날씨': '오늘은 맑고 18도 정도로, 산책이나 가벼운 외출하기 좋은 날씨예요~',
  '추천 옷차림': '오늘은 가벼운 겉옷만 입어도 괜찮아요. 활동하기 편한 옷차림을 추천드려요!',
  '이번주 날씨':
    '이번주는 대체로 맑고 쾌적한 날씨가 예상돼요. 기온 변화가 있으니 아침저녁으로는 가벼운 겉옷 챙기시는 게 좋아요.',
};

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // 초기 환영 메시지
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content:
          '안녕하세요! 날씨 기반 옷차림 추천 챗봇입니다. 궁금한 내용을 선택하거나 질문해주세요!',
      },
    ]);
  }, []);

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 아래로
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const currentMessage = trimmedMessage;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // 임시로 setTimeout으로 봇 응답 시뮬레이션
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: `"${currentMessage}"에 대한 답변입니다.`,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeywordClick = (keyword: string) => {
    // 사용자가 키워드를 클릭한 것처럼 메시지 추가
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: keyword,
    };
    setMessages((prev) => [...prev, userMessage]);

    // 키워드에 대한 봇 응답
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: KEYWORD_RESPONSES[keyword],
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 300);
  };

  return isChatOpen ? (
    <div css={styles.chatContainer}>
      {/* 챗봇 상단 */}
      <div css={styles.header}>
        <div css={styles.headerContent}>
          <div css={styles.profileWrapper}>
            <CgBot css={styles.chatEmoji} />
          </div>
          <div css={styles.headerInfo}>
            <h2 css={styles.headerTitle}>챗봇</h2>
            <p css={styles.onlineStatus}>
              <span css={styles.onlineDot} />
              Online
            </p>
          </div>
        </div>
        <button type='button' onClick={() => setIsChatOpen(false)} css={styles.closeButton}>
          <IoClose />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div css={styles.chatBody}>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === 'bot' ? (
              <div css={styles.messageWrapper}>
                <div css={styles.messageAvatar}>
                  <CgBot />
                </div>
                <div css={styles.messageBubble}>{msg.content}</div>
              </div>
            ) : (
              <div css={styles.messageWrapperUser}>
                <div css={styles.messageBubbleUser}>{msg.content}</div>
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* 키워드 버튼들 - 입력창 위에 고정 */}
      <div css={styles.keywordContainer}>
        {KEYWORDS.map((keyword) => (
          <button
            key={keyword}
            type='button'
            css={styles.keywordButton}
            onClick={() => handleKeywordClick(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>

      {/* 메시지 입력 영역 */}
      <div css={styles.inputContainer}>
        <form
          css={styles.inputWrapper}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type='text'
            css={styles.input}
            placeholder='메시지를 입력하세요...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit' css={styles.sendButton} disabled={!message.trim()}>
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  ) : (
    <button type='button' css={styles.toggleButton} onClick={() => setIsChatOpen(true)}>
      <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
    </button>
  );
};

export default Chatbot;
