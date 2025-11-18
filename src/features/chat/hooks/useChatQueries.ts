import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReqSendMessage, ResSendMessage, ResChatHistory } from '../types/chat';
import { sendMessage, getChatHistory } from '../api/chat';

// 메시지를 서버로 보내기
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ResSendMessage, Error, ReqSendMessage>({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
    onError: (error) => {
      console.log('대화 전송 실패 : ', error.message);
    },
  });
};

interface UseChatHistoryParams {
  sessionId?: string;
  limit?: number;
  beforeId?: number;
}

// 서버에서 대화 내역 받아오기 (실시간 세션)
export const useChatHistory = ({ sessionId, limit = 20, beforeId }: UseChatHistoryParams) => {
  return useQuery<ResChatHistory, Error>({
    queryKey: ['chatHistory', sessionId, limit, beforeId], // beforeId 상태가 변경되면 react query가 자동으로 재요청
    queryFn: () => getChatHistory(sessionId, limit, beforeId),
    enabled: !!sessionId, // sessionId가 있을 때만 실행
  });
};
