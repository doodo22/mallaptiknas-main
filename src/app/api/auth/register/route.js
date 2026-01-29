import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        // 1. Cek apakah username sudah ada di JSON
        const users = await readJson('users.json');
        const existing = users.find(u => u.username === username);

        if (existing) {
            return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Simpan ke JSON
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({
            id: newId,
            username,
            password: hashedPassword,
            is_active: 0,
            created_at: new Date().toISOString()
        });

        await writeJson('users.json', users);

        return NextResponse.json({ message: "Registrasi berhasil! Tunggu validasi Admin." });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}