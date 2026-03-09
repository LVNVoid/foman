import { Product, ProductPicture, ProductVariant, ProductSpecification } from '@/app/generated/prisma/client';

export type ProductWithDetails = Product & {
    pictures: ProductPicture[];
    variants?: ProductVariant[];
    specifications?: ProductSpecification[];
};

export interface ProductListItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    pictures: {
        id: string;
        imageUrl: string | null;
    }[];
    category: {
        id: string;
        name: string;
        slug: string;
    } | null;
    variants: {
        id: string;
        name: string;
        price: number;
        stock: number;
        unit: string | null;
    }[] | null;
}

export interface CartProduct {
    id: string;
    name: string;
    slug: string;
    minPrice: number | null;
    description?: string | null;
    pictures: {
        id: string;
        imageUrl: string | null;
    }[];
    selectedVariant?: {
        id: string;
        name: string;
        price: number;
    };
}

export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
}

