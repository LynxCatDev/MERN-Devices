import { Metadata } from 'next';
import { Devices } from '@/components';
import { fetchDevices } from '@/services/api';

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
  const devices = await fetchDevices(q, link, 'popularity', 8, page);

  return (
    <div className="devices-page">
      <Devices devices={devices} />
    </div>
  );
};

export default DevicesPage;
