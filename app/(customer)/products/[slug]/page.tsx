import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductOptions } from '@/features/products/components/customer/product-options';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ProductImageGallery } from '@/features/products/components/customer/product-image-gallery';
import { siteConfig } from '@/lib/seo';
import { getStoreSettings } from '@/features/settings/actions/settings.actions';

export async function generateStaticParams() {
    const products = await prisma.product.findMany({
        select: { slug: true },
    });

    return products.map((product) => ({
        slug: product.slug,
    }));
}

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            pictures: true,
            category: true,
            variants: true,
            specifications: true
        },
    });

    if (!product) {
        return {
            title: 'Produk Tidak Ditemukan',
            description: 'Produk yang Anda cari tidak tersedia di Foman Percetakan',
        };
    }

    const primaryImage = product.pictures[0]?.imageUrl || '/images/placeholder-image.png';
    const productUrl = `${siteConfig.baseUrl}/products/${slug}`;

    const seoDescription = product.description
        ? `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}`
        : `Pesan ${product.name} berkualitas tinggi dari Foman Percetakan.`;

    const keywords = [
        product.name,
        `cetak ${product.name}`,
        `jasa ${product.name}`,
        ...product.variants.map(v => v.name),
        product.category?.name || 'percetakan',
        'Foman', 'percetakan', 'printing', 'cetak online', 'cetak murah', 'cetak berkualitas'
    ];

    return {
        title: `${product.name} - Foman Percetakan`,
        description: seoDescription,
        keywords,

        openGraph: {
            title: `${product.name} | Foman Percetakan`,
            description: seoDescription,
            url: productUrl,
            siteName: 'Foman Percetakan',
            locale: 'id_ID',
            type: 'website',
            images: [
                {
                    url: primaryImage,
                    width: 1200,
                    height: 1200,
                    alt: product.name,
                },
                ...product.pictures.slice(1, 4).map((pic) => ({
                    url: pic.imageUrl!,
                    width: 800,
                    height: 800,
                    alt: `${product.name} - Gambar tambahan`,
                }))
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: `${product.name} - Foman Kreasi`,
            description: seoDescription,
            images: [primaryImage],
            creator: '@fomankreasi',
        },

        alternates: { canonical: productUrl },

        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },

        category: product.category?.name || 'Percetakan',
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    const settingsResult = await getStoreSettings();
    const settings = 'settings' in settingsResult ? settingsResult.settings : null;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            pictures: true,
            category: true,
            variants: {
                orderBy: { price: 'asc' }
            },
            specifications: true
        },
    });


    if (!product) notFound();

    return (
        <div className="container space-y-6 px-4 py-10 md:space-y-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'Product',
                                name: product.name,
                                description: product.description,
                                image: product.pictures.map((p) => p.imageUrl).filter(Boolean),
                                sku: product.id,
                                brand: {
                                    '@type': 'Brand',
                                    name: 'Foman Percetakan'
                                },
                                offers: {
                                    '@type': 'Offer',
                                    price: Number(product.minPrice) || 0,
                                    priceCurrency: 'IDR',
                                    availability: 'https://schema.org/InStock',
                                    url: `${siteConfig.baseUrl}/products/${product.slug}`,
                                    priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                                    seller: {
                                        '@type': 'Organization',
                                        name: 'Foman Percetakan'
                                    },
                                    shippingDetails: {
                                        '@type': 'OfferShippingDetails',
                                        shippingRate: {
                                            '@type': 'MonetaryAmount',
                                            value: '0',
                                            currency: 'IDR',
                                        },
                                        shippingDestination: {
                                            '@type': 'DefinedRegion',
                                            addressCountry: 'ID',
                                        },
                                        deliveryTime: {
                                            '@type': 'ShippingDeliveryTime',
                                            handlingTime: {
                                                '@type': 'QuantitativeValue',
                                                minValue: 1,
                                                maxValue: 3,
                                                unitCode: 'DAY',
                                            },
                                            transitTime: {
                                                '@type': 'QuantitativeValue',
                                                minValue: 1,
                                                maxValue: 5,
                                                unitCode: 'DAY',
                                            },
                                        },
                                    },
                                    hasMerchantReturnPolicy: {
                                        '@type': 'MerchantReturnPolicy',
                                        applicableCountry: 'ID',
                                        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                                        merchantReturnDays: 7,
                                        returnMethod: 'https://schema.org/ReturnByMail',
                                        returnFees: 'https://schema.org/FreeReturn',
                                    },
                                },
                            },
                            {
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    {
                                        '@type': 'ListItem',
                                        position: 1,
                                        name: 'Home',
                                        item: siteConfig.baseUrl
                                    },
                                    ...(product.category ? [{
                                        '@type': 'ListItem',
                                        position: 2,
                                        name: product.category.name,
                                        item: `${siteConfig.baseUrl}/products/?category=${product.category.slug}`
                                    }] : []),
                                    {
                                        '@type': 'ListItem',
                                        position: product.category ? 3 : 2,
                                        name: product.name
                                    }
                                ]
                            }
                        ]
                    }),
                }}
            />

            {/* Breadcrumb */}
            <div className="text-xs sm:text-sm md:text-base">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        {product.category && (
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/products/?category=${product.category.slug}`}>
                                            {product.category.name}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        )}

                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Main Layout: Image + Content */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                {/* Product Image */}
                <ProductImageGallery images={product.pictures} productName={product.name} />


                <div className="flex flex-col gap-6 md:gap-8">
                    <div>
                        {product.category && (
                            <div className="text-sm sm:text-base md:text-base text-muted-foreground mb-1">
                                {product.category.name}
                            </div>
                        )}
                        <h1 className="font-bold text-[clamp(1.6rem,4vw,2rem)] leading-tight">
                            {product.name}
                        </h1>
                    </div>

                    {/* Varian, Harga & Add to Cart via ProductOptions */}
                    <ProductOptions product={product} storeSettings={settings} />

                    {/* Details Tabs */}
                    <div className="pt-8 border-t">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6 overflow-x-auto">
                                <TabsTrigger
                                    value="description"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 font-semibold"
                                >
                                    Deskripsi
                                </TabsTrigger>
                                {product.specifications && product.specifications.length > 0 && (
                                    <TabsTrigger
                                        value="specifications"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 font-semibold"
                                    >
                                        Spesifikasi
                                    </TabsTrigger>
                                )}
                            </TabsList>
                            <TabsContent value="description" className="pt-6">
                                <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground">
                                    {product.description ? (
                                        product.description.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2">{line}</p>
                                        ))
                                    ) : (
                                        <p>Tidak ada deskripsi tersedia.</p>
                                    )}
                                </div>
                            </TabsContent>
                            {product.specifications && product.specifications.length > 0 && (
                                <TabsContent value="specifications" className="pt-6">
                                    <div className="overflow-hidden rounded-md border">
                                        <table className="w-full text-sm text-left">
                                            <tbody className="divide-y">
                                                {product.specifications.map((spec) => (
                                                    <tr key={spec.id} className="divide-x bg-muted/20">
                                                        <th className="px-4 py-3 font-medium text-muted-foreground w-1/3 bg-muted/50">
                                                            {spec.key}
                                                        </th>
                                                        <td className="px-4 py-3 font-medium">
                                                            {spec.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>

                </div>
            </div>
        </div>
    );
}
