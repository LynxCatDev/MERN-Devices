'use client';

import { useOutsideClick } from '@chakra-ui/hooks';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  getAccessToken,
  isTokenExpired,
  refreshTokens,
} from '@/services/auth-token.service';
import { useDevices, useUser } from '@/store/store';
import { toaster } from '@/components/Toaster/Toaster';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
// import { Menu } from '../Menu/Menu';
import { Search } from '../Search/Search';
import { TopBar } from '../Topbar/Topbar';

import './Header.scss';

const Menu = lazy(() =>
  import('../Menu/Menu').then((m) => ({ default: m.Menu })),
);

export const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const showRef = useRef(null);
  const locale = useLocale();
  const t = useTranslations('Header');
  const tAuth = useTranslations('Auth');
  const accessToken = getAccessToken();
  useOutsideClick({
    ref: showRef,
    handler: () => setShowProfileMenu(false),
  });

  const [profile, validateSession, userLogOut, profileError] = useUser(
    useShallow((state) => [
      state.profile,
      state.validateSession,
      state.userLogOut,
      state.error,
    ]),
  );

  const [devices] = useDevices(useShallow((state) => [state.devices]));
  const devicesCount = useMemo(
    () => devices?.data?.length || 0,
    [devices?.data?.length],
  );

  const checkAccessToken = () => {
    if (accessToken && isTokenExpired(accessToken)) {
      refreshTokens();
      return;
    }
    if (accessToken) {
      validateSession();
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  const logout = () => {
    userLogOut();
  };

  const toggleMenu = () => {
    setShowMenu((i) => !i);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((i) => !i);
  };

  const checkUserForFavorites = () => {
    if (profile?.user) {
      return `/${locale}/favorites`;
    } else {
      return `/${locale}/auth/login`;
    }
  };

  useEffect(() => {
    // Only show error toasts for unexpected errors, not for normal "not logged in" scenarios
    if (
      profileError &&
      profileError !== 'No refresh token provided' &&
      profileError !== 'Invalid refresh token'
    ) {
      toaster.create({
        title: `${profileError}`,
        type: 'error',
        duration: 9000,
      });
    }
  }, [profileError]);

  return (
    <header>
      <TopBar />
      <div className="header">
        <div
          className="header--container"
          style={{
            ...(showMenu || devicesCount > 0
              ? { borderRadius: '16px 16px 0 0' }
              : {}),
          }}
        >
          <div className="header--logo">
            <Link href={`/${locale}`} aria-label="Home">
              <Icon type="logo" />
            </Link>
          </div>

          <div
            className="header--menu"
            onMouseOver={() => setShowMenu(true)}
            onMouseOut={() => setShowMenu(false)}
          >
            <Icon type="menu" />
            {t('menu')}

            <Menu showMenu={showMenu} toggleMenu={toggleMenu} />
          </div>

          <Search />

          <div className="header--main-menu">
            <div className="header--favorites">
              <Link href={checkUserForFavorites()} aria-label="Favorites">
                <Icon type="heart" />
              </Link>
            </div>

            <div className="compare--devices">
              <Link href={`/${locale}/compare`} aria-label="Compare devices">
                <Icon type="compare" />
              </Link>
            </div>

            <div className="header--cart">
              <Link href={`/${locale}/cart`} aria-label="Cart">
                <Icon type="shopping-cart" />
              </Link>
            </div>

            {profile?.user ? (
              <div className="header--user">
                <Button
                  className={`logged-in ${
                    showProfileMenu ? 'logged-in--open' : ''
                  }`}
                  size="auto"
                  onClick={toggleProfileMenu}
                >
                  <Icon type="user" />
                  {(profile.user?.first_name || profile.user?.last_name) && (
                    <span>{`${profile.user?.first_name} ${profile.user?.last_name}`}</span>
                  )}
                </Button>

                {showProfileMenu && (
                  <div className="profile-menu" ref={showRef}>
                    <Link
                      onClick={() => setShowProfileMenu(false)}
                      href={`/${locale}/profile`}
                    >
                      {tAuth('profile')}
                    </Link>
                    <Button size="small" onClick={logout}>
                      {tAuth('logout')}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="header--user">
                <Link href={`/${locale}/auth/login`} aria-label="Account login">
                  <Icon type="user" />
                  <span>{t('account')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
