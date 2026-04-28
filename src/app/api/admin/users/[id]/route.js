import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        return NextResponse.json({ message: "User dihapus permanen" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}