import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// GET: Ambil semua artikel dari Supabase
export async function GET() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// POST: Tambah artikel baru ke Supabase
export async function POST(request) {
    try {
        console.log('=== API BLOG POST CALLED (SUPABASE) ===');

        // Cek content-type
        const contentType = request.headers.get('content-type') || '';

        if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
            return NextResponse.json({
                success: false,
                error: "Content-Type harus multipart/form-data atau application/x-www-form-urlencoded"
            }, { status: 400 });
        }

        const data = await request.formData();
        const file = data.get('imageFile');
        const title = data.get('title');
        const category = data.get('category');
        const author = data.get('author');
        const content = data.get('content');
        const youtubeUrl = data.get('youtubeUrl');

        // Validasi input
        if (!title || title.trim().length < 3) return NextResponse.json({ success: false, error: "Judul minimal 3 karakter" }, { status: 400 });
        if (!category || category.trim().length < 2) return NextResponse.json({ success: false, error: "Kategori wajib diisi" }, { status: 400 });
        if (!author || author.trim().length < 2) return NextResponse.json({ success: false, error: "Penulis wajib diisi" }, { status: 400 });
        if (!content || content.trim().length < 10) return NextResponse.json({ success: false, error: "Konten minimal 10 karakter" }, { status: 400 });

        let imageUrl = '';

        if (file && file.size > 0) {
            // NOTE: Local upload ini bersifat sementara di Vercel. 
            // Disarankan migrasi ke Supabase Storage nanti.
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${filename}`;
        } else {
            imageUrl = 'https://via.placeholder.com/600x400';
        }

        const { data: newPost, error } = await supabase
            .from('posts')
            .insert([{
                title: title.trim(),
                category: category.trim(),
                author: author.trim(),
                content: content.trim(),
                image: imageUrl,
                youtubeUrl: youtubeUrl ? youtubeUrl.trim() : '',
                created_at: new Date().toISOString(),
                trending: false
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "Artikel berhasil dibuat",
            data: newPost
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({
            success: false,
            error: "Gagal menyimpan data: " + error.message
        }, { status: 500 });
    }
}