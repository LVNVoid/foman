'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function CustomersTableToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    }, 300);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Cari pelanggan..."
                    className="max-w-xs"
                    defaultValue={searchParams.get('query')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
        </div>
    );
}
