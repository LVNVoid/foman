'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  phoneNumber: z.string().min(9, 'Nomor telepon tidak valid').max(15, 'Nomor telepon terlalu panjang'),
});

export async function SignUp(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    const validatedData = signUpSchema.safeParse(rawData);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const { name, email, password, phoneNumber } = validatedData.data;

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (exists) {
      if (exists.email === email) {
        return { error: 'Email sudah terdaftar' };
      }
      if (exists.phoneNumber === phoneNumber) {
        return { error: 'Nomor telepon sudah terdaftar' };
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'CUSTOMER',
        phoneNumber,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi.' };
  }

  redirect('/login');
}
