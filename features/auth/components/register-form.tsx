'use client';

import { cn } from '@/lib/utils';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { signUp } from '@/features/auth/actions/auth.actions';
import { Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus minimal 2 karakter' }),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  phoneNumber: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message:
      'Format nomor telepon tidak valid, masukkan nomor telepon contoh: 08123456789',
  }),
  password: z
    .string()
    .min(6, { message: 'Kata sandi harus minimal 6 karakter' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('password', data.password);

    try {
      const result = await signUp({} as any, formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan yang tidak terduga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Buat akun</CardTitle>
          <CardDescription>
            Masukkan detail Anda di bawah ini untuk membuat akun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama"
                  {...register('name')}
                  suppressHydrationWarning
                />
                <FieldError errors={[{ message: errors.name?.message }]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="Masukkan email"
                  {...register('email')}
                  suppressHydrationWarning
                />
                <FieldError errors={[{ message: errors.email?.message }]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="08123456789"
                  {...register('phoneNumber')}
                  suppressHydrationWarning
                />
                <FieldError
                  errors={[{ message: errors.phoneNumber?.message }]}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Kata sandi</FieldLabel>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    suppressHydrationWarning
                    className="pr-10"
                  />

                  <Button
                    variant="ghost"
                    type="button"
                    size="icon-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>

                <FieldError errors={[{ message: errors.password?.message }]} />
              </Field>
              {error && (
                <div className="text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sedang membuat akun...' : 'Daftar'}
              </Button>
              <div className="text-center text-sm">
                Sudah punya akun?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Masuk
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
