"use client";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
    const { toggleTheme } = useTheme();

    return (
        <button
            id="theme-toggle"
            className="theme-btn-celestial"
            onClick={toggleTheme}
            aria-label="Ganti Mode Gelap/Terang"
        >
            <div className="sun-moon-icon">
                <div className="main-body"></div>
                <div className="rays"></div>
            </div>
        </button>
    );
};

export default ThemeToggle;