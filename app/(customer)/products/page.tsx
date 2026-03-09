import { ProductSection } from '@/features/products/components/customer/product-section';
import { CategoryList } from '@/features/categories/components/customer/category-list';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getCachedCategory } from '@/features/categories/services/category.service';
import { getCachedStoreSettings } from '@/features/settings/services/settings.service';
import { siteConfig } from '@/lib/seo';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface ProductsPageProps {
    searchParams: SearchParams
}

export async function generateMetadata(props: ProductsPageProps): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

    const [category, storeSettings] = await Promise.all([
        categorySlug ? getCachedCategory(categorySlug) : Promise.resolve(null),
        getCachedStoreSettings()
    ]);

    const storeName = storeSettings?.storeName || 'Foman Percetakan';

    const baseUrl = `${siteConfig.baseUrl}/products`;

    const urlParams = new URLSearchParams();
    if (categorySlug) urlParams.set('category', categorySlug);
    if (page > 1) urlParams.set('page', page.toString());
    if (search) urlParams.set('search', search);
    const currentUrl = `${baseUrl}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;

    let title = 'Produk Percetakan';
    if (search) {
        title = `Hasil Pencarian "${search}"`;
    } else if (category) {
        title = `${category.name}`;
    }
    if (page > 1) {
        title += ` - Halaman ${page}`;
    }

    let description = `Jelajahi berbagai produk percetakan berkualitas dari ${storeName}. Tersedia cetak brosur, kartu nama, banner, spanduk, stiker, dan masih banyak lagi dengan harga terjangkau.`;

    if (search) {
        description = `Hasil pencarian untuk "${search}" di ${storeName}. Temukan produk percetakan yang Anda butuhkan dengan kualitas terbaik dan harga kompetitif.`;
    } else if (category) {
        description = `Jelajahi produk ${category.name} berkualitas tinggi dari ${storeName}. Harga kompetitif, hasil maksimal, dan layanan profesional untuk semua kebutuhan percetakan Anda.`;
    }

    const keywords = [
        'produk percetakan',
        'katalog percetakan',
        'cetak online',
        storeName,
        'jasa cetak',
        'digital printing',
        'offset printing',
        ...(category ? [category.name, `cetak ${category.name}`, `jasa ${category.name}`] : []),
        ...(search ? [search, `jual ${search}`, `cetak ${search}`] : []),
    ];

    const canonicalParams = new URLSearchParams();
    if (categorySlug) canonicalParams.set('category', categorySlug);
    if (search) canonicalParams.set('search', search);
    const canonicalUrl = `${baseUrl}${canonicalParams.toString() ? `?${canonicalParams.toString()}` : ''}`;

    const defaultOgImage = '/og-image-foman.jpg';

    return {
        title: title,
        description: description,
        keywords: keywords,

        openGraph: {
            title: `${title} | ${storeName}`,
            description: description,
            url: currentUrl,
            siteName: storeName,
            locale: 'id_ID',
            type: 'website',
            images: [
                {
                    url: defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${storeName}`,
            description: description,
            images: [defaultOgImage],
            creator: '@fomanpercetakan',
        },

        alternates: {
            canonical: page === 1 ? canonicalUrl : currentUrl,
        },

        robots: {
            index: page <= 10,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            ...(search && {
                index: search.length > 2,
            }),
        },

        // Other metadata
        ...(category && { category: category.name }),
    };
}


export default async function ProductsPage(props: ProductsPageProps) {
    const searchParams = await props.searchParams
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

    return (
        <div className="py-8">
            <div className="container">
                <CategoryList activeCategory={category} />
                <Suspense fallback={<ProductSkeleton />}>
                    <ProductSection categorySlug={category} page={page} search={search} />
                </Suspense>
            </div>
        </div>
    );
}
