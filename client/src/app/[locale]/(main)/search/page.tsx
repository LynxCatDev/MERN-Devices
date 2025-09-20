import { unstable_cache as nextCache } from 'next/cache';
import { Metadata } from 'next';
import { fetchDevices } from '@/services/api';
import { Devices } from '@/components';

export const metadata: Metadata = {
  title: 'TechnoHeart - Search for Devices',
  description: 'Search for Devices',
};

export const revalidate = 900;

const DevicesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ link: string }>;
  searchParams: Promise<{ page: number; q: string }>;
}) => {
  const { link } = await params;
  const { q, page } = await searchParams;
  const devicesCache = nextCache(fetchDevices, ['devices'], {
    revalidate: 900,
  });
  const devices = await devicesCache(q, link, 'popularity', 8, page);

  return (
    <div className="devices-page">
      <Devices devices={devices} />
    </div>
  );
};

export default DevicesPage;
