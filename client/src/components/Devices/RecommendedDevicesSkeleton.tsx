import { Skeleton, SkeletonText } from '@chakra-ui/react';

export const RecommendedDevicesSkeleton = () => {
  return (
    <div className="devices">
      <div className="devices--items">
        {[0, 1, 2, 3].map((i) => (
          <div className="device--item device--item--skeleton" key={i}>
            <Skeleton height="280px" borderRadius="16px 16px 0 0" />
            <div style={{ padding: '8px 24px' }}>
              <Skeleton height="20px" mb="8px" />
              <Skeleton height="18px" mb="8px" />
              <Skeleton height="18px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
