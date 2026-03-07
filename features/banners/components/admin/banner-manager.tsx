'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/app/generated/prisma/client';
import { createBanner, deleteBanner, toggleBannerActive } from '@/features/banners/actions/banner.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useFormStatus } from 'react-dom';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menambahkan...' : 'Tambah Banner'}
        </Button>
    );
}

export function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        setBanners(initialBanners);
    }, [initialBanners]);

    async function handleAction(formData: FormData) {
        const res = await createBanner(formData);
        if (res.success && res.banner) {
            toast.success(res.message);
            setPreviewUrl(null);
            const form = document.getElementById('banner-form') as HTMLFormElement;
            form?.reset();
            setBanners((prev) => [res.banner as Banner, ...prev]);
        } else {
            toast.error(typeof (res as any).error === 'string' ? (res as any).error : 'Gagal menambahkan banner');
        }
    }

    const handleToggle = async (id: string, checked: boolean) => {
        setBanners(prev => prev.map(b => b.id === id ? { ...b, active: checked } : b));

        const res = await toggleBannerActive(id, checked);
        if (res.success && res.banner) {
            toast.success('Status banner diperbarui');
            setBanners(prev => prev.map(b => b.id === id ? res.banner as Banner : b));
        } else {
            setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !checked } : b));
            toast.error('Gagal memperbarui status');
        }
    };

    const handleDelete = async (id: string) => {
        const oldBanners = banners;
        setBanners(prev => prev.filter(b => b.id !== id));

        const res = await deleteBanner(id);
        if (res.success) {
            toast.success(res.message);
        } else {
            setBanners(oldBanners);
            toast.error(res.error || 'Gagal menghapus banner');
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Banner Baru</CardTitle>
                    <CardDescription>Unggah gambar banner baru untuk ditampilkan di beranda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleAction} id="banner-form" className="space-y-4 max-w-xl">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input id="title" name="title" required placeholder="Contoh: Promo Spesial" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link">Tautan (Opsional)</Label>
                            <Input id="link" name="link" placeholder="/products/promo" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Gambar</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file));
                                    } else {
                                        setPreviewUrl(null);
                                    }
                                }}
                            />
                            {previewUrl && (
                                <div className="mt-2 relative w-full h-40 border rounded-lg overflow-hidden bg-muted">
                                    <Image src={previewUrl} fill alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="active" name="active" defaultChecked />
                            <Label htmlFor="active">Langsung aktif</Label>
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {banners.map((banner) => (
                    <Card key={banner.id} className={`overflow-hidden transition-opacity ${!banner.active ? 'opacity-75 bg-muted/50' : ''}`}>
                        <div className="relative w-full aspect-video bg-muted">
                            <Image
                                src={banner.imageUrl}
                                fill
                                alt={banner.title}
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {!banner.active && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="bg-background/80 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">Tidak Aktif</span>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                                <h3 className="font-semibold truncate" title={banner.title}>{banner.title}</h3>
                                {banner.link && (
                                    <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center hover:underline truncate">
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        {banner.link}
                                    </a>
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={banner.active}
                                        onCheckedChange={(checked) => handleToggle(banner.id, checked)}
                                    />
                                    <span className="text-xs text-muted-foreground">{banner.active ? 'Aktif' : 'Tidak Aktif'}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                                    onClick={() => handleDelete(banner.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}