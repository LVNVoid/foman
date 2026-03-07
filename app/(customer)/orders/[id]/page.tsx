import { getOrderById } from '@/features/orders/actions/admin-order.actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import Image from 'next/image';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage(props: PageProps) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const { success, order } = await getOrderById(params.id);

    if (!success || !order) {
        notFound();
    }

    // Security Check: Ensure order belongs to logged-in user
    if (order.user?.id !== session.user.id) {
        redirect('/orders');
    }

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Detail Pesanan</h1>
                    <p className="text-muted-foreground text-sm">Validasi order: #{order.id.slice(0, 8)}</p>
                </div>
                <div className="ml-auto">
                    <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-base px-4 py-1">
                        {order.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Pesanan</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                                            {item.product.pictures?.[0]?.imageUrl ? (
                                                <Image
                                                    src={item.product.pictures[0].imageUrl}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-secondary">
                                                    <span className="text-xs text-muted-foreground">No Img</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{item.product.name}</h3>
                                            <p className="text-sm text-muted-foreground">{item.quantity} x {formatCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rincian Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal Produk</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                            {/* Add shipping or other fees here if available */}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Belanja</span>
                                <span className="text-primary">{formatCurrency(order.total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Pengiriman</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{session.user.name}</p>
                                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                                    {/* Ideally address should be stored in Order model, using User as fallback for now if not stored */}
                                    {/* <p className="text-sm text-muted-foreground mt-2">Jl. Contoh Alamat No. 123, Jakarta Selatan, DKI Jakarta 12345</p> */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Butuh Bantuan?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" asChild>
                                <Link href="https://wa.me/6281234567890" target="_blank">
                                    Hubungi WhatsApp
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
