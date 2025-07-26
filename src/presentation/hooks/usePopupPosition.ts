import { useState, useEffect } from 'react';

interface PopupPosition {
  top: number;
  left: number;
  width: number;
}

const POPUP_OFFSET = 120;

const calculatePosition = (element: HTMLElement): PopupPosition => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - POPUP_OFFSET,
    left: rect.left,
    width: rect.width,
  };
};

export const usePopupPosition = (element: HTMLElement | null, isVisible: boolean) => {
  const [position, setPosition] = useState<PopupPosition>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!element || !isVisible) return;

    const updatePosition = () => {
      requestAnimationFrame(() => {
        setPosition(calculatePosition(element));
      });
    };

    // Initial position
    updatePosition();

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(element);

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [element, isVisible]);

  return position;
};