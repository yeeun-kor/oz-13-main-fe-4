interface WeatherContext {
  temperature: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
}
/**
 * 외부 API 사용시엔 CORS때문에 즉시 사용 X
 * 룰기반(하드코딩) 으로 개발 진행 > 배포 후 교체 예정
 * @param weather
 * @returns
 */
export const getActivityRecommendation = (weather: WeatherContext): string => {
  const { temperature, condition, location } = weather;

  // 날씨 상태에 따른 추천
  const lowerCondition = condition.toLowerCase();

  // 비 오는 날
  if (lowerCondition.includes('rain') || lowerCondition.includes('비')) {
    if (temperature > 20) {
      return `${location}에 비가 내리는 날, 실내 카페에서 창밖을 보며 따뜻한 음료를 즐기는 건 어떨까요?`;
    }
    return `비 오는 날엔 ${location} 근처 박물관이나 미술관에서 여유로운 시간을 보내보세요!`;
  }

  // 눈 오는 날
  if (lowerCondition.includes('snow') || lowerCondition.includes('눈')) {
    return `하얀 눈이 내리는 ${location}, 따뜻한 옷을 입고 가까운 공원에서 겨울의 낭만을 느껴보세요!`;
  }

  // 온도별 추천
  if (temperature >= 30) {
    return `${location}의 더운 날씨! 시원한 실내 쇼핑몰이나 영화관에서 더위를 피하는 건 어떨까요?`;
  } else if (temperature >= 25) {
    return `따뜻한 ${location}의 날씨, 한강 공원에서 피크닉을 즐기거나 야외 카페에서 여유를 만끽해보세요!`;
  } else if (temperature >= 20) {
    return `완벽한 날씨의 ${location}! 자전거를 타거나 산책하며 상쾌한 봄바람을 느껴보는 건 어떨까요?`;
  } else if (temperature >= 15) {
    return `선선한 ${location}의 날씨, 단풍 구경을 떠나거나 야외에서 가볍게 운동하기 좋은 날이에요!`;
  } else if (temperature >= 10) {
    return `쌀쌀한 ${location}의 날씨, 따뜻한 차 한 잔과 함께 서점에서 독서하는 시간은 어떨까요?`;
  } else if (temperature >= 5) {
    return `추운 ${location}의 날씨엔 실내 전시회나 공연을 관람하며 문화생활을 즐겨보세요!`;
  } else {
    return `매우 추운 ${location}의 날씨! 집에서 따뜻하게 영화를 보거나 온천을 찾아가는 건 어떨까요?`;
  }
};
