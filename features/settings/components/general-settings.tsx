'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateStoreSettings } from '@/features/settings/actions/settings.actions';
import { useFormStatus } from 'react-dom';
import { StoreSettings } from '@/app/generated/prisma/client';
import { useActionState, useEffect, useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
    );
}

export function GeneralSettings({ settings }: { settings: StoreSettings | null }) {
    const [state, formAction] = useActionState(updateStoreSettings, null);

    // Stable key: hanya increment setelah sukses, bukan setiap render
    const [formKey, setFormKey] = useState(0);

    // Controlled state agar input update saat settings dari server berubah
    const [storeName, setStoreName] = useState(settings?.storeName ?? 'My Store');
    const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber ?? '');

    // Sync saat settings baru datang dari server (setelah revalidatePath)
    useEffect(() => {
        setStoreName(settings?.storeName ?? 'My Store');
        setWhatsappNumber(settings?.whatsappNumber ?? '');
    }, [settings]);

    // Reset form key hanya sekali per submit sukses
    useEffect(() => {
        if (state?.success) {
            setFormKey((prev) => prev + 1);
        }
    }, [state?.success]);

    const fieldErrors = state?.error as Record<string, string[]> | undefined;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola informasi umum toko Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                {state?.success && (
                    <p className="text-sm text-green-600 mb-4">✓ Pengaturan berhasil disimpan.</p>
                )}
                <form key={formKey} action={formAction} className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Nama Toko</Label>
                        <Input
                            id="storeName"
                            name="storeName"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                        />
                        {fieldErrors?.storeName && (
                            <p className="text-sm text-red-500">{fieldErrors.storeName[0]}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <Input
                            id="whatsappNumber"
                            name="whatsappNumber"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            placeholder="e.g. 6281234567890"
                        />
                        {fieldErrors?.whatsappNumber && (
                            <p className="text-sm text-red-500">{fieldErrors.whatsappNumber[0]}</p>
                        )}
                    </div>
                    {fieldErrors?.form && (
                        <p className="text-sm text-red-500">{fieldErrors.form[0]}</p>
                    )}
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
