import { MetadataRoute } from 'next';
import { SEO_CITIES, SEO_CATEGORIES } from '@/config/seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://partydial.com';

  // Base routes
  const routes = [
    '',
    '/venues',
    '/sign-in',
    '/sign-up',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Programmatic SEO routes (City x Category)
  const seoRoutes = [...new Set(SEO_CITIES)].flatMap((city) =>
    SEO_CATEGORIES.map((category) => ({
      url: `${baseUrl}/${city.toLowerCase()}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  return [...routes, ...seoRoutes];
}
