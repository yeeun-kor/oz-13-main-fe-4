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
import { useHourlyWeather } from '../hooks/useHourlyWeather';
import { CircularProgress, Box } from '@mui/material';

export const HourlyWeather = () => {
  const { forecast, isLoading } = useHourlyWeather();
  const { scrollRef, handlers } = useDragScroll({
    direction: 'horizontal',
    sensitivity: 2,
    wheelSensitivity: 0.5,
  });

  // valid_time을 "지금" 또는 "HH:00" 형식으로 변환
  const formatTime = (validTime: string, index: number): string => {
    if (index === 0) return '지금';

    const date = new Date(validTime);
    const hours = date.getHours();
    return `${String(hours).padStart(2, '0')}:00`;
  };

  if (isLoading) {
    return (
      <HourlyWeatherCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <CircularProgress size={30} />
        </Box>
      </HourlyWeatherCard>
    );
  }

  if (!forecast || forecast.items.length === 0) {
    return (
      <HourlyWeatherCard>
        <Box sx={{ textAlign: 'center', padding: 2 }}>시간별 날씨 정보를 불러올 수 없습니다.</Box>
      </HourlyWeatherCard>
    );
  }

  // 24시간치 데이터만 표시 (최대 24개)
  const displayData = forecast.items.slice(0, 24);

  return (
    <HourlyWeatherCard>
      <HourlyScrollContainer ref={scrollRef} {...handlers}>
        {displayData.map((item, index) => (
          <HourlyItem key={item.id}>
            <HourLabel>{formatTime(item.valid_time, index)}</HourLabel>
            <WeatherIconBox>
              <WeatherIcon iconCode={item.icon} size={48} />
            </WeatherIconBox>
            <TemperatureLabel>{Math.round(item.temperature)}°C</TemperatureLabel>
          </HourlyItem>
        ))}
      </HourlyScrollContainer>
    </HourlyWeatherCard>
  );
};
