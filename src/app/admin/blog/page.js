"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminBlogPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("posts");

    // Data States
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [terms, setTerms] = useState([]);

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
    const [termForm, setTermForm] = useState({ title: "", revision: "", url: "", content: "" });
    const [termFile, setTermFile] = useState(null);

    // Form State (Tambah User)
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ username: "", password: "" });

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    // Settings State
    const [socialSettings, setSocialSettings] = useState({ instagram: "", facebook: "", youtube: "" });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

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

    const fetchPosts = async () => { const res = await fetch('/api/blog'); setPosts(await res.json()); };
    const fetchUsers = async () => { const res = await fetch('/api/admin/users'); setUsers(await res.json()); };
    const fetchCategories = async () => { const res = await fetch('/api/categories'); setCategories(await res.json()); };
    const fetchTerms = async () => { const res = await fetch('/api/terms'); setTerms(await res.json()); };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.social) setSocialSettings(data.social);
        } catch (err) {
            console.error("Gagal load settings", err);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ social: socialSettings })
            });
            alert("Pengaturan sosial media tersimpan!");
        } catch (err) {
            alert("Gagal menyimpan pengaturan");
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/blog");
    };

    // --- LOGIC TAMBAH USER ---
    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserForm.username || !newUserForm.password) {
            alert("Username dan password harus diisi");
            return;
        }
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserForm)
            });
            const data = await res.json();
            if (res.ok) {
                alert("User berhasil ditambahkan! Status: Pending (menunggu aktivasi admin)");
                setNewUserForm({ username: "", password: "" });
                setShowAddUserModal(false);
                fetchUsers();
            } else {
                alert(data.error || "Gagal menambahkan user");
            }
        } catch (err) {
            alert("Gagal menambahkan user");
        }
    };

    // --- LOGIC DELETE USER ---
    const handleDeleteUser = async (id, username) => {
        if (confirm(`Anda yakin akan menghapus akun "${username}"?`)) {
            try {
                const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchUsers();
                } else {
                    alert("Gagal menghapus user");
                }
            } catch (err) {
                alert("Gagal menghapus user");
            }
        }
    };

    // --- LOGIC ARTIKEL ---
    const handleDelete = async (id) => {
        if (confirm("Yakin ingin menghapus artikel ini?")) {
            await fetch(`/api/blog/${id}`, { method: 'DELETE' });
            fetchPosts();
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
            if (res.ok) {
                resetForm();
                fetchPosts();
            }
        } catch (err) {
            alert("Gagal menyimpan artikel");
        } finally {
            setIsLoading(false);
        }
    };

    // --- LOGIC USER ---
    const handleUserStatus = async (id, status) => {
        await fetch('/api/admin/users', {
            method: 'PUT',
            body: JSON.stringify({ id, is_active: status ? 0 : 1 })
        });
        fetchUsers();
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
            if (res.ok) {
                setNewCategory("");
                fetchCategories();
            }
        } catch (err) {
            alert("Gagal menambah kategori");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (confirm("Hapus kategori ini?")) {
            await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        }
    };

    // --- LOGIC S&K ---
    const handleDeleteTerm = async (id) => {
        if (confirm("Hapus dokumen S&K ini?")) {
            await fetch(`/api/terms/${id}`, { method: 'DELETE' });
            fetchTerms();
        }
    };

    const handleEditTerm = (term) => {
        setTermForm({
            title: term.title,
            revision: term.revision,
            url: term.url || "",
            content: term.content || ""
        });
        // Logic for view switching if applicable, but for now just disabling popup
    };

    const handleToggleStatus = async (id, currentStatus) => {
        // Implementation disabled as requested
    };

    const handleSubmitTerm = async (e) => {
        e.preventDefault();
        // Disabled
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
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="card max-w-4xl mx-auto">
                                    <h3 className="font-bold mb-6 text-gray-700">{editId ? "Edit Artikel" : "Buat Artikel Baru"}</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input className="input-clean" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Judul Artikel" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <select className="input-clean" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                                <option value="">Pilih Kategori</option>
                                                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                            </select>
                                            <input className="input-clean" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Penulis" required />
                                        </div>
                                        <textarea className="input-clean h-64" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Isi Artikel" required />
                                        <input className="input-clean" value={formData.youtubeUrl} onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })} placeholder="URL Youtube" />
                                        <input type="file" className="input-clean" onChange={e => setImageFile(e.target.files[0])} />
                                        <div className="flex justify-end gap-3 pt-4">
                                            <button type="button" onClick={resetForm} className="btn btn-light">Batal</button>
                                            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Proses..." : "Simpan"}</button>
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
                            <div className="card">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-700">Daftar Pengguna</h3>
                                    <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary btn-sm">
                                        <i className="fas fa-plus mr-2"></i> Tambah User
                                    </button>
                                </div>
                                <div className="table-container">
                                    <table className="clean-table">
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>Status</th>
                                                <th className="text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id}>
                                                    <td className="font-bold">{u.username}</td>
                                                    <td>
                                                        <span className={u.is_active ? "text-green-600" : "text-orange-500"}>
                                                            {u.is_active ? "Aktif" : "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleUserStatus(u.id, u.is_active)}
                                                                className="btn btn-sm btn-light"
                                                            >
                                                                {u.is_active ? "Nonaktifkan" : "Setujui"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id, u.username)}
                                                                className="btn-icon btn-delete"
                                                                title="Hapus User"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                                    <button onClick={() => { /* setShowUploadModal(true) */ }} className="btn btn-primary whitespace-nowrap">
                                        <i className="fas fa-plus mr-1 md:mr-2"></i>
                                        <span className="hidden sm:inline">Tambah S&K</span>
                                        <span className="sm:hidden">Tambah</span>
                                    </button>
                                </div>
                                <table className="clean-table">
                                    <thead>
                                        <tr>
                                            <th>Judul S&K</th>
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
                                                        <button onClick={() => handleEditTerm(t)} className="btn-icon btn-edit" title="Edit SNK">Edit</button>
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

            {showAddUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Tambah User Baru</h3>
                            <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-black">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Username</label>
                                <input
                                    className="input-clean"
                                    value={newUserForm.username}
                                    onChange={e => setNewUserForm({ ...newUserForm, username: e.target.value })}
                                    placeholder="Masukkan username"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="input-clean"
                                    value={newUserForm.password}
                                    onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                    placeholder="Masukkan password"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn btn-light flex-1">Batal</button>
                                <button type="submit" className="btn btn-primary flex-1">Simpan User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .animate-pop { animation: pop 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes pop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                .badge-light { background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; text-transform: uppercase; }
            `}</style>
        </div>
    );
}
