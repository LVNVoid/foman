'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global application error:', error);
    }, [error]);

    return (
        <div className="flex h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <svg
                        className="h-10 w-10 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                        Oops! Terjadi Kesalahan
                    </h1>
                    <p className="text-muted-foreground">
                        Maaf, kami mengalami masalah internal saat memproses permintaan Anda. Sistem sedang mengalami gangguan sesaat.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Coba Lagi
                    </button>
                    <Link
                        href="/"
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
