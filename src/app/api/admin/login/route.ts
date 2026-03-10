import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json({ error: 'Not configured' }, { status: 500 });
        }

        if (password === adminPassword) {
            const response = NextResponse.json({ success: true });
            response.cookies.set('itech_admin', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 4, // 4 hours
                path: '/',
            });
            return response;
        }

        return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
