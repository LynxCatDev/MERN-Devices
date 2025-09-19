import { Skeleton } from '@chakra-ui/react';

interface Props {
  itemsLength?: number;
}

export const RecommendedDevicesSkeleton = ({ itemsLength = 4 }: Props) => {
  return (
    <div className="devices">
      <div className="devices--items">
        {[...Array(itemsLength)].map((_, i) => (
          <div className="device--item device--item--skeleton" key={i}>
            <Skeleton height="280px" borderRadius="16px 16px 0 0" />
            <div style={{ padding: '8px 24px' }}>
              <Skeleton height="24px" mb="8px" />
              <Skeleton height="20px" mb="8px" />
              <Skeleton height="20px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
