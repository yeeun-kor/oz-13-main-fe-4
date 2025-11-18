import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAIRecommendation } from '../../../lib/services/claudeAPI';
import {
  ContentSection,
  HeaderText,
  IconBox,
  LoadingText,
  MainRecommendation,
  RecommendationCard,
} from '../styles/AIRecommendationStyles';

interface AIRecommendationProps {
  temperature: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
}

export const AIRecommendation = ({
  temperature,
  condition,
  location,
  humidity,
  windSpeed,
}: AIRecommendationProps) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const rec = await getAIRecommendation({
          temperature,
          condition,
          location,
          humidity,
          windSpeed,
        });

        setRecommendation(rec);
      } catch (err) {
        console.error('추천 생성 실패:', err);
        setError('추천을 생성할 수 없습니다.');
        // 폴백 메시지
        setRecommendation('오늘 하루도 즐거운 시간 보내세요!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [temperature, condition, location, humidity, windSpeed]);

  return (
    <RecommendationCard>
      {/* 좌측 아이콘 */}
      <IconBox>
        <AutoAwesomeIcon sx={{ color: '#3B82F6', fontSize: 48 }} />
      </IconBox>

      {/* 우측 컨텐츠 */}
      <ContentSection>
        <HeaderText>AI가 추천하는 오늘의 활동</HeaderText>

        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={20} />
            <LoadingText>추천 문구를 생성하는 중...</LoadingText>
          </Box>
        ) : error ? (
          <MainRecommendation sx={{ color: '#000' }}>{recommendation}</MainRecommendation>
        ) : (
          <MainRecommendation>{recommendation}</MainRecommendation>
        )}
      </ContentSection>
    </RecommendationCard>
  );
};
