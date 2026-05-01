'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { type ComponentType, useEffect, useState } from 'react';
import { apiBaseUrl } from '@/helpers/baseUrl';
import { SlidesProps } from '@/store/store.interface';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';

import './SlickSlider.scss';

interface Props {
  slides?: SlidesProps[];
}

type SliderComponent = ComponentType<{ initialSlides?: SlidesProps[] }>;
type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const getSlideImageUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;

  return `${apiBaseUrl}/${url.replace(/^\/+/, '')}`;
};

export const SlickSliderWrapper = ({ slides = [] }: Props) => {
  const locale = useLocale();
  const [Slider, setSlider] = useState<SliderComponent | null>(null);
  const firstSlide = slides[0];

  useEffect(() => {
    const browserWindow = window as IdleWindow;

    const loadSlider = () => {
      void import('@/components/SlickSlider/SlickSlider').then((module) => {
        setSlider(() => module.SlickSlider);
      });
    };

    if (browserWindow.requestIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(loadSlider, {
        timeout: 3000,
      });

      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(loadSlider, 1800);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!firstSlide) return <SlickSliderSkeleton />;

  if (Slider) return <Slider initialSlides={slides} />;

  return (
    <div className="slick-wrapper">
      <Link
        href={`/${locale}/${firstSlide.link.replace(/^\/+/, '')}`}
        prefetch={false}
        className="slick-static"
      >
        <Image
          src={getSlideImageUrl(firstSlide.imgUrl)}
          alt={firstSlide.altName}
          width={1400}
          height={520}
          sizes="(max-width: 576px) 100vw, (max-width: 1440px) calc(100vw - 32px), 1400px"
          priority
          fetchPriority="high"
          quality={65}
        />
      </Link>
    </div>
  );
};
