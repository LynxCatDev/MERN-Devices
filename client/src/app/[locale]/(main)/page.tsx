import dynamic from 'next/dynamic';
import { unstable_cache as nextCache } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { Features, Loading, RecommendedDevices, ShopTitle } from '@/components';
import { CategoriesSkeleton } from '@/components/Categories/CategoriesSkeleton';
import { PromotionsSkeleton } from '@/components/Promotions/PromotionsSkeleton';
import { fetchCategories, fetchCollection, fetchDevices } from '@/services/api';
import { DevicesDataProps } from '@/store/store.interface';
import { SlickSliderWrapper } from '@/components/SlickSlider/SlickSliderWrapper';

import './page.scss';

const Promotions = dynamic(
  () => import('@/components/Promotions/Promotions').then((m) => m.Promotions),
  { loading: () => <PromotionsSkeleton /> },
);

const Categories = dynamic(
  () => import('@/components/Categories/Categories').then((m) => m.Categories),
  { loading: () => <CategoriesSkeleton /> },
);

const ServicesSection = dynamic(
  () =>
    import('@/components/ServicesSection/ServicesSection').then(
      (m) => m.ServicesSection,
    ),
  { loading: () => <Loading /> },
);

const Collection = dynamic(
  () => import('@/components/Collection/Collection').then((m) => m.Collection),
  { loading: () => null },
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
      <section>
        <RecommendedDevices
          category={category}
          devices={devices}
          categoryTitle={categoryTitle}
          productsLabel={productsLabel}
        />
      </section>
    );
  };

  return (
    <main className="main">
      <ShopTitle />

      <SlickSliderWrapper />

      <Categories categories={categories} />

      <section className="cv">
        <Promotions />
      </section>

      {renderDeviceSection('smartphones', smartphones)}

      <section className="cv">
        <ServicesSection />
      </section>

      {renderDeviceSection('laptops', laptops)}

      <section className="cv">
        <Collection collection={collection} />
      </section>

      {renderDeviceSection('gadgets', gadgets)}
      {renderDeviceSection('audio', audio)}

      <Features />
    </main>
  );
};

export default Home;
