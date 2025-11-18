// src/components/MainPage/CurrentWeather.tsx
import { Box, Button } from '@mui/material';
import {
  CurrentWeatherCardHeader,
  InfoBox,
  InfoGroup,
  InfoLabel,
  InfoValue,
  LocationText,
  Temperature,
  TemperatureSection,
  WeatherCard,
  WeatherCondition,
} from '../styles/CurrentWeatherStyles';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherDescriptionKorean } from '../../../utils/weatherIcon';

interface CurrentWeatherProps {
  location: string;
  temperature: number;
  condition: string;
  iconCode: string;
  precipitation: number;
  feelsLike: number;
  onEditLocation?: () => void;
}

export const CurrentWeather = ({
  location,
  temperature,
  condition,
  iconCode,
  precipitation,
  feelsLike,
  onEditLocation,
}: CurrentWeatherProps) => {
  return (
    <WeatherCard>
      <CurrentWeatherCardHeader>
        <LocationText>{location}</LocationText>
        <Button
          onClick={onEditLocation}
          sx={{
            backgroundColor: '#5B9EFF',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '4px 16px',
            fontSize: '12px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#4A8EEE',
            },
          }}
        >
          지역 설정
        </Button>
      </CurrentWeatherCardHeader>

      <TemperatureSection>
        <WeatherIcon iconCode={iconCode} size={80} />
        <Box>
          <Temperature>{temperature} °C</Temperature>
          <WeatherCondition>{getWeatherDescriptionKorean(condition)}</WeatherCondition>
        </Box>
      </TemperatureSection>

      <InfoGroup>
        <InfoBox>
          <InfoLabel>기온</InfoLabel>
          <InfoValue>{temperature} °C</InfoValue>
        </InfoBox>
        <InfoBox>
          <InfoLabel>강수확률</InfoLabel>
          <InfoValue>{precipitation}%</InfoValue>
        </InfoBox>
        <InfoBox>
          <InfoLabel>체감온도</InfoLabel>
          <InfoValue>{feelsLike} °C</InfoValue>
        </InfoBox>
      </InfoGroup>
    </WeatherCard>
  );
};
