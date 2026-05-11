import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Root: show unlock page if not yet authenticated
    if (pathname === '/') {
        const accessToken = request.cookies.get('itech_access');
        if (!accessToken || accessToken.value !== 'true') {
            return NextResponse.redirect(new URL('/unlock', request.url));
        }
        // If they HAVE the token, let them through to the homepage
    }

    // Public routes — allow access
    if (
        pathname === '/unlock' ||
        pathname === '/feedback' ||
        pathname.startsWith('/api/unlock') ||
        pathname.startsWith('/api/feedback') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next();
    }

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        const adminSession = request.cookies.get('itech_admin');
        if (!adminSession || adminSession.value !== 'true') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Protect /resume routes
    if (pathname.startsWith('/resume')) {
        const accessToken = request.cookies.get('itech_access');
        if (!accessToken || accessToken.value !== 'true') {
            return NextResponse.redirect(new URL('/unlock', request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/resume/:path*', '/admin/:path*'],
};
