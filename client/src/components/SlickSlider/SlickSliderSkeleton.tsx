import { Skeleton } from '@chakra-ui/react';

export const SlickSliderSkeleton = () => {
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
};
