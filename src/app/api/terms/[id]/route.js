import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil detail S&K berdasarkan ID dari Supabase
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { data: term, error } = await supabase
            .from('terms')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !term) {
            return NextResponse.json({ error: "S&K tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(term);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update S&K di Supabase
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.formData();

        const title = data.get('title');
        const revision = data.get('revision');
        const url = data.get('url');
        const content = data.get('content');
        const date = data.get('date');
        const isActive = data.get('isActive');

        const updateData = {};
        if (title) updateData.title = title.trim();
        if (revision) updateData.revision = revision.trim();
        if (url) updateData.url = url.trim();
        if (content) updateData.content = content.trim();
        if (date) updateData.date = new Date(date).toISOString();
        if (isActive !== null) updateData.isActive = isActive === 'true';

        const { error } = await supabase
            .from('terms')
            .update(updateData)
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ message: "S&K berhasil diperbarui" });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Gagal update data: " + error.message }, { status: 500 });
    }
}

// DELETE: Hapus S&K dari Supabase
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const { error } = await supabase
            .from('terms')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: "S&K berhasil dihapus" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
