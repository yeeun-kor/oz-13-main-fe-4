import { IoImageOutline } from 'react-icons/io5';
import * as styles from './DiaryModal.styles';
import { Box, TextField } from '@mui/material';
import { DiaryModalFieldsProps } from '../types/types';
import { SiAccuweather } from 'react-icons/si';
import { EMOTIONS } from '../constants/emotions';
import { useEffect, useRef } from 'react';

const DiaryModalFields = ({
  handleImage,
  preview,
  handleTitle,
  diary,
  errors,
  handleEmotion,
  handleNotes,
  disabled,
}: DiaryModalFieldsProps) => {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && titleRef.current) {
      titleRef.current.focus();
    }
  }, [disabled]);

  return (
    <>
      {/* 이미지 */}
      <div css={styles.imageContainer}>
        <input
          type='file'
          accept='image/*'
          id='upload-input'
          onChange={handleImage}
          css={styles.fileInput}
          disabled={disabled}
        />
        <label htmlFor='upload-input' css={styles.imageLabel}>
          {preview ? (
            <img src={preview!} alt='미리보기' width={'100%'} css={styles.previewImage} />
          ) : diary.image_url ? (
            <img src={diary.image_url} alt='저장된 이미지' />
          ) : (
            <div css={styles.uploadPlaceholder}>
              <IoImageOutline />
              <span>사진 추가하기</span>
            </div>
          )}
        </label>
      </div>

      {/* 제목 */}
      <Box css={styles.titleWrapper}>
        <TextField
          fullWidth
          id='diary-title'
          label='제목'
          variant='standard'
          onChange={handleTitle}
          error={!!errors?.title}
          helperText={errors?.title || ''}
          value={diary.title}
          disabled={disabled}
          inputRef={titleRef}
          css={styles.disabledTextField}
        />
      </Box>

      {/* 날씨 */}
      <div css={styles.weatherSection}>
        <SiAccuweather css={styles.weatherIcon} />
        <div css={styles.weatherText}>
          <h3>{diary.weather.temperature}°C</h3>
          <p>{diary.weather.condition}</p>
        </div>
      </div>

      {/* 기분 */}
      <div css={styles.emotionSection}>
        <div css={styles.emotionTitle}>오늘의 기분</div>
        <div css={styles.emotionContainer}>
          {EMOTIONS.map((emotion, index) => (
            <button
              key={index}
              type='button'
              css={[
                styles.emotionButton,
                diary.emotion === emotion.name && styles.emotionButtonSelected,
              ]}
              onClick={() => handleEmotion(index)}
              disabled={disabled}
            >
              <img src={emotion.icon} alt={emotion.name} />
            </button>
          ))}
        </div>
      </div>

      {/* 내용 */}
      <Box css={styles.inputWrapper}>
        <TextField
          fullWidth
          id='diary-content'
          label='일기 작성'
          multiline
          rows={4}
          onChange={handleNotes}
          error={!!errors?.notes}
          helperText={errors?.notes || ''}
          value={diary.notes}
          disabled={disabled}
          css={styles.disabledTextField}
        />
      </Box>
    </>
  );
};

export default DiaryModalFields;
