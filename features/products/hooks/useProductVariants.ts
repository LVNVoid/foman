import { useState, useMemo } from 'react';
import { ProductVariant } from '@/app/generated/prisma/client';

export function useProductVariants(variants: ProductVariant[] | undefined, defaultPrice: number) {
    const hasVariants = Boolean(variants && variants.length > 0);
    
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        hasVariants && variants ? variants[0] : null
    );

    const priceInfo = useMemo(() => {
        if (!hasVariants || !variants) {
            return {
                minPrice: defaultPrice,
                maxPrice: defaultPrice,
                isRange: false,
            };
        }
        
        const prices = variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        return {
            minPrice,
            maxPrice,
            isRange: minPrice !== maxPrice,
        };
    }, [variants, hasVariants, defaultPrice]);

    const isOutOfStock = Boolean(hasVariants && selectedVariant && selectedVariant.stock <= 0);

    const selectVariantById = (id: string) => {
        if (!variants) return;
        const variant = variants.find(v => v.id === id);
        if (variant) setSelectedVariant(variant);
    };

    return {
        hasVariants,
        selectedVariant,
        selectVariantById,
        ...priceInfo,
        isOutOfStock,
    };
}
