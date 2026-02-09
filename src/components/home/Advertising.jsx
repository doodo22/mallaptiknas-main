"use client";
import React from 'react';

const Advertising = () => {
    return (
        <section id="advertising" className="cp-section cp-section--alt reveal">
            <div className="container">
                <div className="cp-head">
                    <span className="cp-kicker">Marketing Opportunity</span>
                    <h2 className="cp-title">Partnership & <span>Advertising</span></h2>
                    <p className="cp-sub ad-description">
                        Perkuat eksposur brand Anda melalui ekosistem periklanan terpadu MallAptiknas. Tampilkan produk dan solusi IT Anda langsung kepada:
                    </p>
                    <ul className="ad-target-list">
                        <li>Ribuan mitra usaha IT terpercaya</li>
                        <li>Klien korporasi dari sektor pemerintahan dan swasta</li>
                    </ul>
                    <p className="ad-promo-note">
                        *Paket eksposure di platform MallAptiknas sudah termasuk free konten & eksposure di Instagram, YouTube, dan TikTok MallAptiknas.
                    </p>
                </div>

                <div className="ad-grid">
                    {/* INFO HARGA */}
                    <div className="ad-card price-card">
                        <div className="badge-promo">PROMO 2026</div>
                        <h3>Investasi Iklan</h3>
                        <div className="price-tag">
                            <span className="original-price">Rp 15.000.000</span>
                            <span className="discounted-price">Rp 7.500.000</span>
                            <span className="period">/ bulan</span>
                        </div>
                        <p className="promo-note">Khusus tahun 2026, nikmati diskon 50% untuk semua paket iklan.</p>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeqTwwTkH_Ds64e559DvgP3YRTyqJ8HKjHuhgebBkrjtqEzig/viewform?usp=publish-editor" target="_blank" rel="noreferrer" className="btn-contact">
                            <i className="fas fa-paper-plane"></i> Hubungi kami
                        </a>
                    </div>

                    {/* CHANNEL LIST */}
                    <div className="ad-card-list">
                        <h4>Channel Penayangan</h4>
                        <div className="channel-grid">
                            <div className="channel-item">
                                <i className="fas fa-store"></i>
                                <div>
                                    <h5>Banner MP MallAptiknas</h5>
                                    <p>Tampil di halaman utama Marketplace</p>
                                </div>
                            </div>
                            <div className="channel-item">
                                <i className="fas fa-network-wired"></i>
                                <div>
                                    <h5>Banner SCM</h5>
                                    <p>Penempatan strategis di portal SCM</p>
                                </div>
                            </div>
                            <div className="channel-item">
                                <i className="fab fa-youtube"></i>
                                <div>
                                    <h5>YouTube Channels</h5>
                                    <p>Video Panjang & YouTube Shorts</p>
                                </div>
                            </div>
                            <div className="channel-item">
                                <i className="fab fa-instagram"></i>
                                <div>
                                    <h5>Instagram Reels</h5>
                                    <p>Konten kreatif & viral di Instagram</p>
                                </div>
                            </div>
                            <div className="channel-item">
                                <i className="fab fa-tiktok"></i>
                                <div>
                                    <h5>TikTok</h5>
                                    <p>Jangkauan audiens muda dan luas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .ad-description {
                    font-size: 1.25rem !important;
                    line-height: 1.6 !important;
                    color: var(--brand-navy) !important;
                    font-weight: 600;
                    max-width: 900px !important;
                    margin: 14px auto 0;
                }

                .ad-target-list {
                    list-style: none;
                    padding: 0;
                    margin: 20px auto;
                    max-width: 600px;
                    text-align: left;
                    display: inline-block;
                }

                .ad-target-list li {
                    font-size: 1.1rem;
                    color: var(--brand-navy);
                    font-weight: 500;
                    margin-bottom: 10px;
                    position: relative;
                    padding-left: 25px;
                }

                .ad-target-list li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--brand-blue);
                    font-weight: 900;
                }

                .ad-promo-note {
                    font-size: 0.95rem;
                    color: var(--brand-grey);
                    font-style: italic;
                    margin-top: 20px;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .ad-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 30px;
                    margin-top: 40px;
                }

                .ad-card {
                    background: white;
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid #eee;
                }

                .price-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    border: 2px solid var(--brand-blue);
                }

                .badge-promo {
                    background: var(--brand-red);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                }

                .price-card h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                    color: var(--brand-navy);
                }

                .price-tag {
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .original-price {
                    text-decoration: line-through;
                    color: var(--light-grey);
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .discounted-price {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: var(--brand-blue);
                }

                .period {
                    font-size: 1rem;
                    color: var(--brand-grey);
                }

                .promo-note {
                    font-size: 0.9rem;
                    color: var(--brand-grey);
                    margin-bottom: 30px;
                }

                .btn-contact {
                    background: var(--brand-blue);
                    color: white !important;
                    padding: 15px 30px;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: transform 0.3s ease, background 0.3s ease;
                }

                .btn-contact:hover {
                    transform: translateY(-3px);
                    background: var(--brand-blue-hover);
                    box-shadow: 0 10px 20px rgba(0, 174, 239, 0.2);
                }

                .ad-card-list {
                    padding: 20px;
                }

                .ad-card-list h4 {
                    font-size: 1.3rem;
                    font-weight: 800;
                    margin-bottom: 25px;
                    color: var(--brand-navy);
                }

                .channel-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .channel-item {
                    display: flex;
                    gap: 15px;
                    align-items: flex-start;
                    background: white;
                    padding: 20px;
                    border-radius: 18px;
                    border: 1px solid #f0f3f7;
                    transition: all 0.3s ease;
                }

                .channel-item:hover {
                    border-color: var(--brand-blue);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.03);
                }

                .channel-item i {
                    font-size: 1.5rem;
                    color: var(--brand-blue);
                    background: rgba(0, 174, 239, 0.1);
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    flex-shrink: 0;
                }

                .channel-item h5 {
                    margin: 0 0 5px 0;
                    font-size: 1rem;
                    font-weight: 700;
                }

                .channel-item p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--brand-grey);
                }

                @media (max-width: 992px) {
                    .ad-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 600px) {
                    .channel-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
};

export default Advertising;
