import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // 1. Skip assets entirely
    if (
        pathname.startsWith('/_next') || 
        pathname.startsWith('/static') || 
        pathname.includes('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // 2. Check for Session (HttpOnly cookie)
    const sessionid = request.cookies.get('sessionid')?.value;
    
    // 3. Simple Route Flags
    const isPublic = pathname === '/login' || pathname === '/register' || pathname.startsWith('/auth');

    // 4. Protection Logic
    if (!sessionid && !isPublic) {
        // Force redirect to login if no session is present
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (sessionid && isPublic) {
        // If logged in, don't let them see /login
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Ensure the middleware runs on all relevant paths
export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
