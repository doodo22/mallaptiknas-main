import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateRequired, successResponse, errorResponse } from '@/lib/apiHelpers';

// GET: Ambil semua kategori dari Supabase
export async function GET() {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return NextResponse.json(successResponse(categories));
    } catch (error) {
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}

// POST: Tambah kategori baru ke Supabase
export async function POST(request) {
    try {
        const { name, color } = await request.json();

        // Validasi
        const validatedName = validateRequired(name, 'Nama kategori');

        // Cek duplikat
        const { data: existing } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', validatedName)
            .single();

        if (existing) {
            return NextResponse.json(
                errorResponse('Kategori sudah ada'),
                { status: 400 }
            );
        }

        const { data: newCategory, error } = await supabase
            .from('categories')
            .insert([{
                name: validatedName,
                color: color || 'blue'
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            successResponse(newCategory, 'Kategori berhasil dibuat')
        );
    } catch (error) {
        if (error.name === 'ApiError') {
            return NextResponse.json(errorResponse(error.message), { status: error.status });
        }
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}