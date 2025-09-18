import { cache } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { fetchDevices } from '@/services/api';
import { RecommendedDevicesSkeleton } from '@/components/Devices/RecommendedDevicesSkeleton';

export const metadata: Metadata = {
  title: 'TechnoHeart - Search for Devices',
  description: 'Search for Devices',
};

export const revalidate = 900;

const Devices = dynamic(
  () => import('@/components/Devices/Devices').then((m) => m.Devices),
  {
    loading: () => <RecommendedDevicesSkeleton itemsLength={8} />,
  },
);

const DevicesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ link: string }>;
  searchParams: Promise<{ page: number; q: string }>;
}) => {
  const { link } = await params;
  const { q, page } = await searchParams;
  const devicesCache = cache(fetchDevices);
  const devices = await devicesCache(q, link, 'popularity', 8, page);

  return (
    <div className="devices-page">
      <Devices devices={devices} />
    </div>
  );
};

export default DevicesPage;
