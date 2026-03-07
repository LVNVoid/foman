'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, History } from 'lucide-react';

export function OrderToolbar() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-2 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
            <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                    "gap-2 hover:bg-background hover:text-foreground",
                    pathname === '/orders' && "bg-background text-foreground shadow-sm font-medium"
                )}
            >
                <Link href="/orders">
                    <Clock className="h-4 w-4" />
                    Sedang Berjalan
                </Link>
            </Button>
            <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                    "gap-2 hover:bg-background hover:text-foreground",
                    pathname === '/orders/history' && "bg-background text-foreground shadow-sm font-medium"
                )}
            >
                <Link href="/orders/history">
                    <History className="h-4 w-4" />
                    Riwayat Pesanan
                </Link>
            </Button>
        </div>
    );
}
