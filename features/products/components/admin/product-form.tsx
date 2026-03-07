'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from '@/features/products/actions/product.actions';
import { getCategories } from '@/features/categories/actions/category.actions';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { Product, Category, ProductPicture } from '@/app/generated/prisma/client';
import { X } from 'lucide-react';


function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Memperbarui...' : 'Membuat...') : isEditing ? 'Perbarui Produk' : 'Buat Produk'}
        </Button>
    );
}

type ProductWithPictures = Product & { pictures: ProductPicture[] };

export function ProductForm({ product }: { product?: ProductWithPictures | null }) {
    const isEditing = !!product;
    const action = isEditing ? updateProduct.bind(null, product.id) : createProduct;

    const [selectedFiles, setSelectedFiles] = useState<{ file: File; url: string }[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
        return () => {
            selectedFiles.forEach(item => URL.revokeObjectURL(item.url));
        };
    }, []);

    const formAction = async (formData: FormData) => {
        formData.delete('images');

        selectedFiles.forEach(({ file }) => {
            formData.append('images', file);
        });

        await action(formData);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const invalidFiles = files.filter(file => file.size > 2 * 1024 * 1024);

        if (invalidFiles.length > 0) {
            alert(`Beberapa file melebihi batas 2MB: ${invalidFiles.map(f => f.name).join(', ')}`);
        }

        const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024);

        if (validFiles.length > 0) {
            const newFiles = validFiles.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));

            setSelectedFiles(prev => [...prev, ...newFiles]);
        }

        e.target.value = '';
    };

    const removeSelectedFile = (indexToRemove: number) => {
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            const removed = newFiles.splice(indexToRemove, 1)[0];
            URL.revokeObjectURL(removed.url); // Cleanup URL
            return newFiles;
        });
    };

    return (
        <form action={formAction} className="max-w-4xl">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nama Produk <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={product?.name}
                                    required
                                    placeholder="Masukkan nama produk"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Harga <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        defaultValue={product?.price}
                                        required
                                        className="pl-10"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Kategori</Label>
                                <Select name="categoryId" defaultValue={product?.categoryId || undefined}>
                                    <SelectTrigger id="categoryId">
                                        <SelectValue placeholder="Pilih kategori produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Singkat</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    defaultValue={product?.description || ''}
                                    placeholder="Deskripsi produk (opsional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Upload Gambar Baru */}
                    <div className="space-y-4">
                        <div className="space-y-4 ml-9">
                            <div className="border-2 border-dashed rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer">
                                <Label htmlFor="images" className="cursor-pointer block">
                                    <div className="text-center space-y-2">
                                        <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Klik untuk upload atau drag & drop
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                PNG, JPG atau JPEG (Maksimal 2MB per file)
                                            </p>
                                        </div>
                                    </div>
                                </Label>
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium">Preview Upload Baru ({selectedFiles.length} gambar)</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                        {selectedFiles.map((item, index) => (
                                            <div key={index} className="relative aspect-square border rounded-md overflow-hidden group hover:border-primary transition-colors">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.url} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedFile(index)}
                                                    className="absolute top-1.5 right-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                    title="Hapus upload"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gambar Produk yang Ada */}
                    {product?.pictures && product.pictures.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                    3
                                </div>
                                <h3 className="text-base font-semibold">Gambar Saat Ini</h3>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 ml-9">
                                {product.pictures.map((picture) => (
                                    !deletedImageIds.includes(picture.id) && (
                                        <div key={picture.id} className="relative aspect-square border rounded-md overflow-hidden group hover:border-primary transition-colors">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={picture.imageUrl || ''}
                                                alt="Product"
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setDeletedImageIds(prev => [...prev, picture.id])}
                                                className="absolute top-1.5 right-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                title="Hapus gambar"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )
                                ))}
                            </div>
                            {deletedImageIds.map(id => (
                                <input key={id} type="hidden" name="deletedImageIds" value={id} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-muted/50">
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                        <SubmitButton isEditing={isEditing} />
                    </div>
                </div>
            </div>
        </form>
    );
}