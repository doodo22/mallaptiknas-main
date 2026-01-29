"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const BlogHeader = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- STATE DATA ---
    // State untuk menyimpan kategori dari Database
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Ambil nilai filter awal dari URL
    const initialCategory = searchParams.get('cat') || "Semua";
    const initialSearch = searchParams.get('q') || "";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    // --- FETCH DATA KATEGORI ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error("Gagal fetch kategori");

                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading categories:", err);
                // Jika error, biarkan array kosong (user hanya melihat tombol 'Semua')
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // --- LOGIC FILTER & SEARCH ---
    const updateFilters = (cat, search) => {
        const params = new URLSearchParams();

        // Logika: Jika kategori bukan "Semua", masukkan ke parameter URL
        if (cat && cat !== "Semua") params.set('cat', cat);

        // Logika: Jika ada kata kunci pencarian, masukkan ke parameter URL
        if (search) params.set('q', search);

        // Update URL tanpa reload halaman (scroll: false agar tidak lompat ke atas)
        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    const handleCategoryClick = (catName) => {
        setActiveCategory(catName);
        updateFilters(catName, searchTerm);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateFilters(activeCategory, searchTerm);
    };

    return (
        <section className="blog-hero">
            <div className="blog-kicker">MALL APTIKNAS BLOG</div>
            <h1 className="blog-title">Wawasan Digital <span className="accent">&amp; Bisnis</span></h1>
            <p className="blog-subtitle">
                Insight singkat untuk pelaku distribusi IT: dari tren industri, praktik keamanan, sampai tips operasional SCM yang bisa langsung dipakai.
            </p>

            <div className="search-row">
                <form className="searchbar" onSubmit={handleSearchSubmit} role="search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="search"
                        placeholder="Cari tren, tutorial, atau berita..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoComplete="off"
                    />
                    <button type="submit" aria-label="Cari">
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </form>
            </div>

            <div className="chips">
                {/* TOMBOL STATIS: "Semua" selalu muncul paling kiri */}
                <button
                    onClick={() => handleCategoryClick("Semua")}
                    className={`chip ${activeCategory === "Semua" ? 'active' : ''}`}
                >
                    Semua
                </button>

                {/* TOMBOL DINAMIS: Hasil dari database */}
                {isLoading ? (
                    // Tampilan Loading sederhana (opsional)
                    <span style={{ fontSize: '12px', color: '#999', padding: '10px' }}>Memuat...</span>
                ) : (
                    categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`chip ${activeCategory === cat.name ? 'active' : ''}`}
                        >
                            {cat.name}
                        </button>
                    ))
                )}
            </div>
        </section>
    );
};

export default BlogHeader;