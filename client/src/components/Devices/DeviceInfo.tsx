'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { DevicesProps } from '@/store/store.interface';
import { PRODUCT_PROPERTY } from '@/constants/devicesSpecs';
import { MAX_COMPARE_DEVICES } from '@/constants/compare';
import { formatDevicePropertyValue, hasDevicePropertyValue } from '@/helpers';
import { Icon } from '../Icon/Icon';
import { useCompare, useUser } from '@/store/store';
import { DeviceImageGallery } from './DeviceImageGallery';
import { toaster } from '../Toaster/Toaster';

import './DeviceInfo.scss';

interface DeviceInfoProps {
  device: DevicesProps;
  galleryImages?: string[];
}

export const DeviceInfo = ({
  device,
  galleryImages = [],
}: DeviceInfoProps) => {
  if (!device) {
    return null;
  }

  const t = useTranslations('Devices');
  const tCategories = useTranslations('Categories');
  const tNotifications = useTranslations('Notifications');
  const [mounted, setMounted] = useState(false);
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
  const deviceColors = Array.isArray(device.colors) ? device.colors : [];
  const memoryOptions = Array.isArray(device.memoryOptions)
    ? device.memoryOptions
    : [];
  const normalizedDeviceColor =
    typeof device.color === 'string' ? device.color.toLowerCase() : '';

  const activeAddToFavorites = activeFavoritesIds?.some(
    (favoriteId) => favoriteId === device.id,
  );
  const activeAddToCompare = compareDevices?.some(
    (compareDevice) => compareDevice.id === device.id,
  );

  const findProperties = useMemo(
    () =>
      Object.keys(PRODUCT_PROPERTY).filter((property) =>
        hasDevicePropertyValue(device, property),
      ),
    [device],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const redirectDeviceColors = (color: string) => {
    if (deviceColors.length === 1) {
      return `/device/${device.link}`;
    }

    if (!memoryOptions.length) {
      return `/device/${device.link
        .split('-')
        .slice(0, -1)
        .join('-')}-${color}`;
    }

    return `/device/${device.link.split('-').slice(0, -3).join('-')}-${
      device.hardDrive
    }-gb-${color}`;
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

  const handleFavorites = () => {
    if (!profile?.user) {
      handleInformUser('favorites');
      return;
    }

    addToFavorites(device.id);
  };

  return (
    <div className="device-product">
      <div className="device-product--wrapper">
        <div className="device-product--name">
          <h1>{device.name}</h1>
        </div>

        <div className="device-product--info">
          <div className="device-product--info-image">
            <DeviceImageGallery deviceName={device.name} images={galleryImages} />
          </div>

          <div className="device-product--info-specifications">
            {deviceColors.length > 0 && (
              <div className="device-product--options-colors">
                <span>{t('color')}</span>
                <div className="device-product--options-colors-wrapper">
                  {deviceColors.map((color, key) => (
                    <Link href={redirectDeviceColors(color)} key={key}>
                      <div
                        className={
                          normalizedDeviceColor.includes(color.toLowerCase())
                            ? 'device-color is-active'
                            : 'device-color'
                        }
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {memoryOptions.length > 0 && (
              <div className="device-product--options-memory">
                <span>{t('memory_mob')}</span>
                <div className="device-product--options-memory-wrapper">
                  {memoryOptions.map((memory, key) => (
                    <Link
                      href={
                        memoryOptions.length === 1
                          ? `/device/${device.link}`
                          : `/device/${device.link
                              .split('-')
                              .slice(0, -3)
                              .join(
                                '-',
                              )}-${memory}-gb-${normalizedDeviceColor}`
                      }
                      key={key}
                    >
                      <div
                        className={
                          memory === device.hardDrive
                            ? 'memory-option is-selected'
                            : 'memory-option'
                        }
                      >
                        {memory} GB
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <ul className="device-product--info-specs">
              {findProperties.map((property, i) => (
                <li key={property}>
                  {t(`${property}`)} :{' '}
                  {formatDevicePropertyValue(device, property, t)}
                </li>
              ))}
            </ul>

            <div className="options-devices">
              <div className="compare-devices">
                <Button
                  size="xl"
                  onClick={handleCompare}
                  className={
                    mounted && activeAddToCompare ? 'added-to-compare' : ''
                  }
                  aria-pressed={Boolean(mounted && activeAddToCompare)}
                >
                  <Icon type="compare" />
                  {tCategories('compare')}
                </Button>
              </div>
              <div className="add-to-favorites">
                <Button
                  onClick={handleFavorites}
                  className={
                    mounted && activeAddToFavorites ? 'added-to-favorites' : ''
                  }
                  aria-pressed={Boolean(mounted && activeAddToFavorites)}
                >
                  <Icon type="heart" />
                  {tCategories('favorites')}
                </Button>
              </div>
            </div>
          </div>

          <div className="device-product--info-buy">
            {device.price && (
              <div className="device-product--info-price">
                {`${device.price} ${tCategories('lei')}`}
              </div>
            )}
            <Link href={`/checkout`} className="device-product--buy">
              {tCategories('buy')}
            </Link>
            {device.credit && (
              <div className="device-product--info-credit">{`${
                device.credit
              } ${tCategories('credit')}`}</div>
            )}
            {device.cashback && (
              <div className="device-product--info-cashback">{`Cashback ${
                device.cashback
              } ${tCategories('lei')}`}</div>
            )}
            {device.credit && (
              <Link href={`/credit`} className="device-product--credit">
                {tCategories('buy_credit')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
