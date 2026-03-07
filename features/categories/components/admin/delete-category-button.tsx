'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteCategory } from '@/features/categories/actions/category.actions';
import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteCategoryMenuItem({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Kategori ini akan dihapus permanen.
                        Produk yang terkait dengan kategori ini akan menjadi "Tanpa Kategori".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            startTransition(async () => {
                                const result = await deleteCategory(id);
                                if (result.success) {
                                    toast.success('Kategori berhasil dihapus');
                                } else {
                                    toast.error(result.error as string);
                                }
                            });
                        }}
                        disabled={isPending}
                    >
                        Lanjutkan
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
