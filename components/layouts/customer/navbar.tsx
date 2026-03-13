'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/layouts/customer/search-input';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, Printer, Search, User } from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { useState, useEffect, Suspense } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSession, signOut } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export function Navbar({ storeName }: { storeName?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    const handleLogout = () => {
        signOut();
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Bar - Desktop Only */}
            <div className="hidden lg:block w-full bg-muted/40 border-b h-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6 text-xs font-medium text-muted-foreground">
                    <div>
                        Buka Senin - Jumat (08.00 - 17.00)
                    </div>
                    <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
                        <Link
                            href="/about"
                            className={`transition-colors hover:text-primary ${pathname === '/about' ? 'text-primary font-bold' : ''}`}
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="/contact"
                            className={`transition-colors hover:text-primary ${pathname === '/contact' ? 'text-primary font-bold' : ''}`}
                        >
                            Kontak
                        </Link>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-4 group shrink-0">
                        <Image
                            src="/logo-foman.png"
                            alt="Foman Kreasi"
                            width={200}
                            height={200}
                            className="h-12 sm:h-16 w-auto object-contain"
                            priority
                        />
                        <span className="font-bold text-xl sm:text-2xl tracking-tight">Foman Kreasi</span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <div className="flex-1 max-w-md mx-auto hidden lg:block">
                        <Suspense fallback={<div className="w-full h-10 bg-muted animate-pulse rounded-md" />}>
                            <SearchInput />
                        </Suspense>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="sr-only">Cari</span>
                        </Button>

                        {/* Theme Toggle */}
                        <div className="hidden sm:block">
                            <ModeToggle />
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden lg:flex items-center gap-2">
                            {session && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full overflow-hidden p-0">
                                            {session.user.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt={session.user.name || 'User'}
                                                    width={40}
                                                    height={40}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                            )}
                                            <span className="sr-only">Menu pengguna</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {session.user.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {session.user.role === 'ADMIN' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dashboard" className="cursor-pointer">
                                                    Dashboard Admin
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                Profil
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                            Keluar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <div className="flex lg:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                                        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="sr-only">Buka menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                                    <div className="flex flex-col gap-6 mt-6 mx-2">
                                        {/* Mobile User Info */}
                                        {mounted && session && (
                                            <div className="flex items-center gap-3 pb-4 border-b">
                                                <div className="relative h-12 w-12 rounded-full ring-2 ring-primary/10 overflow-hidden flex-shrink-0">
                                                    {session.user.image ? (
                                                        <Image
                                                            src={session.user.image}
                                                            alt={session.user.name || 'User'}
                                                            width={48}
                                                            height={48}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-6 w-6 text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {session.user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {session.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Links */}
                                        <nav className="flex flex-col gap-1">
                                            <Link
                                                href="/"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 transition-colors ${pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                            >
                                                Beranda
                                            </Link>
                                            <Link
                                                href="/products"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 transition-colors ${pathname?.startsWith('/products') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                            >
                                                Produk
                                            </Link>
                                            <Link
                                                href="/about"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 transition-colors ${pathname === '/about' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                            >
                                                Tentang Kami
                                            </Link>
                                            <Link
                                                href="/contact"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 transition-colors ${pathname === '/contact' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                            >
                                                Kontak
                                            </Link>
                                            {mounted && session && (
                                                <div className='flex flex-col py-3 border-t border-b'>
                                                    {session.user.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            onClick={() => setIsOpen(false)}
                                                            className={`text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 transition-colors ${pathname?.startsWith('/admin') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                                        >
                                                            Dashboard Admin
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/profile"
                                                        onClick={() => setIsOpen(false)}
                                                        className={`text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 transition-colors ${pathname?.startsWith('/profile') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                                    >
                                                        Profil
                                                    </Link>
                                                </div>
                                            )}
                                        </nav>

                                        {/* Theme Toggle for Mobile */}
                                        <div className="flex items-center justify-between py-3 px-3 border-t border-b">
                                            <span className="text-sm font-medium">Tema</span>
                                            <ModeToggle />
                                        </div>

                                        {mounted && session && (
                                            <Button
                                                variant="outline"
                                                className="w-full text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsOpen(false);
                                                }}
                                            >
                                                Keluar
                                            </Button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Collapsible) */}
            {showSearch && (
                <div className="lg:hidden pb-3 pt-2 mx-4 animate-in slide-in-from-top-2">
                    <Suspense fallback={null}>
                        <SearchInput autoFocus />
                    </Suspense>
                </div>
            )}
        </header>
    );
}