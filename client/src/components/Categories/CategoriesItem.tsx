'use client';

import { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CategoriesProps } from '@/store/store.interface';
import { apiBaseUrl } from '@/helpers/baseUrl';

interface CategoriesItemProps {
  category: CategoriesProps;
}

export const CategoriesItem = ({ category }: CategoriesItemProps) => {
  const t = useTranslations('Categories');
  const label = category.name;
  return (
    <Link
      className={`categories--card ${category.link.slice(1)}`}
      href={`/devices${category.link}`}
      aria-label={label}
      prefetch={false}
      style={{ '--shadow-color': category.shadowColor } as CSSProperties}
      // onMouseOver={(e) =>
      //   (e.currentTarget.style.color = `${category.shadowColor}`)
      // }
      // onMouseOut={(e) => (e.currentTarget.style.color = '')}
    >
      <div className="categories--img">
        <Image
          priority={false}
          fetchPriority="low"
          loading="lazy"
          src={`${apiBaseUrl}${category?.imgUrl}`}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width:576px) 60px, (max-width:768px) 70px, (max-width:992px) 80px, 115px"
          style={{ objectFit: 'contain' }}
          decoding="async"
        />
      </div>

      <div className="categories--title">
        <span>{t(`${category.translate}`)}</span>
      </div>
    </Link>
  );
};
