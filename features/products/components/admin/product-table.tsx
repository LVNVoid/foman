'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DeleteProductMenuItem } from './delete-product-button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, Pencil } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    category: { name: string } | null;
    pictures: { imageUrl: string | null }[];
}

interface ProductTableProps {
    products: Product[];
    totalPages: number;
    currentPage: number;
}

export function ProductTable({ products, totalPages, currentPage }: ProductTableProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Produk</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kategori</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Harga</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Deskripsi</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground"></th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                        Tidak ada produk ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            {product.pictures && product.pictures.length > 0 && product.pictures[0].imageUrl ? (
                                                <div className="relative w-16 h-16 rounded overflow-hidden border">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={product.pictures[0].imageUrl}
                                                        alt={product.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                                    Tidak Ada Gambar
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle font-medium">{product.name}</td>
                                        <td className="p-4 align-middle">{product.category?.name || '-'}</td>
                                        <td className="p-4 align-middle">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="p-4 align-middle max-w-xs truncate">{product.description}</td>
                                        <td className="p-4 align-middle text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Buka menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/products/${product.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DeleteProductMenuItem id={product.id} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                    </Button>
                    <div className="text-sm font-medium">
                        Halaman {currentPage} dari {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Berikutnya
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
