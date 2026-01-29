import { Suspense } from 'react';
import BlogHeader from "@/components/Blog/BlogHeader";
import BlogFeatured from "@/components/Blog/BlogFeatured";
import BlogFeed from "@/components/Blog/BlogFeed";
import './blog-custom.css';

export const metadata = {
    title: 'Wawasan Digital & Bisnis - Mall APTIKNAS',
    description: 'Wawasan digital dan bisnis terbaru dari ekosistem APTIKNAS.',
};

export default function BlogPage() {
    return (
        <div className="blog-wrapper">
            <Suspense fallback={<div className="text-center py-20">Memuat Blog...</div>}>
                {/* 1. Header (blog-hero) - Berdiri Sendiri */}
                <BlogHeader />

                {/* 2. Main Content (blog-main) - Membungkus Featured & Feed */}
                <section className="blog-main">
                    <BlogFeatured />
                    <BlogFeed />
                </section>
            </Suspense>
        </div>
    );
}