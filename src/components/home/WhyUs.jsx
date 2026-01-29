// src/components/home/WhyUs.jsx
"use client";

const WhyUs = () => {
    return (
        <section id="keuntungan" className="cp-section why-us-combined">
            <div className="container">
                <div className="cp-head">
                    <span className="cp-kicker">Value Proposition</span>
                    <h2 className="cp-title">Mengapa Memilih <span>MallAptiknas</span>?</h2>
                    <p className="cp-sub">
                        Kami menghadirkan ekosistem IT terlengkap yang menggabungkan efisiensi SCM dengan kekuatan marketplace, memberikan nilai tambah yang tidak dimiliki platform lain.
                    </p>
                </div>

                <div className="why-us-grid">
                    {/* VALUE 1: Ekosistem */}
                    <div className="why-us-card reveal">
                        <div className="card-icon blue">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <div className="card-body">
                            <h3>Ekosistem Terintegrasi</h3>
                            <p>Satu platform terpadu untuk SCM dan marketplace, memastikan alur kerja bisnis Anda berjalan tanpa hambatan.</p>
                        </div>
                    </div>

                    {/* VALUE 2: Spesialis IT */}
                    <div className="why-us-card reveal">
                        <div className="card-icon navy">
                            <i className="fa-solid fa-laptop-code"></i>
                        </div>
                        <div className="card-body">
                            <h3>Spesialis Industri TIK</h3>
                            <p>Fokus mendalam pada kebutuhan spesifik industri teknologi, mulai dari verifikasi produk hingga dukungan teknis ahli.</p>
                        </div>
                    </div>

                    {/* VALUE 3: Keamanan */}
                    <div className="why-us-card reveal">
                        <div className="card-icon green">
                            <i className="fa-solid fa-shield-check"></i>
                        </div>
                        <div className="card-body">
                            <h3>Keaslian & Keamanan</h3>
                            <p>Standarisasi ketat untuk menjamin produk original, keamanan transaksi, dan perlindungan garansi resmi.</p>
                        </div>
                    </div>

                    {/* VALUE 4: Dukungan Komunitas */}
                    <div className="why-us-card reveal">
                        <div className="card-icon red">
                            <i className="fa-solid fa-people-group"></i>
                        </div>
                        <div className="card-body">
                            <h3>Jaringan Terluas</h3>
                            <p>Didukung oleh ribuan mitra IT di seluruh Indonesia dan akses langsung ke sektor pemerintah serta swasta skala besar.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .why-us-combined {
                    background-color: #f8fafc;
                    padding: 100px 0;
                }

                .why-us-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 30px;
                    margin-top: 50px;
                }

                .why-us-card {
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                    transition: all 0.3s ease;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }

                .why-us-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                    border-color: var(--brand-blue);
                }

                .card-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    flex-shrink: 0;
                }

                .card-icon.blue { background: rgba(0, 174, 239, 0.1); color: var(--brand-blue); }
                .card-icon.navy { background: rgba(11, 27, 52, 0.1); color: var(--brand-navy); }
                .card-icon.green { background: rgba(124, 194, 66, 0.1); color: var(--brand-green); }
                .card-icon.red { background: rgba(233, 30, 37, 0.1); color: var(--brand-red); }

                .card-body h3 {
                    font-size: 1.3rem;
                    font-weight: 800;
                    margin: 0 0 12px 0;
                    color: var(--brand-navy);
                }

                .card-body p {
                    font-size: 1rem;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0;
                }

                @media (max-width: 992px) {
                    .why-us-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .why-us-card {
                        padding: 30px;
                    }
                }

                @media (max-width: 600px) {
                    .why-us-card {
                        flex-direction: column;
                        gap: 16px;
                    }
                }
            `}</style>
        </section>
    );
};

export default WhyUs;