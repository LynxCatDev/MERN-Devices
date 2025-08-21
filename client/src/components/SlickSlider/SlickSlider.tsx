'use client';

import { apiBaseUrl } from '@/helpers/baseUrl';
import { useSlider } from '@/store/store';
import Slider, { Settings } from '@ant-design/react-slick';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Loading } from '../Loading/Loading';
import { NoData } from '../NoData/NoData';
import { ShowErrorMessage } from '../ShowErrorMessage/ShowErrorMessage';
import { useShallow } from 'zustand/react/shallow';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './SlickSlider.scss';
import { Skeleton } from '@chakra-ui/react';

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
            variant="shine"
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
          {slides.map((slide) => (
            <Link href={`/${locale}/${slide.link}`} key={slide.id}>
              <Image
                priority
                src={`${apiBaseUrl}/${slide.imgUrl}`}
                alt={slide.altName}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};
