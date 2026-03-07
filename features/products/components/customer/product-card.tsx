'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { memo, useState, useCallback, useMemo, useTransition } from 'react';
import { formatCurrency } from '@/lib/utils';
import { CartProduct, ProductListItem } from '@/types/product';
import { useCart } from '@/features/cart/context/cart.context';

interface ProductCardProps {
    product: ProductListItem;
}

function toCartProduct(product: ProductListItem): CartProduct {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        pictures: product.pictures,
    };
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isPending, startTransition] = useTransition();

    const primaryImage = useMemo(
        () => product.pictures[0]?.imageUrl || '/images/placeholder-image.png',
        [product.pictures]
    );

    const formattedPrice = useMemo(
        () => formatCurrency(product.price),
        [product.price]
    );

    const handleAddToCart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (isPending) return;

            startTransition(() => {
                addItem(toCartProduct(product));
            });
        },
        [addItem, product, isPending]
    );

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const hasImages = product.pictures.length > 0;

    return (
        <div className="group relative h-full overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-xl transition-shadow duration-300">
            {/* IMAGE */}
            <Link
                href={`/products/${product.slug}`}
                className="block"
                prefetch={false}
                aria-label={`Lihat ${product.name}`}
            >
                <div className="relative w-full overflow-hidden bg-muted rounded-t-lg aspect-square">
                    {hasImages ? (
                        <>
                            <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className={`object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    } group-hover:scale-105`}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                onLoad={handleImageLoad}
                                loading="lazy"
                                quality={75}
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                            />

                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Eye className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
            </Link>

            {/* CONTENT */}
            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-base text-foreground line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between pt-2 gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-0.5">Harga</p>
                        <p className="text-lg font-bold text-foreground">
                            {formattedPrice}
                        </p>
                    </div>

                    <Button
                        size="sm"
                        className="h-10 px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                        onClick={handleAddToCart}
                        disabled={isPending}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                    >
                        {isPending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        ) : (
                            <ShoppingCart className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // ✅ Custom comparison untuk memo
    return prevProps.product.id === nextProps.product.id &&
        prevProps.product.price === nextProps.product.price &&
        prevProps.product.name === nextProps.product.name;
});