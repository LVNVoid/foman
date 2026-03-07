'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/context/cart.context';
import { Product, ProductPicture } from '@/app/generated/prisma/client';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
    product: Product & { pictures: ProductPicture[] };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product);
        toast.success('Ditambahkan ke keranjang');
    };

    return (
        <Button size="lg" className="w-full md:w-auto gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
            Tambah ke Keranjang
        </Button>
    );
}
