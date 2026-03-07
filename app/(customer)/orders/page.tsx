import { OrderToolbar } from '@/features/orders/components/customer/order-toolbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import { getUserOrders } from '@/features/orders/actions/order.actions';

export const metadata: Metadata = {
    title: 'Pesanan Saya - Foman Percetakan',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const orders = await getUserOrders(session.user.id, ['PENDING', 'PAID', 'SHIPPED']);

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Pesanan Saya</h1>

            <OrderToolbar />

            {orders.length > 0 ? (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Pesanan</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Item</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/orders/${order.id}`} className="hover:underline hover:text-primary">
                                            {order.id.slice(0, 8)}...
                                        </Link>
                                    </TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(order.total)}
                                    </TableCell>
                                    <TableCell>
                                        {order.items.length} item
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-20 border rounded-lg bg-secondary/10">
                    <p className="text-muted-foreground">Tidak ada pesanan yang sedang berjalan.</p>
                </div>
            )}
        </div>
    );
}
