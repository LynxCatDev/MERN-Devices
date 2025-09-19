'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

// client-only slider, no SSR HTML -> no hydration risk
const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => m.SlickSlider),
  { ssr: false },
);

// small “smart defer”: mount when visible OR after idle timeout
function useSmartDefer({ idle = 2500, rootMargin = '300px' } = {}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [idleOk, setIdleOk] = useState(false);

  useEffect(() => {
    if (!hostRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(hostRef.current);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    const id = window.requestIdleCallback?.(() => setIdleOk(true), {
      timeout: idle,
    });
    const t = setTimeout(() => setIdleOk(true), idle);
    return () => {
      if (id) window.cancelIdleCallback?.(id);
      clearTimeout(t);
    };
  }, [idle]);

  return { hostRef, shouldMount: visible || idleOk };
}

export function SlickSliderWrapper() {
  const { hostRef, shouldMount } = useSmartDefer({
    idle: 2500,
    rootMargin: '300px',
  });

  return (
    <div ref={hostRef} className="slick-wrapper">
      {shouldMount ? <SlickSlider /> : <SlickSliderSkeleton />}
    </div>
  );
}
