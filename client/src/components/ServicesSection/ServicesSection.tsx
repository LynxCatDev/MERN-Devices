import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icon } from '../Icon/Icon';

import './ServicesSection.scss';

export const ServicesSection = () => {
  const t = useTranslations('General');

  return (
    <div className="service-section">
      <div className="smart-protection service">
        <Link
          href={`/protection`}
          aria-label="Smart Protection details"
          prefetch={false}
        >
          <div className="service--image">
            <Image
              src="/images/offer-day.webp"
              alt="offer-day"
              fill
              sizes="(max-width:576px) 60px, (max-width:768px) 70px, (max-width:992px) 80px, 115px"
              style={{ objectFit: 'contain' }}
              loading="lazy"
              priority={false}
            />
          </div>
          <div className="service--card">
            <h3>{t('offer_day_title')}</h3>
            <span>{t('offer_day')}</span>
          </div>
          <div>
            <Icon type="play-button-arrowhead" width="30" height="30" />
          </div>
        </Link>
      </div>
      <div className="trade-in service">
        <Link href={`/tradein`} aria-label="Trade-in details" prefetch={false}>
          <div className="service--image">
            <Image
              src="/images/trade-in.webp"
              alt="trade-in"
              width={0}
              height={0}
              sizes="48px"
              style={{ width: 48, height: 'auto' }}
              loading="lazy"
              priority={false}
            />
          </div>
          <div className="service--card">
            <h3>Trade In</h3>
            <span>{t('trade_in')}</span>
          </div>
          <div>
            <Icon type="play-button-arrowhead" width="30" height="30" />
          </div>
        </Link>
      </div>
    </div>
  );
};
