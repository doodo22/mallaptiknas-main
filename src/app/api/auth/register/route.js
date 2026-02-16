import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        // 1. Cek apakah username sudah ada di Supabase
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existing) {
            return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Simpan ke Supabase
        const { error } = await supabase
            .from('users')
            .insert([{
                username,
                password: hashedPassword,
                is_active: 0
            }]);

        if (error) throw error;

        return NextResponse.json({ message: "Registrasi berhasil! Tunggu validasi Admin." });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
    }
}