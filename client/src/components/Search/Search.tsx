'use client';

import { checkImageUrl } from '@/helpers';
import { useDevices } from '@/store/store';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { Loading } from '../Loading/Loading';
import { ShowErrorMessage } from '../ShowErrorMessage/ShowErrorMessage';
import { useShallow } from 'zustand/shallow';
import './Search.scss';

export const Search = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const t = useTranslations('Devices');
  const locale = useLocale();
  const router = useRouter();

  const [devices, getDevices, loading, error] = useDevices(
    useShallow((state) => [
      state.devices,
      state.getDevices,
      state.loading,
      state.error,
    ]),
  );

  const devicesSearchData = useMemo(() => devices?.data, [devices?.data]);

  const onSearchChange = (e: { target: { value: string } }) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const clearSearchValue = () => {
    setSearchValue('');
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchValue) {
        getDevices(searchValue, '', 'popularity', 10, 1);
      }
    }, 1000);

    const listener = (event: { code: string }) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        router.push(`/${locale}/search?q=${searchValue}`);
        clearSearchValue();
      }
    };
    document.addEventListener('keydown', listener);

    return () => {
      clearInterval(debounce);
      document.removeEventListener('keydown', listener);
    };
  }, [searchValue]);

  return (
    <div className="search">
      <input
        type="text"
        style={
          searchValue && devicesSearchData?.length > 0
            ? { borderRadius: '8px 8px 0 0' }
            : {}
        }
        placeholder={t('search')}
        value={searchValue}
        onChange={onSearchChange}
      />

      <Link
        href={`/${locale}/search?q=${searchValue}`}
        onClick={clearSearchValue}
      >
        <Icon type="zoom" />
      </Link>

      {searchValue && searchValue?.length > 0 && (
        <div className="found-devices">
          <h3>{t('products')}</h3>

          {devicesSearchData?.length > 0 &&
            devicesSearchData.map((device, key) => (
              <Link
                href={`/${locale}/device/${device.link}`}
                onClick={clearSearchValue}
                className="found-devices--item"
                key={key}
              >
                <Image
                  src={checkImageUrl(device?.imageUrl)}
                  alt={device?.name}
                  width={50}
                  height={50}
                  loading="lazy"
                />
                <div className="found-devices--product">
                  <div>{device.name}</div>
                  <div>
                    {device.price} {t('lei')}
                  </div>
                </div>
              </Link>
            ))}

          {loading && <Loading />}

          {error && <ShowErrorMessage errorMessage={error} />}
        </div>
      )}
    </div>
  );
};
