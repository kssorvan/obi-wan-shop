
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode'; // Can be used if token is in a cookie readable by middleware

// List of paths that generally require authentication
const protectedPaths = [
  '/account', 
  '/checkout',
  '/admin',
];

// List of paths that require admin privileges (must also be authenticated)
const adminPaths = [
  '/admin',
];

interface DecodedJwtPayload {
  sub: string; 
  role?: 'user' | 'admin' | 'superuser';
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = '/auth/signin';

  // For JWTs stored in HttpOnly cookies (recommended for middleware access)
  const tokenCookie = request.cookies.get('auth_token'); // Assuming you name your JWT cookie 'auth_token'
  let isAuthenticated = false;
  let userRole: 'user' | 'admin' | 'superuser' = 'user';

  if (tokenCookie) {
    try {
      const decoded = jwtDecode<DecodedJwtPayload>(tokenCookie.value);
      if (decoded.exp * 1000 > Date.now()) {
        isAuthenticated = true;
        userRole = decoded.role || 'user';
      }
    } catch (e) {
      // Invalid token or expired, treat as not authenticated
      console.warn("Middleware: Invalid or expired token cookie", e);
    }
  }
  // If JWT is ONLY in localStorage, middleware CANNOT access it.
  // In that scenario, this server-side middleware check for isAuthenticated would always be false.
  // Client-side routing guards (like in AuthContext or layouts) would then be the primary mechanism
  // for redirecting, but this isn't as secure as middleware checks for initial server requests.

  const isPathProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  // If trying to access a protected path without authentication
  if (isPathProtected && !isAuthenticated) {
    const redirectUrl = signInUrl.clone();
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If trying to access an admin path
  if (isAdminPath) {
    if (!isAuthenticated) {
      const redirectUrl = signInUrl.clone();
      redirectUrl.searchParams.set('message', 'Admin%20access%20required');
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // If authenticated but not an admin
    if (userRole !== 'admin' && userRole !== 'superuser') {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = '/'; 
      unauthorizedUrl.searchParams.set('error', 'access_denied_admin');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to paths that typically require auth or admin roles.
    // Public paths are implicitly excluded by not being listed here
    // or by the logic within the middleware.
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    // Add other specific paths that need protection if they don't fall under broader groups.
    // Example: '/((?!api|_next/static|_next/image|favicon.ico|auth|shop|cart|search|lighting|about|contact|help|legal|style-guide|$).*)',
    // The above complex matcher is an alternative if you want to exclude many public paths by default.
    // For JWT in HttpOnly cookie, a simpler matcher targeting protected areas is often sufficient.
  ],
};
