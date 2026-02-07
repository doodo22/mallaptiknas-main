"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function AdminMainPage() {
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
    const [termForm, setTermForm] = useState({ title: "", revision: "", url: "", content: "", date: "" });
    const [termFile, setTermFile] = useState(null);
    const [editTermId, setEditTermId] = useState(null);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    // Settings State
    const [socialSettings, setSocialSettings] = useState({ instagram: "", tiktok: "", youtube: "", linkedin: "" });
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

    const handleWordUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const mammoth = await import("mammoth");
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setTermForm({ ...termForm, content: result.value });
            showNotification("Berhasil mengimpor dari Word!", "success");
        } catch (err) {
            console.error("Mammoth Error:", err);
            showNotification("Gagal membaca file Word", "error");
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleEditTerm = (term) => {
        setEditTermId(term.id);
        setTermForm({
            title: term.title,
            revision: term.revision,
            url: term.url,
            content: term.content || "",
            date: term.date ? term.date.split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setView("term-form");
        setActiveTab("terms");
    };

    const resetTermForm = () => {
        setEditTermId(null);
        setTermForm({ title: "", revision: "", url: "", content: "", date: "" });
        setTermFile(null);
        setView("list");
    };

    const handleSubmitTerm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const d = new FormData();
            d.append('title', termForm.title);
            d.append('revision', termForm.revision);
            d.append('url', termForm.url);
            d.append('content', termForm.content);
            d.append('date', termForm.date);
            if (termFile) d.append('file', termFile);

            const url = editTermId ? `/api/terms/${editTermId}` : '/api/terms';
            const method = editTermId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, body: d });

            if (!res.ok) {
                const error = await res.json();
                showNotification(error.error || 'Gagal menyimpan S&K', 'error');
                return;
            }

            showNotification(editTermId ? "S&K berhasil diperbarui" : "S&K berhasil disimpan", 'success');
            resetTermForm();
            fetchTerms();
        } catch (err) {
            showNotification('Network error: ' + err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTerms = terms.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.revision.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-900 font-sans text-slate-200">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-dark z-0"></div>
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="admin-layout relative z-10 flex min-h-screen">
                {/* SIDEBAR */}
                <aside className="admin-sidebar w-64 flex flex-col fixed h-full transition-all duration-300 backdrop-blur-md border-r border-white/5" style={{ zIndex: 100 }}>
                    <div className="sidebar-logo p-6 text-2xl font-bold tracking-wider text-white border-b border-white/5">
                        MALL<span className="text-[#00c6ff]">APTIKNAS</span>
                    </div>
                    <nav className="flex-1 py-6 space-y-2 px-3">
                        <button onClick={() => { setActiveTab("dashboard"); setView("list"); }} className={`nav-item w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === "dashboard" ? "active" : ""}`}>
                            <i className="fas fa-home w-5 text-center"></i> Dashboard
                        </button>
                        <button onClick={() => { setActiveTab("posts"); setView("list"); }} className={`nav-item w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === "posts" ? "active" : ""}`}>
                            <i className="fas fa-newspaper w-5 text-center"></i> Artikel Blog
                        </button>
                        <button onClick={() => { setActiveTab("categories"); setView("list"); }} className={`nav-item w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === "categories" ? "active" : ""}`}>
                            <i className="fas fa-tags w-5 text-center"></i> Kategori
                        </button>
                        <button onClick={() => { setActiveTab("terms"); setView("list"); }} className={`nav-item w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === "terms" ? "active" : ""}`}>
                            <i className="fas fa-file-contract w-5 text-center"></i> S&K
                        </button>
                        <button onClick={() => { setActiveTab("users"); setView("list"); }} className={`nav-item w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === "users" ? "active" : ""}`}>
                            <i className="fas fa-users w-5 text-center"></i> Pengguna
                        </button>
                    </nav>
                    <div className="p-4 border-t border-white/5">
                        <button onClick={handleLogout} className="nav-item nav-logout w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <i className="fas fa-sign-out-alt w-5 text-center"></i> Logout
                        </button>
                    </div>
                </aside>

                {/* CONTENT */}
                <main className="admin-content flex-1 ml-64 p-8 relative" style={{ zIndex: 10 }}>
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold capitalize text-white drop-shadow-md">
                                {view === "form" ? (editId ? "Edit Artikel" : "Tulis Artikel Baru") : (view === "term-form" ? (editTermId ? "Edit S&K" : "Tambah S&K Baru") : (activeTab === "categories" ? "Kelola Kategori" : activeTab === "terms" ? "Syarat & Ketentuan" : activeTab))}
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">Panel Administrasi Konten</p>
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
                                    <div className="grid grid-cols-2 gap-10 max-w-4xl">
                                        <div className="card text-center relative overflow-hidden group py-6 mx-4">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                                            <span className="stat-value text-blue-600 text-4xl font-extrabold">{posts.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Artikel</p>
                                        </div>
                                        <div className="card text-center relative overflow-hidden group py-6 mx-4">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                                            <span className="stat-value text-teal-600 text-4xl font-extrabold">{categories.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Kategori</p>
                                        </div>
                                        <div className="card text-center relative overflow-hidden group py-6 mx-4">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                                            <span className="stat-value text-purple-600 text-4xl font-extrabold">{terms.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Dokumen</p>
                                        </div>
                                        <div className="card text-center relative overflow-hidden group py-6 mx-4">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                                            <span className="stat-value text-indigo-600 text-4xl font-extrabold">{users.length}</span>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mt-2">Pengguna</p>
                                        </div>
                                    </div>
                                )}

                                {/* SOCIAL MEDIA SETTINGS */}
                                <div className="card max-w-2xl">
                                    <h3 className="font-bold text-gray-100 text-lg mb-6 border-b border-gray-700 pb-2">Pengaturan Link Sosial Media</h3>
                                    <form onSubmit={handleSaveSettings} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <i className="fab fa-tiktok text-white mr-2 w-5 text-center"></i> TikTok Link
                                            </label>
                                            <input
                                                className="input-clean"
                                                value={socialSettings.tiktok}
                                                onChange={e => setSocialSettings({ ...socialSettings, tiktok: e.target.value })}
                                                placeholder="https://tiktok.com/@..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <i className="fab fa-youtube text-red-600 mr-2 w-5 text-center"></i> YouTube Link
                                            </label>
                                            <input
                                                className="input-clean"
                                                value={socialSettings.youtube}
                                                onChange={e => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                                                placeholder="https://youtube.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <i className="fab fa-linkedin-in text-blue-500 mr-2 w-5 text-center"></i> LinkedIn Link
                                            </label>
                                            <input
                                                className="input-clean"
                                                value={socialSettings.linkedin}
                                                onChange={e => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                                                placeholder="https://linkedin.com/in/..."
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
                                        <h3 className="font-bold text-gray-100">Daftar Artikel</h3>
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
                                                            <td className="font-bold text-gray-100">{post.title}</td>
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
                                                            <td colSpan="5" className="text-center py-8 text-gray-500">
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
                                    <h3 className="font-bold mb-8 text-2xl text-gray-100 border-b border-gray-700 pb-4">{editId ? "✏️ Edit Artikel" : "📝 Tulis Artikel Baru"}</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Judul Artikel</label>
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
                                                <label className="block text-sm font-medium text-gray-300">Kategori</label>
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
                                                <label className="block text-sm font-medium text-gray-300">Penulis</label>
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
                                            <label className="block text-sm font-medium text-gray-300">Isi Artikel</label>
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
                                            <label className="block text-sm font-medium text-gray-300">URL Video YouTube (Opsional)</label>
                                            <input
                                                className="input-clean py-3"
                                                value={formData.youtubeUrl}
                                                onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Gambar Utama (Opsional)</label>
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
                                                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                                <input
                                                    type="text"
                                                    className="input-clean"
                                                    value={userForm.username}
                                                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                                    placeholder="Masukkan username"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                                    Password {userEditId && <span className="text-gray-500 text-xs">(kosongkan jika tidak ingin mengubah)</span>}
                                                </label>
                                                <input
                                                    type="password"
                                                    className="input-clean"
                                                    value={userForm.password}
                                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
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
                                        <h3 className="font-bold text-gray-100">Daftar Pengguna</h3>
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
                            view === "list" ? (
                                <div className="card">
                                    <div className="flex flex-row justify-between items-center gap-4 mb-8">
                                        <div className="search-wrapper flex-1 md:flex-none md:w-1/2">
                                            <i className="fas fa-search"></i>
                                            <input
                                                className="input-clean"
                                                placeholder="Cari judul..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => { /* resetTermForm(); setView("term-form"); */ }} className="btn btn-primary whitespace-nowrap">
                                            <i className="fas fa-plus mr-1 md:mr-2"></i>
                                            <span>Tambah S&K</span>
                                        </button>
                                    </div>
                                    <div className="table-container">
                                        <table className="clean-table">
                                            <thead>
                                                <tr>
                                                    <th className="w-16">No</th>
                                                    <th>Nama SNK</th>
                                                    <th>Revisi</th>
                                                    <th>Tanggal</th>
                                                    <th className="text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTerms.map((t, index) => (
                                                    <tr key={t.id}>
                                                        <td>{index + 1}</td>
                                                        <td className="font-bold text-gray-100">{t.title}</td>
                                                        <td><span className="badge-light">{t.revision}</span></td>
                                                        <td className="text-gray-400 text-sm">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                                                        <td className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleEditTerm(t)}
                                                                    className="btn btn-primary btn-sm px-4"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredTerms.length === 0 && <tr><td colSpan="5" className="text-center py-10 text-gray-400">Belum ada data.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="card max-w-5xl mx-auto p-8">
                                    <h3 className="font-bold mb-8 text-2xl text-gray-100 border-b border-gray-700 pb-4">{editTermId ? "✏️ Edit Syarat & Ketentuan" : "📝 Tambah S&K Baru"}</h3>
                                    <form onSubmit={handleSubmitTerm} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">Nama SNK</label>
                                                <input
                                                    className="input-clean py-3"
                                                    value={termForm.title}
                                                    onChange={e => setTermForm({ ...termForm, title: e.target.value })}
                                                    placeholder="Contoh: SNK pengguna SCM"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">Tanggal</label>
                                                <input
                                                    type="date"
                                                    className="input-clean py-3"
                                                    value={termForm.date}
                                                    onChange={e => setTermForm({ ...termForm, date: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">Revisi ke:</label>
                                                <input
                                                    className="input-clean py-3"
                                                    value={termForm.revision}
                                                    onChange={e => setTermForm({ ...termForm, revision: e.target.value })}
                                                    placeholder="Contoh: 1.0 atau 2024.v1"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">Slug / URL (Opsional)</label>
                                                <input
                                                    className="input-clean py-3"
                                                    value={termForm.url}
                                                    onChange={e => setTermForm({ ...termForm, url: e.target.value })}
                                                    placeholder="Contoh: /snk/scm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <label className="block text-sm font-medium text-gray-300">Isi SNK</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept=".docx"
                                                        className="hidden"
                                                        id="word-upload"
                                                        onChange={handleWordUpload}
                                                    />
                                                    <label
                                                        htmlFor="word-upload"
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all"
                                                    >
                                                        <i className="fas fa-file-word"></i> Import dari Word (.docx)
                                                    </label>
                                                </div>
                                            </div>
                                            <textarea
                                                className="input-clean w-full min-h-[500px] p-6 text-base leading-relaxed resize-y font-mono"
                                                value={termForm.content}
                                                onChange={e => setTermForm({ ...termForm, content: e.target.value })}
                                                placeholder="Masukkan isi Syarat & Ketentuan di sini (Mendukung format HTML)"
                                                required
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1 italic">
                                                *Tips: Anda dapat menulis langsung dengan HTML atau menggunakan fitur "Import dari Word" untuk hasil yang lebih rapi.
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-4 pt-6 border-t">
                                            <button
                                                type="button"
                                                onClick={resetTermForm}
                                                className="btn btn-light px-8 py-3"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary px-8 py-3"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "⏳ Menyimpan..." : (editTermId ? "💾 Perbarui SNK" : "🚀 Simpan SNK")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div>

            {/* OVERLAY MODALS */}


            <style jsx>{`
                .bg-gradient-dark {
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                }
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.4;
                    pointer-events: none;
                }
                .orb-1 { width: 400px; height: 400px; background: #00c6ff; top: -100px; left: -100px; }
                .orb-2 { width: 300px; height: 300px; background: #0072ff; bottom: -50px; right: -50px; }
                
                /* Glass Card Override */
                .card {
                    background: rgba(255, 255, 255, 0.05) !important;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
                    border-radius: 20px !important;
                    color: white !important;
                    padding: 24px;
                }

                /* Sidebar */
                .admin-sidebar {
                    background: rgba(15, 23, 39, 0.6) !important;
                    backdrop-filter: blur(12px) !important;
                    border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
                }
                .nav-item {
                    color: rgba(255,255,255,0.6) !important;
                }
                .nav-item:hover, .nav-item.active {
                    background: rgba(0, 198, 255, 0.1) !important;
                    color: white !important;
                }
                .nav-item.active {
                    border-right: 3px solid #00c6ff !important;
                }
                .sidebar-logo {
                    color: white !important;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                /* Inputs */
                .input-clean, select.input-clean, textarea.input-clean {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 12px !important;
                    color: white !important;
                    padding: 12px;
                    outline: none;
                    transition: all 0.3s;
                }
                .input-clean:focus {
                    border-color: #00c6ff !important;
                    box-shadow: 0 0 0 3px rgba(0, 198, 255, 0.2) !important;
                }
                 textarea.input-clean::placeholder, input.input-clean::placeholder {
                    color: rgba(255,255,255,0.4) !important;
                 }

                 /* Table */
                 .clean-table th {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                    color: rgba(255,255,255,0.6) !important;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                 }
                 .clean-table td {
                    padding: 14px 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                    vertical-align: middle;
                    color: rgba(255,255,255,0.8) !important;
                 }
                 .clean-table tr:hover td {
                    background: rgba(255,255,255,0.03);
                 }

                /* Buttons */
                .btn-primary {
                    background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 10px !important;
                    font-weight: 600 !important;
                    transition: transform 0.2s, box-shadow 0.2s !important;
                }
                .btn-primary:hover {
                    box-shadow: 0 10px 20px rgba(0, 198, 255, 0.3) !important;
                    transform: translateY(-2px) !important;
                }
                .btn-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .btn-edit { background: rgba(59, 130, 246, 0.2) !important; color: #60a5fa !important; }
                .btn-edit:hover { background: #3b82f6 !important; color: white !important; }
                .btn-delete { background: rgba(239, 68, 68, 0.2) !important; color: #f87171 !important; }
                .btn-delete:hover { background: #ef4444 !important; color: white !important; }

                .badge-light {
                    background: rgba(255,255,255,0.1) !important;
                    color: rgba(255,255,255,0.8) !important;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                
                /* Text Overrides for compatibility */
                h1, h2, h3, h4, .text-gray-800, .text-gray-700 {
                    color: white !important;
                }
                p, .text-gray-600, .text-gray-500 {
                    color: rgba(255,255,255,0.6) !important;
                }
                .text-gray-400 {
                    color: rgba(255,255,255,0.4) !important;
                }
                
                /* Color Tweaks for Dark Mode */
                .text-blue-600 { color: #60a5fa !important; } /* blue-400 */
                .text-teal-600 { color: #2dd4bf !important; } /* teal-400 */
                .text-purple-600 { color: #c084fc !important; } /* purple-400 */
                .text-indigo-600 { color: #818cf8 !important; } /* indigo-400 */
                
                .stat-value {
                    text-shadow: 0 0 20px rgba(0,0,0,0.5);
                }
                
                /* Light Background Overrides */
                .bg-blue-50, .bg-blue-100, .bg-slate-100, .bg-white {
                     background-color: rgba(255,255,255,0.05) !important;
                     border-color: rgba(255,255,255,0.1) !important;
                }
                .border-blue-100, .border-gray-200 {
                     border-color: rgba(255,255,255,0.1) !important;
                }

                .animate-pop { animation: pop 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes pop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
            `}</style>

            {/* Notification Component */}
            <Notification
                notifications={notifications}
                removeNotification={removeNotification}
            />
        </div>
    );
}
