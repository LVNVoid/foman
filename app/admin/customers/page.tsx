import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCustomers } from '@/features/customers/actions/customer.actions';
import { formatDate } from '@/lib/utils';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomersTableToolbar } from '@/features/customers/components/admin/customers-table-toolbar';
import { CustomersPagination } from '@/features/customers/components/admin/customers-pagination';

interface CustomersAdminPageProps {
    searchParams: Promise<{
        page?: string;
        query?: string;
        limit?: string;
    }>;
}

export default async function CustomersAdminPage({ searchParams }: CustomersAdminPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.query || '';
    const limit = Number(params.limit) || 10;

    const { users: customers, totalPages, totalUsers } = await getCustomers({
        page,
        query,
        limit,
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pelanggan</h1>
            <CustomersTableToolbar />
            <div className="rounded-md border bg-card">
                <Table className="w-full caption-bottom text-sm">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</TableHead>
                            <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</TableHead>
                            <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nomor Telepon</TableHead>
                            <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Peran</TableHead>
                            <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal Bergabung</TableHead>
                            <TableHead className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="p-4 text-center text-muted-foreground">
                                    Tidak ada pelanggan ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer: any) => (
                                <TableRow key={customer.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <TableCell className="p-4 align-middle font-medium">{customer.name}</TableCell>
                                    <TableCell className="p-4 align-middle">{customer.email}</TableCell>
                                    <TableCell className="p-4 align-middle">{customer.phoneNumber}</TableCell>
                                    <TableCell className="p-4 align-middle">{customer.role}</TableCell>
                                    <TableCell className="p-4 align-middle">{formatDate(customer.createdAt)}</TableCell>
                                    <TableCell className="p-4 align-middle text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Buka menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/customers/${customer.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <CustomersPagination
                    total={totalUsers}
                    pages={totalPages}
                    page={page}
                    limit={limit}
                />
            )}
        </div>
    );
}