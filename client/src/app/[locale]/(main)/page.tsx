import { cache } from 'react';
import {
  Categories,
  Collection,
  Features,
  Promotions,
  RecommendedDevices,
  ServicesSection,
  ShopTitle,
  SlickSlider,
} from '@/components';
import { fetchCategories, fetchCollection, fetchDevices } from '@/services/api';
import { DevicesDataProps } from '@/store/store.interface';

import './page.scss';

//works only with nextjs fetch
export const revalidate = 900;

const Home = async () => {
  const getCategories = cache(fetchCategories);
  const getCollection = cache(fetchCollection);

  const recommendedDevices = cache((category: string) => {
    return fetchDevices('', category, 'popularity', 3);
  });

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
    return devices.data.length ? (
      <RecommendedDevices category={category} devices={devices} />
    ) : null;
  };

  return (
    <main className="main">
      <div className="main--wrapper">
        <ShopTitle />
        {/* <SlickSlider /> */}
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
