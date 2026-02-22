'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => m.SlickSlider),
  {
    ssr: false,
    loading: () => <SlickSliderSkeleton />,
  },
);

export const SlickSliderWrapper = () => {
  const [showSlider, setShowSlider] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSlider) return;
    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowSlider(true); // triggers lazy() download only when near view
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' }, // start a bit early
    );

    io.observe(el);
    return () => io.disconnect();
  }, [showSlider]);

  return (
    <div ref={hostRef}>
      {showSlider ? (
        <SlickSlider />
      ) : (
        <SlickSliderSkeleton />
      )}
    </div>
  );
};
