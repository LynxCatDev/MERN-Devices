import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Icon } from '../Icon/Icon';

import './Footer.scss';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <div className="footer">
      <div className="upper-footer">
        <div>
          <h5>{t('shop')}</h5>
          <span>{t('tel')}: + 373 79160000</span>
          <span>sales@technoheart.md</span>
        </div>
        <div>
          <h5>{t('customer_support')}</h5>
          <span>{t('tel')}: + 373 79890000</span>
          <span>advertising@technoheart.md</span>
          <Link href={`/contacts`}>{t('contacts')}</Link>
        </div>
        <div>
          <h5>{t('services')}</h5>
          <Link href={`/protection`}>Smart Protection</Link>
          <Link href={`/tradein`}>Trade-in</Link>
        </div>
      </div>
      <div className="lower-footer">
        <div className="lower-footer--logo">
          <Link href="/">
            <Icon type="logo" />
          </Link>
        </div>
        <div className="copyright">
          <h5>{`© ${new Date().getFullYear()}. ${t('copyright')}`}</h5>
        </div>
        <div className="lower-footer--media">
          <Link href="https://www.facebook.com">
            <Icon type="facebook" />
          </Link>
          <Link href="https://www.youtube.com">
            <Icon type="youtube" />
          </Link>
          <Link href="https://www.instagram.com">
            <Icon type="instagram" />
          </Link>
        </div>
      </div>
    </div>
  );
};
