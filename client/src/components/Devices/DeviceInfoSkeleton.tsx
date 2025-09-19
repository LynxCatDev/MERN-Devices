import { Skeleton } from '@chakra-ui/react';

export const DeviceInfoSkeleton = () => {
  return (
    <div className="device-product">
      <div className="device-product--wrapper">
        <div className="device-product--name">
          <Skeleton height="32px" width="60%" mb="16px" />
        </div>

        <div className="device-product--info">
          <div className="device-product--info-image">
            <Skeleton height="360px" borderRadius="16px" />
          </div>

          <div className="device-product--info-specifications">
            <div style={{ marginBottom: 16 }}>
              <Skeleton height="20px" width="150px" mb="8px" />
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton height="32px" width="32px" borderRadius="50%" />
                <Skeleton height="32px" width="32px" borderRadius="50%" />
                <Skeleton height="32px" width="32px" borderRadius="50%" />
                <Skeleton height="32px" width="32px" borderRadius="50%" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Skeleton height="20px" width="150px" mb="8px" />
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton height="32px" width="64px" borderRadius="8px" />
                <Skeleton height="32px" width="64px" borderRadius="8px" />
                <Skeleton height="32px" width="64px" borderRadius="8px" />
              </div>
            </div>

            <ul className="device-product--info-specs">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <Skeleton height="16px" width="100%" mb="10px" />
                </li>
              ))}
            </ul>

            <div className="options-devices">
              <Skeleton height="40px" width="100%" borderRadius="8px" />
              <Skeleton height="40px" width="100%" borderRadius="8px" />
            </div>
          </div>

          <div className="device-product--info-buy">
            <Skeleton height="32px" width="160px" mb="12px" />
            <Skeleton height="44px" width="200px" borderRadius="8px" mb="8px" />
            <Skeleton height="20px" width="120px" />
          </div>
        </div>
      </div>
    </div>
  );
};
