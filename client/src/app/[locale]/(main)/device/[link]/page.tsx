import type { Metadata } from 'next';
import { cache } from 'react';
import dynamic from 'next/dynamic';
import { fetchCategories, fetchDevice } from '@/services/api';
import { baseUrl, checkImageUrl } from '@/helpers';
import { CategoriesSkeleton } from '@/components/Categories/CategoriesSkeleton';
import { DeviceInfo } from '@/components';

const Categories = dynamic(
  () => import('@/components/Categories/Categories').then((m) => m.Categories),
  {
    loading: () => <CategoriesSkeleton />,
  },
);

type Props = {
  params: Promise<{ link: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { link, locale } = await params;

  // fetch data
  const device = await fetchDevice(link);

  return {
    title: `${device?.name} | TechnoHeart`,
    description: `Fă comandă de ${device?.name} la preț avantajos cu livrare express în Chișinău și Moldova din online magazinul TechnoHeart`,
    openGraph: {
      images: [checkImageUrl(device?.imageUrl)],
      url: `/${baseUrl}/${locale}/device/${device?.link}`,
    },
  };
}

export const revalidate = 900;

const DeviceInfoPage = async ({
  params,
}: {
  params: Promise<{ link: string }>;
}) => {
  const { link } = await params;
  const [categoriesCache, deviceCache] = await Promise.all([
    cache(fetchCategories),
    cache(fetchDevice),
  ]);
  const categories = await categoriesCache();
  const device = await deviceCache(link);

  return (
    <div className="device-info-page">
      <Categories categories={categories} />
      <DeviceInfo device={device} />
    </div>
  );
};

export default DeviceInfoPage;
