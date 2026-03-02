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

// ─── GET: Ambil Detail Artikel ───────────────────────────────
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !post) {
            return NextResponse.json({
                success: false,
                error: "Artikel tidak ditemukan"
            }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// ─── PUT: Update Artikel ─────────────────────────────────────
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.formData();

        const title = data.get('title');
        const category = data.get('category');
        const author = data.get('author');
        const content = data.get('content');
        const youtubeUrl = data.get('youtubeUrl');
        const file = data.get('imageFile');

        // Validasi
        if (title && title.trim().length < 3)
            return NextResponse.json({ success: false, error: "Judul minimal 3 karakter" }, { status: 400 });

        // Upload gambar ke Supabase Storage jika ada file baru
        let imageUrl = null;
        if (file && typeof file !== 'string' && file.size > 0) {
            imageUrl = await uploadImageToSupabase(file);
        }

        const updateData = {};
        if (title) updateData.title = title.trim();
        if (category) updateData.category = category.trim();
        if (author) updateData.author = author.trim();
        if (content) updateData.content = content.trim();
        if (youtubeUrl !== null) updateData.youtubeUrl = youtubeUrl.trim();
        if (imageUrl) updateData.image = imageUrl;

        const { data: updatedPost, error } = await supabase
            .from('posts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "Artikel berhasil diperbarui",
            data: updatedPost
        });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({
            success: false,
            error: "Gagal update data: " + error.message
        }, { status: 500 });
    }
}

// ─── DELETE: Hapus Artikel ───────────────────────────────────
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}