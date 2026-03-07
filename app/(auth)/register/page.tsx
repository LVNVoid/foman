import { RegisterForm } from '@/features/auth/components/register-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Daftar Akun - Foman Percetakan',
  description: 'Buat akun baru di Foman Percetakan. Dapatkan akses cepat dan mudah untuk memesan berbagai produk cetak berkualitas.',
  alternates: {
    canonical: `${siteConfig.baseUrl}/register`,
  },
  openGraph: {
    title: 'Daftar Akun - Foman Percetakan',
    description: 'Buat akun baru di Foman Percetakan.',
    url: `${siteConfig.baseUrl}/register`,
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <RegisterForm className="w-full max-w-sm" />
    </div>
  );
};

export default RegisterPage;
