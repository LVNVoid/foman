'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema as profileFormSchema, UpdateProfileInput } from '@/features/profile/schemas/profile.schema';
import { useSession } from 'next-auth/react';
import { updateProfile } from '@/features/profile/actions/profile.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, User } from 'lucide-react';



interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        profileUrl: string | null;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(user.profileUrl);
    const [isImageDeleted, setIsImageDeleted] = useState(false);
    const router = useRouter();
    const { update } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            password: '',
            deleteImage: false,
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setValue('image', file);
            setIsImageDeleted(false);
        }
    };

    const onSubmit = (data: UpdateProfileInput) => {
        setError('');
        setSuccess('');

        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.email) formData.append('email', data.email);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.password) {
            formData.append('password', data.password);
        }
        if (data.image) {
            formData.append('image', data.image);
        }
        if (isImageDeleted) {
            formData.append('deleteImage', 'true');
        }

        startTransition(async () => {
            const result = await updateProfile({ success: false, error: null }, formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess('Profil berhasil diperbarui');
                await update();
                router.refresh();
            }
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-background ">
            <CardHeader>
                <CardTitle>Pengaturan Profil</CardTitle>
                <CardDescription>
                    Perbarui informasi pribadi dan foto profil Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 group">
                            {preview ? (
                                <>
                                    <Image
                                        src={preview}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreview(null);
                                            setValue('image', undefined);
                                            setIsImageDeleted(true);
                                            // Reset file input
                                            const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
                                            if (fileInput) fileInput.value = '';
                                        }}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Hapus foto profil"
                                    >
                                        <X className="text-white w-8 h-8" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-gray-400">
                                    <User className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Input
                                id="profile-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full max-w-[250px]"
                            />
                            <p className="text-xs text-muted-foreground">
                                Klik gambar untuk menghapus
                            </p>
                        </div>
                    </div>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Nama</FieldLabel>
                            <Input id="name" {...register('name')} />
                            <FieldError errors={[{ message: errors.name?.message }]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="email" {...register('email')} />
                            <FieldError errors={[{ message: errors.email?.message }]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
                            <Input id="phoneNumber" type="tel" {...register('phoneNumber')} />
                            <FieldError errors={[{ message: errors.phoneNumber?.message }]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Kata Sandi Baru (Opsional)</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Biarkan kosong untuk menyimpan kata sandi saat ini"
                                {...register('password')}
                            />
                            <FieldError errors={[{ message: errors.password?.message }]} />
                        </Field>
                    </FieldGroup>

                    {error && (
                        <div className="text-sm text-destructive font-medium">{error}</div>
                    )}
                    {success && (
                        <div className="text-sm text-green-600 font-medium">{success}</div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
