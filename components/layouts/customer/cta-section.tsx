import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
    return (
        <section className="py-24">
            <div className="container">
                <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-24 text-center md:text-left">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl mb-4">
                                Siap untuk mewujudkan ide Anda?
                            </h2>
                            <p className="text-lg text-primary-foreground/80">
                                Bergabunglah dengan ribuan pelanggan puas dan mulai perjalanan mencetak Anda hari ini.
                                Dapatkan diskon 20% untuk pesanan pertama Anda!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-semibold shadow-lg">
                                    Mulai Sekarang
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                                    Hubungi Penjualan <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
