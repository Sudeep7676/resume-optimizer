import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Fetch all approved feedback for stats
        const { data, error } = await supabase
            .from('feedback')
            .select('rating, category, sentiment, is_featured, created_at, is_approved')
            .eq('is_approved', true);

        if (error) throw error;

        const feedback = data || [];
        const total = feedback.length;

        // Average rating
        const avgRating = total > 0
            ? Math.round((feedback.reduce((sum, f) => sum + f.rating, 0) / total) * 10) / 10
            : 0;

        // Rating distribution
        const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedback.forEach(f => {
            ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1;
        });

        // Category distribution
        const categoryDistribution: Record<string, number> = {};
        feedback.forEach(f => {
            const cat = f.category || 'general';
            categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
        });

        // Sentiment distribution
        const sentimentDistribution: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
        feedback.forEach(f => {
            const s = f.sentiment || 'neutral';
            sentimentDistribution[s] = (sentimentDistribution[s] || 0) + 1;
        });

        // Featured count
        const featuredCount = feedback.filter(f => f.is_featured).length;

        // Recent trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentCount = feedback.filter(f =>
            new Date(f.created_at) >= sevenDaysAgo
        ).length;

        return NextResponse.json({
            total,
            avgRating,
            ratingDistribution,
            categoryDistribution,
            sentimentDistribution,
            featuredCount,
            recentCount,
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
