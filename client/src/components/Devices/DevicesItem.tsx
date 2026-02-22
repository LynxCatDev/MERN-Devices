'use client';

import { checkImageUrl } from '@/helpers';
import { MAX_COMPARE_DEVICES } from '@/constants/compare';
import { useCompare, useUser } from '@/store/store';
import { DevicesProps } from '@/store/store.interface';
import { Button } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Icon } from '../Icon/Icon';
import './Devices.scss';
import { toaster } from '../Toaster/Toaster';

interface DeviceItemProps {
  device: DevicesProps;
  priority?: boolean;
}

export const DevicesItem = ({ device, priority = false }: DeviceItemProps) => {
  const t = useTranslations('Categories');
  const tNotifications = useTranslations('Notifications');
  const [imgSrc, setImgSrc] = useState(checkImageUrl(device?.imageUrl));
  const [profile, activeFavoritesIds, addToFavorites] = useUser(
    useShallow((state) => [
      state.profile,
      state.activeFavoritesIds,
      state.addToFavorites,
    ]),
  );
  const [compareDevices, toggleCompare] = useCompare(
    useShallow((state) => [state.compareDevices, state.toggleCompare]),
  );
  const activeAddToFavorites = activeFavoritesIds?.some(
    (favoriteId) => favoriteId === device.id,
  );
  const activeAddToCompare = compareDevices?.some(
    (compareDevice) => compareDevice.id === device.id,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageError = () => {
    setImgSrc('/images/placeholder.webp');
  };

  const handleInformUser = (type: 'compare' | 'favorites') => {
    toaster.create({
      title: tNotifications(`login_required_${type}`),
      type: 'info',
      duration: 4000,
    });
  };

  const handleCompare = () => {
    if (!profile?.user) {
      handleInformUser('compare');
      return;
    }

    if (!activeAddToCompare && compareDevices.length >= MAX_COMPARE_DEVICES) {
      toaster.create({
        title: tNotifications('compare_limit', { count: MAX_COMPARE_DEVICES }),
        type: 'warning',
        duration: 4000,
      });
      return;
    }

    toggleCompare(device);
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
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
                  onClick={handleCompare}
                  id={
                    mounted && activeAddToCompare ? 'added-to-compare' : undefined
                  }
                  aria-pressed={Boolean(mounted && activeAddToCompare)}
                >
                  <Icon type="compare" />
                </Button>
                <div className="options-devices-info compare-info">
                  {t('compare')}
                </div>
              </div>
              <div className="add-to-favorites">
                <Button
                  onClick={
                    profile?.user
                      ? () => addToFavorites(device.id)
                      : () => handleInformUser('favorites')
                  }
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
