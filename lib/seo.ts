export const siteConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://foman.id',
  name: 'Foman Percetakan',
  description: 'Foman Percetakan menyediakan jasa cetak berkualitas tinggi untuk brosur, kartu nama, banner, spanduk, stiker, dan berbagai kebutuhan percetakan lainnya dengan harga terjangkau dan pengiriman cepat.',
};

export function getCanonicalUrl(path: string = '') {
  return `${siteConfig.baseUrl}${path}`;
}

export function getOgImageUrl(path: string = '/og-image-foman.jpg') {
  return `${siteConfig.baseUrl}${path}`;
}
