'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { CategoryDialog } from './category-dialog';
import { DeleteCategoryMenuItem } from './delete-category-button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryTableProps {
    categories: {
        id: string;
        name: string;
        slug: string;
        _count: { products: number };
    }[];
}

export function CategoryTable({ categories }: CategoryTableProps) {

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Kategori</TableHead>
                        <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</TableHead>
                        <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Produk</TableHead>
                        <TableHead className="h-12 px-4 text-right align-middle font-medium text-muted-foreground"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                Tidak ada kategori ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="px-4 align-middle font-medium">{category.name}</TableCell>
                                <TableCell className='px-4 align-middle'>{category.slug}</TableCell>
                                <TableCell className='px-4 align-middle'>{category._count.products}</TableCell>
                                <TableCell className="px-4 align-middle text-right">
                                    <div className="flex justify-end gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Buka menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <CategoryDialog
                                                    category={category}
                                                    trigger={
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                                <DeleteCategoryMenuItem id={category.id} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
