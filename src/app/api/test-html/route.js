import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public/uploads/terms/1768592403789-SYARAT-DAN-KETENTUAN-APLIKASI-MA.htm');
        
        // Cek jika file ada
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ 
                success: false, 
                error: 'File not found' 
            }, { status: 404 });
        }

        // Baca file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Cek ukuran file
        const fileSize = fs.statSync(filePath).size;
        
        // Cek apakah file valid HTML
        const isHtml = fileContent.toLowerCase().includes('<html') && fileContent.toLowerCase().includes('</html>');
        
        return NextResponse.json({
            success: true,
            fileExists: true,
            fileSize: fileSize,
            isHtml: isHtml,
            first500Chars: fileContent.substring(0, 500),
            last500Chars: fileContent.substring(fileContent.length - 500),
            hasBodyTag: fileContent.toLowerCase().includes('<body'),
            hasContent: fileContent.toLowerCase().includes('syarat') || fileContent.toLowerCase().includes('ketentuan')
        });
        
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}