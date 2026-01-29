import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';

// GET: Ambil semua user dari JSON
export async function GET() {
    try {
        const users = await readJson('users.json');
        // Jangan kembalikan password
        const safeUsers = users.map(({ password, ...user }) => user);
        return NextResponse.json(safeUsers);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Buat user baru
export async function POST(request) {
    try {
        const { username, password } = await request.json();
        
        // Validasi input
        if (!username || !username.trim()) {
            return NextResponse.json({ 
                success: false,
                error: "Username wajib diisi" 
            }, { status: 400 });
        }
        
        if (!password || password.length < 6) {
            return NextResponse.json({ 
                success: false,
                error: "Password minimal 6 karakter" 
            }, { status: 400 });
        }

        const users = await readJson('users.json');
        
        // Cek jika username sudah ada
        const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            return NextResponse.json({ 
                success: false,
                error: "Username sudah digunakan" 
            }, { status: 400 });
        }

        // Generate ID baru
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            username: username.trim(),
            password: password, // TODO: Hash password di sini nanti
            is_active: 1,
            created_at: new Date().toISOString(),
            role: 'user' // Tambahkan role
        };

        users.push(newUser);
        await writeJson('users.json', users);

        // Jangan kembalikan password
        const { password: _, ...safeUser } = newUser;
        return NextResponse.json({ 
            success: true,
            message: "User berhasil dibuat", 
            data: safeUser 
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}

// PUT: Update Status (Approve/Reject) di JSON
export async function PUT(request) {
    try {
        const { id, is_active, username } = await request.json();
        
        if (!id) {
            return NextResponse.json({ 
                success: false,
                error: "ID user wajib diisi" 
            }, { status: 400 });
        }

        const users = await readJson('users.json');

        const index = users.findIndex(u => u.id === parseInt(id));
        if (index === -1) {
            return NextResponse.json({ 
                success: false,
                error: "User tidak ditemukan" 
            }, { status: 404 });
        }

        // Update data
        if (is_active !== undefined) {
            users[index].is_active = is_active;
        }
        
        if (username && username.trim()) {
            // Cek jika username baru sudah digunakan oleh user lain
            const usernameExists = users.some((u, idx) => 
                idx !== index && u.username.toLowerCase() === username.toLowerCase().trim()
            );
            
            if (usernameExists) {
                return NextResponse.json({ 
                    success: false,
                    error: "Username sudah digunakan" 
                }, { status: 400 });
            }
            
            users[index].username = username.trim();
        }

        await writeJson('users.json', users);
        
        const { password, ...updatedUser } = users[index];
        
        return NextResponse.json({ 
            success: true,
            message: "Data user berhasil diperbarui",
            data: updatedUser
        });
    } catch (error) {
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}