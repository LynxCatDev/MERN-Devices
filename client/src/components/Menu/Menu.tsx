'use client';

import { quickLinks } from '@/constants/quickLinks';
import { apiBaseUrl } from '@/helpers';
import { useCategories } from '@/store/store';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import './Menu.scss';

interface Props {
  showMenu: boolean;
  toggleMenu: () => void;
}

export const Menu = ({ showMenu, toggleMenu }: Props) => {
  const [showQuickLinks, setShowQuickLinks] = useState('');
  const locale = useLocale();
  const tCategories = useTranslations('Categories');
  const [categories, getCategories, loading, error] = useCategories(
    useShallow((state) => [
      state.categories,
      state.getCategories,
      state.loading,
      state.error,
    ]),
  );

  useEffect(() => {
    getCategories();
  }, []);

  const checkQuickLinksRedirect = (submenu: any, category: string) => {
    if (submenu.getInfo) {
      return `/${locale}/device/${submenu.properties}`;
    } else if (submenu?.properties && !submenu.categoryLink) {
      return `/${locale}/devices/${category}/${submenu.properties}`;
    } else if (submenu?.properties) {
      return `/${locale}/devices/${submenu.categoryLink}/${submenu.properties}`;
    } else if (submenu?.categoryLink) {
      return `/${locale}/devices/${submenu.categoryLink}`;
    } else if (typeof submenu === 'string') {
      return `/${locale}/devices/${submenu.toLowerCase().split(' ').join('-')}`;
    } else {
      return `/${locale}/devices/${category}`;
    }
  };

  return (
    <div className="menu" style={!showMenu ? { display: 'none' } : {}}>
      <div className="menu--categories">
        {categories &&
          categories.map((category) => (
            <div
              className="menu--category"
              onMouseOver={() => setShowQuickLinks(`${category.link.slice(1)}`)}
              key={category.id}
            >
              <Link
                onClick={toggleMenu}
                href={`/${locale}/devices${category.link}`}
              >
                <Image
                  priority
                  src={`${apiBaseUrl}${category?.imgUrl}`}
                  alt={category.name}
                  width={40}
                  height={40}
                />
                <span className="menu--category--title">
                  {tCategories(`${category.translate}`)}
                </span>
              </Link>
            </div>
          ))}
      </div>

      <div className="menu--quicklinks">
        {quickLinks.map((quickLink) => (
          <div
            className="quicklinks"
            style={showQuickLinks === quickLink.name ? { display: 'flex' } : {}}
            key={quickLink.name}
          >
            <div className="quicklinks--wrapper">
              {quickLink?.subCategories?.map((subCategory) => (
                <div
                  className="quicklinks--properties"
                  key={subCategory.quickLinksName}
                >
                  <div className="quicklinks--properties--title">
                    {subCategory.quickLinksName}
                  </div>
                  {subCategory?.links?.map((submenu: any, key) => (
                    <Link
                      href={checkQuickLinksRedirect(submenu, quickLink.name)}
                      onClick={toggleMenu}
                      key={key}
                    >
                      {submenu?.title ? submenu.title : submenu}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
