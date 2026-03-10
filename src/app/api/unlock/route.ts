import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.PRIVATE_ACCESS_PASSWORD;

        if (!correctPassword) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (password === correctPassword) {
            const response = NextResponse.json({ success: true });
            response.cookies.set('itech_access', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                // No maxAge = session cookie (expires when browser closes)
                path: '/',
            });
            return response;
        }

        return NextResponse.json(
            { error: 'Incorrect password' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
