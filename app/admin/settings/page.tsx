'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoreSettings as getSettings, updateStoreSettings as updateSettings } from '@/features/settings/actions/settings.actions';
import { getBanners } from '@/features/banners/actions/banner.actions';
import { toast } from 'sonner';
import { BannerManager } from '@/features/banners/components/admin/banner-manager';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [banners, setBanners] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, bannersRes] = await Promise.all([
                    getSettings(),
                    getBanners()
                ]);

                if (settingsRes.success && 'settings' in settingsRes) {
                    setSettings(settingsRes.settings);
                } else {
                    toast.error('Gagal memuat pengaturan toko.');
                }

                if (Array.isArray(bannersRes)) {
                    setBanners(bannersRes);
                } else {
                    toast.error('Gagal memuat banner.');
                }

            } catch (error) {
                toast.error('Terjadi kesalahan saat memuat data.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await updateSettings(null, formData);
            if (res.success) {
                toast.success('Pengaturan berhasil disimpan!');
                const refreshed = await getSettings();
                if (refreshed.success && 'settings' in refreshed) {
                    setSettings(refreshed.settings);
                }
            } else {
                toast.error('Gagal menyimpan pengaturan.');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menyimpan.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Memuat pengaturan...</div>;
    }

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
                    <p className="text-sm text-muted-foreground mt-1">Ubah pengaturan toko Anda di sini.</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Umum</TabsTrigger>
                    <TabsTrigger value="banner">Banner</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Toko</CardTitle>
                                <CardDescription>Kelola informasi dasar toko Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Nama Toko</Label>
                                    <Input
                                        id="storeName"
                                        name="storeName"
                                        defaultValue={settings?.storeName}
                                        placeholder="Foman Kreasi"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Email Kontak</Label>
                                    <Input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        defaultValue={settings?.contactEmail}
                                        placeholder="info@fomanprinting.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsappNumber">Nomor Telepon / WhatsApp</Label>
                                    <Input
                                        id="whatsappNumber"
                                        name="whatsappNumber"
                                        defaultValue={settings?.whatsappNumber}
                                        placeholder="6281234567890"
                                    />
                                    <p className="text-sm text-muted-foreground">Nomor ini akan digunakan untuk link WhatsApp dan tampilan telepon.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactAddress">Alamat Kontak</Label>
                                    <Textarea
                                        id="contactAddress"
                                        name="contactAddress"
                                        defaultValue={settings?.contactAddress}
                                        placeholder="Alamat lengkap toko..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="googleMapsEmbedUrl">Link Google Maps Embed</Label>
                                    <Input
                                        id="googleMapsEmbedUrl"
                                        name="googleMapsEmbedUrl"
                                        defaultValue={settings?.googleMapsEmbedUrl}
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                    <p className="text-sm text-muted-foreground">Masukan link embed dari Google Maps (src="...").</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="openDays">Hari Buka</Label>
                                        <Input
                                            id="openDays"
                                            name="openDays"
                                            defaultValue={settings?.openDays}
                                            placeholder="Senin - Jumat"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="openHours">Jam Buka</Label>
                                        <Input
                                            id="openHours"
                                            name="openHours"
                                            defaultValue={settings?.openHours}
                                            placeholder="08:00 - 17:00"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button className="ml-auto" type="submit" disabled={saving}>
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="banner">
                    <BannerManager initialBanners={banners} />
                </TabsContent>
            </Tabs>
        </div>
    );
}