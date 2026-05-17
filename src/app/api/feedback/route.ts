import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, email, rating, emoji, message, category, sentiment, sentiment_score, tags, nps_score, priority, screenshot, is_anonymous } = body;

        if (!name || !rating || !message) {
            return NextResponse.json({ error: 'Name, rating, and message are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Validate screenshot size (max 500KB base64)
        if (screenshot && screenshot.length > 700000) {
            return NextResponse.json({ error: 'Screenshot too large (max 500KB)' }, { status: 400 });
        }

        const insertData: Record<string, unknown> = {
            name: is_anonymous ? 'Anonymous User' : name.trim(),
            email: is_anonymous ? null : (email?.trim() || null),
            rating,
            emoji: emoji || null,
            message: message.trim(),
            category: category || 'general',
            sentiment: sentiment || 'neutral',
            sentiment_score: sentiment_score || 0.5,
            tags: tags || [],
            nps_score: nps_score ?? null,
            priority: priority || null,
            screenshot: screenshot || null,
            is_anonymous: is_anonymous || false,
            is_approved: false,
            is_featured: false,
            helpful_count: 0,
        };

        const { data, error } = await supabase
            .from('feedback')
            .insert([insertData])
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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const category = searchParams.get('category');
        const rating = searchParams.get('rating');
        const sentiment = searchParams.get('sentiment');
        const sort = searchParams.get('sort') || 'recent';
        const search = searchParams.get('search');

        // Public route: fetch only approved feedback with pagination & filters
        if (approved === 'true') {
            let query = supabase
                .from('feedback')
                .select('*', { count: 'exact' })
                .eq('is_approved', true);

            // Apply filters
            if (category && category !== 'all') {
                query = query.eq('category', category);
            }
            if (rating) {
                query = query.eq('rating', parseInt(rating));
            }
            if (sentiment && sentiment !== 'all') {
                query = query.eq('sentiment', sentiment);
            }
            if (search) {
                query = query.or(`message.ilike.%${search}%,name.ilike.%${search}%`);
            }

            // Sort
            switch (sort) {
                case 'highest':
                    query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
                    break;
                case 'helpful':
                    query = query.order('helpful_count', { ascending: false }).order('created_at', { ascending: false });
                    break;
                case 'oldest':
                    query = query.order('created_at', { ascending: true });
                    break;
                default: // 'recent'
                    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
            }

            // Pagination
            const from = (page - 1) * limit;
            query = query.range(from, from + limit - 1);

            const { data, error, count } = await query;

            if (error) throw error;
            return NextResponse.json({
                feedback: data,
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            });
        }

        // Admin route: fetch all feedback
        if (key) {
            const adminPassword = process.env.ADMIN_PASSWORD;
            if (key !== adminPassword) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            let query = supabase
                .from('feedback')
                .select('*', { count: 'exact' });

            // Admin filters
            if (category && category !== 'all') {
                query = query.eq('category', category);
            }
            if (rating) {
                query = query.eq('rating', parseInt(rating));
            }
            if (sentiment && sentiment !== 'all') {
                query = query.eq('sentiment', sentiment);
            }
            const status = searchParams.get('status');
            if (status === 'approved') {
                query = query.eq('is_approved', true);
            } else if (status === 'pending') {
                query = query.eq('is_approved', false);
            } else if (status === 'featured') {
                query = query.eq('is_featured', true);
            }
            if (search) {
                query = query.or(`message.ilike.%${search}%,name.ilike.%${search}%`);
            }

            query = query.order('created_at', { ascending: false });

            const from = (page - 1) * limit;
            query = query.range(from, from + limit - 1);

            const { data, error, count } = await query;

            if (error) throw error;
            return NextResponse.json({
                feedback: data,
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            });
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

        // Bulk operations
        if (body.bulk && Array.isArray(body.ids)) {
            const updateData: Record<string, unknown> = {};
            if (typeof body.is_approved === 'boolean') updateData.is_approved = body.is_approved;
            if (typeof body.is_featured === 'boolean') updateData.is_featured = body.is_featured;

            const { error } = await supabase
                .from('feedback')
                .update(updateData)
                .in('id', body.ids);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // Single update
        const { id, is_approved, is_featured, admin_reply } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updateData: Record<string, unknown> = {};
        if (typeof is_approved === 'boolean') updateData.is_approved = is_approved;
        if (typeof is_featured === 'boolean') updateData.is_featured = is_featured;
        if (admin_reply !== undefined) {
            updateData.admin_reply = admin_reply || null;
            updateData.replied_at = admin_reply ? new Date().toISOString() : null;
        }

        const { error } = await supabase
            .from('feedback')
            .update(updateData)
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

        // Bulk delete
        const ids = searchParams.get('ids');
        if (ids) {
            const idArr = ids.split(',');
            const { error } = await supabase
                .from('feedback')
                .delete()
                .in('id', idArr);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // Single delete
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

export async function PUT(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
        }

        // Increment helpful count
        const { data: current, error: fetchError } = await supabase
            .from('feedback')
            .select('helpful_count')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const { error } = await supabase
            .from('feedback')
            .update({ helpful_count: (current?.helpful_count || 0) + 1 })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true, helpful_count: (current?.helpful_count || 0) + 1 });
    } catch (error) {
        console.error('Helpful vote error:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
