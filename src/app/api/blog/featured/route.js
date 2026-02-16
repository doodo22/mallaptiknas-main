import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}