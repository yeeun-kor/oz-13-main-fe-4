import * as styles from './Chatbot.styles';
import { CgBot } from 'react-icons/cg';
import { IoSend, IoClose } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Message } from '../types/chat';
import { useSendMessage, useChatHistory } from '../hooks/useChatQueries';

const KEYWORDS = ['서비스 소개', '추천 옷차림', '이번주 날씨'];
const CHAT_SESSION_KEY = 'chat-session-id';

const keywordsAnswer: Record<string, string> = {
  '서비스 소개':
    '사용자가 선택한 위치에 맞는 날씨 정보와 그에 맞는 옷 조합을 소개하는 서비스입니다. 원하는 지역을 즐겨찾기에 추가하고 날씨 사진 또는 오늘 정한 스타일을 찍은 사진을 업로드 할 수 있는 일기장 페이지 또한 마련되어 있습니다.',
};

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      role: 'ai',
      text: '안녕하세요! 날씨 기반 옷차림 추천 챗봇입니다. 궁금한 내용을 선택하거나 질문해주세요!',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sendMessage = useSendMessage();

  // localStorage에서 session_id 가져오기
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(CHAT_SESSION_KEY);
  });

  // 페이지네이션 상태
  const [beforeId, setBeforeId] = useState<number | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const { data: chatHistory } = useChatHistory({
    sessionId: sessionId || undefined,
    limit: 20,
    beforeId,
  });

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(CHAT_SESSION_KEY, sessionId);
    }
  }, [sessionId]);

  // 채팅 히스토리 로드 시 메시지 업데이트
  useEffect(() => {
    if (chatHistory?.messages && chatHistory.messages.length > 0) {
      if (beforeId) {
        // 이전 메시지 로드 시 기존 메시지에 추가 (중복 제거)
        setMessages((prev) => {
          const newMessages = chatHistory.messages.filter(
            (newMsg) => !prev.some((existingMsg) => existingMsg.id === newMsg.id)
          );
          return [...newMessages, ...prev];
        });
        setIsLoadingMore(false);
      } else {
        // 최초 로드 또는 새로고침
        setMessages(chatHistory.messages);
      }
      setHasMore(chatHistory.has_more);
    }
  }, [chatHistory, beforeId]);

  useEffect(() => {
    if (!isLoadingMore) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoadingMore]);

  // 스크롤 이벤트로 이전 메시지 로드
  const handleScroll = () => {
    const chatBody = chatRef.current;
    if (!chatBody || isLoadingMore || !hasMore) return;

    if (chatBody.scrollTop === 0) {
      setIsLoadingMore(true);
      // next_before_id를 사용하여 이전 메시지 로드
      if (chatHistory?.next_before_id) {
        setBeforeId(chatHistory.next_before_id);
      }
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const currentMessage = trimmedMessage;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: currentMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await sendMessage.mutateAsync({
        message: currentMessage,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      const botMessage: Message = {
        id: Date.now(),
        role: 'ai',
        text: response.response,
        created_at: response.created_at,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // 에러 발생 시 안내 메시지 표시
      const errorMessage: Message = {
        id: Date.now(),
        role: 'ai',
        text: '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeywordClick = async (keyword: string) => {
    // 사용자가 키워드를 클릭한 것처럼 메시지 추가
    const timestamp = Date.now();
    const userMessage: Message = {
      id: timestamp,
      role: 'user',
      text: keyword,
    };
    setMessages((prev) => [...prev, userMessage]);

    if (keywordsAnswer[keyword]) {
      const botMessage: Message = {
        id: timestamp + 1,
        role: 'ai',
        text: keywordsAnswer[keyword],
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    try {
      const response = await sendMessage.mutateAsync({
        message: keyword,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // 봇 응답을 UI에 추가
      const botMessage: Message = {
        id: Date.now(),
        role: 'ai',
        text: response.response,
        created_at: response.created_at,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      const errorMessage: Message = {
        id: Date.now(),
        role: 'ai',
        text: '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
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
      <div css={styles.chatBody} ref={chatRef} onScroll={handleScroll}>
        {isLoadingMore && hasMore && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#999' }}>
            이전 메시지 로드 중...
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'ai' ? (
              <div css={styles.messageWrapper}>
                <div css={styles.messageAvatar}>
                  <CgBot />
                </div>
                <div css={styles.messageBubble}>{msg.text}</div>
              </div>
            ) : (
              <div css={styles.messageWrapperUser}>
                <div css={styles.messageBubbleUser}>{msg.text}</div>
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
