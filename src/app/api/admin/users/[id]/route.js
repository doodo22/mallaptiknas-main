import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const users = await readJson('users.json');
        const filteredUsers = users.filter(u => u.id !== parseInt(id));

        await writeJson('users.json', filteredUsers);
        return NextResponse.json({ message: "User dihapus permanen" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}