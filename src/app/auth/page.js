"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [registerError, setRegisterError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/admin");
            } else {
                setError(data.error || "Username atau password salah.");
            }
        } catch (err) {
            setError("Gagal terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRegisterError("");
        setRegisterSuccess("");

        if (registerForm.password !== registerForm.confirmPassword) {
            setRegisterError("Password dan konfirmasi password tidak cocok.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: registerForm.username,
                    password: registerForm.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setRegisterSuccess("Pendaftaran berhasil! Akun Anda menunggu aktivasi admin.");
                setRegisterForm({
                    username: "",
                    password: "",
                    confirmPassword: ""
                });
                setTimeout(() => {
                    setIsRegisterMode(false);
                    setRegisterSuccess("");
                }, 3000);
            } else {
                setRegisterError(data.error || "Pendaftaran gagal.");
            }
        } catch (err) {
            setRegisterError("Gagal terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-page-container">
            {/* CSS LOKAL: Memastikan tampilan tetap benar meskipun Tailwind error */}
            <style jsx>{`
                .auth-page-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                    z-index: 9999;
                    overflow: hidden;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                /* Dekorasi Latar (Orbs) */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.4;
                }
                .orb-1 { width: 400px; height: 400px; background: #00c6ff; top: -100px; left: -100px; }
                .orb-2 { width: 300px; height: 300px; background: #0072ff; bottom: -50px; right: -50px; }

                /* Kartu Glassmorphism */
                .glass-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 400px; /* Membatasi lebar agar tidak stretch */
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    margin: 20px;
                }

                .icon-wrapper {
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px auto;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    font-size: 32px;
                    color: white;
                }

                h2 {
                    color: white;
                    text-align: center;
                    margin: 0 0 5px 0;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .subtitle {
                    color: #94a3b8;
                    text-align: center;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 30px;
                    display: block;
                }

                /* Input Style */
                .input-group {
                    margin-bottom: 20px;
                    position: relative;
                }

                .input-field {
                    width: 100%;
                    padding: 14px 14px 14px 45px; /* Padding kiri untuk icon */
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s;
                }

                .input-field:focus {
                    background: rgba(0, 0, 0, 0.4);
                    border-color: #00c6ff;
                    box-shadow: 0 0 0 3px rgba(0, 198, 255, 0.1);
                }

                .input-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.5);
                }

                /* Button Style */
                .login-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    margin-top: 10px;
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0, 198, 255, 0.3);
                }

                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .error-msg {
                    background: rgba(220, 38, 38, 0.2);
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    color: #fecaca;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .footer {
                    text-align: center;
                    margin-top: 25px;
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 11px;
                }

                .show-pwd-btn {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.3s;
                }

                .show-pwd-btn:hover {
                    color: #00c6ff;
                }

                /* Toggle Button Style */
                .toggle-btn {
                    background: none;
                    border: 1px solid rgba(0, 198, 255, 0.3);
                    color: #00c6ff;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 8px 16px;
                    border-radius: 20px;
                    transition: all 0.3s;
                    margin: 10px auto;
                    display: block;
                    text-decoration: none;
                }

                .toggle-btn:hover {
                    background: rgba(0, 198, 255, 0.1);
                    border-color: #00c6ff;
                }

                .success-msg {
                    background: rgba(34, 197, 94, 0.2);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #bbf7d0;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    text-align: center;
                    margin-bottom: 20px;
                }
            `}</style>

            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="glass-card">
                <div className="icon-wrapper">
                    <i className="fas fa-user-shield"></i>
                </div>

                {isRegisterMode ? (
                    <>
                        <h2>DAFTAR USER BARU</h2>
                        <span className="subtitle">Buat akun baru untuk akses admin</span>
                    </>
                ) : (
                    <>
                        <h2>ADMIN LOGIN</h2>
                        <span className="subtitle">Aptiknas Security Panel</span>
                    </>
                )}

                {error && <div className="error-msg">{error}</div>}
                {registerError && <div className="error-msg">{registerError}</div>}
                {registerSuccess && (
                    <div className="success-msg">
                        <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                        {registerSuccess}
                    </div>
                )}

                {isRegisterMode ? (
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <i className="fas fa-id-card-alt input-icon" style={{ color: '#00c6ff', fontSize: '18px' }}></i>
                            <input
                                type="text"
                                name="username"
                                className="input-field"
                                placeholder="Username"
                                value={registerForm.username}
                                onChange={handleRegisterChange}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <i className="fas fa-shield-alt input-icon" style={{ color: '#00c6ff', fontSize: '18px' }}></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="input-field"
                                placeholder="Password"
                                value={registerForm.password}
                                onChange={handleRegisterChange}
                                required
                            />
                            <button
                                type="button"
                                className="show-pwd-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>

                        <div className="input-group">
                            <i className="fas fa-shield-alt input-icon" style={{ color: '#00c6ff', fontSize: '18px' }}></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="input-field"
                                placeholder="Konfirmasi Password"
                                value={registerForm.confirmPassword}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <i className="fas fa-id-card-alt input-icon" style={{ color: '#00c6ff', fontSize: '18px' }}></i>
                            <input
                                type="text"
                                name="username"
                                className="input-field"
                                placeholder="Username / ID"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <i className="fas fa-shield-alt input-icon" style={{ color: '#00c6ff', fontSize: '18px' }}></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="input-field"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="show-pwd-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "MEMPROSES..." : "MASUK SEKARANG"}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <button
                        type="button"
                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                        className="toggle-btn"
                    >
                        <i className={`fas ${isRegisterMode ? 'fa-sign-in-alt' : 'fa-user-plus'}`} style={{ marginRight: '8px' }}></i>
                        {isRegisterMode ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Daftar User di sini'}
                    </button>
                </div>

                <div className="footer">
                    &copy; 2026 Mall Aptiknas. Protected Area.
                </div>
            </div>
        </div>
    );
}
