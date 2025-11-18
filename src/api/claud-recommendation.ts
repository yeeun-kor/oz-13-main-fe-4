import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'method_not_allowed',
        message: 'GET 요청만 지원됩니다',
      },
    });
  }

  // 쿼리 파라미터 추출
  const { temperature, condition, location, humidity, windSpeed } = req.query;

  // 필수 파라미터 검증
  if (!temperature || !condition || !location) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'missing_parameters',
        message: 'temperature, condition, location 파라미터가 필요합니다',
      },
    });
  }

  try {
    // Anthropic 클라이언트 초기화
    // Vercel 환경변수 설정: CLAUDE_API_KEY
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // 프롬프트 구성
    const prompt = buildPrompt({
      temperature: Number(temperature),
      condition: String(condition),
      location: String(location),
      humidity: humidity ? Number(humidity) : undefined,
      windSpeed: windSpeed ? Number(windSpeed) : undefined,
    });

    // Claude API 호출
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 응답 추출
    const recommendation =
      message.content[0].type === 'text'
        ? message.content[0].text.trim()
        : '추천을 생성할 수 없습니다.';

    // 성공 응답
    return res.status(200).json({
      success: true,
      recommendation,
      metadata: {
        temperature: Number(temperature),
        condition: String(condition),
        location: String(location),
      },
    });
  } catch (error: any) {
    console.error('Claude API Error:', error);

    // Anthropic API 에러 처리
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'rate_limit_exceeded',
          message: 'API 호출 한도를 초과했습니다',
        },
      });
    }

    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'invalid_api_key',
          message: 'API 키가 유효하지 않습니다',
        },
      });
    }

    // 일반 에러
    return res.status(500).json({
      success: false,
      error: {
        code: 'ai_failed',
        message: 'AI 추천 생성에 실패했습니다',
      },
    });
  }
}

// 프롬프트 생성 함수
function buildPrompt({
  temperature,
  condition,
  location,
  humidity,
  windSpeed,
}: {
  temperature: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
}): string {
  // 날씨 상태 한글 변환
  const conditionKR = translateCondition(condition);

  // Few-shot 프롬프트 (가장 안정적)
  return `날씨 정보를 보고 적절한 야외 활동 하나를 추천하세요.

예시 1:
날씨: 맑음, 25°C, 서울
추천: "한강 공원에서 피크닉을 즐겨보세요!"

예시 2:
날씨: 비, 18°C, 부산
추천: "해운대 카페에서 바다를 바라보며 차 한잔 어떠세요?"

예시 3:
날씨: 눈, -2°C, 강원도
추천: "스키장에서 겨울 스포츠를 즐겨보세요!"

예시 4:
날씨: 맑음, 15°C, 대구
추천: "팔공산 산책로에서 가을 단풍을 감상해보세요!"

---

현재 날씨:
- 지역: ${location}
- 온도: ${temperature}°C
- 날씨: ${conditionKR}${humidity ? `\n- 습도: ${humidity}%` : ''}${windSpeed ? `\n- 풍속: ${windSpeed}m/s` : ''}

요구사항:
1. 해당 날씨에 적합한 야외/실내 활동 1가지만 추천
2. ${location} 지역의 실제 장소를 포함하면 더 좋음
3. 친근하고 긍정적인 톤
4. 30자 이내의 짧은 한 문장
5. 따옴표 없이 추천 문구만 작성

추천:`;
}

// 날씨 상태 영어 -> 한글 변환
function translateCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    clear: '맑음',
    clouds: '구름',
    cloudy: '흐림',
    rain: '비',
    drizzle: '이슬비',
    thunderstorm: '천둥번개',
    snow: '눈',
    mist: '안개',
    fog: '안개',
    haze: '연무',
  };

  const lowerCondition = condition.toLowerCase();
  return conditionMap[lowerCondition] || condition;
}
