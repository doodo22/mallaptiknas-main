"use client"; // Ubah jadi client component untuk hooks scroll reveal
import { useEffect } from "react";
import "./globals.css";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import BusinessStats from "@/components/home/BusinessStats"; // Ini jadi Platform
import WhyUs from "@/components/home/WhyUs"; // Ini jadi Keuntungan & Pembeda
import LifeGallery from "@/components/home/LifeGallery"; // Ini jadi Timeline
import Partners from "@/components/home/Partners"; // Ini jadi Mitra
import Advertising from "@/components/home/Advertising";

export default function Home() {

  // LOGIC SCROLL REVEAL
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target); // Hanya animasi sekali
          }
        });
      }, { threshold: 0.12 });

      revealEls.forEach(el => io.observe(el));
    } else {
      // Fallback untuk browser lama
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }, []);

  return (
    <>
      <Hero />
      <About />
      {/* About sekarang berisi Sejarah & Misi */}

      <BusinessStats />
      {/* BusinessStats sekarang berisi Platform Section */}

      <WhyUs />
      {/* WhyUs sekarang berisi Keuntungan & Pembeda */}

      <Advertising />

      <Partners />
    </>
  );
}