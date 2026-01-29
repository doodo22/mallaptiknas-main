import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// GET: Ambil semua artikel dari JSON
export async function GET() {
    try {
        const posts = await readJson('posts.json');
        // Sort terbaru (berdasarkan id atau created_at)
        const sortedPosts = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return NextResponse.json(sortedPosts);
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// POST: Tambah artikel baru ke JSON
export async function POST(request) {
    try {
        console.log('=== API BLOG POST CALLED ===');

        // Cek content-type
        const contentType = request.headers.get('content-type') || '';
        console.log('Content-Type:', contentType);

        if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
            console.log('ERROR: Invalid content-type');
            return NextResponse.json({
                success: false,
                error: "Content-Type harus multipart/form-data atau application/x-www-form-urlencoded"
            }, { status: 400 });
        }

        const data = await request.formData();
        console.log('FormData keys:', Array.from(data.keys()));

        const file = data.get('imageFile');
        const title = data.get('title');
        const category = data.get('category');
        const author = data.get('author');
        const content = data.get('content');
        const youtubeUrl = data.get('youtubeUrl');

        console.log('Received data:', { title, category, author, content: content?.substring(0, 50) + '...', youtubeUrl, hasFile: !!file });

        // Validasi input
        if (!title || title.trim().length < 3) {
            return NextResponse.json({
                success: false,
                error: "Judul minimal 3 karakter"
            }, { status: 400 });
        }

        if (!category || category.trim().length < 2) {
            return NextResponse.json({
                success: false,
                error: "Kategori wajib diisi"
            }, { status: 400 });
        }

        if (!author || author.trim().length < 2) {
            return NextResponse.json({
                success: false,
                error: "Penulis wajib diisi"
            }, { status: 400 });
        }

        if (!content || content.trim().length < 10) {
            return NextResponse.json({
                success: false,
                error: "Konten minimal 10 karakter"
            }, { status: 400 });
        }

        let imageUrl = '';

        if (file && file.size > 0) {
            console.log('Processing file:', file.name, file.type, file.size);

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
            console.log('File saved:', imageUrl);
        } else {
            imageUrl = 'https://via.placeholder.com/600x400';
            console.log('Using placeholder image');
        }

        const posts = await readJson('posts.json');
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

        const newPost = {
            id: newId,
            title: title.trim(),
            category: category.trim(),
            author: author.trim(),
            content: content.trim(),
            image: imageUrl,
            youtubeUrl: youtubeUrl ? youtubeUrl.trim() : '',
            created_at: new Date().toISOString(),
            trending: false
        };

        console.log('New post to save:', newPost);

        posts.push(newPost);
        await writeJson('posts.json', posts);

        console.log('Post saved successfully, total posts:', posts.length);

        return NextResponse.json({
            success: true,
            message: "Artikel berhasil dibuat",
            data: { id: newId }
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({
            success: false,
            error: "Gagal menyimpan data: " + error.message
        }, { status: 500 });
    }
}