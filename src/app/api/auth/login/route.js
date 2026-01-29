import { NextResponse } from "next/server";
import { readJson } from "@/lib/jsonDb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // 1. Cek User di JSON
        const users = await readJson('users.json');
        const user = users.find(u => u.username === username);

        if (!user) {
            return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 401 });
        }

        if (user.is_active === 0) {
            return NextResponse.json({
                error: "Akun Anda belum diaktifkan."
            }, { status: 403 });
        }

        // 2. Cek Password 
        let isValid = false;

        // Cek apakah password cocok secara langsung (plain text)
        if (password === user.password) {
            isValid = true;
        } else {
            // Jika tidak cocok plain, coba cek dengan bcrypt (untuk akun yang mendaftar via web)
            try {
                isValid = await bcrypt.compare(password, user.password);
            } catch (e) {
                isValid = false;
            }
        }

        if (!isValid) {
            return NextResponse.json({ error: "Password salah!" }, { status: 401 });
        }

        // 3. Buat Token JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia_default");
        const token = await new SignJWT({ id: user.id, username: user.username })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(secret);

        // 4. Set Cookie
        const response = NextResponse.json({ message: "Login Berhasil" });
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
    }
}