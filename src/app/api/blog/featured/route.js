import { NextResponse } from 'next/server';
import { readJson } from '@/lib/jsonDb';

export async function GET() {
    try {
        const posts = await readJson('posts.json');
        // Sort terbaru, batasi 3
        const featured = posts
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3);

        return NextResponse.json(featured);
    } catch (error) {
        console.error("JSON Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}