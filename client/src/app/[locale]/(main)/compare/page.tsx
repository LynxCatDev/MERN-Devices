'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/react/shallow';
import { NoData } from '@/components';
import { MAX_COMPARE_DEVICES } from '@/constants/compare';
import { PRODUCT_PROPERTY } from '@/constants/devicesSpecs';
import {
  checkImageUrl,
  formatDevicePropertyValue,
  hasDevicePropertyValue,
} from '@/helpers';
import { useCompare, useUser } from '@/store/store';

import './page.scss';

const ComparePage = () => {
  const tDevices = useTranslations('Devices');
  const tCategories = useTranslations('Categories');
  const tCompare = useTranslations('Compare');
  const [hydrated, setHydrated] = useState(false);

  const [compareDevices, removeFromCompare, clearCompare] = useCompare(
    useShallow((state) => [
      state.compareDevices,
      state.removeFromCompare,
      state.clearCompare,
    ]),
  );
  const [profile] = useUser(useShallow((state) => [state.profile]));

  useEffect(() => {
    setHydrated(useCompare.persist.hasHydrated());

    const unsubscribe = useCompare.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    void useCompare.persist.rehydrate();

    return unsubscribe;
  }, []);

  const compareProperties = useMemo(
    () =>
      Object.keys(PRODUCT_PROPERTY).filter((property) =>
        compareDevices.some((device) => hasDevicePropertyValue(device, property)),
      ),
    [compareDevices],
  );

  return (
    <section className="compare-page">
      <div className="compare-page__header">
        <div>
          <h1>{tCompare('title')}</h1>
          <p>{tCompare('subtitle', { max: MAX_COMPARE_DEVICES })}</p>
        </div>
        <div className="compare-page__actions">
          <span className="compare-page__count">
            {tCompare('selected_count', {
              count: compareDevices.length,
              max: MAX_COMPARE_DEVICES,
            })}
          </span>
          {compareDevices.length > 0 && (
            <Button
              size="sm"
              onClick={clearCompare}
              className="compare-page__clear"
            >
              {tCompare('clear')}
            </Button>
          )}
        </div>
      </div>

      {hydrated && !profile?.user && (
        <div className="compare-page__notice">
          <span>{tCompare('login_notice')}</span>
          <Link href="/auth/login">{tCompare('login_cta')}</Link>
        </div>
      )}

      {hydrated && !compareDevices.length && (
        <div className="compare-page__empty">
          <NoData />
          <Link href="/">{tCompare('browse_devices')}</Link>
        </div>
      )}

      {hydrated && compareDevices.length > 0 && (
        <>
          <div
            className={`compare-page__cards ${
              compareDevices.length <= 2 ? 'is-compact' : ''
            }`}
          >
            {compareDevices.map((device) => (
              <article key={device.id} className="compare-page__card">
                <Link href={`/device/${device.link}`} className="compare-page__card-image">
                  <Image
                    src={checkImageUrl(device.imageUrl)}
                    alt={device.name}
                    width={280}
                    height={280}
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </Link>
                <Link href={`/device/${device.link}`} className="compare-page__card-name">
                  {device.name}
                </Link>
                <div className="compare-page__card-price">
                  {device.price} {tCategories('lei')}
                </div>
                <Button
                  size="sm"
                  onClick={() => removeFromCompare(device.id)}
                  className="compare-page__card-remove"
                >
                  {tCompare('remove')}
                </Button>
              </article>
            ))}
          </div>

          <div className="compare-page__table-wrapper">
            <table className="compare-page__table">
              <thead>
                <tr>
                  <th>{tCompare('specification')}</th>
                  {compareDevices.map((device) => (
                    <th key={`${device.id}-head`}>{device.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!compareProperties.length && (
                  <tr>
                    <th>{tCompare('specification')}</th>
                    <td colSpan={compareDevices.length}>{tCompare('no_specs')}</td>
                  </tr>
                )}
                {compareProperties.map((property) => (
                  <tr key={property}>
                    <th>{tDevices(property)}</th>
                    {compareDevices.map((device) => (
                      <td key={`${device.id}-${property}`}>
                        {formatDevicePropertyValue(device, property, tDevices)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default ComparePage;
