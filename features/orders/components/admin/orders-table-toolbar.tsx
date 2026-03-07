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
import { useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function OrdersTableToolbar() {
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

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (status && status !== 'ALL') {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter pesanan..."
                    className="max-w-xs"
                    defaultValue={searchParams.get('query')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                // className="h-8 w-[150px] lg:w-[250px]"
                />
                <Select
                    defaultValue={searchParams.get('status')?.toString() || 'ALL'}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="PENDING">Tertunda</SelectItem>
                        <SelectItem value="PAID">Dibayar</SelectItem>
                        <SelectItem value="SHIPPED">Dikirim</SelectItem>
                        <SelectItem value="COMPLETED">Selesai</SelectItem>
                        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>

                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
