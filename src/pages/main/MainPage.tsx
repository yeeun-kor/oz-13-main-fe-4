import { AIRecommendation } from './components/AIRecommendation';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyWeather } from './components/HourlyWeather';
import { TodayOutfitRecommendation } from './components/TodayOutfitRecommendation';
import {
  ComponentsGrid,
  FullWidthCard,
  MainContainer,
  PlaceholderCard,
} from './styles/MainPageContentStyles';

export const MainPage = () => {
  return (
    <MainContainer>
      <ComponentsGrid>
        {/* 현재 날씨 */}
        <CurrentWeather
          location='서울'
          temperature={18}
          condition='scattered clouds'
          iconCode='03d'
          precipitation={30}
          feelsLike={16}
          onEditLocation={() => {
            console.log('위치 변경');
          }}
        />

        {/* 오늘의 추천 코디 */}
        <TodayOutfitRecommendation temperature={18} />

        {/* 시간별 날씨 */}
        <HourlyWeather hourlyData={[]} />

        <AIRecommendation temperature={15} condition={'clear'} location={'seoul'} />

        <PlaceholderCard>즐겨 찾는 지역</PlaceholderCard>

        <PlaceholderCard>○○○경기장</PlaceholderCard>

        {/* 하단 추가 정보 */}
        <FullWidthCard>지금, ○○○경기장에 가시는건가요?</FullWidthCard>
      </ComponentsGrid>
    </MainContainer>
  );
};
