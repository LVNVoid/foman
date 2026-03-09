'use client';

import { useState } from 'react';
import { ProductVariant } from '@/app/generated/prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export function VariantFormSection({ initialVariants = [] }: { initialVariants?: Partial<ProductVariant>[] }) {
    const [variants, setVariants] = useState<Partial<ProductVariant>[]>(initialVariants);

    const addVariantRow = () => setVariants([...variants, { name: '', price: 0, stock: 0, unit: '' }]);
    const removeVariantRow = (index: number) => setVariants(variants.filter((_, i) => i !== index));
    const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    return (
        <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Varian Produk</h3>
                    <p className="text-sm text-muted-foreground">Tambahkan variasi produk seperti ukuran, warna, atau material (opsional).</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addVariantRow} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah Varian
                </Button>
            </div>

            {variants.length > 0 && (
                <div className="space-y-3">
                    {variants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-end bg-muted/30 p-3 rounded-md border">
                            <div className="col-span-12 sm:col-span-4 space-y-1">
                                <Label className="text-xs">Nama Varian <span className="text-destructive">*</span></Label>
                                <Input required value={variant.name || ''} onChange={(e) => updateVariant(index, 'name', e.target.value)} placeholder="Contoh: Sablon / Size L" />
                            </div>
                            <div className="col-span-6 sm:col-span-3 space-y-1">
                                <Label className="text-xs">Harga <span className="text-destructive">*</span></Label>
                                <Input type="number" min="0" required value={variant.price || ''} onChange={(e) => updateVariant(index, 'price', parseInt(e.target.value) || 0)} placeholder="Rp" />
                            </div>
                            <div className="col-span-6 sm:col-span-2 space-y-1">
                                <Label className="text-xs">Stok <span className="text-destructive">*</span></Label>
                                <Input type="number" min="0" required value={variant.stock || ''} onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="col-span-10 sm:col-span-2 space-y-1">
                                <Label className="text-xs">Satuan</Label>
                                <Input value={variant.unit || ''} onChange={(e) => updateVariant(index, 'unit', e.target.value || undefined)} placeholder="pcs / rim" />
                            </div>
                            <div className="col-span-2 sm:col-span-1 flex justify-end">
                                <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeVariantRow(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <input type="hidden" name="variantsData" value={JSON.stringify(variants.map(v => ({
                ...v,
                unit: v.unit || undefined
            })))} />
        </div>
    );
}
