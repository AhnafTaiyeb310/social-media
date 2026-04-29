import { NextResponse } from 'next/server';

export default function middleware(request) {
  const token = request.cookies.get('access')?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Public paths (accessible without login)
  const publicPaths = ['/login', '/signup', '/verify-email'];
  const isPublicPage = publicPaths.some(path => pathname.startsWith(path));
  
  // 2. Logic: If no token and not on a public page, force redirect to login
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // NOTE: We moved the "Redirect to Home if already logged in" logic to the 
  // client-side (app components) to prevent infinite redirect loops 
  // when an expired 'access' cookie remains in the browser.

  return NextResponse.next();
}

// Ensure the middleware runs on EVERY relevant page
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
