// src/app/admin/layout.js
import "./admin.css";
import "./admin-styles.css";

export const metadata = {
  title: 'Admin Dashboard',
};

export default function AdminLayout({ children }) {
  return (
    // ID "admin-scope" ini wajib ada
    <div id="admin-scope">
      {/* Hapus div "admin-wrapper" di sini karena page.js sudah punya "admin-layout"
            Ini menghindari double-wrapping yang bisa bikin layout aneh.
            Kita biarkan CSS menangani .admin-layout dari page.js langsung. 
        */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}