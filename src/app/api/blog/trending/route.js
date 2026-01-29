import { NextResponse } from 'next/server';
import { readJson } from '@/lib/jsonDb';

export async function GET() {
    try {
        const posts = await readJson('posts.json');

        // Ambil yang ditandai trending, atau ambil 3 terbaru sebagai fallback
        let trending = posts.filter(p => p.trending === true);

        if (trending.length === 0) {
            trending = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
        }

        return NextResponse.json(trending.slice(0, 3));
    } catch (error) {
        console.error("JSON Read Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}