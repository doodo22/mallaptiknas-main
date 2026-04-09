import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil semua S&K dari Supabase
export async function GET() {
    try {
        const { data: terms, error } = await supabase
            .from('terms')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return NextResponse.json(terms);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Tambah S&K baru ke Supabase
export async function POST(request) {
    try {
        const data = await request.formData();
        const title = data.get('title');
        const revision = data.get('revision');
        const urlTarget = data.get('url') || '#';
        let content = data.get('content') || '';
        const file = data.get('file');

        // Jika ada file HTML yang diupload
        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer();
            content = new TextDecoder().decode(buffer);
        }

        // Validasi
        if (!title || title.trim().length < 3) return NextResponse.json({ error: "Judul minimal 3 karakter" }, { status: 400 });
        if (!revision || revision.trim().length < 1) return NextResponse.json({ error: "Versi revisi harus diisi" }, { status: 400 });
        if (!content || content.trim().length < 10) return NextResponse.json({ error: "Konten S&K minimal 10 karakter" }, { status: 400 });

        const dateVal = data.get('date');
        const finalDate = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();

        // Ambil ID tertinggi saat ini untuk mencegah error duplicate key sequence
        const { data: maxIdData } = await supabase
            .from('terms')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)
            .single();
            
        const nextId = maxIdData ? maxIdData.id + 1 : 1;

        const { data: newTerm, error } = await supabase
            .from('terms')
            .insert([{
                id: nextId,
                title: title.trim(),
                slug: title.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                revision: revision.trim(),
                url: urlTarget,
                content: content.trim(),
                "isActive": true,
                date: finalDate
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            message: "S&K berhasil disimpan",
            id: newTerm.id
        });

    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: "Gagal menyimpan data: " + error.message }, { status: 500 });
    }
}
