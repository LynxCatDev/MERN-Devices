'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

const SlickSlider = lazy(() =>
  import('@/components/SlickSlider/SlickSlider').then((m) => ({
    default: m.SlickSlider,
  })),
);

export const SlickSliderWrapper = () => {
  // const [showSlider, setShowSlider] = useState(false);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowSlider(true);
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, []);
  // return showSlider ? <SlickSlider /> : <SlickSliderSkeleton />;
  return (
    <Suspense fallback={<SlickSliderSkeleton />}>
      <SlickSlider />
    </Suspense>
  );
};
