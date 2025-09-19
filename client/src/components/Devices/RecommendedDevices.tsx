import Link from 'next/link';
import { DevicesDataProps } from '@/store/store.interface';
import { DevicesItem } from './DevicesItem';
import { devicesCards } from '@/constants/devicesCards';

interface Props {
  devices: DevicesDataProps;
  category: keyof typeof devicesCards;
  categoryTitle: string;
  productsLabel: string;
}

export const RecommendedDevices = ({
  devices,
  category,
  categoryTitle,
  productsLabel,
}: Props) => {
  const cardData = devicesCards[category];
  const devicesData = devices?.data;

  return (
    <div className="devices">
      {cardData && (
        <Link href={`/devices${cardData.link}`}>
          <div
            className="devices--banner"
            style={{ backgroundImage: `url(${cardData.imgUrl})` }}
          >
            {category && <h4>{categoryTitle}</h4>}
            {!!devicesData?.length && (
              <span>
                {devicesData?.length}+ {productsLabel}
              </span>
            )}
          </div>
        </Link>
      )}

      <div className="devices--items recommended-item">
        {!!devicesData?.length &&
          devicesData.map((device) => (
            <DevicesItem key={device.id} device={device} />
          ))}
      </div>
    </div>
  );
};
