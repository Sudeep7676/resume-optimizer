import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, email, rating, emoji, message } = body;

        if (!name || !rating || !message) {
            return NextResponse.json({ error: 'Name, rating, and message are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('feedback')
            .insert([{ name, email: email || null, rating, emoji: emoji || null, message, is_approved: false }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, feedback: data });
    } catch (error) {
        console.error('Feedback submit error:', error);
        return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const approved = searchParams.get('approved');
        const key = searchParams.get('key');

        // Public route: fetch only approved feedback
        if (approved === 'true') {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json({ feedback: data });
        }

        // Admin route: fetch all feedback
        if (key) {
            const adminPassword = process.env.ADMIN_PASSWORD;
            if (key !== adminPassword) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json({ feedback: data });
        }

        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    } catch (error) {
        console.error('Feedback fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!key || key !== adminPassword) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, is_approved } = body;

        if (!id || typeof is_approved !== 'boolean') {
            return NextResponse.json({ error: 'ID and is_approved are required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('feedback')
            .update({ is_approved })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback update error:', error);
        return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const id = searchParams.get('id');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!key || key !== adminPassword) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback delete error:', error);
        return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
    }
}
