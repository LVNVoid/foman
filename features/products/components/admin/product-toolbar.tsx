'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface ProductToolbarProps {
    categories: { id: string; name: string }[];
}

export function ProductToolbar({ categories }: ProductToolbarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (value && value !== 'all') {
            params.set('categoryId', value);
        } else {
            params.delete('categoryId');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-4">
                <Input
                    placeholder="Cari produk..."
                    className="max-w-xs"
                    defaultValue={searchParams.get('query')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Select
                    defaultValue={searchParams.get('categoryId')?.toString() || 'all'}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter berdasarkan kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
