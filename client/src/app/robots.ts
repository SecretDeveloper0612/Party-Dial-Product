import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin', 
        '/api', 
        '/auth', 
        '/login', 
        '/signup', 
        '/sign-in', 
        '/sign-up'
      ],
    },
    sitemap: 'https://www.partydial.com/sitemap.xml',
    host: 'https://www.partydial.com',
  };
}
