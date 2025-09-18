import { Skeleton, SkeletonCircle } from '@chakra-ui/react';

export const CategoriesSkeleton = () => {
  const placeholders = Array.from({ length: 10 });
  return (
    <div className="categories">
      <div className="categories--wrapper">
        {placeholders.map((_, i) => (
          <div className="categories--card" key={i}>
            <div
              className="categories--img"
              style={{ width: 115, height: 115 }}
            >
              <SkeletonCircle size="115px" />
            </div>
            <Skeleton height="16px" width="80px" borderRadius="8px" />
          </div>
        ))}
      </div>
    </div>
  );
};
