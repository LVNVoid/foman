import { Suspense } from 'react';
import { getCategories } from '@/features/categories/actions/category.actions';
import { CategoryTable } from '@/features/categories/components/admin/category-table';
import { CategoryDialog } from '@/features/categories/components/admin/category-dialog';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
                    <p className="text-sm text-muted-foreground mt-1">Kelola kategori produk.</p>
                </div>
                <CategoryDialog />
            </div>

            <Suspense fallback={<div>Memuat kategori...</div>}>
                <CategoryTable categories={categories} />
            </Suspense>
        </div>
    );
}
