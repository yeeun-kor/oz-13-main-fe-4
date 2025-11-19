import { useRef, useCallback } from 'react';

/**
 * lazy loading을 위한  IntersectionOberserver 훅
 * usage :: 사용해야 하는 img 태그에 ref={refCallback} 과 data-src 속성 추가
 * @returns ref 콜백 함수
 */
export const useIntersectionObserver = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((el: HTMLImageElement | null) => {
    if (!el) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const dataSrc = img.getAttribute('data-src');
              if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute('data-src');
                observerRef.current?.unobserve(img);
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px 0px' }
      );
    }

    const dataSrc = el.getAttribute('data-src');
    const srcAttr = el.getAttribute('src');
    if (dataSrc && (!srcAttr || srcAttr === '' || srcAttr.startsWith('data:'))) {
      observerRef.current.observe(el);
    }
  }, []);

  return observe;
};
