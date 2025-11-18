import { BoxProps } from '@mui/material';
import { useEffect, useRef } from 'react';

interface UseDragScrollOptions {
  direction?: 'horizontal' | 'vertical' | 'both';
  sensitivity?: number;
  wheelSensitivity?: number;
  disabled?: boolean;
}

/**
 * 드래그 무브 구현
 * @description
 * MouseDown, MouseMove = 마우스를 클릭하고 이동하는 동작
 * MouseUp, MouseLeave = 마우스 드래그를 종료하는 동작
 * 해당 이벤트에 대한 좌표값으로 화면 움직임 구현
 * !마우스가 해당 영역 안에 있는 경우 휠 이벤트도 추가
 * 클릭(터치) + 휠 동작
 * @param options
 * direction: 이벤트가 동작할 방향(horizontal | vertical | both)
 * sensitivity: 마우스 동작으로 화면이 움직이는 민감도(number)
 * wheelSensitivity: 휠 동작 민감도(number)
 * disabled: 해당 이벤트 비활성화(boolean)
 */
export const useDragScroll = (options: UseDragScrollOptions = {}) => {
  const {
    direction = 'horizontal',
    sensitivity = 2,
    wheelSensitivity = 1,
    disabled = false,
  } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);
  // 휠 이벤트 리스너
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || disabled) return;

    const handleWheel = (e: WheelEvent) => {
      const canScrollHorizontally = element.scrollWidth > element.clientWidth;
      const canScrollVertically = element.scrollHeight > element.clientHeight;

      if (direction === 'horizontal' && canScrollHorizontally) {
        e.preventDefault();
        e.stopPropagation();
        element.scrollLeft += e.deltaY * wheelSensitivity;
      } else if (direction === 'vertical' && canScrollVertically) {
        e.preventDefault();
        e.stopPropagation();
        element.scrollTop += e.deltaY * wheelSensitivity;
      } else if (direction === 'both') {
        e.preventDefault();
        e.stopPropagation();
        element.scrollLeft += e.deltaX * wheelSensitivity;
        element.scrollTop += e.deltaY * wheelSensitivity;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [direction, wheelSensitivity, disabled]);

  const handleMouseDown: BoxProps['onMouseDown'] = (e) => {
    if (disabled || !scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollTop.current = scrollRef.current.scrollTop;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.scrollBehavior = 'auto';
  };
  const handleMouseMove: BoxProps['onMouseMove'] = (e) => {
    if (!isDragging.current || !scrollRef.current || disabled) return;

    e.preventDefault();
    e.stopPropagation();

    if (direction === 'horizontal' || direction === 'both') {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const moveX = (x - startX.current) * sensitivity;
      scrollRef.current.scrollLeft = scrollLeft.current - moveX;
    }
    if (direction === 'vertical' || direction === 'both') {
      const y = e.pageY - scrollRef.current.offsetTop;
      const walkY = (y - startY.current) * sensitivity;
      scrollRef.current.scrollTop = scrollTop.current - walkY;
    }
  };
  const handleMouseUp: BoxProps['onMouseUp'] = () => {
    if (disabled) return;
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };
  const handleMouseLeave: BoxProps['onMouseLeave'] = () => {
    if (disabled) return;
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };
  return {
    scrollRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
};
