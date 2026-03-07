import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from './providers/session-provider';
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';
import { OrganizationJsonLd } from '@/components/json-ld';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: 'Foman Percetakan - Jasa Cetak Berkualitas & Terpercaya',
    template: '%s | Foman Percetakan',
  },
  description: 'Foman Percetakan menyediakan jasa cetak berkualitas tinggi untuk brosur, kartu nama, banner, spanduk, stiker, dan berbagai kebutuhan percetakan lainnya dengan harga terjangkau dan pengiriman cepat.',
  keywords: [
    'percetakan',
    'jasa cetak',
    'cetak brosur',
    'cetak kartu nama',
    'cetak banner',
    'cetak spanduk',
    'cetak stiker',
    'percetakan online',
    'Foman',
    'cetak murah',
    'cetak cepat',
    'digital printing',
    'offset printing'
  ],
  authors: [{ name: 'Foman Percetakan' }],
  creator: 'Foman Percetakan',
  publisher: 'Foman Percetakan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteConfig.baseUrl,
    siteName: 'Foman Percetakan',
    title: 'Foman Percetakan - Jasa Cetak Berkualitas & Terpercaya',
    description: 'Solusi lengkap untuk semua kebutuhan percetakan Anda. Kualitas terbaik, harga kompetitif, dan layanan profesional.',
    images: [
      {
        url: '/og-image-foman.jpg',
        width: 1200,
        height: 630,
        alt: 'Foman Percetakan - Jasa Cetak Profesional',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foman Percetakan - Jasa Cetak Berkualitas',
    description: 'Solusi lengkap untuk semua kebutuhan percetakan Anda',
    images: ['/twitter-image-foman.jpg'],
    creator: '@fomanpercetakan',
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
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <OrganizationJsonLd />
        <NextTopLoader showSpinner={false} />
        <SpeedInsights />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
