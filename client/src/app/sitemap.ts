import type { MetadataRoute } from 'next';

export const revalidate = 86400; // 1 day

const site =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mern-devices.vercel.app';
const locales = ['en', 'ro', 'ru'] as const;
const basePaths = ['', '/devices', '/device', '/promotions', '/search'];
const categories = [
  'smartphones',
  'laptops',
  'gadgets',
  'audio',
  'sport-and-health',
  'personal-transport',
];

function entry(path: string, priority = 0.8): MetadataRoute.Sitemap[number] {
  const url = new URL(path || '/', site).toString();
  const languages: Record<string, string> = {};
  for (const l of locales)
    languages[l] = new URL(path ? `/${l}${path}` : `/${l}`, site).toString();
  return {
    url,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = [];

  for (const p of basePaths) items.push(entry(p, p === '' ? 1 : 0.9));
  for (const c of categories) items.push(entry(`/devices/${c}`, 0.7));

  // Optional: include products from your API if available
  try {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (api) {
      const res = await fetch(`${api}/sitemap/devices`, {
        next: { revalidate },
      });
      if (res.ok) {
        const products: { link: string; updatedAt?: string }[] =
          await res.json();
        for (const p of products) {
          items.push(entry(`/device/${p.link}`, 0.6));
        }
      }
    }
  } catch {
    // ignore if API unreachable
  }

  return items;
}
