import prisma from '@/lib/prisma';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { unstable_cache } from 'next/cache';
import { getCachedCategory } from '@/features/categories/services/category.service';
import { ProductCard } from './product-card';

interface ProductSectionProps {
    categorySlug?: string;
    page?: number;
    search?: string;
    baseUrl?: string;
}

const PAGE_SIZE = 12;
const MAX_PAGINATION_DISPLAY = 7;

const getCachedProducts = unstable_cache(
    async (page: number, categorySlug?: string, search?: string) => {
        const skip = (page - 1) * PAGE_SIZE;
        const where: any = {};

        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, count] = await Promise.all([
            prisma.product.findMany({
                take: PAGE_SIZE,
                skip,
                where,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    minPrice: true,
                    maxPrice: true,
                    pictures: {
                        select: {
                            id: true,
                            imageUrl: true,
                        },
                        take: 1,
                        orderBy: { id: 'asc' }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        }
                    },
                    variants: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            stock: true,
                            unit: true,
                        },
                        orderBy: { price: 'asc' },
                    },
                },
            }),
            prisma.product.count({ where })
        ]);

        const serializedProducts = products.map(product => ({
            ...product,
        }));

        return [serializedProducts, count] as const;
    },
    ['products-list'],
    {
        revalidate: 3600,
        tags: ['products']
    }
);



export async function ProductSection({ categorySlug, page = 1, search, baseUrl = '/products' }: ProductSectionProps) {
    const [productsData, categoryData] = await Promise.all([
        getCachedProducts(page, categorySlug, search),
        categorySlug ? getCachedCategory(categorySlug) : Promise.resolve(null)
    ]);

    const [products, totalCount] = productsData;
    const categoryName = categoryData?.name || 'Semua Produk';
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams();
        if (categorySlug) params.set('category', categorySlug);
        if (search) params.set('search', search);
        params.set('page', newPage.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const getPageNumbers = () => {
        if (totalPages <= MAX_PAGINATION_DISPLAY) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const halfDisplay = Math.floor(MAX_PAGINATION_DISPLAY / 2);

        let startPage = Math.max(1, page - halfDisplay);
        let endPage = Math.min(totalPages, page + halfDisplay);

        if (page <= halfDisplay) {
            endPage = MAX_PAGINATION_DISPLAY;
        } else if (page >= totalPages - halfDisplay) {
            startPage = totalPages - MAX_PAGINATION_DISPLAY + 1;
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('ellipsis-start');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('ellipsis-end');
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <section>
            <div className="container">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {search ? `Hasil Pencarian untuk "${search}"` : categoryName}
                        </h2>
                        {totalCount > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, totalCount)} dari {totalCount} produk
                            </p>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-3xl">
                        <p className="text-xl text-muted-foreground">
                            {search ? `Tidak ada produk ditemukan untuk "${search}"` : 'Tidak ada produk ditemukan. Silakan cek kembali nanti.'}
                        </p>
                    </div>
                )}

                {/* Optimized Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={page > 1 ? createPageUrl(page - 1) : '#'}
                                        aria-disabled={page <= 1}
                                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {pageNumbers.map((p, idx) => (
                                    typeof p === 'number' ? (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                href={createPageUrl(p)}
                                                isActive={p === page}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={`${p}-${idx}`}>
                                            <span className="px-4 py-2">...</span>
                                        </PaginationItem>
                                    )
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href={page < totalPages ? createPageUrl(page + 1) : '#'}
                                        aria-disabled={page >= totalPages}
                                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </section>
    );
}