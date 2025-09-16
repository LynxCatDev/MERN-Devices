import dynamic from 'next/dynamic';
import { unstable_cache as nextCache } from 'next/cache';
import { getLocale, getTranslations } from 'next-intl/server';
import { Collection, Features, ServicesSection, ShopTitle } from '@/components';
import { fetchCategories, fetchCollection, fetchDevices } from '@/services/api';
import { DevicesDataProps } from '@/store/store.interface';
import { SlickSliderWrapper } from '@/components/SlickSlider/SlickSliderWrapper';

import './page.scss';

const Promotions = dynamic(
  () => import('@/components/Promotions/Promotions').then((m) => m.Promotions),
  { ssr: true },
);

const Categories = dynamic(
  () => import('@/components/Categories/Categories').then((m) => m.Categories),
  { ssr: true },
);

const RecommendedDevices = dynamic(
  () =>
    import('@/components/Devices/RecommendedDevices').then(
      (m) => m.RecommendedDevices,
    ),
  { ssr: true },
);

//works only with nextjs fetch
export const revalidate = 900;

const Home = async () => {
  const getCategories = nextCache(fetchCategories, ['categories'], {
    revalidate: 900,
  });
  const getCollection = nextCache(fetchCollection, ['collection'], {
    revalidate: 900,
  });
  const locale = await getLocale();
  const tCategories = await getTranslations('Categories');
  const tDevices = await getTranslations('Devices');

  const recommendedDevices = (category: string) =>
    nextCache(
      () => fetchDevices('', category, 'popularity', 3),
      ['recommendedDevices', category],
      { revalidate: 900 },
    )();

  const [categories, collection, smartphones, laptops, gadgets, audio] =
    await Promise.all([
      getCategories(),
      getCollection(),
      recommendedDevices('smartphones'),
      recommendedDevices('laptops'),
      recommendedDevices('gadgets'),
      recommendedDevices('audio'),
    ]);

  const renderDeviceSection = (
    category: 'smartphones' | 'laptops' | 'gadgets' | 'audio',
    devices: DevicesDataProps,
  ) => {
    if (!devices.data.length) return null;
    const categoryTitle = tCategories(category);
    const productsLabel = tDevices('products');
    return (
      <RecommendedDevices
        category={category}
        devices={devices}
        locale={locale}
        categoryTitle={categoryTitle}
        productsLabel={productsLabel}
      />
    );
  };

  return (
    <main className="main">
      <div className="main--wrapper">
        <ShopTitle />
        <SlickSliderWrapper />
        <Categories categories={categories} />
        <Promotions />
        {renderDeviceSection('smartphones', smartphones)}
        <ServicesSection />
        {renderDeviceSection('laptops', laptops)}
        <Collection collection={collection} />
        {renderDeviceSection('gadgets', gadgets)}
        {renderDeviceSection('audio', audio)}
        <Features />
      </div>
    </main>
  );
};

export default Home;
