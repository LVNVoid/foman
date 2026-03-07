import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/features/products/actions/product.actions';
import { getCategories } from '@/features/categories/actions/category.actions';
import Link from 'next/link';
import { ProductTable } from '@/features/products/components/admin/product-table';
import { ProductToolbar } from '@/features/products/components/admin/product-toolbar';

interface ProductsAdminPageProps {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
    page?: string;
  }>;
}

const ProductsAdminPage = async ({ searchParams }: ProductsAdminPageProps) => {
  const params = await searchParams;
  const query = params.query || '';
  const categoryId = params.categoryId || '';
  const currentPage = Number(params.page) || 1;

  const { products, totalPages } = await getProducts({
    query,
    categoryId,
    page: currentPage,
    limit: 6,
  });

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola produk.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Tambah Produk Baru</Link>
        </Button>
      </div>


      <Suspense fallback={<div>Memuat toolbar...</div>}>
        <ProductToolbar categories={categories} />
      </Suspense>

      <Suspense fallback={<div>Memuat tabel...</div>}>
        <ProductTable
          products={products}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
};

export default ProductsAdminPage;
