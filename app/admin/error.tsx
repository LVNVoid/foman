'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error('Admin panel error:', error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center p-8 text-center">
            <div className="flex max-w-md flex-col items-center gap-6 rounded-lg border bg-card p-8 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Gangguan Sistem</h2>
                    <p className="text-sm text-muted-foreground">
                        Gagal memuat data di panel admin. Pastikan koneksi database Anda berjalan normal.
                    </p>
                </div>

                <div className="flex w-full gap-3">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => reset()}
                        className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Coba Ulang
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 w-full rounded-md bg-muted p-4 text-left text-xs">
                        <p className="font-semibold text-destructive mb-1">Error Details (Dev Only):</p>
                        <p className="font-mono break-all text-muted-foreground">{error.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
