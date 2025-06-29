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

      {slides?.length === 0 && !loading && <NoData />}

      {loading && <Loading />}

      {error && <ShowErrorMessage errorMessage={error} />}
    </div>
  );
};
