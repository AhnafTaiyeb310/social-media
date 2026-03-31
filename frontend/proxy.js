// proxy.js (or proxy.ts)
import { NextResponse } from "next/server";

export function proxy(request) {
    const token = request.cookies.get("accessToken");
    const { pathname } = request.nextUrl;

    const isPublicRoute = ["/login", "/signup"].includes(pathname);

  // 1. Redirect unauthenticated users away from protected routes
    if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
    }

  // 2. Redirect authenticated users away from public auth pages
    if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/signup"],
};
    