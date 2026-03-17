import { NextResponse } from 'next/server';
    export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access')?.value;
    
    // 2. Define Route types
    const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isAsset = pathname.startsWith('/_next') || pathname.includes('/favicon.ico');
    
    // 3. Redirect Logic
    if (isAsset) return NextResponse.next();
     // If user is NOT logged in and trying to access a protected route
    if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
    }
     // If user IS logged in and trying to access login/register
    if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
    }
        return NextResponse.next();
}
   // Ensure middleware runs on all routes except static files
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};