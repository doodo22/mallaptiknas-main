"use client";
import React from 'react';
import Link from 'next/link';

const BlogCard = ({ id, image, category, title, author, date }) => {
    // Fallback jika image kosong
    const bgImage = image ? `url('${image}')` : `url('/img/blog/access.jpg')`;

    return (
        <Link href={`/blog/${id}`} className="post-card">
            {/* Bagian Gambar dengan Tag Kategori */}
            <div className="post-media" style={{ backgroundImage: bgImage }}>
                <span className="post-tag">
                    {category || 'Umum'}
                </span>
            </div>

            {/* Body Content */}
            <div className="post-body">
                <h3 className="post-title">
                    {title}
                </h3>

                <div className="post-meta">
                    <div className="author">
                        <div className="author-avatar">
                            {author ? author.charAt(0) : 'A'}
                        </div>
                        <span>{author || 'Admin'}</span>
                    </div>
                    <span>{date}</span>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;