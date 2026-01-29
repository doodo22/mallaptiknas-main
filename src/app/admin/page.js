"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function AdminBlogPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("posts");

    // Data States
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [terms, setTerms] = useState([]);

        // Notification State
    const [notifications, setNotifications] = useState([]);

    // Loading States
    const [loading, setLoading] = useState({
        posts: true,
        users: true,
        categories: true,
        terms: true,
        settings: true
    });

    // Modal & View States
    const [showTermModal, setShowTermModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTermFile, setSelectedTermFile] = useState("");
    const [view, setView] = useState("list");
    const [isLoading, setIsLoading] = useState(false);

    // Form State (Artikel)
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        author: "",
        content: "",
        youtubeUrl: "",
        image: ""
    });
    const [imageFile, setImageFile] = useState(null);

    // Form State (Kategori Baru)
    const [newCategory, setNewCategory] = useState("");

    // Form State (S&K)
    const [termForm, setTermForm] = useState({ title: "", revision: "", url: "" });
    const [termFile, setTermFile] = useState(null);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    // Settings State
    const [socialSettings, setSocialSettings] = useState({ instagram: "", facebook: "", youtube: "" });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

        // Notification helper
    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedPosts = [...posts].sort((a, b) => {
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    useEffect(() => {
        fetchPosts();
        fetchUsers();
        fetchCategories();
        fetchTerms();
        fetchSettings();
    }, []);

            const fetchPosts = async () => { 
        setLoading(prev => ({ ...prev, posts: true }));
        try {
            const res = await fetch('/api/blog');
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal memuat artikel', 'error');
                return;
            }
            setPosts(await res.json());
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, posts: false }));
        }
    };
    
        const fetchUsers = async () => { 
        setLoading(prev => ({ ...prev, users: true }));
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal memuat pengguna', 'error');
                return;
            }
            setUsers(await res.json());
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };
    
            const fetchCategories = async () => { 
        setLoading(prev => ({ ...prev, categories: true }));
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal memuat kategori', 'error');
                return;
            }
            const data = await res.json();
            // Handle response format: check if data has success property
            if (data.success && Array.isArray(data.data)) {
                setCategories(data.data);
            } else if (Array.isArray(data)) {
                setCategories(data);
            } else {
                console.error('Invalid categories response format:', data);
                setCategories([]);
                showNotification('Format data kategori tidak valid', 'error');
            }
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
            setCategories([]);
        } finally {
            setLoading(prev => ({ ...prev, categories: false }));
        }
    };
    
        const fetchTerms = async () => { 
        setLoading(prev => ({ ...prev, terms: true }));
        try {
            const res = await fetch('/api/terms');
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal memuat S&K', 'error');
                return;
            }
            setTerms(await res.json());
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, terms: false }));
        }
    };

            const fetchSettings = async () => {
        setLoading(prev => ({ ...prev, settings: true }));
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) {
                console.error("Gagal load settings", await res.text());
                return;
            }
            const data = await res.json();
            if (data.success && data.data?.social) {
                setSocialSettings(data.data.social);
            } else if (data.social) {
                // Fallback untuk format lama
                setSocialSettings(data.social);
            }
        } catch (err) {
            console.error("Gagal load settings", err);
        } finally {
            setLoading(prev => ({ ...prev, settings: false }));
        }
    };

            const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ social: socialSettings })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                showNotification(data.error || 'Gagal menyimpan pengaturan', 'error');
                return;
            }
            
            showNotification(data.message || "Pengaturan sosial media tersimpan!", 'success');
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth");
    };

        // --- LOGIC ARTIKEL ---
    const handleDelete = async (id) => {
        if (confirm("Yakin ingin menghapus artikel ini?")) {
            try {
                const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const error = await res.json();
                    showNotification(error.error || 'Gagal menghapus artikel', 'error');
                    return;
                }
                showNotification("Artikel berhasil dihapus", 'success');
                fetchPosts();
            } catch (err) {
                showNotification('Network error: ' + err.message, 'error');
            }
        }
    };

    const handleEdit = (post) => {
        setEditId(post.id);
        setFormData({
            title: post.title,
            category: post.category,
            author: post.author,
            content: post.content,
            youtubeUrl: post.youtubeUrl || "",
            image: post.image || ""
        });
        setImageFile(null);
        setView("form");
        setActiveTab("posts");
    };

    const resetForm = () => {
        setView("list");
        setEditId(null);
        setFormData({ title: "", category: "", author: "", content: "", youtubeUrl: "", image: "" });
        setImageFile(null);
    };

        const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('author', formData.author);
            data.append('content', formData.content);
            data.append('youtubeUrl', formData.youtubeUrl);
            if (imageFile) data.append('imageFile', imageFile);
            const url = editId ? `/api/blog/${editId}` : '/api/blog';
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, body: data });
            
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal menyimpan artikel', 'error');
                return;
            }
            
            showNotification(editId ? "Artikel berhasil diperbarui" : "Artikel berhasil dibuat", 'success');
            resetForm();
            fetchPosts();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

        // --- LOGIC USER ---
    // State untuk form user
    const [userForm, setUserForm] = useState({ username: '', password: '' });
    const [userEditId, setUserEditId] = useState(null);
    const [showUserForm, setShowUserForm] = useState(false);

    const handleUserStatus = async (id, status) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: status ? 0 : 1 })
            });
            
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal mengubah status user', 'error');
                return;
            }
            
            showNotification("Status user berhasil diubah", 'success');
            fetchUsers();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm)
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                showNotification(data.error || 'Gagal membuat user', 'error');
                return;
            }
            
            showNotification("User berhasil dibuat", 'success');
            setUserForm({ username: '', password: '' });
            setShowUserForm(false);
            fetchUsers();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        }
    };

    const handleEditUser = (user) => {
        setUserEditId(user.id);
        setUserForm({ username: user.username, password: '' });
        setShowUserForm(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: userEditId, 
                    username: userForm.username,
                    ...(userForm.password && { password: userForm.password })
                })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                showNotification(data.error || 'Gagal mengupdate user', 'error');
                return;
            }
            
            showNotification("User berhasil diperbarui", 'success');
            setUserForm({ username: '', password: '' });
            setUserEditId(null);
            setShowUserForm(false);
            fetchUsers();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        }
    };

    const resetUserForm = () => {
        setUserForm({ username: '', password: '' });
        setUserEditId(null);
        setShowUserForm(false);
    };

        // --- LOGIC KATEGORI ---
        const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory })
            });
            
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal menambah kategori', 'error');
                return;
            }
            
            const data = await res.json();
            showNotification(data.message || "Kategori berhasil ditambahkan", 'success');
            setNewCategory("");
            fetchCategories(); // Refresh list
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        }
    };

            const handleDeleteCategory = async (id) => {
        if (confirm("Hapus kategori ini?")) {
            try {
                const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const error = await res.json();
                    showNotification(error.error || 'Gagal menghapus kategori', 'error');
                    return;
                }
                const data = await res.json();
                showNotification(data.message || "Kategori berhasil dihapus", 'success');
                fetchCategories();
            } catch (err) {
                showNotification('Network error: ' + err.message, 'error');
            }
        }
    };

        // --- LOGIC S&K ---
    const handleDeleteTerm = async (id) => {
        if (confirm("Hapus dokumen S&K ini?")) {
            try {
                const res = await fetch(`/api/terms/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const error = await res.json();
                    showNotification(error.error || 'Gagal menghapus S&K', 'error');
                    return;
                }
                showNotification("S&K berhasil dihapus", 'success');
                fetchTerms();
            } catch (err) {
                showNotification('Network error: ' + err.message, 'error');
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/terms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal mengubah status S&K', 'error');
                return;
            }
            
            showNotification("Status S&K berhasil diubah", 'success');
            fetchTerms();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        }
    };

        const handleSubmitTerm = async (e) => {
        e.preventDefault();
        if (!termFile) {
            showNotification("Pilih file terlebih dahulu", 'warning');
            return;
        }
        
        try {
            const d = new FormData();
            d.append('title', termForm.title);
            d.append('revision', termForm.revision);
            d.append('url', termForm.url);
            d.append('file', termFile);
            
            const res = await fetch('/api/terms', { method: 'POST', body: d });
            
            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal menyimpan S&K', 'error');
                return;
            }
            
            showNotification("S&K berhasil diupload", 'success');
            setTermForm({ title: "", revision: "", url: "" });
            setTermFile(null);
            setShowUploadModal(false);
            fetchTerms();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        }
    };

    const filteredTerms = terms.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.revision.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="admin-scope">
            <div className="admin-layout">
                {/* SIDEBAR */}
                <aside className="admin-sidebar" style={{ zIndex: 100 }}>
                    <div className="sidebar-logo">MALL<span className="text-blue-400">APTIKNAS</span></div>
                    <nav>
                        <button onClick={() => { setActiveTab("dashboard"); setView("list"); }} className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}>
                            <i className="fas fa-home"></i> Dashboard
                        </button>
                        <button onClick={() => { setActiveTab("posts"); setView("list"); }} className={`nav-item ${activeTab === "posts" ? "active" : ""}`}>
                            <i className="fas fa-newspaper"></i> Artikel Blog
                        </button>
                        <button onClick={() => { setActiveTab("categories"); setView("list"); }} className={`nav-item ${activeTab === "categories" ? "active" : ""}`}>
                            <i className="fas fa-tags"></i> Kategori
                        </button>
                        <button onClick={() => { setActiveTab("terms"); setView("list"); }} className={`nav-item ${activeTab === "terms" ? "active" : ""}`}>
                            <i className="fas fa-file-contract"></i> S&K
                        </button>
                        <button onClick={() => { setActiveTab("users"); setView("list"); }} className={`nav-item ${activeTab === "users" ? "active" : ""}`}>
                            <i className="fas fa-users"></i> Pengguna
                        </button>
                    </nav>
                    <button onClick={handleLogout} className="nav-item nav-logout">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </aside>

                {/* CONTENT */}
                <main className="admin-content" style={{ zIndex: 10 }}>
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold capitalize text-gray-800">
                                {view === "form" ? (editId ? "Edit Artikel" : "Tulis Artikel Baru") : (activeTab === "categories" ? "Kelola Kategori" : activeTab === "terms" ? "Syarat & Ketentuan" : activeTab)}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Panel Administrasi Konten</p>
                        </div>
                    </header>

                    {/* TAB CONTENT */}
                    <div className="tab-pane">
                        {activeTab === "dashboard" && (
                            <div className="space-y-8">
                                                                {/* STATS GRID - Made horizontal on tablet+ */}
                                {loading.posts || loading.categories || loading.terms || loading.users ? (
                                    <SkeletonLoader type="stats" />
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                        <div className="card text-center relative overflow-hidden group py-6">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                                            <span className="stat-value text-blue-600 text-4xl font-extrabold">{posts.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Artikel</p>
                                        </div>
                                        <div className="card text-center relative overflow-hidden group py-6">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                                            <span className="stat-value text-teal-600 text-4xl font-extrabold">{categories.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Kategori</p>
                                        </div>
                                        <div className="card text-center relative overflow-hidden group py-6">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                                            <span className="stat-value text-purple-600 text-4xl font-extrabold">{terms.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Dokumen</p>
                                        </div>
                                        <div className="card text-center relative overflow-hidden group py-6">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                                            <span className="stat-value text-indigo-600 text-4xl font-extrabold">{users.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Pengguna</p>
                                        </div>
                                    </div>
                                )}

                                {/* SOCIAL MEDIA SETTINGS */}
                                <div className="card max-w-2xl">
                                    <h3 className="font-bold text-gray-800 text-lg mb-6 border-b pb-2">Pengaturan Link Sosial Media</h3>
                                    <form onSubmit={handleSaveSettings} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                                <i className="fab fa-instagram text-pink-500 mr-2 w-5 text-center"></i> Instagram Link
                                            </label>
                                            <input
                                                className="input-clean"
                                                value={socialSettings.instagram}
                                                onChange={e => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                                <i className="fab fa-facebook text-blue-600 mr-2 w-5 text-center"></i> Facebook Link
                                            </label>
                                            <input
                                                className="input-clean"
                                                value={socialSettings.facebook}
                                                onChange={e => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                                                placeholder="https://facebook.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                                <i className="fab fa-youtube text-red-600 mr-2 w-5 text-center"></i> YouTube Link
                                            </label>
                                            <input
                                                className="input-clean"
                                                value={socialSettings.youtube}
                                                onChange={e => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                                                placeholder="https://youtube.com/..."
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <button type="submit" className="btn btn-primary" disabled={isSavingSettings}>
                                                {isSavingSettings ? "Menyimpan..." : "Simpan Perubahan"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "posts" && (
                            view === "list" ? (
                                <div className="card">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-gray-700">Daftar Artikel</h3>
                                        <button onClick={() => { resetForm(); setView("form"); }} className="btn btn-primary btn-sm">
                                            <i className="fas fa-plus mr-2"></i> Tulis Baru
                                        </button>
                                    </div>
                                                                        <div className="table-container">
                                        {loading.posts ? (
                                            <SkeletonLoader type="table" rows={5} />
                                        ) : (
                                            <table className="clean-table text-sm">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('title')} className="cursor-pointer">Judul {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                                        <th onClick={() => requestSort('category')} className="cursor-pointer">Kategori {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                                        <th onClick={() => requestSort('author')} className="cursor-pointer">Penulis {sortConfig.key === 'author' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                                        <th onClick={() => requestSort('created_at')} className="cursor-pointer">Tanggal {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                                        <th className="text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedPosts.map(post => (
                                                        <tr key={post.id}>
                                                            <td className="font-bold text-gray-700">{post.title}</td>
                                                            <td><span className="badge-light">{post.category}</span></td>
                                                            <td>{post.author}</td>
                                                            <td className="text-gray-400">{new Date(post.created_at).toLocaleDateString()}</td>
                                                            <td className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => handleEdit(post)} className="btn-icon btn-edit"><i className="fas fa-pen"></i></button>
                                                                    <button onClick={() => handleDelete(post.id)} className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {sortedPosts.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-8 text-gray-400">
                                                                Belum ada artikel. Klik "Tulis Baru" untuk membuat artikel pertama.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                                                <div className="card max-w-5xl mx-auto p-8">
                                    <h3 className="font-bold mb-8 text-2xl text-gray-800 border-b pb-4">{editId ? "✏️ Edit Artikel" : "📝 Tulis Artikel Baru"}</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
                                            <input 
                                                className="input-clean text-lg py-3" 
                                                value={formData.title} 
                                                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                                placeholder="Masukkan judul artikel yang menarik" 
                                                required 
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                                <select 
                                                    className="input-clean py-3" 
                                                    value={formData.category} 
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                                                    required
                                                >
                                                    <option value="">-- Pilih Kategori --</option>
                                                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Penulis</label>
                                                <input 
                                                    className="input-clean py-3" 
                                                    value={formData.author} 
                                                    onChange={e => setFormData({ ...formData, author: e.target.value })} 
                                                    placeholder="Nama penulis" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Isi Artikel</label>
                                            <textarea 
                                                className="input-clean w-full min-h-[500px] p-6 text-base leading-relaxed resize-y" 
                                                value={formData.content} 
                                                onChange={e => setFormData({ ...formData, content: e.target.value })} 
                                                placeholder="Tulis isi artikel di sini... Gunakan format yang jelas dengan paragraf yang terstruktur." 
                                                required 
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Gunakan paragraf yang jelas. Artikel dapat disusun dengan heading, bullet points, dan gambar untuk keterbacaan yang lebih baik.</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">URL Video YouTube (Opsional)</label>
                                            <input 
                                                className="input-clean py-3" 
                                                value={formData.youtubeUrl} 
                                                onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })} 
                                                placeholder="https://youtube.com/watch?v=..." 
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Gambar Utama (Opsional)</label>
                                            <input 
                                                type="file" 
                                                className="input-clean py-3" 
                                                onChange={e => setImageFile(e.target.files[0])} 
                                                accept="image/*"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Upload gambar dengan format JPG, PNG, atau GIF. Ukuran maksimal 5MB.</p>
                                        </div>
                                        
                                        <div className="flex justify-end gap-4 pt-6 border-t">
                                            <button 
                                                type="button" 
                                                onClick={resetForm} 
                                                className="btn btn-light px-8 py-3"
                                            >
                                                Batal
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary px-8 py-3" 
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "⏳ Menyimpan..." : (editId ? "💾 Update Artikel" : "🚀 Publikasikan")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        )}

                        {activeTab === "categories" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="card h-fit">
                                    <h3 className="font-bold mb-4">Tambah Kategori</h3>
                                    <form onSubmit={handleAddCategory} className="space-y-3">
                                        <input className="input-clean" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nama Kategori" required />
                                        <button type="submit" className="btn btn-primary w-full">Tambah</button>
                                    </form>
                                </div>
                                <div className="card md:col-span-2">
                                    <table className="clean-table">
                                        <thead><tr><th>Nama Kategori</th><th className="text-right">Aksi</th></tr></thead>
                                        <tbody>
                                            {categories.map(cat => (
                                                <tr key={cat.id}>
                                                    <td className="font-bold">{cat.name}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => handleDeleteCategory(cat.id)} className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                                                {activeTab === "users" && (
                            <div className="space-y-6">
                                {/* Form Tambah/Edit User */}
                                {showUserForm && (
                                    <div className="card">
                                        <h3 className="font-bold mb-4">{userEditId ? "Edit User" : "Tambah User Baru"}</h3>
                                        <form onSubmit={userEditId ? handleUpdateUser : handleCreateUser} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                                <input 
                                                    type="text" 
                                                    className="input-clean" 
                                                    value={userForm.username}
                                                    onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                                                    placeholder="Masukkan username"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password {userEditId && <span className="text-gray-400 text-xs">(kosongkan jika tidak ingin mengubah)</span>}
                                                </label>
                                                <input 
                                                    type="password" 
                                                    className="input-clean" 
                                                    value={userForm.password}
                                                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                                    placeholder={userEditId ? "Password baru (opsional)" : "Masukkan password"}
                                                    required={!userEditId}
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button 
                                                    type="button" 
                                                    onClick={resetUserForm}
                                                    className="btn btn-light flex-1"
                                                >
                                                    Batal
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary flex-1"
                                                >
                                                    {userEditId ? "Update User" : "Tambah User"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Daftar Users */}
                                <div className="card">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-gray-700">Daftar Pengguna</h3>
                                        {!showUserForm && (
                                            <button 
                                                onClick={() => setShowUserForm(true)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                <i className="fas fa-plus mr-2"></i> Tambah User
                                            </button>
                                        )}
                                    </div>
                                    
                                                                        <div className="table-container">
                                        {loading.users ? (
                                            <SkeletonLoader type="table" rows={5} />
                                        ) : (
                                            <table className="clean-table">
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Status</th>
                                                        <th>Tanggal Dibuat</th>
                                                        <th className="text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map(u => (
                                                        <tr key={u.id}>
                                                            <td className="font-bold">{u.username}</td>
                                                            <td>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.is_active ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                                                                    {u.is_active ? "Aktif" : "Pending"}
                                                                </span>
                                                            </td>
                                                            <td className="text-gray-500 text-sm">
                                                                {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button 
                                                                        onClick={() => handleEditUser(u)}
                                                                        className="btn-icon btn-edit"
                                                                        title="Edit User"
                                                                    >
                                                                        <i className="fas fa-pen"></i>
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleUserStatus(u.id, u.is_active)}
                                                                        className={`btn btn-sm ${u.is_active ? "btn-warning" : "btn-success"}`}
                                                                    >
                                                                        {u.is_active ? "Nonaktifkan" : "Setujui"}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {users.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="text-center py-8 text-gray-400">
                                                                Belum ada pengguna. Klik "Tambah User" untuk menambahkan.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "terms" && (
                            <div className="card">
                                <div className="flex flex-row justify-between items-center gap-4 mb-8">
                                    <div className="search-wrapper flex-1 md:flex-none md:w-1/2">
                                        <i className="fas fa-search"></i>
                                        <input
                                            className="input-clean"
                                            placeholder="Cari judul atau revisi S&K..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => setShowUploadModal(true)} className="btn btn-primary whitespace-nowrap">
                                        <i className="fas fa-plus mr-1 md:mr-2"></i>
                                        <span className="hidden sm:inline">Tambah S&K</span>
                                        <span className="sm:hidden">Tambah</span>
                                    </button>
                                </div>
                                <table className="clean-table">
                                    <thead>
                                        <tr>
                                            <th>Judul S&K</th>
                                            <th>Nama File</th>
                                            <th>Revisi</th>
                                            <th>Tanggal</th>
                                            <th>URL</th>
                                            <th>Status</th>
                                            <th className="text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTerms.map(t => (
                                            <tr key={t.id}>
                                                <td className="font-bold text-gray-700">{t.title}</td>
                                                <td className="text-sm text-gray-500 truncate max-w-[150px]">{t.fileName || '-'}</td>
                                                <td><span className="badge-light">{t.revision}</span></td>
                                                <td className="text-gray-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                                <td className="text-blue-500 text-sm">{t.url || '-'}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleToggleStatus(t.id, t.isActive)}
                                                        className={`toggle-switch ${t.isActive ? 'active' : ''}`}
                                                        title={t.isActive ? "Nonaktifkan" : "Aktifkan"}
                                                    ></button>
                                                </td>
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={t.fileUrl}
                                                            download
                                                            className="btn-icon btn-download"
                                                            title="Download Dokumen"
                                                        >
                                                            <i className="fas fa-download"></i>
                                                        </a>
                                                        <button onClick={() => handleDeleteTerm(t.id)} className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTerms.length === 0 && <tr><td colSpan="7" className="text-center py-10 text-gray-400">Belum ada data.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* OVERLAY MODALS */}
            {showUploadModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Tambah S&K Baru</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-black">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitTerm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Judul Dokumen</label>
                                <input className="input-clean" value={termForm.title} onChange={e => setTermForm({ ...termForm, title: e.target.value })} placeholder="Contoh: S&K Marketplace" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Versi Revisi</label>
                                <input className="input-clean" value={termForm.revision} onChange={e => setTermForm({ ...termForm, revision: e.target.value })} placeholder="Contoh: v1.0" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">URL Target</label>
                                <select 
                                    className="input-clean" 
                                    value={termForm.url} 
                                    onChange={e => setTermForm({ ...termForm, url: e.target.value })} 
                                    required
                                >
                                    <option value="">Pilih halaman tujuan</option>
                                    <option value="/blog/sk-scm">/blog/sk-scm (S&K SCM)</option>
                                    <option value="/help">/help (Bantuan)</option>
                                    <option value="/platform">/platform (Platform)</option>
                                    <option value="/auth">/auth (Login/Register)</option>
                                    <option value="/admin">/admin (Admin Panel)</option>
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1">Pilih halaman tempat S&K akan ditampilkan</p>
                            </div>
                                                        <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pilih File HTML (*.html, *.htm)</label>
                                <input 
                                    type="file" 
                                    className="input-clean" 
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const fileName = file.name.toLowerCase();
                                            const allowed = ['.html', '.htm'];
                                            const isValid = allowed.some(ext => fileName.endsWith(ext));
                                            if (!isValid) {
                                                showNotification("Hanya file HTML yang diperbolehkan (.html atau .htm)", 'warning');
                                                e.target.value = '';
                                                setTermFile(null);
                                                return;
                                            }
                                        }
                                        setTermFile(file);
                                    }} 
                                    accept=".html,.htm"
                                    required 
                                />
                                {termFile && (
                                    <p className="text-[10px] text-blue-500 mt-1 uppercase font-bold">
                                        {termFile.name} ({(termFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                )}
                                <p className="text-[10px] text-gray-400 mt-1">File HTML akan ditampilkan langsung di browser. Pastikan file valid dan tidak mengandung script berbahaya.</p>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-light flex-1">Batal</button>
                                <button type="submit" className="btn btn-primary flex-1">Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTermModal && (
                <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTermModal(false)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl relative flex flex-col overflow-hidden animate-pop" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold flex items-center gap-2"><i className="fas fa-file-alt text-blue-500"></i> Preview Dokumen</h3>
                            <button onClick={() => setShowTermModal(false)} className="bg-gray-200 hover:bg-black hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-4">
                            {selectedTermFile.toLowerCase().endsWith('.pdf') ? (
                                <iframe src={selectedTermFile} className="w-full h-full rounded shadow-inner border border-gray-300"></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="bg-blue-100 text-blue-600 p-8 rounded-full"><i className="fas fa-file-word fa-4x"></i></div>
                                    <h4 className="font-bold text-gray-700">Pratinjau Tidak Tersedia</h4>
                                    <p className="text-gray-500 text-sm max-w-xs">Dokumen ini bertipe non-PDF. Silakan klik tombol di bawah untuk mengunduh dan membaca isinya.</p>
                                    <a href={selectedTermFile} download className="btn btn-primary px-10"><i className="fas fa-download mr-2"></i> Unduh Sekarang</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

                                                <style jsx>{`
                .animate-pop { animation: pop 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes pop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                .badge-light { background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; text-transform: uppercase; }
                
                /* Button Styles */
                .btn-warning { background-color: #f59e0b; color: white; }
                .btn-warning:hover { background-color: #d97706; }
                .btn-success { background-color: #10b981; color: white; }
                .btn-success:hover { background-color: #059669; }
                
                /* Form Artikel Styles */
                .input-clean {
                    transition: all 0.2s ease;
                }
                .input-clean:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                textarea.input-clean {
                    line-height: 1.6;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                textarea.input-clean::placeholder {
                    color: #9ca3af;
                }
                @media (max-width: 768px) {
                    .card {
                        padding: 1.5rem !important;
                    }
                    textarea.input-clean {
                        min-height: 350px !important;
                    }
                }
            `}</style>
            
            {/* Notification Component */}
            <Notification 
                notifications={notifications}
                removeNotification={removeNotification}
            />
        </div>
    );
}
