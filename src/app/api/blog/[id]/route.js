import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// GET: Ambil Detail Artikel dari Supabase
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

        return NextResponse.json({
            success: true,
            data: post
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// PUT: Update Artikel di Supabase
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

        // Validasi input
        if (title && title.trim().length < 3) return NextResponse.json({ success: false, error: "Judul minimal 3 karakter" }, { status: 400 });

        let imageUrl = null;
        if (file && typeof file !== 'string' && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${filename}`;
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

// DELETE: Hapus artikel dari Supabase
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "Artikel berhasil dihapus"
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}