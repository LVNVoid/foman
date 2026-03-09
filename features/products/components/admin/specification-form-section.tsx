'use client';

import { useState } from 'react';
import { ProductSpecification } from '@/app/generated/prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export function SpecificationFormSection({ initialSpecifications = [] }: { initialSpecifications?: Partial<ProductSpecification>[] }) {
    const [specifications, setSpecifications] = useState<Partial<ProductSpecification>[]>(initialSpecifications);

    const addSpecRow = () => setSpecifications([...specifications, { key: '', value: '' }]);
    const removeSpecRow = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));
    const updateSpec = (index: number, field: keyof ProductSpecification, value: string) => {
        const newSpecs = [...specifications];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setSpecifications(newSpecs);
    };

    return (
        <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Spesifikasi Produk</h3>
                    <p className="text-sm text-muted-foreground">Tambahkan detail teknis atau spesifikasi khusus (opsional).</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSpecRow} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah Spesifikasi
                </Button>
            </div>

            {specifications.length > 0 && (
                <div className="space-y-3">
                    {specifications.map((spec, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-end bg-muted/30 p-3 rounded-md border">
                            <div className="col-span-5 space-y-1">
                                <Label className="text-xs">Key <span className="text-destructive">*</span></Label>
                                <Input required value={spec.key || ''} onChange={(e) => updateSpec(index, 'key', e.target.value)} placeholder="Contoh: Material" />
                            </div>
                            <div className="col-span-6 space-y-1">
                                <Label className="text-xs">Value <span className="text-destructive">*</span></Label>
                                <Input required value={spec.value || ''} onChange={(e) => updateSpec(index, 'value', e.target.value)} placeholder="Contoh: Full Cotton" />
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeSpecRow(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <input type="hidden" name="specificationsData" value={JSON.stringify(specifications)} />
        </div>
    );
}
