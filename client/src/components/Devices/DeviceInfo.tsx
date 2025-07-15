'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';
import { DevicesProps } from '@/store/store.interface';
import { PRODUCT_PROPERTY } from '@/constants/devicesSpecs';
import { checkImageUrl } from '@/helpers';
import { Icon } from '../Icon/Icon';
import { useUser } from '@/store/store';

import './DeviceInfo.scss';

interface DeviceInfoProps {
  device: DevicesProps;
}

export const DeviceInfo = ({ device }: DeviceInfoProps) => {
  const [imgSrc, setImgSrc] = useState(checkImageUrl(device?.imageUrl));
  const t = useTranslations('Devices');
  const tCategories = useTranslations('Categories');
  const locale = useLocale();
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
  const findProperties = Object.keys(PRODUCT_PROPERTY).filter((property) => {
    return device?.[property];
  });

  const redirectDeviceColors = (color: string) => {
    if (device.colors.length === 1) {
      return `/${locale}/device/${device.link}`;
    } else if (!device.memoryOptions.length) {
      return `/${locale}/device/${device.link
        .split('-')
        .slice(0, -1)
        .join('-')}-${color}`;
    } else {
      return `/${locale}/device/${device.link
        .split('-')
        .slice(0, -3)
        .join('-')}-${device.hardDrive}-gb-${color}`;
    }
  };

  const checkDeviceProperties = (property: string) => {
    if (property === 'camera' || property === 'frontCamera') {
      return `${device[property]} mpx`;
    }
    if (property === 'resolution') {
      return `${device[property]} px`;
    }
    if (
      property === 'memory' ||
      property === 'hardDrive' ||
      property === 'videoCardMemory'
    ) {
      return `${device[property]} GB`;
    }
    if (property === 'weight') {
      if (device[property].toString().split('').length >= 4) {
        return `${(device[property] * 0.001).toFixed(1)} ${t('kilogram')}`;
      } else {
        return `${device[property]} ${t('gram')}`;
      }
    }
    if (property === 'supportedWeight') {
      return `${device[property]} ${t('kilogram')}`;
    }
    if (
      property === 'touchScreen' ||
      property === 'microphone' ||
      property === 'coldAir'
    ) {
      if (device[property]) {
        return t('true');
      }
      return t('false');
    }
    if (property === 'chargingTime' || property === 'workingTimeHours') {
      return `${device[property]} ${t('hours')}`;
    }
    if (property === 'workingTimeDays') {
      return `${device[property]} ${t('days')}`;
    }
    if (property === 'batteryCapacity') {
      return `${device[property]} mah`;
    }
    if (
      property === 'audioFormats' ||
      property === 'interface' ||
      property === 'memoryCard'
    ) {
      return device[property]?.join(', ');
    }
    if (property === 'maxSpeed' || property === 'electricRange') {
      return `${device[property]} km/h`;
    }
    if (property === 'sensitivity') {
      return `${device[property]} dB`;
    }
    if (property === 'impedance') {
      return `${device[property]} Ω`;
    }
    if (property === 'wheelDiameter' || property === 'frameDiameter') {
      return `${device[property]}"`;
    }
    if (
      property === 'material' ||
      property === 'rimMaterial' ||
      property === 'frameMaterial'
    ) {
      return `${t(`${device[property]}`)}`;
    }
    return device[property];
  };

  const handleImageError = () => {
    setImgSrc('/images/placeholder.webp');
  };

  return (
    <div className="device-product">
      <div className="device-product--wrapper">
        <div className="device-product--name">
          <h1>{device?.name}</h1>
        </div>

        <div className="device-product--info">
          <div className="device-product--info-image">
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
          </div>

          <div className="device-product--info-specifications">
            {device?.colors?.length > 0 && (
              <div className="device-product--options-colors">
                <span>{t('color')}</span>
                <div className="device-product--options-colors-wrapper">
                  {device.colors.map((color, key) => (
                    <Link href={redirectDeviceColors(color)} key={key}>
                      <div
                        className={
                          device.color.toLowerCase().match(color)
                            ? 'device-color is-active'
                            : 'device-color'
                        }
                        style={{
                          backgroundColor: Object.values(color).join(''),
                        }}
                      ></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {device?.memoryOptions?.length > 0 && (
              <div className="device-product--options-memory">
                <span>{t('memory_mob')}</span>
                <div className="device-product--options-memory-wrapper">
                  {device.memoryOptions.map((memory, key) => (
                    <Link
                      href={
                        device.memoryOptions.length === 1
                          ? `/${locale}/device/${device.link}`
                          : `/${locale}/device/${device.link
                              .split('-')
                              .slice(0, -3)
                              .join(
                                '-',
                              )}-${memory}-gb-${device.color.toLowerCase()}`
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
                <li key={i}>
                  {t(`${property}`)} : {checkDeviceProperties(property)}
                </li>
              ))}
            </ul>

            <div className="options-devices">
              <div className="compare-devices">
                <Button
                  size="full-width"
                  // onClick={() => addToCompare(deviceData)}
                  // className={userCompareFind ? 'added-to-compare' : ''}
                >
                  <Icon type="compare" />
                  {tCategories('compare')}
                </Button>
              </div>
              <div className="add-to-favorites">
                <Button
                  onClick={() => addToFavorites(device.id)}
                  id={activeAddToFavorites ? 'added-to-favorites' : ''}
                >
                  <Icon type="heart" />
                  {tCategories('favorites')}
                </Button>
              </div>
            </div>
          </div>

          <div className="device-product--info-buy">
            {device?.price && (
              <div className="device-product--info-price">
                {`${device.price} ${tCategories('lei')}`}
              </div>
            )}
            <Link href={`/${locale}/checkout`} className="device-product--buy">
              {tCategories('buy')}
            </Link>
            {device?.credit && (
              <div className="device-product--info-credit">{`${
                device.credit
              } ${tCategories('credit')}`}</div>
            )}
            {device?.cashback && (
              <div className="device-product--info-cashback">{`Cashback ${
                device.cashback
              } ${tCategories('lei')}`}</div>
            )}
            {device?.credit && (
              <Link
                href={`/${locale}/credit`}
                className="device-product--credit"
              >
                {tCategories('buy_credit')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
