'use client';

import Image from 'next/image';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
// Letakkan logo di: /public/images/brands/<logo>
const brands = [
  {
    name: 'Hanwha Life',
    initials: 'HL',
    logo: '/images/brands/hanwha-life.jpg',
  },
  { name: 'Allianz Life', initials: 'AL', logo: '/images/brands/allianz.png' },
  { name: 'Korindo Group', initials: 'KG', logo: '/images/brands/korindo.jpg' },
  {
    name: 'Tunas Sawa Erma',
    initials: 'TS',
    logo: '/images/brands/tunas-sawa-erma.png',
  },
  {
    name: 'Ganda Alam Makmur',
    initials: 'GA',
    logo: '/images/brands/ganda-alam.png',
  },
  {
    name: 'Grand Indonesia',
    initials: 'GI',
    logo: '/images/brands/grand-indonesia.png',
  },
  {
    name: 'Waagner Biro',
    initials: 'WB',
    logo: '/images/brands/waagner-biro.png',
  },
  {
    name: 'Cargill Indonesia',
    initials: 'CI',
    logo: '/images/brands/cargill.png',
  },
  {
    name: 'Sebuku Coal',
    initials: 'SC',
    logo: '/images/brands/sebuku-coal.png',
  },
  { name: 'Humanscape', initials: 'HT', logo: '/images/brands/humanscape.png' },
  { name: 'Hs Net', initials: 'HN', logo: '/images/brands/hs-net.png' },
  { name: 'RS EMC', initials: 'EM', logo: '/images/brands/rs-emc.png' },
  {
    name: 'Bina Medika',
    initials: 'BM',
    logo: '/images/brands/bina-medika.png',
  },
  {
    name: 'Osstem Implant',
    initials: 'OI',
    logo: '/images/brands/osstem-implant.png',
  },
  {
    name: 'BINUS University',
    initials: 'BN',
    logo: '/images/brands/binus.png',
  },
  { name: 'UNAS Jakarta', initials: 'UN', logo: '/images/brands/unas.png' },
  { name: 'Dept. PU', initials: 'PU', logo: '/images/brands/dept-pu.png' },
  {
    name: 'Chung Gi Wa',
    initials: 'CG',
    logo: '/images/brands/chung-gi-wa.png',
  },
  { name: 'BBQ Gahyo', initials: 'BG', logo: '/images/brands/bbq-gahyo.png' },
];

// Split into two rows for staggered effect
const row1 = brands.slice(0, 10);
const row2 = brands.slice(10);

// ─── Single brand item ────────────────────────────────────────────────────────
function BrandItem({ brand }: { brand: (typeof brands)[number] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex items-center select-none shrink-0 px-8">
      {/* Logo or fallback initials */}
      <div className="relative flex h-18 w-32 shrink-0 items-center justify-center overflow-hidden">
        {!imgError ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-150"
            onError={() => setImgError(true)}
            sizes="112px"
          />
        ) : (
          <span className="text-sm font-extrabold text-slate-400 tracking-wide">
            {brand.initials}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Marquee row ─────────────────────────────────────────────────────────────
function MarqueeRow({
  items,
  duration,
  reverse = false,
}: {
  items: (typeof brands)[number][];
  duration: number;
  reverse?: boolean;
}) {
  // Duplicate items for seamless infinite loop
  const doubled = [...items, ...items, ...items];

  return (
    <div className="relative flex overflow-hidden">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex w-max"
        style={{
          animation: `marquee${reverse ? '-reverse' : ''} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((brand, i) => (
          <BrandItem key={`${brand.name}-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function BrandsSection() {
  return (
    <>
      {/* Inject keyframes — Tailwind has no built-in marquee animation */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-reverse {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="w-full space-y-4 py-2">
        <MarqueeRow items={row1} duration={30} />
        <MarqueeRow items={row2} duration={24} reverse />
      </div>
    </>
  );
}
