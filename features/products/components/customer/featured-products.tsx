import prisma from '@/lib/prisma';
import { ProductCard } from './product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export async function FeaturedProducts() {
    const products = await prisma.product.findMany({
        take: 4,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            pictures: true,
            category: true,
        },
    });

    return (
        <section className="bg-background">
            <div className="container">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Rekomendasi Untuk Anda
                        </h2>
                        <Link href="/products">
                            <Button variant="ghost" className="gap-2">
                                Lihat Semua Produk
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-3xl">
                        <p className="text-xl text-muted-foreground">Tidak ada produk ditemukan. Silakan cek kembali nanti.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
