// src/components/home/Hero.jsx
"use client";
import React from "react";

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-bg"></div>

            <style jsx>{`
                /* --- LAYOUT UTAMA (Desktop & Tablet) --- */
                .hero-section {
                    position: relative;
                    width: 100%;
                    margin-top: 80px; /* Kompensasi Fixed Navbar */
                    overflow: hidden;
                    background-color: #f0f3f7;

                    /* 1. Hapus Tinggi Fixed (calc 100vh) */
                    height: auto;
                    min-height: 0;

                    /* 2. KUNCI RASIO GAMBAR DESKTOP
                       PENTING: Ganti angka 16 / 9 di bawah ini dengan dimensi asli 
                       file 'hero-desktop.jpg' kamu agar akurat.
                       Contoh: Jika gambar 1920x800, tulis: 1920 / 800
                    */
                    aspect-ratio: 16 / 9; 
                }

                .hero-bg {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    
                    /* Desktop Image */
                    background-image: url('/img/hero-desktop.jpg');
                    
                    /* 3. Paksa gambar memenuhi container */
                    background-size: 100% 100%;
                    background-position: center center;
                }

                /* --- RESPONSIVE MOBILE (Layar < 768px) --- */
                @media (max-width: 768px) {
                    .hero-section {
                        /* Override Aspect Ratio untuk Mobile */
                        /* Sesuai dimensi gambar HP: 720x1600 */
                        aspect-ratio: 720 / 1600;
                    }

                    .hero-bg {
                        /* Ganti ke gambar Mobile */
                        background-image: url('/img/hero-mobile.jpg');
                        background-size: 100% 100%;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;