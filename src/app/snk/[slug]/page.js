"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SnkDetailPage() {
    const params = useParams();
    const [docData, setDocData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTerm() {
            try {
                const res = await fetch('/api/terms');
                if (!res.ok) throw new Error("Gagal mengambil data");
                const terms = await res.json();

                const slug = params.slug;
                const activeTerm = terms.find(t => (t.slug === slug || t.url?.includes(slug)) && t.isActive);

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
    }, [params.slug]);

    if (loading) return <div className="min-h-screen pt-24 text-center text-gray-400">Loading...</div>;

    if (!docData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <i className="fas fa-file-contract text-6xl text-gray-300 mb-4"></i>
                    <h1 className="text-2xl font-bold text-gray-700">Dokumen Tidak Tersedia</h1>
                    <p className="text-gray-500 mt-2">Maaf, Syarat & Ketentuan yang Anda cari tidak ditemukan atau sudah tidak aktif.</p>
                    <Link href="/snk" className="mt-6 text-blue-600 hover:underline">Lihat Semua S&K</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const lastUpdated = new Date(docData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Navbar />
            <div className="pt-[100px] pb-20 flex-1">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 mb-8 py-10">
                    <div className="container mx-auto px-4 text-center">
                        <Link href="/snk" className="text-blue-500 hover:text-blue-700 text-sm font-bold flex items-center justify-center gap-2 mb-4">
                            <i className="fas fa-arrow-left"></i> Kembali ke Daftar S&K
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{docData.title}</h1>
                        <div className="flex justify-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center"><i className="far fa-calendar-alt mr-2"></i> Terakhir Diperbarui: {lastUpdated}</span>
                            <span className="flex items-center"><i className="far fa-file-alt mr-2"></i> Revisi {docData.revision}</span>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
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

                    <div className="mt-12 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Mall Aptiknas. Seluruh hak cipta dilindungi undang-undang.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
