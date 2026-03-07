import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Flag,
    CreditCard,
    StickyNote,
    BookOpen,
    Image as ImageIcon,
    Printer,
    Box,
    FileText,
    type LucideIcon
} from 'lucide-react';
import Image from 'next/image';

interface CategoryGridProps {
    activeCategory?: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'spanduk': Flag,
    'banner': Flag,
    'kartu-nama': CreditCard,
    'id-card': CreditCard,
    'sticker': StickyNote,
    'label': StickyNote,
    'brosur': BookOpen,
    'flyer': FileText,
    'poster': ImageIcon,
    'box': Box,
    'kotak': Box,

};

export async function CategoryGrid({ activeCategory }: CategoryGridProps) {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc',
        },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    if (categories.length === 0) {
        return null;
    }

    // Filter categories that have products or you want to show
    const activeCategories = categories.filter(c => c._count.products > 0);

    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Kategori Pilihan</h2>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-8 gap-x-4">
                <Link
                    href="/?category="
                    className="flex flex-col items-center group cursor-pointer"
                >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-105 border ${!activeCategory ? 'bg-primary/5 border-primary shadow-sm' : 'bg-secondary/10 border-transparent'}`}>
                        <Box className={`w-8 h-8 ${!activeCategory ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className={`text-xs md:text-sm font-medium text-center px-1 leading-tight ${!activeCategory ? 'text-primary' : 'text-foreground/80'}`}>
                        Semua
                    </span>
                </Link>

                {activeCategories.map((category) => {
                    const Icon = CATEGORY_ICONS[category.slug] || Printer;
                    const isActive = activeCategory === category.slug;

                    return (
                        <Link
                            key={category.id}
                            href={`/?category=${category.slug}`}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 overflow-hidden relative transition-transform group-hover:scale-105 border ${isActive ? 'bg-primary/5 border-primary shadow-sm' : 'bg-secondary/10 border-transparent'}`}>
                                {category.imageUrl ? (
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover p-2"
                                        sizes="(max-width: 768px) 64px, 80px"
                                    />
                                ) : (
                                    <Icon className={`w-8 h-8 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                )}
                            </div>
                            <span className={`text-xs md:text-sm font-medium text-center px-1 leading-tight line-clamp-2 ${isActive ? 'text-primary' : 'text-foreground/80'}`}>
                                {category.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
