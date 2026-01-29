// src/app/platform/page.js
"use client";
import React from "react";
import Link from 'next/link';

export default function PlatformPage() {
    return (
        <div className="platform-page">

            <section className="platform-hero">
                {/* Background Shapes */}
                <div className="hero-bg-shapes">
                    <div className="hero-shape shape-1"></div>
                    <div className="hero-shape shape-2"></div>
                </div>

                {/* LAYER 1: KONTEN TEKS (Posisi Terkunci di Tengah) */}
                <div className="hero-center-stack animate-fade-in-up">
                    <div className="hero-badge">
                        <i className="fas fa-layer-group" style={{ fontSize: '1em' }}></i>
                        <span>SCM Platform</span>
                    </div>

                    <div className="hero-logo-wrapper">
                        <img
                            src="/img/logo-atas-bawah.png"
                            alt="Logo Mall APTIKNAS"
                            className="platform-hero-logo"
                        />
                    </div>

                    <h1 className="hero-headline">
                        Platform Supply Chain <br />
                        Management Teknologi
                    </h1>

                    <p className="hero-subheadline">
                        Hubungkan bisnis Anda dengan ribuan mitra dalam satu ekosistem digital.
                    </p>
                </div>

                {/* LAYER 2: GAMBAR (Absolute Floating - Di Atas Semuanya) */}
                <div className="hero-abs-image-layer animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <img
                        src="/img/promo gratis keanggotaan.png"
                        alt="Promo Gratis"
                        className="promo-img-overlay"
                    />
                </div>
            </section>

            {/* SECTION 2: PRICING TIERS */}
            <section className="section-wrapper">
                <div className="section-header">
                    <h2 className="section-title">Pilih Tier Keanggotaan Anda</h2>
                    <div className="promo-badge-container">
                        <span className="promo-main-tag">🔥 PROMO SPESIAL 2026</span>
                        <p className="promo-desc">
                            <strong>Gratis Jan-Mar 2026</strong>, lalu Diskon 50% s/d Desember. <br />
                            <small>*Hanya untuk pendaftaran sebelum 1 April 2026</small>
                        </p>
                    </div>
                </div>

                {/* UPDATE: Grid disesuaikan untuk 6 item (3 per baris di desktop) */}
                <div className="pricing-grid six-cols">

                    {/* 1. PRINCIPAL */}
                    <PricingCard
                        title="Principal"
                        subtitle="Brand owner & manufacturer"
                        desc="Raih kendali penuh atas distribusi. Lacak pergerakan, kendali harga, & analisis pasar."
                        color="var(--brand-green)"
                        icon={<IconCrown />}
                        basePrice="Rp 750.000"
                        effectivePrice="Rp 375.000"
                        benefits={[
                            "Kendali penuh distribusi",
                            "Lacak pergerakan stok",
                            "Kontrol harga pasar",
                            "Analisis data mendalam",
                            "Laporan real-time"
                        ]}
                    />

                    {/* 2. DISTRIBUTOR */}
                    <PricingCard
                        title="Distributor"
                        subtitle="Distributor resmi & wholesaler"
                        desc="Ekspansi bisnis lebih mudah. Akses banyak Principal & kelola supply ke Master Dealer."
                        color="var(--brand-blue)"
                        icon={<IconBuilding />}
                        basePrice="Rp 400.000"
                        effectivePrice="Rp 200.000"
                        benefits={[
                            "Akses ragam Principal",
                            "Kelola supply chain",
                            "Manajemen kredit MD",
                            "Efisiensi operasional",
                            "Fitur API (+Rp 200rb)"
                        ]}
                    />

                    {/* 3. MASTER DEALER */}
                    <PricingCard
                        title="Master Dealer"
                        subtitle="Grosir & Jaringan Toko"
                        desc="Kuatkan jaringan toko Anda. Akses harga terbaik & kelola mitra dengan mudah."
                        color="#38BDF8" // Light Blue
                        icon={<IconStore />}
                        basePrice="Rp 250.000"
                        effectivePrice="Rp 125.000"
                        benefits={[
                            "Akses harga terbaik",
                            "Kelola mitra toko",
                            "Stok real-time",
                            "Order management"
                        ]}
                    />

                    {/* 4. MITRA USAHA 1 */}
                    <PricingCard
                        title="Mitra Usaha 1"
                        subtitle="Reseller & Retail"
                        desc="Jualan kompetitif dengan akses harga berjenjang & stok real-time."
                        color="var(--brand-red)"
                        icon={<IconUsers />}
                        basePrice="Rp 150.000"
                        effectivePrice="Rp 75.000"
                        benefits={[
                            "Syarat: NPWP, NIB & Rekening a/n Perusahaan",
                            "Bisa akses Harga hingga distributor",
                            "Free marketplace",
                            "Stok real Time",
                            "Pembayaran Fleksibel"
                        ]}
                    />

                    {/* 5. MITRA USAHA 2 */}
                    <PricingCard
                        title="Mitra Usaha 2"
                        subtitle="Reseller, Retail & UMKM"
                        desc="Jualan kompetitif dengan akses harga berjenjang & stok real-time."
                        color="var(--brand-red)"
                        icon={<IconUsers />}
                        basePrice="Rp 150.000"
                        effectivePrice="Rp 50.000"
                        benefits={[
                            "Syarat: NPWP & NIB a/n Perusahaan",
                            "Bisa akses Harga hingga MD",
                            "Free marketplace",
                            "Stok real Time",
                            "Pembayaran Fleksibel"
                        ]}
                    />

                    {/* 6. MITRA USAHA 3 */}
                    <PricingCard
                        title="Mitra Usaha 3"
                        subtitle="Reseller & UMKM"
                        desc="Jualan kompetitif & stok real-time."
                        color="var(--brand-red)"
                        icon={<IconUsers />}
                        basePrice="Rp 150.000"
                        effectivePrice="Rp 25.000"
                        benefits={[
                            "Syarat: Rekening Pribadi",
                            "Bisa akses Harga hingga Mitra_1",
                            "Free marketplace",
                            "Stok real Time"
                        ]}
                    />

                </div>
            </section>

            {/* SECTION 3: DOKUMEN */}
            <section className="docs-section">
                <div className="container mx-auto">
                    <div className="section-header">
                        <h2 className="section-title">Syarat Pendaftaran</h2>
                        <p style={{ color: "var(--brand-grey)" }}>Siapkan dokumen berikut untuk mendaftar</p>
                    </div>

                    <div className="doc-cards-grid">
                        <DocCard
                            title="NIB"
                            subtitle="Nomor Induk Berusaha"
                            desc="Dokumen resmi dari OSS yang menjadi identitas pelaku usaha."
                        />
                        <DocCard
                            title="NPWP"
                            subtitle="Nomor Pokok Wajib Pajak"
                            desc="Nomor identitas wajib pajak untuk administrasi perpajakan."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

// ... (Sub Components PricingCard, DocCard, Icons tetap sama di bawah) ...
// Sertakan juga kode Sub Components di file asli Anda
// src/app/platform/page.js (Bagian Component PricingCard saja)

// src/app/platform/page.js (Komponen PricingCard)

function PricingCard({ title, subtitle, desc, icon, benefits, color, basePrice, effectivePrice, priceNote }) {
    const targetUrl = "https://stage-scm.mallaptiknas.com/register";

    return (
        <div className="pricing-card" style={{ '--theme-color': color }}>
            <div className="card-top-line"></div>

            {/* HAPUS BADGE DARI SINI (Posisi Lama) */}

            {/* Header */}
            <div className="card-header-group">
                <div className="card-icon">
                    {icon}
                </div>
                <div>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-subtitle">{subtitle}</p>
                </div>
            </div>

            {/* Deskripsi */}
            <p className="card-desc">
                {desc}
            </p>

            {/* --- POSISI BARU: BADGE DISINI --- */}
            {/* Menggunakan margin-left: auto di CSS akan membuatnya rata kanan */}
            <div className="card-badge-free">FREE JAN-MAR</div>

            {/* Bagian Harga */}
            <div className="price-section">
                {/* Baris Harga Normal */}
                <div className="price-row-base">
                    <span className="price-label-sm">Normal:</span>
                    <span className="price-strike">{basePrice}/bln</span>
                </div>

                {/* Baris Harga Promo */}
                <div className="price-row-promo">
                    <p className="price-promo-label">
                        Promo Apr-Des 2026:
                    </p>
                    <div className="price-promo-val-group">
                        <span className="price-promo-value">{effectivePrice}</span>
                        <span className="price-promo-suffix">/bln</span>
                    </div>
                    {priceNote && <p className="price-note">*{priceNote}</p>}
                </div>
            </div>

            {/* Keuntungan */}
            <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                <p className="card-benefits-title">Keuntungan:</p>
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-item">
                        <div className="benefit-check">✔</div>
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>

            {/* Tombol Aksi */}
            <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-card-action block text-center text-white no-underline"
            >
                Daftar Sekarang
            </a>
        </div >
    );
}

function DocCard({ title, subtitle, desc }) {
    return (
        <div className="doc-card">
            <div className="doc-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                </svg>
            </div>
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--brand-navy)' }}>{title}</h3>
                <p style={{ color: 'var(--brand-blue)', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{subtitle}</p>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{desc}</p>
            </div>
        </div>
    );
}

// --- ICONS (Tambahkan IconStore) ---
const IconCrown = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path><path d="M5 21h14"></path></svg>);
const IconBuilding = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path></svg>);
// Icon Baru untuk Master Dealer
const IconStore = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const IconUsers = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path></svg>);