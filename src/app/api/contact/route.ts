import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { first_name, last_name, email, message } = body;

        if (!first_name || !last_name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('contact_messages')
            .insert([{ first_name, last_name, email, message }]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact submit error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
