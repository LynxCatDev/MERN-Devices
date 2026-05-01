'use client';

import dynamic from 'next/dynamic';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => m.SlickSlider),
  {
    ssr: false,
    loading: () => <SlickSliderSkeleton />,
  },
);

export const SlickSliderWrapper = () => <SlickSlider />;
