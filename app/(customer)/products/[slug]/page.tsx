import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ProductImageGallery } from '@/features/products/components/customer/product-image-gallery';

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
            category: true
        },
    });

    if (!product) {
        return {
            title: 'Produk Tidak Ditemukan',
            description: 'Produk yang Anda cari tidak tersedia di Foman Percetakan',
        };
    }

    const primaryImage = product.pictures[0]?.imageUrl || '/placeholder-image.jpg';
    const productUrl = `https://printing-app-ruddy.vercel.app/products/${slug}`;

    const seoDescription = product.description
        ? `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}`
        : `Pesan ${product.name} berkualitas tinggi dari Foman Percetakan. Harga ${formatCurrency(product.price)}.`;

    const keywords = [
        product.name,
        `cetak ${product.name}`,
        `jasa ${product.name}`,
        product.category?.name || 'percetakan',
        'Foman', 'percetakan', 'printing', 'cetak online', 'cetak murah', 'cetak berkualitas'
    ];

    return {
        title: `${product.name} - ${formatCurrency(product.price)}`,
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
            title: `${product.name} - ${formatCurrency(product.price)}`,
            description: seoDescription,
            images: [primaryImage],
            creator: '@fomanpercetakan',
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

    const product = await prisma.product.findUnique({
        where: { slug },
        include: { pictures: true, category: true },
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
                                image: product.pictures.map((p) => p.imageUrl),
                                sku: product.id,
                                brand: {
                                    '@type': 'Brand',
                                    name: 'Foman Percetakan'
                                },
                                offers: {
                                    '@type': 'Offer',
                                    price: product.price,
                                    priceCurrency: 'IDR',
                                    availability: 'https://schema.org/InStock',
                                    url: `https://fomanprint.vercel.app/products/${product.slug}`,
                                    seller: {
                                        '@type': 'Organization',
                                        name: 'Foman Percetakan'
                                    }
                                },
                            },
                            {
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    {
                                        '@type': 'ListItem',
                                        position: 1,
                                        name: 'Home',
                                        item: 'https://fomanprint.vercel.app/'
                                    },
                                    ...(product.category ? [{
                                        '@type': 'ListItem',
                                        position: 2,
                                        name: product.category.name,
                                        item: `https://fomanprint.vercel.app/products/?category=${product.category.slug}`
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


                {/* Product Info */}
                <div className="flex flex-col gap-6 md:gap-8">

                    {/* Category + Title */}
                    <div>
                        {product.category && (
                            <div className="text-sm sm:text-base text-muted-foreground mb-1">
                                {product.category.name}
                            </div>
                        )}

                        <h1 className="font-bold text-[clamp(1.6rem,4vw,3rem)] leading-tight">
                            {product.name}
                        </h1>
                    </div>

                    {/* Price */}
                    <div className="font-bold text-primary text-xl sm:text-2xl md:text-3xl">
                        {formatCurrency(product.price)}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-muted-foreground">
                        <p>{product.description}</p>
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-auto pt-4">
                        <AddToCartButton product={product} />
                    </div>

                </div>
            </div>
        </div>
    );
}
