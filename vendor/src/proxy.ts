import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept any onboarding routes and redirect directly to dashboard
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/dashboard/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  
  // Apply no-store cache control for sensitive routes
  // This tells Cloudflare NOT to cache these responses
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export { proxy as middleware };

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*',
    '/api/:path*',
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/onboarding'
  ],
};
