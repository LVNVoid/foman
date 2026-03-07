'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { createCategory, updateCategory } from '@/features/categories/actions/category.actions';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Memperbarui...' : 'Membuat...') : (isEditing ? 'Perbarui Kategori' : 'Buat Kategori')}
        </Button>
    );
}

interface SelectedFile {
    file: File;
    url: string;
}

interface CategoryDialogProps {
    category?: { id: string; name: string; imageUrl?: string | null; imagePublicId?: string | null };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CategoryDialog({ category, open: controlledOpen, onOpenChange: controlledOnOpenChange, trigger }: CategoryDialogProps & { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const isEditing = !!category;
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const [isDeletingImage, setIsDeletingImage] = useState(false);

    // Use controlled state if provided, otherwise local state
    const isOpen = controlledOpen !== undefined ? controlledOpen : open;

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setIsDeletingImage(false);
        }
        return () => {
            if (selectedFile) URL.revokeObjectURL(selectedFile.url);
        }
    }, [isOpen, selectedFile]);

    const onOpenChange = controlledOnOpenChange || setOpen;

    // Wrap action to handle FormData manipulation if needed
    const actionWithImage = async (prevState: any, formData: FormData) => {
        if (selectedFile) {
            formData.set('image', selectedFile.file);
        }
        if (isDeletingImage) {
            formData.set('deleteImage', 'true');
        }
        return isEditing ? updateCategory(category.id, prevState, formData) : createCategory(prevState, formData);
    };

    const [state, formAction] = useActionState(actionWithImage, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(isEditing ? 'Kategori diperbarui' : 'Kategori dibuat');
            onOpenChange(false);
        }
    }, [state, isEditing, onOpenChange]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger ? trigger : (isEditing ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                ) : (
                    <Button>
                        Tambah Kategori
                    </Button>
                ))}
            </DialogTrigger>
            <DialogContent className="bg-card">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Kategori' : 'Buat Kategori'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Perbarui detail kategori di bawah ini.' : 'Tambahkan kategori baru ke toko Anda.'}
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={category?.name}
                            required
                        />
                        {state?.error?.name && (
                            <p className="text-sm text-red-500">{state.error.name[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Gambar Kategori (Opsional)</Label>
                        <div className="flex gap-4 items-start">
                            {/* Preview of new file */}
                            {selectedFile ? (
                                <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={selectedFile.url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFile(null)}
                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                // Preview of existing image
                                isEditing && category?.imageUrl && !isDeletingImage && (
                                    <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={category.imageUrl} alt="Category" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setIsDeletingImage(true)}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}

                            <div className="flex-1">
                                <Label htmlFor="image" className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted/50 transition-colors">
                                        <Plus className="w-4 h-4" />
                                        <span className="text-sm">Pilih Gambar</span>
                                    </div>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert('Ukuran gambar maksimal 2MB');
                                                    return;
                                                }
                                                setSelectedFile({
                                                    file,
                                                    url: URL.createObjectURL(file)
                                                });
                                                setIsDeletingImage(false); // If we select new, we are effectively keeping an image (the new one)
                                            }
                                        }}
                                    />
                                </Label>
                                <p className="text-xs text-muted-foreground mt-2">
                                    JPG, PNG. Max 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
