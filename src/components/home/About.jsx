// src/components/home/About.jsx
"use client";

const About = () => {
    return (
        <>
            {/* --- SEJARAH & TIMELINE --- */}
            <section id="sejarah" className="cp-section cp-section--alt">
                <div className="container">
                    <div className="cp-head">
                        <h3 className="cp-title">SEJARAH KAMI</h3>
                        <h2 className="cp-title">Perjalanan Membangun <span>Ekosistem Teknologi</span> Indonesia</h2>
                        <p className="cp-sub">Dari akar komunitas industri TIK hingga hadirnya MallAptiknas sebagai platform terintegrasi.</p>
                    </div>

                    {/* GRID ATAS: INFO DETAIL (Kiri) vs SOLUSI (Kanan) - TETAP SAMA */}
                    <div className="cp-history-grid" style={{ alignItems: 'stretch' }}>
                        {/* LEFT COLUMN: History, Legal, People */}
                        <div className="cp-stack">
                            {/* CARD 1: WARISAN */}
                            <div className="cp-panel reveal">
                                <div className="cp-panel-top">
                                    <div className="cp-icon-badge">
                                        <i className="fa-solid fa-landmark"></i>
                                    </div>
                                    <div>
                                        <h3 className="cp-panel-title">Warisan 35 Tahun APTIKNAS</h3>
                                        <div className="cp-badge">1991 – Sekarang</div>
                                    </div>
                                </div>
                                <p className="cp-text">
                                    Asosiasi Pengusaha Teknologi Informasi dan Komunikasi Nasional (APTIKNAS) merupakan organisasi profesional yang bertransformasi dari Asosiasi Pengusaha Komputer Indonesia (APKOMINDO), yang telah berdiri sejak tahun 1991. Dengan perjalanan lebih dari 35 tahun, APTIKNAS sesungguhnya merupakan asosiasi TIK tertua di Indonesia yang tumbuh dan berkembang seiring dinamika serta perjalanan panjang industri TIK nasional. Pengalaman kolektif dan kekuatan komunitas inilah yang menjadi fondasi utama lahirnya ekosistem MallAptiknas.
                                </p>
                                <div className="cp-metric">
                                    <div className="cp-metric-num">35 Tahun</div>
                                    <div className="cp-metric-label">Asosiasi TIK tertua</div>
                                </div>
                            </div>

                            {/* CARD 2: LEGALITAS */}
                            <div className="cp-panel reveal">
                                <div className="cp-panel-top">
                                    <div className="cp-icon-badge">
                                        <i className="fa-solid fa-scale-balanced"></i>
                                    </div>
                                    <div>
                                        <h3 className="cp-panel-title">Pendirian dan Legalitas</h3>
                                        <p className="cp-mini">APTIKNAS dibangun di atas landasan organisasi yang kuat dan kredibel sebagai dasar pengembangan ekosistem nasional di bidang teknologi informasi dan komunikasi.</p>
                                    </div>
                                </div>
                                <div className="cp-text" style={{ fontSize: '0.9rem', lineHeight: '1.6', marginTop: '15px', color: 'var(--brand-grey)' }}>
                                    <p>APTIKNAS didirikan oleh 100 pengusaha, praktisi, dan akademisi TIK dari seluruh Indonesia, serta dideklarasikan pada 24 Februari 2017.</p>
                                    <p style={{ marginTop: '10px' }}>Organisasi ini telah memiliki legalitas resmi dari Kementerian Hukum dan HAM RI berdasarkan SK Nomor AHU-0007054.AH.01.07.Tahun 2017 tertanggal 26 April 2017, dan diperbarui melalui SK perubahan kepengurusan Nomor AHU-0000091.AH.01.08.Tahun 2023 tertanggal 19 Januari 2023.</p>
                                </div>
                            </div>

                            {/* CARD 3: KEPENGURUSAN */}
                            <div className="cp-panel reveal">
                                <div className="cp-panel-top">
                                    <div className="cp-icon-badge"><i className="fa-solid fa-users-gear"></i></div>
                                    <div>
                                        <h3 className="cp-panel-title">Kepengurusan 2022–2027</h3>
                                        <p className="cp-mini">Kepemimpinan yang mendorong transformasi ekosistem.</p>
                                    </div>
                                </div>
                                <ul className="cp-people">
                                    <li><span>Ketum APTIKNAS</span><strong>Ir. Soegiharto Santoso, S.H. / HOKY</strong></li>
                                    <li><span>Sekretaris Jenderal</span><strong>Fanky Christian</strong></li>
                                    <li><span>Bendahara</span><strong>Andri Sugondo</strong></li>
                                </ul>
                                <div className="cp-note">SK KUMHAM RI: AHU-000091.AH.01.08.TAHUN 2023</div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SOLUSI (Full Height) */}
                        <div className="cp-stack" style={{ height: '100%' }}>
                            <div className="cp-panel cp-panel--soft reveal" style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div className="cp-panel-top">
                                    <div className="cp-icon-badge cp-icon-badge--soft">
                                        <i className="fa-solid fa-code-branch"></i>
                                    </div>
                                    <div>
                                        <h3 className="cp-panel-title">Solusi untuk Anggota APTIKNAS</h3>
                                        <p className="cp-mini">Ekosistem MallAptiknas dihadirkan sebagai solusi strategis bagi anggota APTIKNAS dalam menjawab tantangan distribusi produk teknologi informasi, melalui sistem yang terintegrasi, kolaboratif, dan berkelanjutan.</p>
                                    </div>
                                </div>

                                {/* Grid Masalah */}
                                <div className="cp-problem-grid" style={{ flexGrow: 1 }}>
                                    <div className="cp-mini-card">
                                        <i className="fa-solid fa-link-slash"></i>
                                        <h4>Fragmentasi Distribusi</h4>
                                        <p>Rantai pasok produk teknologi informasi yang masih terfragmentasi, berjalan secara terpisah, dan belum terintegrasi secara optimal.</p>
                                    </div>
                                    <div className="cp-mini-card">
                                        <i className="fa-solid fa-lock"></i>
                                        <h4>Akses Terbatas</h4>
                                        <p>Keterbatasan akses terhadap produk teknologi informasi dengan harga yang kompetitif masih menjadi tantangan bagi pelaku UMKM.</p>
                                    </div>
                                    <div className="cp-mini-card">
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                        <h4>Inefisiensi Operasional</h4>
                                        <p>Pengelolaan inventori yang masih dilakukan secara manual dan belum terpusat, sehingga menimbulkan inefisiensi operasional.</p>
                                    </div>
                                    <div className="cp-mini-card">
                                        <i className="fa-solid fa-shield-halved"></i>
                                        <h4>Keaslian Produk</h4>
                                        <p>Verifikasi keaslian produk dan standar garansi yang belum terintegrasi secara optimal.</p>
                                    </div>
                                </div>

                                {/* Kotak Bawah: Lahirnya MallAptiknas */}
                                <div className="cp-solution-box" style={{ marginTop: 'auto' }}>
                                    <div className="cp-solution-bar"></div>
                                    <div className="cp-solution-content">
                                        <h4>Lahirnya MallAptiknas</h4>
                                        <p>
                                            Menyikapi kompleksitas distribusi produk teknologi informasi di Indonesia, APTIKNAS menghadirkan sebuah platform digital nasional bernama <strong>MallAptiknas</strong>. Platform ini dirancang untuk menyatukan seluruh rantai pasok—mulai dari produsen, distributor, hingga mitra penjualan—ke dalam satu ekosistem yang terintegrasi, efisien, dan berkelanjutan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BAGIAN BAWAH: TIMELINE PERJALANAN (UPDATED: BLUE THEME) --- */}
                    <div style={{ marginTop: '80px' }}>
                        <div className="cp-head">
                            <h3 className="cp-title" style={{ fontSize: '1.8rem' }}>Timeline <span>Perjalanan</span></h3>
                            <p className="cp-sub">Milestone utama dari komunitas hingga platform siap peluncuran.</p>
                        </div>

                        {/* Tambahkan class 'blue-theme' di sini */}
                        <div className="cp-timeline reveal blue-theme">
                            {/* Garis Penghubung */}
                            <div className="cp-timeline-line"></div>

                            {/* ITEM 1: 1991 */}
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot"><i className="fa-solid fa-flag"></i></div>
                                <div className="cp-timeline-year">1991</div>
                                <div className="cp-timeline-title">APKOMINDO Didirikan</div>
                                <div className="cp-timeline-desc">Asosiasi pengusaha komputer Indonesia berdiri.</div>
                            </div>

                            {/* ITEM 2: 2017 */}
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot"><i className="fa-solid fa-shuffle"></i></div>
                                <div className="cp-timeline-year">2017</div>
                                <div className="cp-timeline-title">Transformasi ke APTIKNAS</div>
                                <div className="cp-timeline-desc">Deklarasi organisasi dan legalitas.</div>
                            </div>

                            {/* ITEM 3: 2022 */}
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot"><i className="fa-solid fa-people-roof"></i></div>
                                <div className="cp-timeline-year">2022</div>
                                <div className="cp-timeline-title">Kepengurusan Baru</div>
                                <div className="cp-timeline-desc">Periode 2022–2027 dengan visi transformasi digital.</div>
                            </div>

                            {/* ITEM 4: 2024 */}
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot"><i className="fa-solid fa-code"></i></div>
                                <div className="cp-timeline-year">2024</div>
                                <div className="cp-timeline-title">Dev. MallAptiknas</div>
                                <div className="cp-timeline-desc">Pengembangan platform terintegrasi dimulai.</div>
                            </div>

                            {/* ITEM 5: 2026 */}
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot"><i className="fa-solid fa-rocket"></i></div>
                                <div className="cp-timeline-year">2026</div>
                                <div className="cp-timeline-title">Target Launching</div>
                                <div className="cp-timeline-desc">Peluncuran nasional dan ekspansi layanan.</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- MISI KAMI (TETAP SAMA) --- */}
            <section id="misi" className="cp-section">
                <div className="container">
                    <div className="cp-head">
                        {/*<span className="cp-kicker">TENTANG KAMI</span>*/}
                        <h2 className="cp-title">Misi <span>Kami</span></h2>
                        <p className="cp-sub">Komitmen MallAptiknas membangun ekosistem teknologi yang lebih efisien, inklusif, dan tepercaya.</p>
                    </div>

                    <div className="cp-mission-grid">
                        <div className="cp-mission-left reveal">
                            <h3>Mendobrak Tembok <br /> Jarak & Waktu</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
                                <div style={{
                                    width: '100%',
                                    height: '240px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 15px 40px rgba(0, 174, 239, 0.15)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                                        alt="Kolaborasi Tim Teknologi"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <p style={{ marginBottom: '16px' }}>
                                        Kami memastikan siapa saja, di mana saja, bisa mendapatkan akses yang
                                        sama terhadap produk IT dan kesempatan ekonomi.
                                    </p>
                                    <p>
                                        Kami terus berinovasi untuk membantu distributor, reseller, dan UMKM
                                        naik kelas—dengan proses yang lebih cepat, transparan, dan terukur.
                                    </p>
                                </div>
                            </div>

                            <div className="cp-pill-group">
                                <div className="cp-pill blue">
                                    <i className="fa-solid fa-circle-check"></i> Fokus pada Konsumen
                                </div>
                                <div className="cp-pill green">
                                    <i className="fa-solid fa-chart-line"></i> Pola Pikir Bertumbuh
                                </div>
                                <div className="cp-pill green">
                                    <i className="fa-solid fa-bolt"></i> Buat Menjadi Nyata
                                </div>
                            </div>
                        </div>

                        <div className="cp-mission-right reveal">
                            <h4>Yang Kami Percayai</h4>
                            <div className="cp-beliefs">
                                <div className="cp-belief">
                                    <div className="cp-belief-ic"><i className="fa-solid fa-globe"></i></div>
                                    <div>
                                        <div className="cp-belief-title">Platform Terintegrasi</div>
                                        <div className="cp-belief-desc">Ekosistem digital yang menghubungkan rantai pasok produk IT dari supplier hingga konsumen.</div>
                                    </div>
                                </div>
                                <div className="cp-belief">
                                    <div className="cp-belief-ic"><i className="fa-solid fa-hand-holding-hand"></i></div>
                                    <div>
                                        <div className="cp-belief-title">Pemberdayaan Pelaku Usaha</div>
                                        <div className="cp-belief-desc">Mendukung distributor, reseller, dan UMKM dengan alat & akses untuk berkembang di industri teknologi.</div>
                                    </div>
                                </div>
                                <div className="cp-belief">
                                    <div className="cp-belief-ic"><i className="fa-solid fa-arrows-rotate"></i></div>
                                    <div>
                                        <div className="cp-belief-title">Transformasi Digital</div>
                                        <div className="cp-belief-desc">Mendorong adopsi teknologi untuk efisiensi, transparansi, dan standardisasi proses.</div>
                                    </div>
                                </div>
                                <div className="cp-belief">
                                    <div className="cp-belief-ic"><i className="fa-solid fa-shield-halved"></i></div>
                                    <div>
                                        <div className="cp-belief-title">Komunitas Terpercaya</div>
                                        <div className="cp-belief-desc">Jaminan keaslian produk, dukungan teknis, dan komunitas yang terus berkembang.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CUSTOM CSS KHUSUS TIMELINE BIRU --- */}
            <style jsx>{`
                /* Override Style untuk Timeline dengan Tema Biru (Sesuai Gambar) */
                .cp-timeline.blue-theme {
                    background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%); /* Gradasi Biru */
                    border: none;
                    color: white;
                    box-shadow: 0 10px 40px rgba(2, 132, 199, 0.2);
                }
                
                /* Ubah Warna Garis jadi Putih Transparan */
                .cp-timeline.blue-theme .cp-timeline-line {
                    background-color: rgba(255, 255, 255, 0.3);
                }
                
                /* Ubah Dot jadi Putih dengan Icon Biru */
                .cp-timeline.blue-theme .cp-timeline-dot {
                    background: white;
                    color: #0284c7; /* Warna Icon Biru */
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                
                /* Ubah Warna Teks Judul & Tahun jadi Putih */
                .cp-timeline.blue-theme .cp-timeline-year,
                .cp-timeline.blue-theme .cp-timeline-title {
                    color: white;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .cp-timeline.blue-theme .cp-timeline-year {
                    opacity: 0.9;
                }

                /* Ubah Deskripsi jadi Putih Agak Pudar */
                .cp-timeline.blue-theme .cp-timeline-desc {
                    color: rgba(255, 255, 255, 0.85);
                }

                /* Responsive: Sesuaikan Garis Vertikal di Mobile */
                @media (max-width: 992px) {
                    .cp-timeline.blue-theme::before {
                        background: rgba(255, 255, 255, 0.3); /* Garis vertikal putih transparan */
                    }
                }
            `}</style>
        </>
    );
};
export default About;