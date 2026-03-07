import { ProductForm } from '@/features/products/components/admin/product-form';

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
            <div >
                <ProductForm />
            </div>
        </div>
    );
}
