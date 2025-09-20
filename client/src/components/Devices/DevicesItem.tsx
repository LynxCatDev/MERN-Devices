'use client';

import { checkImageUrl } from '@/helpers';
import { useUser } from '@/store/store';
import { DevicesProps } from '@/store/store.interface';
import { Button } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Icon } from '../Icon/Icon';
import './Devices.scss';

interface DeviceItemProps {
  device: DevicesProps;
  priority?: boolean;
}

export const DevicesItem = ({ device, priority = false }: DeviceItemProps) => {
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageError = () => {
    setImgSrc('/images/placeholder.webp');
  };

  return (
    <div className="device--item">
      {device && (
        <>
          <Link
            href={`/device/${device.link}`}
            aria-label={device.name}
            prefetch={false}
          >
            <Image
              src={imgSrc}
              alt={device.name}
              width={321}
              height={321}
              style={{ width: '100%', height: 'auto' }}
              onError={handleImageError}
              priority={priority}
              fetchPriority={priority ? 'high' : 'auto'}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          </Link>
          <Link href={`/device/${device.link}`} prefetch={false}>
            <div className="device--title">{device.name}</div>
          </Link>
          <div className="device--price-wrapper options-devices-card-wrapper">
            <div className="device--price">
              <h3>
                {device.price} {t('lei')}
              </h3>

              {device.credit && (
                <span>
                  {device.credit} {t('credit')}
                </span>
              )}

              {device.cashback && (
                <span>
                  Cashback {device.cashback} {t('lei')}
                </span>
              )}
            </div>
            <div className="options-devices">
              <div className="compare-devices">
                <Button
                  aria-label={t('compare')}
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
                  id={
                    mounted && activeAddToFavorites
                      ? 'added-to-favorites'
                      : undefined
                  }
                  aria-label={t('favorites')}
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
