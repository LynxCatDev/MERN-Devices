'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useLocale } from 'next-intl';
import { useUser } from '@/store/store';
import { Devices } from '@/components';

const FavoritesPage = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const page = Number(searchParams.get('page'));
  const [userFavorites, getUserFavorites, loading, error] = useUser(
    useShallow((state) => [
      state.userFavorites,
      state.getUserFavorites,
      state.loading,
      state.error,
    ]),
  );
  const checkFavoritesDataExist =
    userFavorites?.data?.length === 0 && page === userFavorites.page;

  useEffect(() => {
    if (checkFavoritesDataExist) {
      push(`/${locale}/favorites`);
    } else if (page !== userFavorites?.page) {
      getUserFavorites(page || 1);
    }
  }, [page, checkFavoritesDataExist]);

  return (
    <div className="favorites-page">
      <Devices devices={userFavorites} loading={loading} />
    </div>
  );
};

export default FavoritesPage;
