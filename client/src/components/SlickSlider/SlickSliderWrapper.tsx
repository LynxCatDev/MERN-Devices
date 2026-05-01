'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { SlidesProps } from '@/store/store.interface';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

import './SlickSlider.scss';

const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => m.SlickSlider),
  {
    ssr: false,
    loading: () => <SlickSliderSkeleton />,
  },
);

interface Props {
  slides?: SlidesProps[];
}

export const SlickSliderWrapper = ({ slides = [] }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <SlickSliderSkeleton />;

  return <SlickSlider initialSlides={slides} />;
};
