import { getOrderById } from '@/actions/admin-order';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderStatusUpdater } from './_components/order-status-updater';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const { order, error } = await getOrderById(id);

  if (error || !order) {
    if (error === 'Order not found') {
      notFound();
    }
    return <div className="p-4 text-red-500">Error loading order: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{order.user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{order.user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Nomor Telepon</dt>
                <dd className="font-medium">{order.user.phoneNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-medium text-xs text-muted-foreground">
                  {order.userId}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-md border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd className="font-medium text-xs text-muted-foreground">
                  {order.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <dt className="font-semibold">Total Amount</dt>
                <dd className="font-bold text-lg">
                  {formatCurrency(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-md border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
