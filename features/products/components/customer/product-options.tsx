'use client';

import { ProductWithDetails } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useProductVariants } from '@/features/products/hooks/useProductVariants';



export function ProductOptions({ product }: { product: ProductWithDetails }) {
    const {
        hasVariants,
        selectedVariant,
        selectVariantById,
        minPrice,
        maxPrice,
        isRange,
        isOutOfStock
    } = useProductVariants(product.variants, (product as any).minPrice ?? 0);

    let displayedPrice = (product as any).minPrice ? formatCurrency((product as any).minPrice) : '-';
    if (hasVariants) {
        if (selectedVariant) {
            const unitLabel = (selectedVariant as any).unit ? ` / ${(selectedVariant as any).unit}` : '';
            displayedPrice = `${formatCurrency(selectedVariant.price)}${unitLabel}`;
        } else {
            // No variant selected — show computed range from variants
            if (isRange) {
                displayedPrice = `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
            } else {
                displayedPrice = formatCurrency(minPrice);
            }
        }
    } else {
        // No variants — use manual minPrice/maxPrice
        const manualMin = (product as any).minPrice;
        const manualMax = (product as any).maxPrice;
        if (manualMin && manualMax && manualMax !== manualMin) {
            displayedPrice = `${formatCurrency(manualMin)} - ${formatCurrency(manualMax)}`;
        } else if (manualMin) {
            displayedPrice = formatCurrency(manualMin);
        }
    }

    const cartProduct = {
        ...product,
        selectedVariant: selectedVariant
            ? { id: selectedVariant.id, name: selectedVariant.name, price: selectedVariant.price }
            : undefined
    };

    return (
        <div className="space-y-6">
            <div className="font-bold text-primary text-xl sm:text-2xl md:text-2xl">
                {displayedPrice}
            </div>
            {hasVariants && (
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Pilih Varian</Label>
                    <RadioGroup
                        value={selectedVariant?.id}
                        onValueChange={selectVariantById}
                        className="flex flex-wrap gap-3"
                    >
                        {product.variants!.map((variant) => {
                            const isSoldOut = variant.stock <= 0;
                            return (
                                <div key={variant.id}>
                                    <RadioGroupItem
                                        value={variant.id}
                                        id={variant.id}
                                        className="peer sr-only"
                                        disabled={isSoldOut}
                                    />
                                    <Label
                                        htmlFor={variant.id}
                                        className={`
                                            flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 
                                            hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary 
                                            peer-data-[state=checked]:text-primary cursor-pointer transition-all
                                            ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span className="font-medium px-2">{variant.name}</span>
                                        {isSoldOut && <span className="text-[10px] text-destructive mt-1">Habis</span>}
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            )}



            {/* Add to Cart */}
            <div className="pt-6">
                <AddToCartButton
                    // @ts-ignore - Temporary ignore until CartProduct type perfectly matches
                    product={cartProduct as any}
                    disabled={Boolean(isOutOfStock)}
                />
            </div>
        </div>
    );
}
