
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = [
  // '/home', // This route was removed in a previous refactor
  '/account', // All sub-pages like /account/profile, /account/orders
  // '/cart', // Cart is now public as per new strategy
  '/checkout', // All sub-pages like /checkout/shipping
  '/admin', // All sub-pages
];

// List of paths that require admin privileges (must also be authenticated)
const adminPaths = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicUrl = request.nextUrl.clone();
  publicUrl.pathname = '/auth/signin';

  // In a real application, you would check for a valid session token/cookie here.
  // For Laravel Sanctum, this would typically involve checking for the session cookie.
  // Since middleware runs on the edge, direct access to localStorage or context is not possible.
  // We'll use a placeholder for the actual authentication check.
  // Replace `isAuthenticated` and `userRole` with your actual auth logic.
  const isAuthenticated = request.cookies.has('laravel_session'); // Example: Check for Sanctum session cookie
  const userRole = request.cookies.get('user_role')?.value || 'user'; // Example: Get role from a cookie

  const isPathProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  // If trying to access a protected path without authentication
  if (isPathProtected && !isAuthenticated) {
    // Add a redirect query parameter to send user back after login
    const redirectUrl = publicUrl.clone();
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If trying to access an admin path
  if (isAdminPath) {
    if (!isAuthenticated) {
      const redirectUrl = publicUrl.clone();
      redirectUrl.searchParams.set('message', 'Admin%20access%20required');
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // If authenticated but not an admin
    if (userRole !== 'admin' && userRole !== 'superuser') {
      const unauthorizedUrl = request.nextUrl.clone();
      // Redirect non-admins away from /admin to the main marketing page or shop
      unauthorizedUrl.pathname = '/'; 
      unauthorizedUrl.searchParams.set('error', 'access_denied_admin');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages, allow them to be public)
     * - shop (public shop pages: products, categories)
     * - cart (public cart page)
     * - search (public search page)
     * - lighting (public lighting page)
     * - about, contact, help (public informational pages)
     * - legal (public legal pages)
     * - style-guide (public style guide)
     * - $ (root path, which is public homepage)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|shop|cart|search|lighting|about|contact|help|legal|style-guide|$).*)',
    // Explicitly include paths that NEED protection and might be complex enough
    // that the negative lookahead isn't perfectly catching them or for clarity.
    // Given the negative lookahead should exclude most public top-levels,
    // we primarily need to ensure our protected top-levels are included if they aren't simple prefixes.
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
  ],
};
