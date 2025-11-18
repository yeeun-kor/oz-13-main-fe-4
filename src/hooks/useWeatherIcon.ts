import { useMemo } from 'react';
import {
  getWeatherIconUrl,
  getWeatherDescriptionKorean,
  getWeatherMainKorean,
  getDayOrNight,
} from '../utils/weatherIcon';

interface UseWeatherIconReturn {
  iconUrl: string;
  descriptionKr: string;
  mainKr: string;
  isDay: boolean;
  isNight: boolean;
}
/**
 * 아이콘 코드 사용 훅 :
 * @description
 * @param iconCode - 아이콘코드(00n, 00d)
 * @param description (service > condition 항목으로 올 예정. 날씨 string)
 * @param main - desc로 오지 않는 경우에 사용할 예정(main > description 날씨가 형태의 데이터임)
 * @param size - 아이콘 사이즈(1x 2x 4x)
 * @returns iconUrl - api에서 제공하는 이미지url
 * @return descriptionKr - 날씨 desc
 * @return mainKr - 날씨 main(위 param 설명 참조)
 * @return dayOrNight - 밤낮여부
 */
export const useWeatherIcon = (
  iconCode: string,
  description?: string,
  main?: string, // main은 desc가 오지 않으면
  size: '1x' | '2x' | '4x' = '2x'
): UseWeatherIconReturn => {
  const iconUrl = useMemo(() => getWeatherIconUrl(iconCode, size), [iconCode, size]);

  const descriptionKr = useMemo(
    () => (description ? getWeatherDescriptionKorean(description) : ''),
    [description]
  );

  const mainKr = useMemo(() => (main ? getWeatherMainKorean(main) : ''), [main]);

  const dayOrNight = useMemo(() => getDayOrNight(iconCode), [iconCode]);

  return {
    iconUrl,
    descriptionKr,
    mainKr,
    isDay: dayOrNight === 'day',
    isNight: dayOrNight === 'night',
  };
};
