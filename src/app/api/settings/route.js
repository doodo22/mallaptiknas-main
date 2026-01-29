import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';
import { successResponse, errorResponse } from '@/lib/apiHelpers';
import path from 'path';
import fs from 'fs';

// Helper khusus untuk settings karena strukturnya object bukan array of objects
const dataPath = path.join(process.cwd(), 'src/data/settings.json');

async function getSettings() {
    if (!fs.existsSync(dataPath)) {
        return { social: { instagram: '#', facebook: '#', youtube: '#' } };
    }
    const fileContent = await fs.promises.readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
}

// GET: Ambil settings
export async function GET() {
    try {
        const settings = await readJson('settings.json');
        return NextResponse.json(successResponse(settings));
    } catch (error) {
        // Jika file tidak ada, return default settings
        if (error.code === 'ENOENT') {
            const defaultSettings = {
                social: {
                    instagram: '',
                    facebook: '',
                    youtube: ''
                },
                site: {
                    title: 'Mall APTIKNAS',
                    description: 'Platform ekosistem teknologi terintegrasi'
                }
            };
            return NextResponse.json(successResponse(defaultSettings));
        }
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}

// POST: Update settings
export async function POST(request) {
    try {
        const body = await request.json();

        // Validasi minimal
        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                errorResponse('Data settings tidak valid'),
                { status: 400 }
            );
        }

        // Simpan settings
        await writeJson('settings.json', body);

        return NextResponse.json(
            successResponse(body, 'Settings berhasil diperbarui')
        );
    } catch (error) {
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}

