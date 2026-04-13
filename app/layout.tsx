import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SessionProvider } from './providers/session-provider';
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';
import { OrganizationJsonLd } from '@/components/json-ld';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://foman.id'),
  title: {
    default: 'Foman Kreasi - Jasa Cetak Berkualitas & Terpercaya',
    template: '%s | Foman Kreasi',
  },
  description:
    'Foman Kreasi menyediakan jasa cetak berkualitas tinggi untuk brosur, kartu nama, banner, spanduk, stiker, dan berbagai kebutuhan percetakan lainnya dengan harga terjangkau dan pengiriman cepat.',
  keywords: [
    'percetakan depok',
    'jasa cetak depok',
    'cetak brosur',
    'cetak kartu nama',
    'cetak banner',
    'cetak spanduk',
    'cetak stiker',
    'pt fokus aman kreasi',
    'foman',
    'foman kreasi',
    'cetak murah',
    'cetak cepat',
    'digital printing',
    'cetak majalah depok',
  ],
  authors: [{ name: 'Foman Kreasi' }],
  creator: 'Foman Kreasi',
  publisher: 'Foman Kreasi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteConfig.baseUrl,
    siteName: 'Foman Kreasi',
    title: 'Foman Kreasi - Jasa Cetak Berkualitas & Terpercaya',
    description:
      'Solusi lengkap untuk semua kebutuhan percetakan Anda. Kualitas terbaik, harga kompetitif, dan layanan profesional.',
    images: [
      {
        url: '/og-image-foman.jpg',
        width: 1200,
        height: 630,
        alt: 'Foman Kreasi - Jasa Cetak Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foman Kreasi - Jasa Cetak Berkualitas',
    description: 'Solusi lengkap untuk semua kebutuhan percetakan Anda',
    images: ['/og-image-foman.jpg'],
    creator: '@fomankreasi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'bqnPBWYX8-P_cG1MdwSLqSeGEEAxj0eIjZJWe5oatU8',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <OrganizationJsonLd />
        <NextTopLoader showSpinner={false} />
        <SpeedInsights />
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Analytics />
          </ThemeProvider>
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
