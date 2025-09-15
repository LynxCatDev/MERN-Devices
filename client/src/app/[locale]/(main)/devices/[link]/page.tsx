import { cache } from 'react';
import { Metadata } from 'next';
import { Categories, Devices } from '@/components';
import { fetchCategories, fetchDevices } from '@/services/api';

export const metadata: Metadata = {
  title: 'TechnoHeart - Devices',
  description: 'Select Category and Devices',
};

export const revalidate = 900;

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
    cache(fetchDevices),
    cache(fetchCategories),
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
