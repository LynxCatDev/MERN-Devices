'use client';

import { Skeleton } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { lazy, useEffect, useState } from 'react';

const SlickSlider = lazy(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => ({
      default: m.SlickSlider,
    })),
  // {
  //   ssr: false,
  //   loading: () => (
  //     <div className="slick-wrapper">
  //       <div className="slide-skeleton">
  //         <Skeleton
  //           height="100%"
  //           width="100%"
  //           position="absolute"
  //           top="0"
  //           left="0"
  //           borderRadius="md"
  //         />
  //       </div>
  //     </div>
  //   ),
  // },
);

export const SlickSliderWrapper = () => {
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlider(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return showSlider ? (
    <SlickSlider />
  ) : (
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
};
