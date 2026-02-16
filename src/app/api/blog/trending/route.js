import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Ambil yang ditandai trending
        let { data: trending, error } = await supabase
            .from('posts')
            .select('*')
            .eq('trending', true)
            .limit(3);

        if (error) throw error;

        // Fallback: ambil 3 terbaru
        if (!trending || trending.length === 0) {
            const { data: latest, error: err2 } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (err2) throw err2;
            trending = latest;
        }

        return NextResponse.json(trending || []);
    } catch (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}