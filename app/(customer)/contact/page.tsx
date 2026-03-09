import { Mail, MapPin, Phone, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

async function getContactSettings() {
    const settings = await prisma.storeSettings.findFirst();
    return settings;
}

import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getContactSettings();
    const storeName = settings?.storeName || 'Foman Percetakan';

    return {
        title: `Hubungi Kami | ${storeName}`,
        description: `Hubungi ${storeName} untuk pertanyaan tentang layanan, produk cetak, atau pesanan khusus Anda. Kami siap melayani di ${settings?.contactAddress || 'Jakarta'}.`,
        keywords: ['hubungi foman percetakan', 'kontak percetakan', 'alamat foman kreasi', 'nomor telepon foman kreasi', 'customer service cetak'],
        alternates: {
            canonical: `${siteConfig.baseUrl}/contact`,
        },
        openGraph: {
            title: `Hubungi Kami | ${storeName}`,
            description: `Hubungi ${storeName} untuk pertanyaan tentang layanan, produk cetak, atau pesanan khusus Anda. Kami siap membantu.`,
            url: `${siteConfig.baseUrl}/contact`,
            type: 'website',
            images: [`${siteConfig.baseUrl}/og-image-foman.jpg`],
        },
    };
}

export default async function ContactPage() {
    const settings = await getContactSettings();

    return (
        <div className="flex flex-col">
            <div className="container pt-10 ">
                <h1 className="text-3xl font-bold mb-4">Hubungi Kami</h1>
                <p className="text-muted-foreground text-md md:text-lg">Kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui formulir di bawah ini atau kunjungi lokasi kami.</p>
            </div>
            <section className="py-8 md:py-16">
                <div className="container">
                    <div className="grid gap-10 lg:grid-cols-2">

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Informasi Kontak</h2>
                                <p className="text-muted-foreground">
                                    Tim kami akan dengan senang hati menjawab pertanyaan Anda tentang layanan dan produk kami.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Alamat</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {settings?.contactAddress || "Jl. Percetakan Negara No. 123\nJakarta Pusat, DKI Jakarta 10560"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Telepon</h3>
                                        <p className="text-muted-foreground">
                                            {`+${settings?.contactPhone}` || "+62 21 1234 5678"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email</h3>
                                        <p className="text-muted-foreground">
                                            {settings?.contactEmail || "info@fomanprinting.com"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Clock className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Jam Operasional</h3>
                                        <p className="font-medium text-foreground">
                                            {settings?.openDays || "Senin - Jumat"}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {settings?.openHours || "08:00 - 17:00"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Embed */}
                        <div className="rounded-lg mt-8 overflow-hidden border bg-muted h-[400px] w-full relative">
                            {settings?.googleMapsEmbedUrl ? (
                                <iframe
                                    src={settings.googleMapsEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                    <MapPin className="h-10 w-10 opacity-50" />
                                    <p>Peta lokasi belum diatur</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
