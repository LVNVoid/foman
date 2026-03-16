import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Printer, Users, Award, Clock } from "lucide-react";
import { BrandsSection } from "@/components/layouts/customer/brands-section";
import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Tentang Kami | Foman Percetakan',
    description: 'Pelajari lebih lanjut tentang Foman Percetakan. Kami adalah mitra percetakan terpercaya sejak bertahun-tahun dengan teknologi modern dan tim ahli profesional.',
    keywords: ['tentang foman percetakan', 'profil percetakan', 'sejarah foman kreasi', 'layanan cetak terbaik'],
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'Tentang Kami | Foman Percetakan',
        description: 'Mitra percetakan terpercaya Anda untuk segala kebutuhan bisnis dan personal. Kualitas terbaik, harga bersaing.',
        url: `${siteConfig.baseUrl}/about`,
        type: 'website',
        images: [`${siteConfig.baseUrl}/og-image-foman.jpg`],
    },
};

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            <div className="container pt-10">
                <h1 className="text-3xl font-bold mb-4">Tentang Foman Kreasi</h1>
                <p className="text-muted-foreground text-md md:text-lg">
                    Mitra percetakan terpercaya Anda untuk segala kebutuhan bisnis dan personal. Kualitas terbaik, harga bersaing.
                </p>
            </div>

            <section className="py-12 md:py-16 lg:py-20">
                <div className="container">
                    <div className="grid gap-12  lg:grid-cols-2 lg:gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tentang Kami</h2>
                            <p className="text-muted-foreground text-md md:text-lg leading-relaxed">
                                Foman Kreasi didirikan dengan visi sederhana: membuat layanan percetakan berkualitas tinggi dapat diakses oleh semua orang. Bermula dari sebuah toko kecil di pusat kota, kami kini telah berkembang menjadi salah satu penyedia layanan percetakan digital terdepan.
                            </p>
                            <p className="text-muted-foreground text-md md:text-lg leading-relaxed">
                                Kami menggabungkan teknologi percetakan terbaru dengan keahlian tim yang berdedikasi untuk menghasilkan produk yang tidak hanya memenuhi, tetapi melampaui ekspektasi pelanggan kami.
                            </p>
                        </div>
                        <div className="grid gap-2 md:gap-4 grid-cols-2">
                            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
                                <Printer className="h-10 w-10 text-primary mb-2" />
                                <h3 className="text-xl font-bold text-center">Teknologi Modern</h3>
                                <p className="text-sm text-center text-muted-foreground">Mesin cetak terbaru untuk hasil tajam dan akurat.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
                                <Users className="h-10 w-10 text-primary mb-2 text-center" />
                                <h3 className="text-xl font-bold text-center">Tim Ahli</h3>
                                <p className="text-sm text-center text-muted-foreground">Didukung oleh profesional berpengalaman di bidangnya.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
                                <Award className="h-10 w-10 text-primary mb-2 text-center" />
                                <h3 className="text-xl font-bold text-center">Kualitas Premium</h3>
                                <p className="text-sm text-center text-muted-foreground">Standar kontrol kualitas yang ketat untuk setiap pesanan.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
                                <Clock className="h-10 w-10 text-primary mb-2 text-center" />
                                <h3 className="text-xl font-bold text-center">Tepat Waktu</h3>
                                <p className="text-sm text-center text-muted-foreground">Komitmen kami untuk menyelesaikan pesanan sesuai jadwal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BrandsSection />

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Siap Mencetak Ide Anda?</h2>
                        <p className=" text-lg md:text-xl max-w-[600px] opacity-90">
                            Hubungi kami jika Anda memiliki pertanyaan khusus atau mulailah menjelajahi layanan kami sekarang.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/products">
                                <Button size="lg" variant="secondary" className="font-semibold">
                                    Lihat Produk
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold">
                                    Hubungi Kami
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
}
