/**
 * OpenWeatherMap 아이콘 코드를 이미지 URL로 변환
 * @param iconCode - 날씨 아이콘 코드 (ex: '01d', '02n', '10d')
 * @param size - 이미지 크기 ('1x'| '2x'| '4x')
 * @returns 아이콘 이미지 URL
 */
export const getWeatherIconUrl = (iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string => {
  if (!iconCode) {
    console.warn('날씨 아이콘 코드가 없습니다.');
    return '';
  }

  const sizeMap = {
    '1x': '',
    '2x': '@2x',
    '4x': '@4x',
  };

  return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size]}.png`;
};

/**
 * 날씨 description을 한글로 변환
 * @param description - 날씨 상세 설명 (예: 'clear sky', 'few clouds', 'light rain')
 * @returns 한글 날씨 설명
 */
export const getWeatherDescriptionKorean = (description: string): string => {
  const descriptionMap: Record<string, string> = {
    // Clear
    'clear sky': '맑음',

    // Clouds
    'few clouds': '구름 조금',
    'scattered clouds': '구름 낀',
    'broken clouds': '구름 많음',
    'overcast clouds': '흐림',

    // Rain
    'light rain': '약한 비',
    'moderate rain': '비',
    'heavy intensity rain': '강한 비',
    'very heavy rain': '매우 강한 비',
    'extreme rain': '폭우',
    'freezing rain': '얼어붙는 비',
    'light intensity shower rain': '약한 소나기',
    'shower rain': '소나기',
    'heavy intensity shower rain': '강한 소나기',
    'ragged shower rain': '불규칙한 소나기',

    // Drizzle
    'light intensity drizzle': '약한 이슬비',
    'drizzle': '이슬비',
    'heavy intensity drizzle': '강한 이슬비',
    'light intensity drizzle rain': '약한 이슬비',
    'drizzle rain': '이슬비',
    'heavy intensity drizzle rain': '강한 이슬비',
    'shower rain and drizzle': '소나기와 이슬비',
    'heavy shower rain and drizzle': '강한 소나기와 이슬비',
    'shower drizzle': '이슬비 소나기',

    // Thunderstorm
    'thunderstorm with light rain': '약한 비를 동반한 천둥번개',
    'thunderstorm with rain': '비를 동반한 천둥번개',
    'thunderstorm with heavy rain': '강한 비를 동반한 천둥번개',
    'light thunderstorm': '약한 천둥번개',
    'thunderstorm': '천둥번개',
    'heavy thunderstorm': '강한 천둥번개',
    'ragged thunderstorm': '불규칙한 천둥번개',
    'thunderstorm with light drizzle': '약한 이슬비를 동반한 천둥번개',
    'thunderstorm with drizzle': '이슬비를 동반한 천둥번개',
    'thunderstorm with heavy drizzle': '강한 이슬비를 동반한 천둥번개',

    // Snow
    'light snow': '약한 눈',
    'snow': '눈',
    'heavy snow': '강한 눈',
    'sleet': '진눈깨비',
    'light shower sleet': '약한 진눈깨비 소나기',
    'shower sleet': '진눈깨비 소나기',
    'light rain and snow': '약한 비와 눈',
    'rain and snow': '비와 눈',
    'light shower snow': '약한 눈 소나기',
    'shower snow': '눈 소나기',
    'heavy shower snow': '강한 눈 소나기',

    // Atmosphere
    'mist': '안개',
    'smoke': '연기',
    'haze': '실안개',
    'sand/dust whirls': '모래/먼지 소용돌이',
    'fog': '안개',
    'sand': '모래',
    'dust': '먼지',
    'volcanic ash': '화산재',
    'squalls': '돌풍',
    'tornado': '토네이도',
  };

  const normalizedDescription = description.toLowerCase().trim();
  return descriptionMap[normalizedDescription] || description;
};

/**
 * 날씨 main 카테고리를 한글로 변환
 * main으로 오지 않으면 사용할 일 없을듯(직접 붙혀보고 쓸일없으면 삭제)
 * @param main - 날씨 주 카테고리 (ex: 'Clear', 'Clouds', 'Rain')
 * @returns 한글 날씨 카테고리
 */
export const getWeatherMainKorean = (main: string): string => {
  const mainMap: Record<string, string> = {
    Clear: '맑음',
    Clouds: '흐림',
    Rain: '비',
    Drizzle: '이슬비',
    Thunderstorm: '천둥번개',
    Snow: '눈',
    Mist: '안개',
    Smoke: '연기',
    Haze: '실안개',
    Dust: '먼지',
    Fog: '안개',
    Sand: '모래',
    Ash: '화산재',
    Squall: '돌풍',
    Tornado: '토네이도',
  };

  return mainMap[main] || main;
};

/**
 * 아이콘 코드로 낮/밤 구분
 * @param iconCode - 날씨 아이콘 코드 ->  00d = day | 00n = night
 * @returns 'day' | 'night'
 */
export const getDayOrNight = (iconCode: string): 'day' | 'night' => {
  return iconCode.endsWith('d') ? 'day' : 'night';
};
