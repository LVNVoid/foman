'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { ProductWithDetails } from '@/types/product';
import { ImagePlus, Loader2, Package, X } from 'lucide-react';
import { VariantFormSection } from './variant-form-section';
import { SpecificationFormSection } from './specification-form-section';
import toast from 'react-hot-toast';


function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[140px]">
            {pending ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEditing ? 'Memperbarui...' : 'Menyimpan...'}
                </span>
            ) : isEditing ? 'Perbarui Produk' : 'Simpan Produk'}
        </Button>
    );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/30">
                <h2 className="text-base font-semibold">{title}</h2>
                {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

export function ProductForm({ product }: { product?: ProductWithDetails | null }) {
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

        try {
            const result = await action(formData);
            if (result?.error) {
                console.error("Form error:", result.error);
                const errorFields = Object.keys(result.error).join(', ');
                toast.error(`Validasi gagal pada field: ${errorFields}`);
            }
        } catch (e: any) {
            if (e.message && e.message.includes('NEXT_REDIRECT')) {
                throw e;
            }
            toast.error(e.message || "Terjadi kesalahan sistem.");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const invalidFiles = files.filter(file => file.size > 2 * 1024 * 1024);

        if (invalidFiles.length > 0) {
            toast.error(`File melebihi batas 2MB: ${invalidFiles.map(f => f.name).join(', ')}`);
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
            URL.revokeObjectURL(removed.url);
            return newFiles;
        });
    };

    return (
        <form action={formAction}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

                {/* ── Left Column ── */}
                <div className="space-y-6">

                    {/* Basic Info */}
                    <SectionCard title="Informasi Produk" description="Nama, harga, kategori, dan deskripsi produk.">
                        <div className="space-y-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name">
                                    Nama Produk <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={product?.name}
                                    required
                                    placeholder="Contoh: Topi Custom Bordir"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <Label htmlFor="description">Deskripsi Produk</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={product?.description || ''}
                                    placeholder="Deskripsikan produk Anda (bahan, kegunaan, keunggulan, dll.)"
                                    rows={4}
                                />
                            </div>

                            {/* Harga & Kategori */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="minPrice">
                                        Harga Minimum <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
                                        <Input
                                            id="minPrice"
                                            name="minPrice"
                                            type="number"
                                            min="0"
                                            defaultValue={product?.minPrice ?? ''}
                                            required
                                            className="pl-10"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="maxPrice">
                                        Harga Maksimum
                                        <span className="ml-1 text-xs text-muted-foreground font-normal">(opsional)</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
                                        <Input
                                            id="maxPrice"
                                            name="maxPrice"
                                            type="number"
                                            min="0"
                                            defaultValue={product?.maxPrice ?? ''}
                                            className="pl-10"
                                            placeholder="Sama dengan Harga Minimum jika tidak diisi"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="categoryId">Kategori</Label>
                                    <Select name="categoryId" defaultValue={product?.categoryId || undefined}>
                                        <SelectTrigger id="categoryId">
                                            <SelectValue placeholder="Pilih kategori..." />
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
                            </div>

                            {/* Rentang Harga (opsional) */}
                            {/* <div className="space-y-1.5">
                                <Label>
                                    Rentang Harga Tampilan
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                                        (opsional — ditampilkan ke customer sebagai "Rp X - Rp Y")
                                    </span>
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">Min</span>
                                        <Input
                                            id="minPrice"
                                            name="minPrice"
                                            type="number"
                                            min="0"
                                            defaultValue={product?.minPrice ?? ''}
                                            className="pl-10"
                                            placeholder="Kosongkan jika tidak ada"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">Max</span>
                                        <Input
                                            id="maxPrice"
                                            name="maxPrice"
                                            type="number"
                                            min="0"
                                            defaultValue={product?.maxPrice ?? ''}
                                            className="pl-10"
                                            placeholder="Kosongkan jika tidak ada"
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </SectionCard>

                    {/* Varian */}
                    <SectionCard title="Varian Produk" description="Tambahkan pilihan seperti teknik cetak, ukuran, atau warna (opsional).">
                        <VariantFormSection initialVariants={product?.variants || []} />
                    </SectionCard>

                    {/* Spesifikasi */}
                    <SectionCard title="Spesifikasi Teknis" description="Detail material, ukuran, atau teknis lainnya yang perlu ditampilkan (opsional).">
                        <SpecificationFormSection initialSpecifications={product?.specifications || []} />
                    </SectionCard>

                </div>

                {/* ── Right Column ── */}
                <div className="space-y-6">

                    {/* Upload Gambar Baru */}
                    <SectionCard title="Foto Produk" description="Upload foto produk. Maks 2MB per file.">
                        <div className="space-y-4">
                            <label
                                htmlFor="images"
                                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ImagePlus className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Klik untuk upload</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG, WEBP — maks 2MB</p>
                                </div>
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>

                            {/* Preview baru */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Preview ({selectedFiles.length} foto baru)
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedFiles.map((item, index) => (
                                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.url} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedFile(index)}
                                                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Foto existing */}
                            {product?.pictures && product.pictures.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Foto Saat Ini
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {product.pictures.map((picture) => (
                                            !deletedImageIds.includes(picture.id) && (
                                                <div key={picture.id} className="relative aspect-square border rounded-lg overflow-hidden group">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={picture.imageUrl || ''}
                                                        alt="Product"
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletedImageIds(prev => [...prev, picture.id])}
                                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                        title="Hapus gambar"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {deletedImageIds.map(id => (
                                <input key={id} type="hidden" name="deletedImageIds" value={id} />
                            ))}
                        </div>
                    </SectionCard>

                    {/* Action Card */}
                    <div className="bg-card rounded-xl border shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span>{isEditing ? 'Simpan perubahan untuk memperbarui produk.' : 'Semua field bertanda * wajib diisi.'}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <SubmitButton isEditing={isEditing} />
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => window.history.back()}
                                className="w-full"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
}