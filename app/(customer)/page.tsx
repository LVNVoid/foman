import { BannerSection } from '@/features/banners/components/customer/banner-section';
import { Metadata } from 'next';
import { CategoryGrid } from '@/features/categories/components/customer/category-grid';
import { ProductSection } from '@/features/products/components/customer/product-section';
import { Suspense } from 'react';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Foman Kreasi - Jasa Cetak Profesional Indonesia',
  description:
    'Foman Kreasi menawarkan layanan cetak berkualitas tinggi: offset, digital printing, dan large format printing untuk kebutuhan bisnis maupun personal.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Foman Kreasi - Jasa Cetak Profesional Indonesia',
    description:
      'Percetakan modern dengan teknologi terkini. Hasil berkualitas, harga kompetitif.',
    url: siteConfig.baseUrl,
    siteName: 'Foman Kreasi',
    images: [
      {
        url: '/og-image-foman.jpg',
        width: 1200,
        height: 630,
        alt: 'Foman Kreasi',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foman Kreasi - Jasa Cetak Profesional Indonesia',
    description:
      'Percetakan modern dengan teknologi terkini. Hasil berkualitas, harga kompetitif.',
    images: ['/og-image-foman.jpg'],
  },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface HomePageProps {
  searchParams: SearchParams
}

const HomePage = async (props: HomePageProps) => {
  const searchParams = await props.searchParams
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  return (
    <div className="py-4 lg:py-8">
      <BannerSection />
      <div className="container mt-8">
        <CategoryGrid activeCategory={category} />
        <Suspense fallback={<ProductSkeleton />}>
          <ProductSection
            categorySlug={category}
            page={page}
            search={search}
            baseUrl="/"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
