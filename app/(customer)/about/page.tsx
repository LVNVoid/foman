import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Printer,
  Users,
  Award,
  Clock,
  Building2,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { BrandsSection } from '@/components/layouts/customer/brands-section';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Tentang Kami | PT. Fokus Aman Kreasi',
  description:
    'Pelajari lebih lanjut tentang PT. Fokus Aman Kreasi. Mitra percetakan dan digital printing terpercaya sejak 2012 dengan teknologi modern dan tim ahli profesional.',
  keywords: [
    'tentang fokus aman kreasi',
    'profil percetakan',
    'sejarah fokus aman kreasi',
    'layanan cetak terbaik',
    'digital printing depok',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Tentang Kami | PT. Fokus Aman Kreasi',
    description:
      'Mitra percetakan dan digital printing terpercaya Anda. Kualitas terbaik, ketepatan waktu terjamin.',
    url: `${siteConfig.baseUrl}/about`,
    type: 'website',
    images: [`${siteConfig.baseUrl}/og-image-foman.jpg`],
  },
};

// ─── Reusable: Section Heading ───────────────────────────────────────────────
function SectionHeading({
  label,
  title,
  subtitle,
  center = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div
      className={
        center ? 'flex flex-col items-center text-center' : 'flex flex-col'
      }
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-orange-600 mb-3">
        <span className="block h-px w-6 bg-orange-500" />
        {label}
        <span className="block h-px w-6 bg-orange-500" />
      </span>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Reusable: Stat Badge ────────────────────────────────────────────────────
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 px-6 py-5 min-w-[110px]">
      <span className="text-3xl font-extrabold text-orange-400 leading-none">
        {value}
      </span>
      <span className="text-xs text-slate-300 mt-1 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Reusable: Feature Card ──────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Reusable: Vision/Mission Card ───────────────────────────────────────────
function VisionMissionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm p-8 space-y-4">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-300 rounded-t-2xl" />
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
          {children}
        </p>
      </div>
    </div>
  );
}

// ─── Reusable: Legality Item ─────────────────────────────────────────────────
function LegalityItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        <CheckCircle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Reusable: Hero decorative background ────────────────────────────────────
function HeroBg() {
  return (
    <div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-600 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-orange-400 opacity-10 blur-3xl" />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="flex flex-col bg-slate-50 mt-4 sm:mt-6 md:mt-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-lg">
        <HeroBg />
        <div className="container relative py-20 px-4 md:px-8 md:py-28">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-orange-400">
              <span className="block h-px w-6 bg-orange-500" />
              Tentang Kami
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              PT. Fokus Aman <span className="text-orange-500">Kreasi</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed">
              Mitra percetakan dan digital printing terpercaya Anda sejak 2012.
              Kualitas premium, hasil tepat waktu, tanpa minimum pesanan.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <StatBadge value="2012" label="Berdiri sejak" />
              <StatBadge value="19+" label="Mitra Korporat" />
              <StatBadge value="4" label="Mesin Produksi" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Sejarah ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div className="space-y-6">
              <SectionHeading
                label="Profil Perusahaan"
                title="Sejarah Singkat Perusahaan"
              />
              <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                Pada akhir 2012, perusahaan kami bergerak sebagai jasa{' '}
                <strong className="text-slate-800">Design Supporting</strong>{' '}
                dan{' '}
                <strong className="text-slate-800">Layout Supporting</strong>{' '}
                yang membantu segala macam kebutuhan costumer — mulai
                perorangan, UKM, perusahaan kecil hingga perusahaan menengah dan
                pemerintahan.
              </p>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                Seiring berjalannya waktu, perusahaan memperluas cakupan jasa ke
                bidang Printing dan Advertising. Demi terus maju dan berkembang,
                kami mendirikan{' '}
                <strong className="text-slate-800">
                  PT. Fokus Aman Kreasi
                </strong>{' '}
                dengan fokus utama di bidang Digital Printing dan Percetakan.
              </p>
              <div className="pt-4 space-y-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                  Jl. Tiga Putra No. 2, Rt. 01/Rw. 02, Meruyung, Limo, Depok
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                  +62 815-1365-4674
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                  ptfokusamankreasi@gmail.com
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon={Printer}
                title="Teknologi Modern"
                description="Mesin Offset, Digital Print, hingga Laminating untuk hasil tajam dan akurat."
              />
              <FeatureCard
                icon={Users}
                title="Tim Berpengalaman"
                description="Profesional berdedikasi di bidang percetakan dan desain grafis."
              />
              <FeatureCard
                icon={Award}
                title="Kualitas Premium"
                description="Standar kontrol kualitas ketat pada setiap pesanan tanpa minimum kuantitas."
              />
              <FeatureCard
                icon={Clock}
                title="Tepat Waktu"
                description="Komitmen penuh menyelesaikan setiap pesanan sesuai jadwal yang disepakati."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Visi & Misi ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <SectionHeading
              label="Arah Perusahaan"
              title="Visi &amp; Misi"
              subtitle="Landasan nilai yang mengarahkan setiap langkah PT. Fokus Aman Kreasi dalam melayani pelanggan."
              center
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <VisionMissionCard icon={Building2} title="Visi">
              Dengan pelayanan yang optimal dan tenaga-tenaga yang
              berpengalaman, kami siap melayani produk-produk keperluan{' '}
              <strong className="text-slate-800">
                tanpa memandang quantity pesanan.
              </strong>
            </VisionMissionCard>
            <VisionMissionCard icon={CheckCircle} title="Misi">
              Memberikan yang{' '}
              <strong className="text-slate-800">terbaik, berkualitas,</strong>{' '}
              dan <strong className="text-slate-800">ketepatan waktu</strong>{' '}
              kepada setiap mitra yang memakai jasa PT. Fokus Aman Kreasi.
            </VisionMissionCard>
          </div>
        </div>
      </section>

      {/* ── Legalitas ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="mb-12">
            <SectionHeading
              label="Legalitas"
              title="Legalitas Perusahaan"
              subtitle="PT. Fokus Aman Kreasi beroperasi secara resmi dan terdaftar secara hukum di Indonesia."
              center
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            <LegalityItem
              title="Surat Izin Usaha Perdagangan (SIUP)"
              subtitle="No. 09589-03/PM/1.824.271"
            />
            <LegalityItem
              title="NPWP"
              subtitle="Nomor Pokok Wajib Pajak terdaftar"
            />
            <LegalityItem
              title="NIB"
              subtitle="Nomor Induk Berusaha terdaftar"
            />
          </div>
        </div>
      </section>

      {/* ── Mitra ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="mb-12">
            <SectionHeading
              label="Kerja Sama"
              title="Dipercaya Berbagai Perusahaan"
              subtitle="Lebih dari 19 mitra korporat telah mempercayakan kebutuhan percetakan mereka kepada kami."
              center
            />
          </div>
          <BrandsSection />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 md:py-24  rounded-lg">
        <HeroBg />
        <div className="container relative flex flex-col items-center text-center space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-orange-400">
            <span className="block h-px w-6 bg-orange-500" />
            Mulai Sekarang
            <span className="block h-px w-6 bg-orange-500" />
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl">
            Siap Mencetak Ide Anda?
          </h2>
          <p className="text-slate-300 text-lg max-w-lg leading-relaxed">
            Hubungi kami untuk pertanyaan khusus atau jelajahi layanan kami
            sekarang.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-orange-600 text-white hover:bg-orange-500 font-semibold rounded-xl px-8"
              >
                Lihat Produk
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-slate-600 text-white hover:bg-white hover:text-slate-900 font-semibold rounded-xl px-8"
              >
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
