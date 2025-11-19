export interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  created_at?: string; // ISO 8601 형식
}

export interface ReqSendMessage {
  message: string;
  lat: number;
  lon: number;
}

export interface ResSendMessage {
  response: string;
  session_id: string;
  created_at: string;
}

export interface ResChatHistory {
  session_id: string;
  created_at: string;
  messages: Message[];
  next_before_id: number | null;
  has_more: boolean;
}

export interface ChatLog {
  id: number;
  session_id: string;
  model_name: string;
  user_question: string;
  ai_answer: string;
  context: {
    profile: Record<string, unknown>;
    weather: {
      city: string;
      icon: string;
      condition: string;
      feels_like: number;
      wind_speed: number;
      rain_volume: number;
      temperature: number;
      rain_probability: number;
    };
    rule_outfits: {
      rec_1: string;
      rec_2: string;
      rec_3: string;
      explanation: string;
    };
    model_setting: unknown;
  };
  created_at: string;
}

export interface ResChatLogs {
  logs: ChatLog[];
}
