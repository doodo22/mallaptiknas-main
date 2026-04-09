import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil semua user dari Supabase
export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, username, is_active, created_at, role')
            .order('id', { ascending: true });

        if (error) throw error;
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Buat user baru di Supabase
export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Validasi input
        if (!username || !username.trim()) return NextResponse.json({ success: false, error: "Username wajib diisi" }, { status: 400 });
        if (!password || password.length < 6) return NextResponse.json({ success: false, error: "Password minimal 6 karakter" }, { status: 400 });

        // Cek jika username sudah ada
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('username', username.trim())
            .single();

        if (existing) return NextResponse.json({ success: false, error: "Username sudah digunakan" }, { status: 400 });

        // Ambil ID tertinggi saat ini untuk mencegah error duplicate key sequence
        const { data: maxIdData } = await supabase
            .from('users')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)
            .single();
            
        const nextId = maxIdData ? maxIdData.id + 1 : 1;

        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                id: nextId,
                username: username.trim(),
                password: password, // TODO: Hash password
                is_active: 1,
                role: 'user'
            }])
            .select('id, username, is_active, created_at, role')
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "User berhasil dibuat",
            data: newUser
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Update Status atau Profile di Supabase
export async function PUT(request) {
    try {
        const { id, is_active, username } = await request.json();

        if (!id) return NextResponse.json({ success: false, error: "ID user wajib diisi" }, { status: 400 });

        const updateData = {};
        if (is_active !== undefined) updateData.is_active = is_active;
        if (username && username.trim()) {
            // Cek duplikat username
            const { data: dup } = await supabase
                .from('users')
                .select('id')
                .eq('username', username.trim())
                .neq('id', id)
                .single();

            if (dup) return NextResponse.json({ success: false, error: "Username sudah digunakan" }, { status: 400 });
            updateData.username = username.trim();
        }

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select('id, username, is_active, created_at, role')
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "Data user berhasil diperbarui",
            data: updatedUser
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}