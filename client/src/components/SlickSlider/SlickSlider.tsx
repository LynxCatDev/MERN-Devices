'use client';

import { apiBaseUrl } from '@/helpers/baseUrl';
import { useSlider } from '@/store/store';
import Slider, { Settings } from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useLocale } from 'next-intl';
import { NoData } from '../NoData/NoData';
import { ShowErrorMessage } from '../ShowErrorMessage/ShowErrorMessage';
import { SlickSliderSkeleton } from './SlickSliderSkeleton';
import { SlidesProps } from '@/store/store.interface';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './SlickSlider.scss';

interface Props {
  initialSlides?: SlidesProps[];
}

const getSlideImageUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;

  return `${apiBaseUrl}/${url.replace(/^\/+/, '')}`;
};

export const SlickSlider = ({ initialSlides }: Props = {}) => {
  const locale = useLocale();
  const hasInitialSlides = !!initialSlides && initialSlides.length > 0;

  const [slidesFromStore, getSlides, loading, error] = useSlider(
    useShallow((state) => [
      state.slides,
      state.getSlides,
      state.loading,
      state.error,
    ]),
  );

  useEffect(() => {
    if (hasInitialSlides) return;
    void getSlides();
  }, [getSlides, hasInitialSlides]);

  const slides = hasInitialSlides ? initialSlides : slidesFromStore;

  const settings: Settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 5000,
      lazyLoad: 'ondemand',
    }),
    [],
  );

  if (!hasInitialSlides && loading) return <SlickSliderSkeleton />;
  if (!hasInitialSlides && error)
    return (
      <div className="slick-wrapper">
        <ShowErrorMessage errorMessage={error} />
      </div>
    );
  if (!slides?.length)
    return (
      <div className="slick-wrapper">
        <NoData />
      </div>
    );

  return (
    <div className="slick-wrapper">
      {slides?.length > 0 && (
        <Slider {...settings}>
          {slides.map((slide, i) => (
            <Link
              href={`/${locale}/${slide.link}`}
              key={slide.id}
              prefetch={false}
            >
              <Image
                priority={false}
                src={getSlideImageUrl(slide.imgUrl)}
                alt={slide.altName}
                width={1400}
                height={520}
                sizes="(max-width: 576px) 100vw, (max-width: 1440px) calc(100vw - 32px), 1400px"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority="auto"
                quality={i === 0 ? 65 : 100}
              />
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};
