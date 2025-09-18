import { Skeleton } from '@chakra-ui/react';

export const PromotionsSkeleton = () => {
  return (
    <div className="promotions">
      <div className="promotions--wrapper">
        {[0, 1].map((i) => (
          <div className="promotions--bg" style={{ padding: 0 }} key={i}>
            <Skeleton height="100%" width="100%" borderRadius="8px" />
          </div>
        ))}
      </div>
      <div className="promotions--link">
        <Skeleton height="48px" width="240px" borderRadius="8px" />
      </div>
    </div>
  );
};
