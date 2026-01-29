"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    // Jangan tampilkan di halaman Admin/Auth
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    // LOGIC SCROLL SPY (Pengganti script.js bagian scroll)
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            let current = "";

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                // Offset 150px sesuai script.js asli
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute("id");
                }
            });
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { id: "sejarah", label: "Sejarah" },
        { id: "misi", label: "Misi" },
        { id: "platform", label: "Platform" },
        { id: "keuntungan", label: "Mengapa Kami" },
        { id: "mitra", label: "Mitra" },
        { id: "advertising", label: "Pasang Iklan" },
    ];

    return (
        <header>
            <div className="container">
                <nav>
                    <div className="logo" onClick={() => isHomePage && window.scrollTo(0, 0)}>
                        <Link href="/">
                            <img src="/img/logo-mallaptiknas-new.png" alt="Mall Aptiknas" />
                        </Link>
                    </div>

                    <div
                        className={`hamburger ${isMobileOpen ? "active" : ""}`}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>

                    <div className={`nav-links ${isMobileOpen ? "active" : ""}`}>
                        <ul>
                            {navLinks.map((link) => (
                                <li key={link.id}>
                                    <Link
                                        href={isHomePage ? `#${link.id}` : `/#${link.id}`}
                                        className={activeSection === link.id ? "active" : ""}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {/* Link Khusus Blog */}
                            <li>
                                <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;