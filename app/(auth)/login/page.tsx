import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/login-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Login - Foman Percetakan',
  description: 'Masuk ke akun Anda untuk mengakses layanan cetak di Foman Percetakan. Nikmati kemudahan memesan berbagai produk cetak berkualitas seperti brosur, kartu nama, banner, dan lainnya.',
  alternates: {
    canonical: `${siteConfig.baseUrl}/login`,
  },
  openGraph: {
    title: 'Login - Foman Percetakan',
    description: 'Masuk ke akun Anda untuk mengakses layanan cetak di Foman Percetakan.',
    url: `${siteConfig.baseUrl}/login`,
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
