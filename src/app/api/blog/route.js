import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ─── HELPER: Upload gambar ke Supabase Storage ───────────────
async function uploadImageToSupabase(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const filename = `${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
        .from('blog-images')          // nama bucket di Supabase Storage
        .upload(`uploads/${filename}`, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) throw new Error('Upload gambar gagal: ' + error.message);

    // Ambil public URL
    const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`uploads/${filename}`);

    return urlData.publicUrl;
}

// ─── GET: Ambil semua artikel ────────────────────────────────
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

// ─── POST: Tambah artikel baru ───────────────────────────────
export async function POST(request) {
    try {
        console.log('=== API BLOG POST (SUPABASE STORAGE) ===');

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
        if (!title || title.trim().length < 3)
            return NextResponse.json({ success: false, error: "Judul minimal 3 karakter" }, { status: 400 });
        if (!category || category.trim().length < 2)
            return NextResponse.json({ success: false, error: "Kategori wajib diisi" }, { status: 400 });
        if (!author || author.trim().length < 2)
            return NextResponse.json({ success: false, error: "Penulis wajib diisi" }, { status: 400 });
        if (!content || content.trim().length < 10)
            return NextResponse.json({ success: false, error: "Konten minimal 10 karakter" }, { status: 400 });

        // Upload gambar ke Supabase Storage (bukan filesystem)
        let imageUrl = 'https://via.placeholder.com/600x400';
        if (file && file.size > 0) {
            imageUrl = await uploadImageToSupabase(file);
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