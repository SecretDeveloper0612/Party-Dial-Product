import { MetadataRoute } from 'next';
import { SEO_CITIES, SEO_CATEGORIES } from '@/config/seo-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.partydial.com';

  // 1. Static Base Routes
  const routes = [
    '',
    '/venues',
    '/sign-in',
    '/sign-up',
    '/about',
    '/contact',
    '/help-center',
    '/terms-of-service',
    '/privacy-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // 2. Programmatic SEO routes (City x Category)
  const seoRoutes = [...new Set(SEO_CITIES)].flatMap((city) =>
    SEO_CATEGORIES.map((category) => ({
      url: `${baseUrl}/${city.toLowerCase()}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // 3. State Level Routes (Uttarakhand)
  const stateRoutes = SEO_CATEGORIES.map((category) => ({
    url: `${baseUrl}/uttarakhand/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 4. Dynamic Venue Routes (Fetch from Backend)
  let venueRoutes: any[] = [];
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005/api';
    const baseUrlApi = serverUrl.endsWith('/api') ? serverUrl : `${serverUrl}/api`;
    
    // Fetch all verified venues to include them in the sitemap
    const response = await fetch(`${baseUrlApi}/venues?verified=true`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const result = await response.json();
    
    if (result.status === 'success' && Array.isArray(result.data)) {
      venueRoutes = result.data.map((venue: any) => ({
        url: `${baseUrl}/venues/${venue.$id}`,
        lastModified: new Date(venue.$updatedAt || venue.$createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch venues for sitemap:', error);
  }

  return [...routes, ...seoRoutes, ...stateRoutes, ...venueRoutes];
}
