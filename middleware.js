import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

/**
 * Middleware to protect admin routes
 * Only allows access to /admin/* routes for authenticated admin users
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route
  if (pathname.startsWith('/admin')) {
    // Allow access to the login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check if user is authenticated as admin by reading cookie directly
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);
      
      // Check if user has ADMIN role
      if (!sessionData || sessionData.role !== 'ADMIN') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // Invalid session data, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
