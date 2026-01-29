const fs = require('fs');
const path = require('path');

function cleanHtmlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Hapus referensi ke file eksternal
        let cleaned = content.replace(/<link[^>]*filelist\.xml[^>]*>/gi, '');
        cleaned = cleaned.replace(/<link[^>]*\.xml[^>]*>/gi, '');
        
        // Hapus namespace Microsoft yang tidak perlu
        cleaned = cleaned.replace(/xmlns:v="[^"]*"/gi, '');
        cleaned = cleaned.replace(/xmlns:o="[^"]*"/gi, '');
        cleaned = cleaned.replace(/xmlns:w="[^"]*"/gi, '');
        cleaned = cleaned.replace(/xmlns:m="[^"]*"/gi, '');
        
        // Hapus tag meta yang tidak perlu
        cleaned = cleaned.replace(/<meta[^>]*ProgId[^>]*>/gi, '');
        cleaned = cleaned.replace(/<meta[^>]*Generator[^>]*>/gi, '');
        cleaned = cleaned.replace(/<meta[^>]*Originator[^>]*>/gi, '');
        
        // Hapus komentar conditional
        cleaned = cleaned.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '');
        
        // Simpan file yang sudah dibersihkan
        const cleanFilePath = filePath.replace('.htm', '-clean.htm');
        fs.writeFileSync(cleanFilePath, cleaned, 'utf8');
        
        console.log(`File berhasil dibersihkan: ${cleanFilePath}`);
        return cleanFilePath;
    } catch (error) {
        console.error('Error membersihkan file:', error);
        return null;
    }
}

// Jalankan untuk file yang bermasalah
const filePath = path.join(__dirname, '../public/uploads/terms/1768592403789-SYARAT-DAN-KETENTUAN-APLIKASI-MA.htm');
cleanHtmlFile(filePath);