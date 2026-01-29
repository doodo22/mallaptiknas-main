"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from './BlogCard';

const BlogFeed = () => {
    const searchParams = useSearchParams();

    // --- STATE UTAMA ---
    const [posts, setPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]); // State untuk Trending
    const [isLoading, setIsLoading] = useState(true);

    // State Pagination & Sort
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("Terbaru");
    const itemsPerPage = 6;

    const categoryFilter = searchParams.get('cat');
    const searchFilter = searchParams.get('q');

    // --- FETCH DATA (Posts & Trending) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Semua Post (Feed Utama)
                const resPosts = await fetch('/api/blog');
                const dataPosts = await resPosts.json();
                setPosts(Array.isArray(dataPosts) ? dataPosts : []);

                // 2. Fetch Trending (Sidebar)
                const resTrending = await fetch('/api/blog/trending');
                const dataTrending = await resTrending.json();
                setTrendingPosts(Array.isArray(dataTrending) ? dataTrending : []);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // ... (Bagian Logic Filter, Sort, Pagination Tetap Sama - Tidak Diubah) ...
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryFilter, searchFilter, sortOrder]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    let filteredPosts = posts.filter((post) => {
        const matchCat = !categoryFilter || categoryFilter === "Semua" || post.category === categoryFilter;
        const matchSearch = !searchFilter || post.title.toLowerCase().includes(searchFilter.toLowerCase());
        return matchCat && matchSearch;
    });

    if (sortOrder === "Terbaru") {
        filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    }

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const displayedPosts = filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- RENDER ---
    return (
        <div className="content-grid">

            {/* KOLOM KIRI: FEED */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {searchFilter ? `Hasil: "${searchFilter}"` : 'Artikel Terbaru'}
                    </h3>
                    <select
                        className="select"
                        style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc' }}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="Terbaru">Terbaru</option>
                        <option value="Populer">Judul (A-Z)</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">Memuat artikel...</div>
                ) : (
                    <>
                        <div className="posts-grid">
                            {displayedPosts.length > 0 ? (
                                displayedPosts.map((post) => (
                                    <BlogCard
                                        key={post.id}
                                        id={post.id}
                                        image={post.image}
                                        category={post.category}
                                        title={post.title}
                                        author={post.author}
                                        date={formatDate(post.created_at)}
                                    />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                                    <p>Tidak ada artikel ditemukan.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="loadmore-wrap" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button
                                    className="btn-loadmore"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    &lt; Prev
                                </button>
                                <button
                                    className="btn-loadmore"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    Next &gt;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* KOLOM KANAN: SIDEBAR (Sekarang Dinamis) */}
            <aside className="sidebar">
                <div className="panel">
                    <h3><i className="fa-solid fa-fire"></i> Trending Minggu Ini</h3>

                    <div className="trending-list">
                        {trendingPosts.length > 0 ? (
                            trendingPosts.map((item, index) => (
                                <div className="trending-item" key={item.id}>
                                    {/* Nomor Urut (1, 2, 3) */}
                                    <span className="trending-num">{index + 1}</span>

                                    <div className="trending-info">
                                        <h4>
                                            <a href={`/blog/${item.id}`}>{item.title}</a>
                                        </h4>
                                        <small>{item.category || 'Umum'}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '13px', color: '#666' }}>Belum ada trending topik.</p>
                        )}
                    </div>
                </div>

                {/* Bagian Newsletter tetap statis */}
                <div className="panel" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                    <h3 style={{ color: 'white' }}>Newsletter</h3>
                    <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '15px' }}>Dapatkan update teknologi terbaru.</p>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input type="text" placeholder="Email.." style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none' }} />
                        <button style={{ background: 'var(--accent)', border: 'none', padding: '0 15px', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>OK</button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default BlogFeed;