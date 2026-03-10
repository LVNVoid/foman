'use client';

import { ProductWithDetails } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useProductVariants } from '@/features/products/hooks/useProductVariants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ProductOptions({
    product,
    storeSettings
}: {
    product: ProductWithDetails,
    storeSettings?: { whatsappNumber?: string, storeName?: string } | null
}) {
    const {
        hasVariants,
        selectedVariant,
        selectVariantById,
        minPrice,
        maxPrice,
        isRange,
        isOutOfStock
    } = useProductVariants(product.variants, (product as any).minPrice ?? 0);

    const [quantity, setQuantity] = useState<number>(1);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const handleWhatsAppOrder = () => {
        // Validation
        if (hasVariants && !selectedVariant) {
            setErrorMsg('Mohon pilih varian produk terlebih dahulu.');
            return;
        }

        if (quantity < 1) {
            setErrorMsg('Jumlah pesanan minimal 1.');
            return;
        }

        // Generate Message
        let message = `Halo, saya ingin memesan produk berikut:\n\n`;
        message += `🖨️ Produk: ${product.name}\n`;

        if (hasVariants && selectedVariant) {
            message += `📐/🎨 Varian: ${selectedVariant.name}\n`;
        }

        message += `📊 Jumlah: ${quantity}\n`;
        message += `📎 Link Produk: ${window.location.href}\n\n`;
        message += `Mohon informasi lebih lanjut mengenai estimasi produksi dan pengiriman.\nTerima kasih! 🙏`;

        // Encode message and create URL
        const phoneNumber = storeSettings?.whatsappNumber || "6281234567890";
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open in new tab
        window.open(url, '_blank');
    };

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



            {/* Add to Cart & WhatsApp */}
            <div className="pt-4 space-y-4">
                {/* Quantity Input */}
                <div className="flex items-center gap-3">
                    <Label className="text-base font-semibold">Jumlah</Label>
                    <div className="flex items-center border rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none border-r"
                            onClick={() => {
                                setQuantity(Math.max(1, quantity - 1));
                                setErrorMsg('');
                            }}
                        >
                            -
                        </Button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setQuantity(isNaN(val) ? 1 : Math.max(1, val));
                                setErrorMsg('');
                            }}
                            className="w-12 h-8 text-center bg-transparent border-none focus:ring-0 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none border-l"
                            onClick={() => {
                                setQuantity(quantity + 1);
                                setErrorMsg('');
                            }}
                        >
                            +
                        </Button>
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-sm text-destructive font-medium">
                        {errorMsg}
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        onClick={handleWhatsAppOrder}
                        className="w-full gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white"
                        size="lg"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        Order via WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    );
}
