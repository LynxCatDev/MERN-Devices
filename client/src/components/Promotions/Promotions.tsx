import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { promotions } from '@/constants/promotions';

import './Promotions.scss';

export const Promotions = () => {
  const t = useTranslations('General');
  return (
    <div className="promotions">
      <div className="promotions--wrapper">
        {promotions.slice(0, 2).map((promotion) => (
          <Link key={promotion.id} href={`${promotion.link}`} prefetch={false}>
            <div className="promotions--bg">
              <Image
                src={promotion.imgUrl}
                alt={promotion.title}
                fill
                sizes="(max-width: 992px) 100vw, 50vw"
                priority
                className="promotions--bg-img"
                fetchPriority="high"
              />
              <h2>{t(`${promotion.title}`)}</h2>
              <span>{t(`${promotion.description}`)}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="promotions--link">
        <Link href={`/promotions`} prefetch={false}>
          {t('promotions_link')}
        </Link>
      </div>
    </div>
  );
};
