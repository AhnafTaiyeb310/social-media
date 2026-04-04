import { NextResponse } from 'next/server';

export default function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Public and Protected paths
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  
  // 2. Logic: If no token and not on an auth page, force login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Logic: If has token and trying to access login/signup, go home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Ensure the middleware runs on EVERY relevant page
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
