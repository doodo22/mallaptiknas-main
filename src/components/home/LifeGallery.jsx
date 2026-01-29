// src/components/home/LifeGallery.jsx
const LifeGallery = () => {
    return (
        <section id="timeline" className="cp-section">
            <div className="container">
                <div className="cp-head">
                    <span className="cp-kicker">TIMELINE</span>
                    <h2 className="cp-title">Timeline <span>Perjalanan</span></h2>
                    <p className="cp-sub">Milestone utama dari komunitas hingga platform siap peluncuran.</p>
                </div>

                <div className="cp-timeline reveal">
                    {/* Garis Penghubung (Visual Line) */}
                    <div className="cp-timeline-line"></div>

                    {/* ITEM 1: 1991 */}
                    <div className="cp-timeline-item">
                        <div className="cp-timeline-dot"><i className="fa-solid fa-flag"></i></div>
                        <div className="cp-timeline-year">1991</div>
                        <div className="cp-timeline-title">APKOMINDO Didirikan</div>
                        <div className="cp-timeline-desc">Asosiasi pengusaha komputer Indonesia berdiri, menjadi akar ekosistem TIK.</div>
                    </div>

                    {/* ITEM 2: 2017 */}
                    <div className="cp-timeline-item">
                        <div className="cp-timeline-dot"><i className="fa-solid fa-shuffle"></i></div>
                        <div className="cp-timeline-year">2017</div>
                        <div className="cp-timeline-title">Transformasi ke APTIKNAS</div>
                        <div className="cp-timeline-desc">Deklarasi organisasi dan legalitas untuk memperluas dampak industri.</div>
                    </div>

                    {/* ITEM 3: 2022 */}
                    <div className="cp-timeline-item">
                        <div className="cp-timeline-dot"><i className="fa-solid fa-people-roof"></i></div>
                        <div className="cp-timeline-year">2022</div>
                        <div className="cp-timeline-title">Kepengurusan 2022–2027</div>
                        <div className="cp-timeline-desc">Periode kepengurusan baru dengan visi transformasi digital.</div>
                    </div>

                    {/* ITEM 4: 2024 (BARU - SESUAI GAMBAR) */}
                    <div className="cp-timeline-item">
                        <div className="cp-timeline-dot"><i className="fa-solid fa-code"></i></div>
                        <div className="cp-timeline-year">2024</div>
                        <div className="cp-timeline-title">Development MallAptiknas</div>
                        <div className="cp-timeline-desc">Pengembangan platform terintegrasi dimulai.</div>
                    </div>

                    {/* ITEM 5: 2026 */}
                    <div className="cp-timeline-item">
                        <div className="cp-timeline-dot"><i className="fa-solid fa-rocket"></i></div>
                        <div className="cp-timeline-year">2026</div>
                        <div className="cp-timeline-title">Target Launching</div>
                        <div className="cp-timeline-desc">Peluncuran nasional MallAptiknas dan ekspansi layanan.</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default LifeGallery;