// src/app/layout.js
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: 'Mall Aptiknas - Platform Ekosistem TIK Nasional',
  description: 'Mall Aptiknas adalah platform ekosistem digital Asosiasi Pengusaha TIK Nasional yang menghubungkan Business-to-Business (B2B), Business-to-Government (B2G), dan rantai pasok distribusi di seluruh Indonesia.',
  keywords: 'mall aptiknas, aptiknas, b2b marketplace, b2g, pengadaan pemerintah, asosiasi tik indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* LINK INI WAJIB ADA UNTUK ICON */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}