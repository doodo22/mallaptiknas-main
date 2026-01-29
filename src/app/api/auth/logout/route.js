import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout Berhasil" });
    // Hapus cookie dengan set maxAge 0
    response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
}