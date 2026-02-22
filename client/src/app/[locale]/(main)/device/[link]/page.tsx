import type { Metadata } from 'next';
import { unstable_cache as nextCache } from 'next/cache';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { fetchCategories, fetchDevice } from '@/services/api';
import { baseUrl, checkImageUrl } from '@/helpers';
import { CategoriesSkeleton } from '@/components/Categories/CategoriesSkeleton';
import { DeviceInfo } from '@/components';
import { CategoriesProps, DevicesProps } from '@/store/store.interface';

const Categories = dynamic(
  () => import('@/components/Categories/Categories').then((m) => m.Categories),
  {
    loading: () => <CategoriesSkeleton />,
  },
);

type Props = {
  params: Promise<{ link: string; locale: string }>;
};

const buildDeviceGalleryImages = (device: DevicesProps) =>
  Array.from(
    new Set(
      [
        device.imageUrl,
        ...(Array.isArray(device.imageUrls) ? device.imageUrls : []),
        ...(Array.isArray(device.images) ? device.images : []),
      ].filter((image): image is string => Boolean(image)),
    ),
  );

const getSafeDeviceForMetadata = async (link: string) => {
  try {
    return await fetchDevice(link);
  } catch (error) {
    console.error(`Failed to load metadata for device "${link}"`, error);
    return null;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { link, locale } = await params;

  const device = await getSafeDeviceForMetadata(link);

  if (!device) {
    return {
      title: 'Device not found | TechnoHeart',
      description: 'Requested device could not be found.',
    };
  }

  return {
    title: `${device?.name} | TechnoHeart`,
    description: `Fă comandă de ${device?.name} la preț avantajos cu livrare express în Chișinău și Moldova din online magazinul TechnoHeart`,
    openGraph: {
      images: [checkImageUrl(device?.imageUrl)],
      url: `${baseUrl}/${locale}/device/${device?.link}`,
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
    nextCache(fetchCategories, ['categories'], { revalidate: 900 }),
    nextCache(fetchDevice, ['device', link], { revalidate: 900 }),
  ]);

  const [categoriesResult, deviceResult] = await Promise.allSettled([
    categoriesCache(),
    deviceCache(link),
  ]);

  const categories: CategoriesProps[] =
    categoriesResult.status === 'fulfilled'
      ? categoriesResult.value
      : (console.error(
          'Failed to fetch categories on device page',
          categoriesResult.reason,
        ),
        []);

  const device =
    deviceResult.status === 'fulfilled'
      ? deviceResult.value
      : (console.error(`Failed to fetch device "${link}"`, deviceResult.reason),
        null);

  if (!device) {
    notFound();
  }

  const galleryImages = buildDeviceGalleryImages(device);

  return (
    <div className="device-info-page">
      <Categories categories={categories} />
      <DeviceInfo device={device} galleryImages={galleryImages} />
    </div>
  );
};

export default DeviceInfoPage;
