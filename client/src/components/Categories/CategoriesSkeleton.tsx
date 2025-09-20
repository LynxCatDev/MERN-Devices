import { Skeleton } from '@chakra-ui/react';
import './Categories.scss';

export const CategoriesSkeleton = () => {
  const placeholders = Array.from({ length: 10 });
  return (
    <div className="categories">
      <div className="categories--wrapper">
        {placeholders.map((_, i) => (
          <div className="categories--card" key={i}>
            <div className="categories--img categories--img-skeleton">
              <Skeleton borderRadius="50%" width="100%" height="100%" />
            </div>
            <div className="categories--title">
              <Skeleton height="1em" width="80px" borderRadius="8px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
