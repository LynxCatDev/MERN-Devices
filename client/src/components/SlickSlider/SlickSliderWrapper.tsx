'use client';

import { Skeleton } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => m.SlickSlider),
  {
    ssr: false,
    loading: () => (
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
    ),
  },
);

export const SlickSliderWrapper = () => <SlickSlider />;
