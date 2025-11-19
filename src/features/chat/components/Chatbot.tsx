import * as styles from './Chatbot.styles';
import { CgBot } from 'react-icons/cg';
import { IoSend, IoClose } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import { useSendMessage, useChatHistory } from '../hooks/useChatQueries';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';

const KEYWORDS = ['서비스 소개', '추천 옷차림'];
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
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sendMessage = useSendMessage();
  const { location, fetchLocation } = useCurrentLocation();
  const messageIdCounter = useRef(0);

  // localStorage에서 session_id 가져오기
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(CHAT_SESSION_KEY);
  });

  // 페이지네이션 상태
  const [beforeId, setBeforeId] = useState<number | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const { data: chatHistory, refetch } = useChatHistory({
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
      // 서버 메시지에 고유 ID 부여 (서버에서 같은 ID넘겨주고 있음)
      const messagesWithUniqueId = chatHistory.messages.map((msg) => ({
        ...msg,
        id: messageIdCounter.current++,
      }));

      if (beforeId) {
        // 이전 메시지 로드 시: 스크롤 위치 유지를 위해 이전 높이 저장
        const chatBody = chatBodyRef.current;
        const prevScrollHeight = chatBody?.scrollHeight || 0;

        setMessages((prev) => [...messagesWithUniqueId, ...prev]);
        setIsLoadingMore(false);

        // 다음 프레임에서 스크롤 위치 조정
        setTimeout(() => {
          if (chatBody) {
            const newScrollHeight = chatBody.scrollHeight;
            chatBody.scrollTop = newScrollHeight - prevScrollHeight;
          }
        }, 0);
      } else {
        // 최초 로드 또는 invalidate 후 재로드 - 로딩 중인 메시지는 유지
        setMessages((prev) => {
          const loadingMessages = prev.filter((msg) => msg.isLoading);
          return [...messagesWithUniqueId, ...loadingMessages];
        });
      }
      setHasMore(chatHistory.has_more);
    }
  }, [chatHistory, beforeId]);

  // 맨 아래로 스크롤 (챗봇 열릴 때 + 새 메시지 전송 시)
  useEffect(() => {
    if (isChatOpen || shouldScrollToBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (shouldScrollToBottom) {
          setShouldScrollToBottom(false);
        }
      }, 0);
    }
  }, [isChatOpen, shouldScrollToBottom]);

  // Intersection Observer로 이전 메시지 로드
  useEffect(() => {
    if (!loadMoreRef.current || !chatBodyRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          if (chatHistory?.next_before_id) {
            setBeforeId(chatHistory.next_before_id);
          }
        }
      },
      {
        root: chatBodyRef.current,
        rootMargin: '20px', // 20px 여유를 둬서 조금 더 일찍 트리거
        threshold: 0.1, // 10%만 보여도 트리거
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, chatHistory?.next_before_id]);

  // 사용자 메시지 추가
  const addUserMessage = (text: string) => {
    const userMessageId = messageIdCounter.current++;
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setShouldScrollToBottom(true);
    return userMessageId;
  };

  // 로딩 메시지 추가
  const addLoadingMessage = () => {
    const loadingMessageId = messageIdCounter.current++;
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'ai',
      text: '답장중...',
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);
    return loadingMessageId;
  };

  // 봇 응답으로 로딩 메시지 교체
  const replaceBotResponse = (
    loadingMessageId: number,
    responseText: string,
    createdAt?: string
  ) => {
    setMessages((prev) => {
      const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
      const botMessage: Message = {
        id: messageIdCounter.current++,
        role: 'ai',
        text: responseText,
        created_at: createdAt,
      };
      return [...filtered, botMessage];
    });
    setShouldScrollToBottom(true);
  };

  // 히스토리 업데이트
  const updateChatHistory = () => {
    setBeforeId(undefined);
    refetch();
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    addUserMessage(trimmedMessage);
    setMessage('');

    const loadingMessageId = addLoadingMessage();

    try {
      await fetchLocation();

      const response = await sendMessage.mutateAsync({
        message: trimmedMessage,
        lat: location?.lat ?? 0,
        lon: location?.lon ?? 0,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      replaceBotResponse(loadingMessageId, response.response, response.created_at);
      updateChatHistory();
    } catch (error) {
      replaceBotResponse(
        loadingMessageId,
        '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  const handleKeywordClick = async (keyword: string) => {
    addUserMessage(keyword);
    const loadingMessageId = addLoadingMessage();

    // 미리 정의된 키워드 답변
    if (keywordsAnswer[keyword]) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      replaceBotResponse(loadingMessageId, keywordsAnswer[keyword]);
      return;
    }

    // 서버에서 답변 가져오기
    try {
      await fetchLocation();

      const response = await sendMessage.mutateAsync({
        message: keyword,
        lat: location?.lat ?? 0,
        lon: location?.lon ?? 0,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      replaceBotResponse(loadingMessageId, response.response, response.created_at);
      updateChatHistory();
    } catch (error) {
      replaceBotResponse(
        loadingMessageId,
        '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
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
      <div css={styles.chatBody} ref={chatBodyRef}>
        {/* Intersection Observer 타겟 */}
        {hasMore && <div ref={loadMoreRef} style={{ height: '1px' }} />}

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
      <CgBot />
    </button>
  );
};

export default Chatbot;
