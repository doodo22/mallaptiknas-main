"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const BlogFeatured = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [current, setCurrent] = useState(0);

    // Fetch Data
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/blog/featured');
                if (!res.ok) throw new Error("Gagal fetch featured posts");
                const data = await res.json();
                setFeaturedPosts(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const length = featuredPosts.length;

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    useEffect(() => {
        if (length === 0) return;
        const timer = setTimeout(() => {
            nextSlide();
        }, 5000);
        return () => clearTimeout(timer);
    }, [current, length]);

    const getExcerpt = (content) => {
        if (!content) return "";
        const plainText = content.replace(/<[^>]+>/g, '');
        return plainText.length > 120 ? plainText.substring(0, 120) + "..." : plainText;
    };

    if (isLoading) return null;
    if (!Array.isArray(featuredPosts) || featuredPosts.length === 0) return null;

    // UPDATE: Menghapus wrapper "container" agar sesuai struktur HTML asli
    return (
        <div className="featured" id="featured">

            <div
                className="featured-track"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {featuredPosts.map((post, index) => (
                    <div
                        className={`featured-slide ${index === current ? 'active' : ''}`}
                        key={post.id}
                    >
                        <div
                            className="bg"
                            style={{ backgroundImage: `url('${post.image || '/img/hero-desktop.jpg'}')` }}
                        ></div>

                        <div className="card">
                            <h2>{post.title}</h2>
                            <p>{getExcerpt(post.content)}</p>
                            <Link href={`/blog/${post.id}`} className="readmore">
                                Baca Selengkapnya <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {length > 1 && (
                <>
                    <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="slider-btn next" onClick={nextSlide} aria-label="Next">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    <div className="slider-dots">
                        {featuredPosts.map((_, index) => (
                            <div
                                key={index}
                                className={`dot ${index === current ? 'active' : ''}`}
                                onClick={() => setCurrent(index)}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogFeatured;