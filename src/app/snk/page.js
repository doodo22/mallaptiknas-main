"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function SnkListPage() {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTerms() {
            try {
                const res = await fetch('/api/terms');
                if (res.ok) {
                    const data = await res.json();
                    setTerms(data.filter(t => t.isActive));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTerms();
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-900 font-sans">
            <style jsx>{`
                .bg-gradient-dark {
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                }
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.4;
                    pointer-events: none;
                }
                .orb-1 { width: 400px; height: 400px; background: #00c6ff; top: -100px; left: -100px; }
                .orb-2 { width: 300px; height: 300px; background: #0072ff; bottom: -50px; right: -50px; }
                
                .glass-text {
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                 .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                }
                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-5px);
                }
            `}</style>

            {/* Background Background */}
            <div className="absolute inset-0 bg-gradient-dark z-0"></div>
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="relative z-10">
                <Navbar />

                <div className="pt-[140px] pb-20">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-16">
                            <span className="text-[#00c6ff] font-bold tracking-[0.2em] uppercase text-sm mb-3 block drop-shadow-md">
                                Pusat Hukum
                            </span>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
                                Syarat & Ketentuan
                            </h1>
                            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                                Temukan semua dokumen hukum, syarat, dan ketentuan penggunaan layanan Mall Aptiknas di sini.
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <i className="fas fa-circle-notch fa-spin text-4xl text-[#00c6ff]"></i>
                                <p className="text-slate-400 mt-4">Memuat data...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                {terms.map((term) => (
                                    <Link
                                        key={term.id}
                                        href={term.url || `/snk/${term.slug}`}
                                        className="glass-card p-6 rounded-2xl transition-all duration-300 group flex flex-col justify-between h-full min-h-[180px]"
                                    >
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-[#00c6ff]/10 text-[#00c6ff] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#00c6ff]/20">
                                                    Revisi {term.revision}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00c6ff] group-hover:text-white transition-colors">
                                                    <i className="fas fa-arrow-right text-xs text-slate-400 group-hover:text-white"></i>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#00c6ff] transition-colors leading-snug mb-2">
                                                {term.title}
                                            </h3>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                                <i className="far fa-calendar-alt"></i>
                                                {new Date(term.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="text-[#00c6ff] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                BACA SEKARANG
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
