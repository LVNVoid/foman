'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartProduct } from '@/types/product';

export interface CartItem {
    id: string;
    product: CartProduct;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: CartProduct) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from local storage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    // Generate unique ID for cart item
    const getCartItemId = (product: CartProduct) => {
        return product.selectedVariant
            ? `${product.id}-${product.selectedVariant.id}`
            : product.id;
    };

    const addItem = (product: CartProduct) => {
        const cartItemId = getCartItemId(product);

        setItems((prev) => {
            const existing = prev.find((item) => item.id === cartItemId);
            if (existing) {
                return prev.map((item) =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { id: cartItemId, product, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const removeItem = (cartItemId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(cartItemId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce(
        (total, item) => total + (item.product.selectedVariant?.price || item.product.minPrice || 0) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
