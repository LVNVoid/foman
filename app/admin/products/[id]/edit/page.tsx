import { ProductForm } from '@/features/products/components/admin/product-form';
import { getProduct } from '@/features/products/actions/product.actions';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Edit Produk</h1>
            <div className="rounded-md border bg-card p-6">
                <ProductForm product={product as any} />
            </div>
        </div>
    );
}
