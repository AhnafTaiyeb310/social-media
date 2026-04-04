import { NextResponse } from 'next/server';

export default function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Public and Protected paths
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // 2. Logic: If no token and not on an auth page, force login
  if (!token && !isAuthPage) {
    console.log('MIDDLEWARE: UNAUTHORIZED -> Redirecting to Login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Logic: If has token and trying to access login/signup, go home
  if (token && isAuthPage) {
    console.log('MIDDLEWARE: AUTHORIZED -> Redirecting to Home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/drafts/:path*',
    '/profile/:path*',
    '/blogs/:path*',
    '/bookmarks/:path*',
    '/notifications/:path*',
    '/search/:path*',
  ],
};
