import { unstable_cache as nextCache } from 'next/cache';
import { getLocale, getTranslations } from 'next-intl/server';
import {
  Categories,
  Collection,
  Features,
  Promotions,
  RecommendedDevices,
  ServicesSection,
  ShopTitle,
} from '@/components';
import { fetchCategories, fetchCollection, fetchDevices } from '@/services/api';
import { DevicesDataProps } from '@/store/store.interface';
import { SlickSliderWrapper } from '@/components/SlickSlider/SlickSliderWrapper';

import './page.scss';

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
