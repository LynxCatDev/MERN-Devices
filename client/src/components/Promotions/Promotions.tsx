import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { promotions } from '@/constants/promotions';

import './Promotions.scss';

export const Promotions = () => {
  const t = useTranslations('General');
  return (
    <div className="promotions">
      <div className="promotions--wrapper">
        {promotions.slice(0, 2).map((promotion) => (
          <Link key={promotion.id} href={`${promotion.link}`}>
            <div
              className="promotions--bg"
              style={{ backgroundImage: `url(${promotion.imgUrl})` }}
            >
              <h2>{t(`${promotion.title}`)}</h2>
              <span>{t(`${promotion.description}`)}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="promotions--link">
        <Link href={`/promotions`}>{t('promotions_link')}</Link>
      </div>
    </div>
  );
};
