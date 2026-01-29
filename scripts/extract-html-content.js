const fs = require('fs');
const path = require('path');

function extractHtmlContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Cari konten antara <body> dan </body>
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        let bodyContent = bodyMatch ? bodyMatch[1] : content;
        
        // Jika tidak ada tag body, coba ambil konten setelah tag penutup head
        if (!bodyMatch) {
            const afterHead = content.split(/<\/head>/i)[1];
            if (afterHead) {
                bodyContent = afterHead;
            }
        }
        
        // Hapus semua tag script
        bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        
        // Hapus semua tag style
        bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        // Hapus semua komentar
        bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, '');
        
        // Hapus semua atribut yang tidak perlu
        bodyContent = bodyContent.replace(/\s(class|style|id|lang|dir|align|valign|bgcolor|border|cellpadding|cellspacing)="[^"]*"/gi, '');
        
        // Buat HTML sederhana
        const cleanHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Syarat dan Ketentuan</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1, h2, h3 { color: #333; }
        p { margin-bottom: 15px; }
        ul, ol { margin-left: 20px; margin-bottom: 15px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
        
        // Simpan file
        const cleanFilePath = filePath.replace('.htm', '-simple.htm');
        fs.writeFileSync(cleanFilePath, cleanHtml, 'utf8');
        
        console.log(`Konten HTML berhasil diekstrak: ${cleanFilePath}`);
        return cleanFilePath;
    } catch (error) {
        console.error('Error mengekstrak konten:', error);
        return null;
    }
}

// Jalankan untuk file asli
const filePath = path.join(__dirname, '../public/uploads/terms/1768592403789-SYARAT-DAN-KETENTUAN-APLIKASI-MA.htm');
extractHtmlContent(filePath);