export const mockCurrentWeather = {
  city: '서울',
  temperature: 18,
  feels_like: 16,
  humidity: 60,
  wind_speed: 3.0,
  rain_probability: 30,
  rain_volume: 1.2,
  condition: 'Cloudy',
  icon: '000',
};

export const mockForecastData = {
  current_weather: {
    temperature: 18,
    icon: '000',
    rain_probability: 10,
    feels_like: 20,
  },
  weathers: [
    {
      time: '07:00',
      temperature: 18,
      icon: '000',
      rain_probability: 10,
      feels_like: 20,
    },
    {
      time: '10:00',
      temperature: 20,
      icon: '001',
      rain_probability: 5,
      feels_like: 22,
    },
    {
      time: '13:00',
      temperature: 22,
      icon: '001',
      rain_probability: 0,
      feels_like: 24,
    },
    {
      time: '16:00',
      temperature: 21,
      icon: '002',
      rain_probability: 15,
      feels_like: 23,
    },
    {
      time: '19:00',
      temperature: 19,
      icon: '003',
      rain_probability: 20,
      feels_like: 21,
    },
    {
      time: '22:00',
      temperature: 17,
      icon: '003',
      rain_probability: 25,
      feels_like: 19,
    },
  ],
};

export const mockHistoryData = [
  {
    date: '2025-01-01',
    min_temperature: 2,
    max_temperature: 8,
    condition: 'Cloudy',
    provider: 'OpenWeather',
  },
  {
    date: '2025-01-02',
    min_temperature: 3,
    max_temperature: 10,
    condition: 'Clear',
    provider: 'OpenWeather',
  },
  {
    date: '2025-01-03',
    min_temperature: 1,
    max_temperature: 7,
    condition: 'Snow',
    provider: 'OpenWeather',
  },
  {
    date: '2025-01-04',
    min_temperature: -1,
    max_temperature: 5,
    condition: 'Snow',
    provider: 'OpenWeather',
  },
  {
    date: '2025-01-05',
    min_temperature: 0,
    max_temperature: 6,
    condition: 'Cloudy',
    provider: 'OpenWeather',
  },
];

// 다양한 지역별 날씨 데이터
export const mockWeatherByLocation: Record<string, typeof mockCurrentWeather> = {
  '서울특별시-강남구': {
    city: '서울',
    temperature: 18,
    feels_like: 16,
    humidity: 60,
    wind_speed: 3.0,
    rain_probability: 30,
    rain_volume: 1.2,
    condition: 'Cloudy',
    icon: '000',
  },
  '부산광역시-해운대구': {
    city: '부산',
    temperature: 20,
    feels_like: 19,
    humidity: 70,
    wind_speed: 5.0,
    rain_probability: 20,
    rain_volume: 0.5,
    condition: 'Clear',
    icon: '001',
  },
  '경기도-수원시': {
    city: '수원',
    temperature: 17,
    feels_like: 15,
    humidity: 55,
    wind_speed: 2.5,
    rain_probability: 40,
    rain_volume: 2.0,
    condition: 'Rainy',
    icon: '002',
  },
};

// 에러 메시지
export const weatherErrors = {
  apiCallFailed: { error: 'API 호출 실패' },
  locationFailed: { error: '위치 조회 실패' },
  dataEmpty: { error: '데이터 없음' },
  locationNotFound: { error: '위치 없음' },
  invalidParams: { error: '잘못된 파라미터' },
};
