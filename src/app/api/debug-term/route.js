import { NextResponse } from 'next/server';
import { readJson } from '@/lib/jsonDb';

export async function GET() {
    try {
        // Get all terms
        const terms = await readJson('terms.json');
        
        // Find term for /blog/sk-scm
        const targetUrl = '/blog/sk-scm';
        const activeTerm = terms
            .filter(t => (t.url === targetUrl || t.url === 'sk-scm') && t.isActive)
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        if (!activeTerm) {
            return NextResponse.json({
                success: false,
                message: 'No active term found for /blog/sk-scm',
                terms: terms
            });
        }
        
        // Check file URL
        const fileUrl = activeTerm.fileUrl;
        const fullUrl = `http://localhost:3000${fileUrl}`;
        
        // Try to fetch the file
        let fetchResult = null;
        try {
            const response = await fetch(fullUrl);
            fetchResult = {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries([...response.headers.entries()]),
                contentType: response.headers.get('content-type'),
                contentLength: response.headers.get('content-length')
            };
            
            // Try to get text (first 1000 chars)
            if (response.ok) {
                const text = await response.text();
                fetchResult.sample = text.substring(0, 1000);
                fetchResult.hasHtmlTag = text.toLowerCase().includes('<html');
                fetchResult.hasBodyTag = text.toLowerCase().includes('<body');
            }
        } catch (fetchError) {
            fetchResult = { error: fetchError.message };
        }
        
        return NextResponse.json({
            success: true,
            term: activeTerm,
            fileUrl: fileUrl,
            fullUrl: fullUrl,
            fetchTest: fetchResult,
            analysis: {
                isHtmlFile: fileUrl.endsWith('.htm') || fileUrl.endsWith('.html'),
                isPdfFile: fileUrl.endsWith('.pdf'),
                expectedContentType: fileUrl.endsWith('.htm') ? 'text/html' : 
                                   fileUrl.endsWith('.html') ? 'text/html' :
                                   fileUrl.endsWith('.pdf') ? 'application/pdf' : 'unknown'
            }
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}