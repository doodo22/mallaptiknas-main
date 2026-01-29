import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import path from 'path';
import fs from 'fs';

// GET: Ambil detail S&K berdasarkan ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const terms = await readJson('terms.json');
        const term = terms.find(t => t.id === parseInt(id));
        
        if (!term) {
            return NextResponse.json({ error: "S&K tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(term);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update S&K
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const terms = await readJson('terms.json');
        const index = terms.findIndex(t => t.id === parseInt(id));

        if (index === -1) {
            return NextResponse.json({ error: "S&K tidak ditemukan" }, { status: 404 });
        }

        // Update data
        terms[index] = {
            ...terms[index],
            ...data,
            date: new Date().toISOString()
        };

        await writeJson('terms.json', terms);
        return NextResponse.json({ message: "S&K berhasil diperbarui" });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Gagal update data: " + error.message }, { status: 500 });
    }
}

// DELETE: Hapus S&K dan file HTML dari folder public
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const terms = await readJson('terms.json');
        const termToDelete = terms.find(t => t.id === parseInt(id));

        if (!termToDelete) {
            return NextResponse.json({ error: "S&K tidak ditemukan" }, { status: 404 });
        }

        // Hapus file fisik jika ada
        if (termToDelete.fileUrl) {
            const filePath = path.join(process.cwd(), 'public', termToDelete.fileUrl);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`File deleted: ${filePath}`);
                }
            } catch (fileError) {
                console.error("Gagal menghapus file:", fileError);
                // Lanjutkan tetap hapus data meskipun file gagal dihapus
            }
        }

        // Hapus dari JSON
        const filteredTerms = terms.filter(t => t.id !== parseInt(id));
        await writeJson('terms.json', filteredTerms);

        return NextResponse.json({ message: "S&K dan file HTML berhasil dihapus" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

