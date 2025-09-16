'use client';

import { apiBaseUrl } from '@/helpers/baseUrl';
import { useSlider } from '@/store/store';
import Slider, { Settings } from '@ant-design/react-slick';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { useShallow } from 'zustand/react/shallow';
import { NoData } from '../NoData/NoData';
import { ShowErrorMessage } from '../ShowErrorMessage/ShowErrorMessage';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './SlickSlider.scss';

export const SlickSlider = () => {
  const locale = useLocale();
  const [slides, getSlides, loading, error] = useSlider(
    useShallow((state) => [
      state.slides,
      state.getSlides,
      state.loading,
      state.error,
    ]),
  );

  useEffect(() => {
    getSlides();
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    lazyLoad: 'ondemand',
  };

  if (loading)
    return (
      <div className="slick-wrapper">
        <div className="slide-skeleton">
          <Skeleton
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            borderRadius="md"
          />
        </div>
      </div>
    );
  if (error)
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
            <Link href={`/${locale}/${slide.link}`} key={slide.id}>
              <Image
                priority={i === 0}
                src={`${apiBaseUrl}/${slide.imgUrl}`}
                alt={slide.altName}
                fill={false}
                width={1400}
                height={520}
                sizes="(min-width:1024px) 1200px, 100vw"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};
