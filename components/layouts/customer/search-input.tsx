'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput({ className, ...props }: React.ComponentProps<"div">) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
            params.set('page', '1'); // Reset to page 1 on new search
        } else {
            params.delete('search');
        }
        replace(`/products?${params.toString()}`);
    }, 300);

    return (
        <div className={`relative ${className}`} {...props}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Cari produk..."
                className="w-full bg-secondary/50 pl-9 focus-visible:bg-background"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('search')?.toString()}
            />
        </div>
    );
}
