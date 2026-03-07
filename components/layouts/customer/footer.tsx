import Link from 'next/link';
import { Printer, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
            <div className="container py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Printer className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Foman Printing</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Solusi satu pintu untuk semua kebutuhan percetakan berkualitas tinggi Anda.
                            Layanan profesional, cepat, dan terpercaya.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Produk</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products?category=brosur" className="hover:text-primary">Brosur</Link></li>
                            <li><Link href="/products?category=kalender" className="hover:text-primary">Kalender</Link></li>
                            <li><Link href="/products?category=kartu-nama" className="hover:text-primary">Kartu Nama</Link></li>
                            <li><Link href="/products?category=undangan" className="hover:text-primary">Undangan</Link></li>
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
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>123 Printing Street, City, Country</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+1 234 567 8900</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>hello@printmaster.com</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} PrintMaster. Hak cipta dilindungi.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-primary">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-primary">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
