'use client';

import { Building2, Globe2, ShoppingBag, Truck, Zap, ShieldCheck } from 'lucide-react';

const brands = [
    {
        name: 'TechCorp',
        icon: Building2,
    },
    {
        name: 'GlobalBiz',
        icon: Globe2,
    },
    {
        name: 'Shopify',
        icon: ShoppingBag,
    },
    {
        name: 'LogisticPro',
        icon: Truck,
    },
    {
        name: 'FastPrint',
        icon: Zap,
    },
    {
        name: 'SecurePay',
        icon: ShieldCheck,
    },
];

export function BrandsSection({ title = 'Dipercaya oleh Perusahaan Terkemuka' }: { title?: string }) {
    return (
        <section className="py-12 bg-muted/30 border-y">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-muted-foreground uppercase tracking-widest">
                        {title}
                    </h2>
                </div>

                {/* Grid Layout for stability and responsiveness */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {brands.map((brand) => (
                        <div
                            key={brand.name}
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div className="p-4 rounded-full bg-background border shadow-sm group-hover:border-primary/50 group-hover:text-primary transition-colors">
                                <brand.icon className="h-8 w-8" />
                            </div>
                            <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
