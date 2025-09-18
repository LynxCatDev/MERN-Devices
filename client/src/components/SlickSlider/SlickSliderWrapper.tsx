'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => ({
      default: m.SlickSlider,
    })),
  { ssr: false, loading: () => <SlickSliderSkeleton /> },
);

export const SlickSliderWrapper = () => {
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlider(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  return showSlider ? <SlickSlider /> : <SlickSliderSkeleton />;
};
