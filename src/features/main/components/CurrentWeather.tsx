import { Box, Button, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
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
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { useLocationStore } from '../../location/store/locationStore';
import { useLocationName } from '../../../hooks/useLocationName';

interface CurrentWeatherProps {
  onEditLocation?: () => void;
}

export const CurrentWeather = ({ onEditLocation }: CurrentWeatherProps) => {
  const { location } = useLocationStore();
  const { loading: locationLoading, fetchLocationName } = useLocationName();
  const { weather, isLoading: weatherLoading } = useCurrentWeather();

  useEffect(() => {
    if (!location) {
      fetchLocationName();
    }
  }, [location, fetchLocationName]);

  const isLoading = locationLoading || weatherLoading;

  if (isLoading) {
    return (
      <WeatherCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      </WeatherCard>
    );
  }

  if (!weather) {
    return (
      <WeatherCard>
        <Box sx={{ textAlign: 'center', padding: 4 }}>날씨 정보를 불러올 수 없습니다.</Box>
      </WeatherCard>
    );
  }

  return (
    <WeatherCard>
      <CurrentWeatherCardHeader>
        <LocationText>{location || weather.location_name}</LocationText>
        {/* <Button
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
        </Button> */}
      </CurrentWeatherCardHeader>

      <TemperatureSection>
        <WeatherIcon iconCode={weather.icon} size={80} />
        <Box>
          <Temperature>{Math.round(weather.temperature)} °C</Temperature>
          <WeatherCondition>{getWeatherDescriptionKorean(weather.condition)}</WeatherCondition>
        </Box>
      </TemperatureSection>

      <InfoGroup>
        <InfoBox>
          <InfoLabel>기온</InfoLabel>
          <InfoValue>{Math.round(weather.temperature)} °C</InfoValue>
        </InfoBox>
        <InfoBox>
          <InfoLabel>강수확률</InfoLabel>
          <InfoValue>{weather.rain_probability ?? 0}%</InfoValue>
        </InfoBox>
        <InfoBox>
          <InfoLabel>체감온도</InfoLabel>
          <InfoValue>{Math.round(weather.feels_like)} °C</InfoValue>
        </InfoBox>
      </InfoGroup>
    </WeatherCard>
  );
};
