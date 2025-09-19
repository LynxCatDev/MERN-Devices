'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { CategoriesProps } from '@/store/store.interface';
import { apiBaseUrl } from '@/helpers/baseUrl';

interface CategoriesItemProps {
  category: CategoriesProps;
}

export const CategoriesItem = ({ category }: CategoriesItemProps) => {
  const locale = useLocale();
  const t = useTranslations('Categories');
  const label = t(`${category.translate}`);
  return (
    <Link
      className={`categories--card ${category.link.slice(1)}`}
      href={`/${locale}/devices${category.link}`}
      aria-label={label}
      onMouseOver={(e) =>
        (e.currentTarget.style.color = `${category.shadowColor}`)
      }
      onMouseOut={(e) => (e.currentTarget.style.color = '')}
    >
      <div
        className="categories--img"
        onMouseOver={(e) =>
          (e.currentTarget.style.boxShadow = `0 0 16px 8px ${category.shadowColor}`)
        }
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = `none`)}
      >
        <Image
          priority={false}
          src={`${apiBaseUrl}${category?.imgUrl}`}
          alt={label}
          width={104}
          height={104}
        />
      </div>

      <div className="categories--title">
        <span>{t(`${category.translate}`)}</span>
      </div>
    </Link>
  );
};
