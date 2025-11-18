import { instance } from '../../../axios/instance';
import { ReqSendMessage, ResSendMessage, ResChatHistory } from '../types/chat';

export const sendMessage = async (message: ReqSendMessage): Promise<ResSendMessage> => {
  const res = await instance.post('/chat/send/', message);

  return res.data;
};

export const getChatHistory = async (
  sessionId?: string,
  limit: number = 20,
  beforeId?: number
): Promise<ResChatHistory> => {
  const params = new URLSearchParams();

  if (sessionId) params.append('session_id', sessionId);
  if (limit) params.append('limit', String(limit));
  if (beforeId !== undefined) params.append('before_id', String(beforeId));

  const url = `/chat/session/?${params.toString()}`;

  const res = await instance.get(url);

  const messages = res.data?.messages && Array.isArray(res.data.messages) ? res.data.messages : [];

  return {
    session_id: res.data?.session_id || '',
    created_at: res.data?.created_at || '',
    messages,
    next_before_id: res.data?.next_before_id ?? null,
    has_more: res.data?.has_more || false,
  };
};
