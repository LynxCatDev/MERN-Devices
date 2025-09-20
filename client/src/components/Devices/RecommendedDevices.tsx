import Link from 'next/link';
import Image from 'next/image';
import { DevicesDataProps } from '@/store/store.interface';
import { devicesCards } from '@/constants/devicesCards';
import { DevicesItem } from './DevicesItem';

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
        <Link href={`/devices${cardData.link}`} prefetch={false}>
          <div className="devices--banner">
            <Image
              src={cardData.imgUrl}
              alt={category}
              fill
              sizes="(max-width: 992px) 100vw, 25vw"
              className="devices--banner-img"
              priority={category === 'smartphones'}
              loading={category === 'smartphones' ? 'eager' : 'lazy'}
            />
            {category && <h2>{categoryTitle}</h2>}
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
            <DevicesItem
              key={device.id}
              device={device}
              priority={category === 'smartphones'}
            />
          ))}
      </div>
    </div>
  );
};
