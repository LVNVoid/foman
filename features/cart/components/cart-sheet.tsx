'use client';

import Image from 'next/image';
import Link from 'next/link';


import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '../context/cart.context';

export function CartSheet() {
    const {
        items,
        removeItem,
        updateQuantity,
        cartTotal,
        isOpen,
        setIsOpen
    } = useCart();


    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="flex w-full px-4 flex-col pr-0 sm:max-w-lg" aria-describedby={undefined}>

                {/* Header */}
                <SheetHeader className="px-1">
                    <SheetTitle>
                        Keranjang Belanja ({items.length})
                    </SheetTitle>
                </SheetHeader>

                {/* If cart has items */}
                {items.length > 0 ? (
                    <>
                        {/* Cart Items Scroll Area */}
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="flex flex-col gap-4 py-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-secondary/20">
                                            {item.product.pictures[0]?.imageUrl ? (
                                                <Image
                                                    src={item.product.pictures[0].imageUrl}
                                                    alt={item.product.name}
                                                    fill
                                                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 100px, 120px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    Tanpa Gmb
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col justify-between px-4">

                                            {/* Name & Price */}
                                            <div className="flex justify-between gap-2">
                                                <div className="flex flex-col">
                                                    <h3 className="font-medium line-clamp-2">
                                                        {item.product.name}
                                                    </h3>
                                                    {item.product.selectedVariant && (
                                                        <span className="text-sm text-muted-foreground mt-0.5">
                                                            Varian: {item.product.selectedVariant.name}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="font-bold shrink-0">
                                                    {formatCurrency((item.product.selectedVariant?.price || item.product.minPrice || 0) * item.quantity)}
                                                </p>
                                            </div>

                                            {/* Quantity & Remove */}
                                            <div className="flex items-center justify-between mt-2">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>

                                                    <span className="w-8 text-center text-sm">
                                                        {item.quantity}
                                                    </span>

                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                {/* Remove Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Footer: Total + Checkout */}
                        <div className="space-y-4 pr-6">
                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-base font-medium">Total</span>
                                <span className="text-xl font-bold">
                                    {formatCurrency(cartTotal)}
                                </span>
                            </div>

                            <SheetFooter>
                                <Button className="w-full" size="lg" asChild>
                                    <Link
                                        href="/checkout"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Pembayaran
                                    </Link>
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                ) : (
                    /* Empty Cart */
                    <div className="flex h-full flex-col items-center justify-center space-y-2">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />

                        <span className="text-lg font-medium text-muted-foreground">
                            Keranjang Anda kosong
                        </span>

                        <Button
                            variant="link"
                            asChild
                            onClick={() => setIsOpen(false)}
                        >
                            <Link href="/products">Lanjut Belanja</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
