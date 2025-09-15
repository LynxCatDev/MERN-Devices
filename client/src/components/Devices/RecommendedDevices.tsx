import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { DevicesDataProps } from '@/store/store.interface';
import { DevicesItem } from './DevicesItem';
import { devicesCards } from '@/constants/devicesCards';

interface Props {
  devices: DevicesDataProps;
  category: keyof typeof devicesCards;
}

export const RecommendedDevices = ({ devices, category }: Props) => {
  const t = useTranslations('Categories');
  const tDevices = useTranslations('Devices');
  const locale = useLocale();
  const cardData = devicesCards[category];
  const devicesData = devices?.data;

  return (
    <div className="devices">
      {cardData && (
        <Link href={`/${locale}/devices${cardData.link}`}>
          <div
            className="devices--banner"
            style={{ backgroundImage: `url(${cardData.imgUrl})` }}
          >
            {category && <h4>{t(`${category}`)}</h4>}
            {!!devicesData?.length && (
              <span>
                {devicesData?.length}+ {tDevices('products')}
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
