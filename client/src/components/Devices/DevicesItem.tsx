import { checkImageUrl } from '@/helpers';
import { useUser } from '@/store/store';
import { DevicesProps } from '@/store/store.interface';
import { Button } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Icon } from '../Icon/Icon';
import './Devices.scss';

interface DeviceItemProps {
  device: DevicesProps;
}

export const DevicesItem = ({ device }: DeviceItemProps) => {
  const locale = useLocale();
  const t = useTranslations('Categories');
  const [imgSrc, setImgSrc] = useState(checkImageUrl(device?.imageUrl));
  const [activeFavoritesIds, addToFavorites, loading, error] = useUser(
    useShallow((state) => [
      state.activeFavoritesIds,
      state.addToFavorites,
      state.loading,
      state.error,
    ]),
  );
  const activeAddToFavorites = activeFavoritesIds?.find(
    (favoriteId) => favoriteId === device.id,
  );

  const handleImageError = () => {
    setImgSrc('/images/placeholder.webp');
  };

  return (
    <div className="device--item">
      {device && (
        <>
          <Link href={`/${locale}/device/${device.link}`}>
            <Image
              src={imgSrc}
              alt={device?.name}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              priority
              onError={handleImageError}
            />
          </Link>
          <Link href={`/${locale}/device/${device.link}`}>
            <div className="device--title">{device.name}</div>
          </Link>
          <div className="device--price-wrapper options-devices-card-wrapper">
            <div className="device--price">
              {device.credit && (
                <span>
                  {device.credit} {t('credit')}
                </span>
              )}

              <h5>
                {device.price} {t('lei')}
              </h5>

              {device.cashback && (
                <span>
                  Cashback {device.cashback} {t('lei')}
                </span>
              )}
            </div>
            <div className="options-devices">
              <div className="compare-devices">
                <Button
                // onClick={() => addToCompare(product)}
                // className={userCompareFind ? 'added-to-compare' : ''}
                >
                  <Icon type="compare" />
                </Button>
                <div className="options-devices-info compare-info">
                  {t('compare')}
                </div>
              </div>
              <div className="add-to-favorites">
                <Button
                  onClick={() => addToFavorites(device.id)}
                  id={activeAddToFavorites ? 'added-to-favorites' : ''}
                >
                  <Icon type="heart" />
                </Button>
                <div className="options-devices-info favorites-info">
                  {t('favorites')}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
