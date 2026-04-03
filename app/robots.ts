import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProdConfigured = process.env.NEXT_PUBLIC_BASE_URL === 'https://foman.id';

  if (!isProdConfigured) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/orders/',
        '/profile/',
        '/checkout/',
      ],
    },
    sitemap: 'https://foman.id/sitemap.xml',
    host: 'https://foman.id',
  };
}
