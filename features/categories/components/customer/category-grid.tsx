import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Printer,
  type LucideIcon,
  LayoutGrid,
  Shirt,
  Presentation,
  Gift,
} from 'lucide-react';
import Image from 'next/image';

interface CategoryGridProps {
  activeCategory?: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'media-promosi-cetak': Printer,
  'pakaian-and-seragam': Shirt,
  'perlengkapan-acara-and-seminar': Presentation,
  'souvenir-and-alat-tulis': Gift,
};

export async function CategoryGrid({ activeCategory }: CategoryGridProps) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (categories.length === 0) {
    return null;
  }

  const activeCategories = categories.filter((c) => c._count.products > 0);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Kategori Pilihan</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-4 gap-x-4">
        <Link
          href="/?category="
          className="flex flex-col items-center group cursor-pointer"
        >
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-105 border ${!activeCategory ? 'bg-primary/5 border-primary shadow-sm' : 'bg-secondary/10 border-transparent'}`}
          >
            <LayoutGrid
              className={`w-5 h-5 md:w-6 md:h-6 ${!activeCategory ? 'text-primary' : 'text-muted-foreground'}`}
            />
          </div>
          <span
            className={`text-xs font-medium text-center px-1 leading-tight ${!activeCategory ? 'text-primary' : 'text-foreground/80'}`}
          >
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
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-2 overflow-hidden relative transition-transform group-hover:scale-105 border ${isActive ? 'bg-primary/5 border-primary shadow-sm' : 'bg-secondary/10 border-transparent'}`}
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover p-1.5"
                    sizes="(max-width: 768px) 48px, 56px"
                  />
                ) : (
                  <Icon
                    className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium text-center px-1 leading-tight line-clamp-2 ${isActive ? 'text-primary' : 'text-foreground/80'}`}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}