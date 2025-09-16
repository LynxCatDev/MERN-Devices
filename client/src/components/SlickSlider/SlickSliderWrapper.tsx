'use client';

import dynamic from 'next/dynamic';

const SlickSlider = dynamic(
  () =>
    import('@/components/SlickSlider/SlickSlider').then((m) => m.SlickSlider),
  {
    ssr: false,
    loading: () => (
      <div className="slick-wrapper">
        <div
          className="slide-skeleton"
          style={{ paddingTop: '37%', position: 'relative' }}
        />
      </div>
    ),
  },
);

export const SlickSliderWrapper = SlickSlider;
