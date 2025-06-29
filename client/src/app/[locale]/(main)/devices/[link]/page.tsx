import { Metadata } from 'next';
import { Categories, Devices } from '@/components';
import { fetchCategories, fetchDevices } from '@/services/api';

export const metadata: Metadata = {
  title: 'TechnoHeart - Devices',
  description: 'Select Category and Devices',
};

const DevicesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ link: string }>;
  searchParams: Promise<{ page: number }>;
}) => {
  const { link } = await params;
  const { page } = await searchParams;
  const devices = await fetchDevices('', link, 'popularity', 8, page);
  const categories = await fetchCategories();

  // const [
  //   devices,
  //   loading,
  //   error,
  //   getDevices
  // ] = useDevices((state) => [
  //   state.devices,
  //   state.loading,
  //   state.error,
  //   state.getDevices
  // ]);

  // useEffect(() => {
  //   getDevices(deviceType);
  // }, [deviceType]);

  return (
    <div className="devices-page">
      <Categories categories={categories} />
      <Devices devices={devices} />
      {/* {devices?.data?.length > 4 && <Categories categories={categories} />} */}
    </div>
  );
};

export default DevicesPage;
