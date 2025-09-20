import { Metadata } from 'next';
import { unstable_cache as nextCache } from 'next/cache';
import dynamic from 'next/dynamic';
import { fetchCategories, fetchDevices } from '@/services/api';
import { CategoriesSkeleton } from '@/components/Categories/CategoriesSkeleton';
import { Devices } from '@/components';

export const metadata: Metadata = {
  title: 'TechnoHeart - Devices',
  description: 'Select Category and Devices',
};

export const revalidate = 900;

const Categories = dynamic(
  () => import('@/components/Categories/Categories').then((m) => m.Categories),
  {
    loading: () => <CategoriesSkeleton />,
  },
);

const DevicesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ link: string }>;
  searchParams: Promise<{ page: number }>;
}) => {
  const { link } = await params;
  const { page } = await searchParams;
  const [devicesCache, categoriesCache] = await Promise.all([
    nextCache(fetchDevices, ['devices'], { revalidate: 900 }),
    nextCache(fetchCategories, ['categories'], { revalidate: 900 }),
  ]);
  const devices = await devicesCache('', link, 'popularity', 8, page);
  const categories = await categoriesCache();

  return (
    <div className="devices-page">
      <Categories categories={categories} />
      <Devices devices={devices} />
      {/* {devices?.data?.length > 4 && <Categories categories={categories} />} */}
    </div>
  );
};

export default DevicesPage;
