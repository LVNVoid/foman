'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateStoreSettings } from '@/features/settings/actions/settings.actions';
import { useFormStatus } from 'react-dom';
import { StoreSettings } from '@/app/generated/prisma/client';
import { useActionState } from 'react';

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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola informasi umum toko Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Nama Toko</Label>
                        <Input
                            id="storeName"
                            name="storeName"
                            defaultValue={settings?.storeName || 'My Store'}
                            required
                        />
                        {((state?.error as Record<string, string[]>)?.storeName) && (
                            <p className="text-sm text-red-500">{(state?.error as Record<string, string[]>).storeName[0]}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <Input
                            id="whatsappNumber"
                            name="whatsappNumber"
                            defaultValue={settings?.whatsappNumber || ''}
                            placeholder="e.g. 6281234567890"
                        />
                        {((state?.error as Record<string, string[]>)?.whatsappNumber) && (
                            <p className="text-sm text-red-500">{(state?.error as Record<string, string[]>).whatsappNumber[0]}</p>
                        )}
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
