import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// GET: Ambil Detail Artikel dari JSON
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const posts = await readJson('posts.json');
        const post = posts.find(p => p.id === parseInt(id));

        if (!post) {
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

// PUT: Update Artikel di JSON (Gunakan Local Upload untuk Konsistensi)
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
        if (title && title.trim().length < 3) {
            return NextResponse.json({ 
                success: false,
                error: "Judul minimal 3 karakter" 
            }, { status: 400 });
        }

        if (category && category.trim().length < 2) {
            return NextResponse.json({ 
                success: false,
                error: "Kategori minimal 2 karakter" 
            }, { status: 400 });
        }

        if (author && author.trim().length < 2) {
            return NextResponse.json({ 
                success: false,
                error: "Penulis minimal 2 karakter" 
            }, { status: 400 });
        }

        if (content && content.trim().length < 10) {
            return NextResponse.json({ 
                success: false,
                error: "Konten minimal 10 karakter" 
            }, { status: 400 });
        }

        let imageUrl = null;

        if (file && typeof file !== 'string' && file.size > 0) {
            // Validasi tipe file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json({ 
                    success: false,
                    error: "Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WebP)" 
                }, { status: 400 });
            }

            // Validasi ukuran file (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return NextResponse.json({ 
                    success: false,
                    error: "Ukuran file maksimal 5MB" 
                }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        const posts = await readJson('posts.json');
        const index = posts.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            return NextResponse.json({ 
                success: false,
                error: "Artikel tidak ditemukan" 
            }, { status: 404 });
        }

        posts[index] = {
            ...posts[index],
            title: title ? title.trim() : posts[index].title,
            category: category ? category.trim() : posts[index].category,
            author: author ? author.trim() : posts[index].author,
            content: content ? content.trim() : posts[index].content,
            youtubeUrl: youtubeUrl ? youtubeUrl.trim() : posts[index].youtubeUrl,
            image: imageUrl || posts[index].image,
            updated_at: new Date().toISOString()
        };

        await writeJson('posts.json', posts);
        return NextResponse.json({ 
            success: true,
            message: "Artikel berhasil diperbarui",
            data: posts[index]
        });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ 
            success: false,
            error: "Gagal update data: " + error.message 
        }, { status: 500 });
    }
}

// DELETE: Hapus artikel dari JSON
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const posts = await readJson('posts.json');
        const postIndex = posts.findIndex(p => p.id === parseInt(id));

        if (postIndex === -1) {
            return NextResponse.json({ 
                success: false,
                error: "Artikel tidak ditemukan" 
            }, { status: 404 });
        }

        const filteredPosts = posts.filter(p => p.id !== parseInt(id));
        await writeJson('posts.json', filteredPosts);
        
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