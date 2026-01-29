import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// GET: Ambil semua S&K
export async function GET() {
    try {
        const terms = await readJson('terms.json');
        const sortedTerms = terms.sort((a, b) => new Date(b.date) - new Date(a.date));
        return NextResponse.json(sortedTerms);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Tambah S&K baru dengan konten langsung
export async function POST(request) {
    try {
        const data = await request.formData();
        const title = data.get('title');
        const revision = data.get('revision');
        const urlTarget = data.get('url') || '#';
        let content = data.get('content') || '';
        const file = data.get('file');

        // Jika ada file HTML yang diupload, baca isinya sebagai content
        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer();
            content = new TextDecoder().decode(buffer);
        }

        // Validasi pembaharuan
        if (!title || title.trim().length < 3) {
            return NextResponse.json({ error: "Judul minimal 3 karakter" }, { status: 400 });
        }

        if (!revision || revision.trim().length < 1) {
            return NextResponse.json({ error: "Versi revisi harus diisi" }, { status: 400 });
        }

        if (!content || content.trim().length < 10) {
            return NextResponse.json({ error: "Konten S&K minimal 10 karakter (Pastikan file HTML tidak kosong)" }, { status: 400 });
        }
        // Simpan data ke JSON
        const terms = await readJson('terms.json');
        const newId = terms.length > 0 ? Math.max(...terms.map(t => t.id)) + 1 : 1;

        const newTerm = {
            id: newId,
            title: title.trim(),
            revision: revision.trim(),
            url: urlTarget,
            content: content.trim(),
            isActive: true,
            date: new Date().toISOString()
        };

        terms.push(newTerm);
        await writeJson('terms.json', terms);

        return NextResponse.json({
            message: "S&K berhasil disimpan",
            id: newId
        });

    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: "Gagal menyimpan data: " + error.message }, { status: 500 });
    }
}

