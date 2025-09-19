'use client';

import dynamic from 'next/dynamic';
import { lazy, Suspense, useEffect, useState } from 'react';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

const SlickSlider = lazy(() =>
  import('@/components/SlickSlider/SlickSlider').then((m) => ({
    default: m.SlickSlider,
  })),
);

export const SlickSliderWrapper = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        idleId = (window as any).requestIdleCallback(() => setShow(true), {
          timeout: 2000,
        });
      } else {
        timeoutId = setTimeout(() => setShow(true), 2000);
      }
    };
    schedule();
    return () => {
      if (idleId && (window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  return show ? (
    <Suspense fallback={<SlickSliderSkeleton />}>
      <SlickSlider />
    </Suspense>
  ) : (
    <SlickSliderSkeleton />
  );
};
