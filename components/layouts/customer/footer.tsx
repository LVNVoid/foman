import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import prisma from '@/lib/prisma';

export async function Footer({ settings }: { settings?: Record<string, any> | null }) {
    const storeName = settings?.storeName || 'Foman Kreasi';
    const categories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' }
    });
    return (
        <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
            <div className="container py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-1.5 sm:gap-4 group shrink-0">
                            <Image
                                src="/logo-foman.png"
                                alt={storeName}
                                width={200}
                                height={200}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                            <span className="text-xl font-bold tracking-tight">{storeName}</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Solusi satu pintu untuk semua kebutuhan percetakan berkualitas tinggi Anda.
                            Layanan profesional, cepat, dan terpercaya.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Produk</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/products?category=${category.slug}`} className="hover:text-primary">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Perusahaan</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">Tentang Kami</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Kontak</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Hubungi Kami</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {settings?.contactAddress && (
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span>{settings.contactAddress}</span>
                                </li>
                            )}
                            {settings?.contactPhone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{settings.contactPhone}</span>
                                </li>
                            )}
                            {settings?.contactEmail && (
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>{settings.contactEmail}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} {storeName}. Hak cipta dilindungi.</p>

                </div>
            </div>
        </footer>
    );
}
