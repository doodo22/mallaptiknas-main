const fs = require('fs');
const path = require('path');

function cleanHtmlFileAggressive(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Hapus SEMUA referensi ke file eksternal
        content = content.replace(/<link[^>]*href="[^"]*\/files\/[^"]*"[^>]*>/gi, '');
        content = content.replace(/<link[^>]*href="[^"]*\.xml"[^>]*>/gi, '');
        content = content.replace(/<link[^>]*href="[^"]*\.thmx"[^>]*>/gi, '');
        
        // Hapus semua atribut xmlns yang tidak perlu
        content = content.replace(/xmlns:[^=]+="[^"]*"/gi, '');
        
        // Hapus semua tag meta yang tidak perlu
        content = content.replace(/<meta[^>]*name="[^"]*"[^>]*>/gi, function(match) {
            // Hanya pertahankan meta charset
            if (match.includes('charset') || match.includes('Content-Type')) {
                return match;
            }
            return '';
        });
        
        // Hapus semua komentar
        content = content.replace(/<!--[\s\S]*?-->/g, '');
        
        // Hapus style internal yang bermasalah
        content = content.replace(/<style>[\s\S]*?<\/style>/gi, '');
        
        // Hapus tag office yang tidak perlu
        content = content.replace(/<\/?o:[^>]*>/gi, '');
        content = content.replace(/<\/?w:[^>]*>/gi, '');
        content = content.replace(/<\/?v:[^>]*>/gi, '');
        content = content.replace(/<\/?m:[^>]*>/gi, '');
        
        // Tambahkan basic HTML structure jika perlu
        if (!content.includes('<html')) {
            content = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' + content + '</body></html>';
        }
        
        // Simpan file yang sudah dibersihkan
        const cleanFilePath = filePath.replace('.htm', '-clean2.htm');
        fs.writeFileSync(cleanFilePath, content, 'utf8');
        
        console.log(`File berhasil dibersihkan secara agresif: ${cleanFilePath}`);
        return cleanFilePath;
    } catch (error) {
        console.error('Error membersihkan file:', error);
        return null;
    }
}

// Jalankan untuk file yang bermasalah
const filePath = path.join(__dirname, '../public/uploads/terms/1768592403789-SYARAT-DAN-KETENTUAN-APLIKASI-MA.htm');
cleanHtmlFileAggressive(filePath);