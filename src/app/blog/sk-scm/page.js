"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SyaratKetentuanPage() {
    const [docData, setDocData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchTerm() {
            try {
                // Fetch all terms
                const res = await fetch('/api/terms');
                if (!res.ok) throw new Error("Gagal mengambil data");
                const terms = await res.json();

                const targetUrl = '/blog/sk-scm';

                const activeTerm = terms
                    .filter(t => (t.url === targetUrl || t.url === 'sk-scm') && t.isActive)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                if (activeTerm) {
                    setDocData(activeTerm);
                            }
                        } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTerm();
    }, []);

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    if (!docData) {
        return (
            <div className="min-h-screen pt-[100px] pb-20 bg-slate-50 flex flex-col items-center justify-center">
                <i className="fas fa-file-contract text-6xl text-gray-300 mb-4"></i>
                <h1 className="text-2xl font-bold text-gray-700">Dokumen Tidak Tersedia</h1>
                <p className="text-gray-500 mt-2">Belum ada Syarat & Ketentuan aktif untuk halaman ini.</p>
                <Link href="/" className="mt-6 text-blue-600 hover:underline">Kembali ke Beranda</Link>
            </div>
        );
    }

    const lastUpdated = new Date(docData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
        <div className="bg-slate-50 min-h-screen pt-[100px] pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 mb-8 py-10">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-blue-500 font-bold tracking-wider uppercase text-sm mb-2 block">Legal Documents</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{docData.title}</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Harap membaca syarat dan ketentuan ini dengan saksama.
                    </p>
                    <div className="mt-6 flex justify-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center"><i className="far fa-calendar-alt mr-2"></i> Terakhir Diperbarui: {lastUpdated}</span>
                        <span className="flex items-center"><i className="far fa-file-word mr-2"></i> Revisi {docData.revision}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative p-8 md:p-12">
                        <div className="prose prose-lg prose-blue max-w-none">
                        {docData.content ? (
                            <div dangerouslySetInnerHTML={{ __html: docData.content }} />
                            ) : (
                                <div className="text-center py-20 text-gray-400">
                                <p>Konten tidak tersedia.</p>
                                </div>
                            )}
                        </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors">
                        <i className="fas fa-arrow-left mr-2"></i> Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}

