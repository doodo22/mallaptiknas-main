import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // 1. Redirect /login dan /register lama ke /auth
    if (path === "/login" || path === "/register") {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    // 2. Proteksi Halaman Admin
    if (path.startsWith("/admin")) {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            // Ubah redirect ke /auth
            return NextResponse.redirect(new URL("/auth", request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia_default");
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (err) {
            // Token expired -> redirect ke /auth
            return NextResponse.redirect(new URL("/auth", request.url));
        }
    }

    return NextResponse.next();
}

// Tambahkan /login dan /register ke matcher agar middleware berjalan di sana
export const config = {
    matcher: ["/admin", "/admin/:path*", "/login", "/register"],
};