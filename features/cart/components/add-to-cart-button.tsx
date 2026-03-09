'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/context/cart.context';
import { Product, ProductPicture } from '@/app/generated/prisma/client';
import toast from 'react-hot-toast';

import { CartProduct } from '@/types/product';

export interface AddToCartButtonProps {
    product: CartProduct;
    disabled?: boolean;
    className?: string;
}

export function AddToCartButton({ product, disabled = false, className }: AddToCartButtonProps) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product);
        toast.success('Ditambahkan ke keranjang');
    };

    return (
        <Button
            onClick={handleAddToCart}
            className={`w-full gap-2 ${className || ''}`}
            size="lg"
            disabled={disabled}
        >
            <ShoppingCart className="w-5 h-5" />
            Tambah ke Keranjang
        </Button>
    );
}
