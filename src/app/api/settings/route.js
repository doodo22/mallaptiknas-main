import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/apiHelpers';

// GET: Ambil settings dari Supabase
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            // Jika error karena data belum ada, kirim default
            const defaultSettings = {
                social: { instagram: '', tiktok: '', youtube: '', linkedin: '', googleForm: '' },
                site: { title: 'Mall APTIKNAS', description: 'Platform ekosistem teknologi terintegrasi' }
            };
            return NextResponse.json(successResponse(defaultSettings));
        }

        return NextResponse.json(successResponse(data));
    } catch (error) {
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}

// POST: Update settings di Supabase
export async function POST(request) {
    try {
        const body = await request.json();

        if (!body || typeof body !== 'object') {
            return NextResponse.json(errorResponse('Data settings tidak valid'), { status: 400 });
        }

        const { error } = await supabase
            .from('settings')
            .upsert({ id: 1, ...body });

        if (error) throw error;

        return NextResponse.json(successResponse(body, 'Settings berhasil diperbarui'));
    } catch (error) {
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}
