'use client';

import { useTheme } from '@/store/store';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Icon } from '../Icon/Icon';

import './Topbar.scss';

export const TopBar = () => {
  const pathname = usePathname();
  const [theme, toggleTheme] = useTheme(
    useShallow((state) => [state.theme, state.toggleTheme]),
  );

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.remove('night');
    }
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="top-bar">
      <div className="top-bar--mode">
        <Button onClick={toggleTheme}>
          <Icon type={`${theme === 'dark' ? 'light-mode' : 'dark-mode'}`} />
        </Button>
      </div>
      <div className="top-bar--lang">
        <Link
          href={`/ro/${pathname.slice(3)}`}
          className={pathname.includes('/ro') ? 'lang--active' : ''}
        >
          ro
        </Link>
        <Link
          href={`/en/${pathname.slice(3)}`}
          className={pathname.includes('/en') ? 'lang--active' : ''}
        >
          en
        </Link>
        <Link
          href={`/ru/${pathname.slice(3)}`}
          className={pathname.includes('/ru') ? 'lang--active' : ''}
        >
          ru
        </Link>
      </div>
    </div>
  );
};
