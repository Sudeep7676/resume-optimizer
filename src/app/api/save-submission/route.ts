import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 500 }
            );
        }

        const { error } = await supabase.from('submissions').insert({
            full_name: body.formData.personal.fullName,
            email: body.formData.personal.email,
            phone: body.formData.personal.phone,
            linkedin: body.formData.personal.linkedin,
            github: body.formData.personal.github,
            portfolio: body.formData.personal.portfolio,
            experience: body.formData.experience,
            education: body.formData.education,
            skills: body.formData.skills,
            projects: body.formData.projects,
            generated_latex: body.generatedLatex,
            tokens_used: body.tokensUsed,
        });

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
