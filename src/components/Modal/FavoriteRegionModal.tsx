import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import BaseModal from './BaseModal';
import { useState } from 'react';
import { REGIONS } from '../../constants/region';
import styled from '@emotion/styled';

interface FavoriteRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (region: { city: string; district: string }) => void;
}

const ITEM_HEIGHT = 53;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 50,
    },
  },
};

const FavoriteRegionModal = ({ isOpen, onClose, onSave }: FavoriteRegionModalProps) => {
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');

  const handleCityChange = (event: SelectChangeEvent) => {
    setCity(event.target.value);
    setDistrict('');
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setDistrict(event.target.value);
  };

  const handleSave = () => {
    if (onSave && city && district) {
      onSave({ city, district });
      setCity('');
      setDistrict('');
      onClose();
    }
  };

  const CustomDiv = styled('div')({
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='즐겨찾는 지역 설정'
      subtitle='원하는 지역을 설정하여 날씨에 맞는 옷 추천을 받아보세요!'
      footer={
        <>
          <Button onClick={onClose} variant='outlined' color='primary'>
            취소
          </Button>
          <Button
            onClick={handleSave}
            variant='contained'
            color='primary'
            disabled={!city || !district}
          >
            저장
          </Button>
        </>
      }
    >
      <CustomDiv>
        <FormControl fullWidth>
          <InputLabel id='city-select-label'>시도 선택</InputLabel>
          <Select
            labelId='city-select-label'
            id='city-select'
            value={city}
            label='시도 선택'
            onChange={handleCityChange}
            MenuProps={MenuProps}
          >
            {Object.keys(REGIONS).map((cityName) => (
              <MenuItem key={cityName} value={cityName}>
                {cityName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!city}>
          <InputLabel id='district-select-label'>시군구 선택</InputLabel>
          <Select
            labelId='district-select-label'
            id='district-select'
            value={district}
            label='시군구 선택'
            onChange={handleDistrictChange}
            MenuProps={MenuProps}
          >
            {city &&
              REGIONS[city].map((districtName) => (
                <MenuItem key={districtName} value={districtName}>
                  {districtName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </CustomDiv>
    </BaseModal>
  );
};

export default FavoriteRegionModal;
