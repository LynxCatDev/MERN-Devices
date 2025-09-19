'use client';

import { checkImageUrl } from '@/helpers';
import { useDevices } from '@/store/store';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Icon } from '../Icon/Icon';
import { Loading } from '../Loading/Loading';
import { ShowErrorMessage } from '../ShowErrorMessage/ShowErrorMessage';
import { NoData } from '../NoData/NoData';

import './Search.scss';
import { Button } from '../Button/Button';

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
    useDevices.setState({
      loading: true,
      devices: {
        data: [],
        totalCount: 0,
        page: 1,
        totalPages: 1,
        limit: 8,
      },
    });
    const debounce = setTimeout(() => {
      if (searchValue) {
        getDevices(searchValue, '', 'popularity', 10, 1);
      }
    }, 1000);

    // if (!searchValue) {
    //   useDevices.setState({
    //     devices: {
    //       data: [],
    //       totalCount: 0,
    //       page: 1,
    //       totalPages: 1,
    //       limit: 8,
    //     },
    //   });
    // }

    const listener = (event: { code: string }) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        router.push(`/${locale}/search?q=${searchValue}`);
        clearSearchValue();
      }
    };
    document.addEventListener('keydown', listener);

    return () => {
      clearTimeout(debounce);
      document.removeEventListener('keydown', listener);
    };
  }, [searchValue]);

  return (
    <div className="search">
      <label htmlFor="search-input" className="visually-hidden"></label>
      <input
        id="search-input"
        name="search-input"
        type="text"
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Find your device..."
      />

      {searchValue && (
        <Button
          onClick={clearSearchValue}
          type="icon"
          size="small"
          aria-label="clear search"
        >
          <Icon type="close" />
        </Button>
      )}

      <Link
        href={`/${locale}/search?q=${searchValue}`}
        onClick={clearSearchValue}
        aria-label="search submit"
      >
        <Icon type="zoom" />
      </Link>

      {searchValue && searchValue?.length > 0 && (
        <div className="found-devices">
          <h3>{t('products')}</h3>

          {loading && <Loading />}

          {!devicesSearchData?.length && !loading && <NoData />}

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

          {error && <ShowErrorMessage errorMessage={error} />}
        </div>
      )}
    </div>
  );
};
