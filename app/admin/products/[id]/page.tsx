import { getProduct } from '@/features/products/actions/product.actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Edit, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ProductImageGallery } from '@/features/products/components/customer/product-image-gallery';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container">
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 -ml-2">
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Produk
                    </Link>
                </Button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
                        {product.category && (
                            <Badge variant="secondary" className="text-sm">
                                <Package className="mr-1 h-3 w-3" />
                                {product.category.name}
                            </Badge>
                        )}
                    </div>
                    <Button asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Produk
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images Section */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-lg border p-4">
                        <ProductImageGallery
                            images={product.pictures}
                            productName={product.name}
                            compact={true}
                        />
                    </div>
                </div>

                {/* Product Info Sidebar */}
                <div className="space-y-4">

                    {/* Price Card */}
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-sm font-medium text-muted-foreground mb-2">Harga</h2>
                        <p className="text-3xl font-bold text-primary">
                            {product.minPrice !== null && product.maxPrice !== null && product.minPrice !== product.maxPrice
                                ? `${formatCurrency(product.minPrice)} - ${formatCurrency(product.maxPrice)}`
                                : product.minPrice !== null
                                    ? formatCurrency(product.minPrice)
                                    : '-'}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-3">Deskripsi</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description || 'Tidak ada deskripsi tersedia untuk produk ini.'}
                        </p>
                    </div>

                    {/* Product Details Card */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Detail Produk</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-start py-2 border-b">
                                <span className="text-sm font-medium text-muted-foreground">ID Produk</span>
                                <span className="text-sm font-mono">{product.id}</span>
                            </div>

                            <div className="flex justify-between items-start py-2 border-b">
                                <span className="text-sm font-medium text-muted-foreground">Kategori</span>
                                <span className="text-sm font-medium">{product.category?.name || '-'}</span>
                            </div>

                            <div className="flex justify-between items-start py-2 border-b">
                                <span className="text-sm font-medium text-muted-foreground">Gambar</span>
                                <span className="text-sm font-medium">
                                    {product.pictures?.length || 0} foto
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="rounded-lg border bg-card p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Varian Produk</h2>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Varian</TableHead>
                                            <TableHead>Harga</TableHead>
                                            <TableHead>Stok</TableHead>
                                            <TableHead>Satuan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {product.variants.map((variant: any) => (
                                            <TableRow key={variant.id}>
                                                <TableCell className="font-medium">{variant.name}</TableCell>
                                                <TableCell>{formatCurrency(variant.price)}</TableCell>
                                                <TableCell>{variant.stock}</TableCell>
                                                <TableCell className="text-muted-foreground">{variant.unit || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Specifications Section */}
                    {product.specifications && product.specifications.length > 0 && (
                        <div className="rounded-lg border bg-card p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Spesifikasi Tambahan</h2>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/3">Key</TableHead>
                                            <TableHead>Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {product.specifications.map((spec: any) => (
                                            <TableRow key={spec.id}>
                                                <TableCell className="font-medium bg-muted/30">{spec.key}</TableCell>
                                                <TableCell>{spec.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}