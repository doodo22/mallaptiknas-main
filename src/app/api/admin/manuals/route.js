import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/apiHelpers';

export const dynamic = 'force-dynamic';

// Helper: Upload file ke Supabase Storage
async function uploadFileToSupabase(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const filename = `manuals/${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) throw new Error('Upload file gagal: ' + error.message);

    const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filename);

    return urlData.publicUrl;
}

export async function POST(request) {
    try {
        const data = await request.formData();
        const principalFile = data.get('principal');
        const distributorFile = data.get('distributor');
        const resellerFile = data.get('reseller');
        const marketplaceFile = data.get('marketplace');

        // Ambil settings lama terlebih dahulu
        const { data: currentSettings, error: fetchError } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();

        let siteConfig = {};
        let existingManuals = {};
        if (currentSettings && currentSettings.site) {
            siteConfig = currentSettings.site;
            if (siteConfig.manuals) {
                existingManuals = siteConfig.manuals;
            }
        }

        const newManuals = { ...existingManuals };

        // Upload masing-masing file jika ada
        if (principalFile && principalFile.size > 0) {
            newManuals.principal = await uploadFileToSupabase(principalFile);
        }
        if (distributorFile && distributorFile.size > 0) {
            newManuals.distributor = await uploadFileToSupabase(distributorFile);
        }
        if (resellerFile && resellerFile.size > 0) {
            newManuals.reseller = await uploadFileToSupabase(resellerFile);
        }
        if (marketplaceFile && marketplaceFile.size > 0) {
            newManuals.marketplace = await uploadFileToSupabase(marketplaceFile);
        }

        siteConfig.manuals = newManuals;

        // Update settings
        const { error: updateError } = await supabase
            .from('settings')
            .upsert({ id: 1, site: siteConfig });

        if (updateError) throw updateError;

        return NextResponse.json(successResponse(siteConfig, 'Manuals berhasil diperbarui'));
    } catch (error) {
        console.error("Upload Manuals Error:", error);
        return NextResponse.json(errorResponse(error.message), { status: 500 });
    }
}
