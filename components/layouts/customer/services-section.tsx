import {
    CreditCard,
    FileText,
    Image as ImageIcon,
    Sticker,
    BookOpen,
    Package,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        title: 'Kartu Nama',
        description: 'Buat kesan mendalam dengan kartu nama premium.',
        icon: CreditCard,
        href: '/services/business-cards',
        color: 'bg-blue-500/10 text-blue-600',
    },
    {
        title: 'Flyer & Brosur',
        description: 'Sebarkan informasi secara efektif dengan flyer berkualitas tinggi.',
        icon: FileText,
        href: '/services/flyers',
        color: 'bg-green-500/10 text-green-600',
    },
    {
        title: 'Spanduk & Papan Nama',
        description: 'Pencetakan format besar untuk acara dan etalase toko.',
        icon: ImageIcon,
        href: '/services/banners',
        color: 'bg-purple-500/10 text-purple-600',
    },
    {
        title: 'Stiker & Label',
        description: 'Stiker dan label kustom untuk kemasan atau kesenangan.',
        icon: Sticker,
        href: '/services/stickers',
        color: 'bg-orange-500/10 text-orange-600',
    },
    {
        title: 'Booklet & Katalog',
        description: 'Jilid profesional untuk laporan dan majalah.',
        icon: BookOpen,
        href: '/services/booklets',
        color: 'bg-pink-500/10 text-pink-600',
    },
    {
        title: 'Kemasan',
        description: 'Kotak kustom untuk meningkatkan presentasi produk Anda.',
        icon: Package,
        href: '/services/packaging',
        color: 'bg-yellow-500/10 text-yellow-600',
    },
];

export function ServicesSection() {
    return (
        <section className="py-24 bg-secondary/30">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">
                            Layanan Kami
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Kami menawarkan berbagai solusi percetakan yang disesuaikan dengan kebutuhan Anda.
                            Kualitas tinggi, pengerjaan cepat, dan harga bersaing.
                        </p>
                    </div>
                    <Link href="/services">
                        <Button variant="ghost" className="gap-2 text-primary">
                            Lihat Semua Layanan <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <Link key={service.title} href={service.href} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full bg-background border rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                                <div className={`h-14 w-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="h-7 w-7" />
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Pelajari lebih lanjut <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Button } from '@/components/ui/button';
