import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import { successResponse, errorResponse } from '@/lib/apiHelpers';

// DELETE: Hapus Kategori dari JSON
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const categories = await readJson('categories.json');
        
        const categoryIndex = categories.findIndex(c => c.id === parseInt(id));
        
        if (categoryIndex === -1) {
            return NextResponse.json(
                errorResponse('Kategori tidak ditemukan'), 
                { status: 404 }
            );
        }

        // Cek apakah kategori digunakan di artikel
        const posts = await readJson('posts.json');
        const isUsed = posts.some(post => post.category === categories[categoryIndex].name);
        
        if (isUsed) {
            return NextResponse.json(
                errorResponse('Kategori tidak dapat dihapus karena masih digunakan di artikel'), 
                { status: 400 }
            );
        }

        const filteredCategories = categories.filter(c => c.id !== parseInt(id));
        await writeJson('categories.json', filteredCategories);
        
        return NextResponse.json(
            successResponse(null, 'Kategori berhasil dihapus')
        );
    } catch (error) {
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}