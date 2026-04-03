'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { memo, useState, useCallback, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { ProductListItem } from '@/types/product';

interface ProductCardProps {
  product: ProductListItem;
  category?: string;
  isNew?: boolean;
  isLowStock?: boolean;
}

const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

export const ProductCard = memo(
  function ProductCard({
    product,
    category,
    isNew = false,
    isLowStock = false,
  }: ProductCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const primaryImage = useMemo(
      () => product.pictures[0]?.imageUrl || null,
      [product.pictures],
    );

    const hasImage = !!primaryImage;

    const formattedPrice = useMemo(() => {
      const hasVariants = product.variants && product.variants.length > 0;

      if (hasVariants) {
        const prices = product.variants!.map((v) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (min !== max) return { range: true, min, max };
        return { range: false, value: min };
      }

      if (
        product.minPrice !== null &&
        product.maxPrice &&
        product.maxPrice !== product.minPrice
      ) {
        return { range: true, min: product.minPrice, max: product.maxPrice };
      }

      if (product.minPrice !== null) {
        return { range: false, value: product.minPrice };
      }

      return null;
    }, [product.minPrice, product.maxPrice, product.variants]);

    const handleImageLoad = useCallback(() => setImageLoaded(true), []);

    const badge = isNew ? 'new' : isLowStock ? 'low' : null;

    return (
      <Link
        href={`/products/${product.slug}`}
        prefetch={false}
        aria-label={`Lihat ${product.name}`}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <article className="relative h-full flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border/70 hover:shadow-sm">
          {/* ── IMAGE ── */}
          <div className="relative w-full overflow-hidden bg-muted aspect-square">
            {hasImage ? (
              <>
                <Image
                  src={primaryImage!}
                  alt={product.name}
                  fill
                  className={[
                    'object-cover transition-all duration-500',
                    imageLoaded ? 'opacity-100' : 'opacity-0',
                    'group-hover:scale-[1.04]',
                  ].join(' ')}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onLoad={handleImageLoad}
                  loading="lazy"
                  quality={75}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse" />
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/60">
                <ImageOff
                  className="h-8 w-8 text-muted-foreground/25"
                  strokeWidth={1.5}
                />
              </div>
            )}

            {/* Badge */}
            {badge && (
              <span
                className={[
                  'absolute top-2.5 left-2.5 z-10 rounded px-2 py-0.5',
                  'text-[10px] font-medium tracking-wide uppercase',
                  badge === 'new'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                ].join(' ')}
              >
                {badge === 'new' ? 'Baru' : 'Stok Terbatas'}
              </span>
            )}

            {/* Quick-view pill — appears on hover
            <div
              className={[
                'absolute bottom-2.5 left-1/2 -translate-x-1/2',
                'flex items-center gap-1 rounded-full',
                'bg-background/90 backdrop-blur-sm border border-border/50',
                'px-3 py-1 text-[11px] font-medium text-foreground/70',
                'pointer-events-none whitespace-nowrap',
                'opacity-0 translate-y-1.5 transition-all duration-200',
                'group-hover:opacity-100 group-hover:translate-y-0',
              ].join(' ')}
            >
              Lihat Produk
            </div> */}
          </div>

          <div className="flex flex-col flex-1 p-4 gap-2">
            {category && (
              <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60">
                {category}
              </p>
            )}

            <h3
              className={[
                'text-sm font-medium leading-snug text-foreground',
                'line-clamp-2 min-h-[2.6em]',
                'group-hover:text-foreground/80 transition-colors',
              ].join(' ')}
            >
              {product.name}
            </h3>

            {/* Divider */}
            <div className="mt-auto pt-3 border-t border-border/40">
              <div className="flex items-end justify-between gap-2">
                {/* Price block */}
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-0.5">
                    Harga
                  </p>
                  {formattedPrice ? (
                    formattedPrice.range ? (
                      <p className="text-[13px] font-medium text-muted-foreground tabular-nums">
                        {formatCurrency(formattedPrice.min!)}
                        <span className="mx-1 opacity-50">–</span>
                        {formatCurrency(formattedPrice.max!)}
                      </p>
                    ) : (
                      <p className="text-[15px] font-semibold text-foreground tabular-nums">
                        {formatCurrency(formattedPrice.value!)}
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground/40">—</p>
                  )}
                </div>

                {/* Arrow CTA */}
                <div
                  className={[
                    'shrink-0 w-7 h-7 rounded-full border border-border/40',
                    'flex items-center justify-content-center',
                    'bg-muted/40 transition-all duration-200',
                    'group-hover:bg-primary group-hover:border-primary',
                  ].join(' ')}
                  aria-hidden
                >
                  <ArrowUpRight
                    className="m-auto h-3.5 w-3.5 text-muted-primary transition-colors duration-200 group-hover:text-background"
                    strokeWidth={1.75}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  },
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.product.minPrice === next.product.minPrice &&
    prev.product.maxPrice === next.product.maxPrice &&
    prev.product.name === next.product.name &&
    prev.isNew === next.isNew &&
    prev.isLowStock === next.isLowStock,
);

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-1/3 rounded bg-muted" />
        <div className="h-3.5 w-full rounded bg-muted" />
        <div className="h-3.5 w-4/5 rounded bg-muted" />
        <div className="pt-3 border-t border-border/40 flex items-end justify-between">
          <div className="space-y-1.5">
            <div className="h-2 w-10 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
          <div className="w-7 h-7 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
