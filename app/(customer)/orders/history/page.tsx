import { getUserOrders } from '@/features/orders/actions/order.actions';
import { OrderToolbar } from '@/features/orders/components/customer/order-toolbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

export default async function OrderHistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const orders = await getUserOrders(session.user.id, ['COMPLETED', 'CANCELLED']);

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan</h1>

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
                            {orders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
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
                    <p className="text-muted-foreground">Tidak ada riwayat pesanan.</p>
                </div>
            )}
        </div>
    );
}
