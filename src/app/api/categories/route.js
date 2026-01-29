import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import { validateRequired, successResponse, errorResponse } from '@/lib/apiHelpers';

// GET: Ambil semua kategori dari JSON
export async function GET() {
    try {
        const categories = await readJson('categories.json');
        return NextResponse.json(successResponse(categories));
    } catch (error) {
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}

// POST: Tambah kategori baru ke JSON
export async function POST(request) {
    try {
        const { name, color } = await request.json();

        // Validasi
        const validatedName = validateRequired(name, 'Nama kategori');
        
        const categories = await readJson('categories.json');
        
        // Cek duplikat
        const existingCategory = categories.find(c => 
            c.name.toLowerCase() === validatedName.toLowerCase()
        );
        
        if (existingCategory) {
            return NextResponse.json(
                errorResponse('Kategori sudah ada'), 
                { status: 400 }
            );
        }

        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;

        const newCategory = {
            id: newId,
            name: validatedName,
            color: color || 'blue',
            created_at: new Date().toISOString()
        };

        categories.push(newCategory);
        await writeJson('categories.json', categories);

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