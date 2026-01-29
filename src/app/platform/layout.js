// src/app/platform/layout.js
import './platform.css'; // Import CSS khusus di sini

export const metadata = {
    title: "Platform Mall APTIKNAS",
    description: "Platform Supply Chain Management untuk Industri Teknologi Indonesia",
};

export default function PlatformLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
}