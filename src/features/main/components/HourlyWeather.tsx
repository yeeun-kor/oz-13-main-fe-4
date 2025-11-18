import { useDragScroll } from '../../../hooks/useDragScroll';
import {
  HourlyWeatherCard,
  HourlyScrollContainer,
  HourlyItem,
  HourLabel,
  WeatherIconBox,
  TemperatureLabel,
} from '../styles/HourlyWeatherStyles';
import { WeatherIcon } from './WeatherIcon';

interface HourlyWeatherData {
  time: string;
  temperature: number;
  icon: string;
  condition: string;
  rain_probability?: number;
  feels_like?: number;
}

interface HourlyWeatherProps {
  hourlyData?: HourlyWeatherData[];
}

export const HourlyWeather = ({ hourlyData = [] }: HourlyWeatherProps) => {
  const { scrollRef, handlers } = useDragScroll({
    direction: 'horizontal',
    sensitivity: 2,
    wheelSensitivity: 0.5, // 휠 감도 (낮을수록 부드러움)
  });

  // 기본 데이터 생성 (24시간)
  const generateDefaultData = (): HourlyWeatherData[] => {
    const now = new Date();
    const currentHour = now.getHours();
    const items: HourlyWeatherData[] = [];

    // 24시간치 데이터 생성
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;

      // 아이콘을 낮/밤에 따라 다르게
      const isDay = hour >= 6 && hour < 18;

      // 날씨 조건에 따라 다른 아이콘
      const iconCodes = isDay ? ['01d', '02d', '03d', '04d'] : ['01n', '02n', '03n', '04n'];
      const randomIcon = iconCodes[Math.floor(Math.random() * iconCodes.length)];

      // 시간 표시
      let timeLabel: string;
      if (i === 0) {
        timeLabel = '지금';
      } else {
        timeLabel = `${String(hour).padStart(2, '0')}:00`;
      }

      items.push({
        time: timeLabel,
        temperature: 15 + Math.floor(Math.random() * 10), // 15~24도 사이
        icon: randomIcon,
        condition: 'clear sky',
        rain_probability: Math.floor(Math.random() * 50),
      });
    }

    return items;
  };

  const displayData = hourlyData.length > 0 ? hourlyData : generateDefaultData();

  return (
    <HourlyWeatherCard>
      <HourlyScrollContainer ref={scrollRef} {...handlers}>
        {displayData.map((data, index) => (
          <HourlyItem key={`hour-${index}`}>
            <HourLabel>{data.time}</HourLabel>
            <WeatherIconBox>
              <WeatherIcon iconCode={data.icon} size={48} />
            </WeatherIconBox>
            <TemperatureLabel>{data.temperature}°C</TemperatureLabel>
          </HourlyItem>
        ))}
      </HourlyScrollContainer>
    </HourlyWeatherCard>
  );
};
