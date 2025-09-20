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
          <h2 className="footer-heading">{t('shop')}</h2>
          <span>{t('tel')}: + 373 79160000</span>
          <span>sales@technoheart.md</span>
        </div>
        <div>
          <h2 className="footer-heading">{t('customer_support')}</h2>
          <span>{t('tel')}: + 373 79890000</span>
          <span>advertising@technoheart.md</span>
          <Link href={`/contacts`} prefetch={false}>
            {t('contacts')}
          </Link>
        </div>
        <div>
          <h2 className="footer-heading">{t('services')}</h2>
          <Link href={`/protection`} prefetch={false}>
            Smart Protection
          </Link>
          <Link href={`/tradein`} prefetch={false}>
            Trade-in
          </Link>
        </div>
      </div>
      <div className="lower-footer">
        <div className="lower-footer--logo">
          <Link href="/" aria-label="Go to homepage" prefetch={false}>
            <Icon type="logo" />
          </Link>
        </div>
        <div className="copyright">
          <p>{`© ${new Date().getFullYear()}. ${t('copyright')}`}</p>
        </div>
        <div className="lower-footer--media">
          <Link
            href="https://www.facebook.com"
            aria-label="Visit our Facebook"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
          >
            <Icon type="facebook" />
          </Link>
          <Link
            href="https://www.youtube.com"
            aria-label="Visit our YouTube"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
          >
            <Icon type="youtube" />
          </Link>
          <Link
            href="https://www.instagram.com"
            aria-label="Visit our Instagram"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
          >
            <Icon type="instagram" />
          </Link>
        </div>
      </div>
    </div>
  );
};
