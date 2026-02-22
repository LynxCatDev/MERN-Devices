import { apiBaseUrl } from './baseUrl';

export const checkImageUrl = (url: string) => {
  if (!url) {
    return '/images/placeholder.webp';
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${apiBaseUrl}${url}`;
};
