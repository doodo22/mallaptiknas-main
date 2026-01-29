const CTA = () => {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.3 }}>
                        Tertarik untuk menjadi bagian dari perjalanan kami?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '40px' }}>
                        Mari bersama-sama temukan tujuan dan ciptakan peluangmu!
                    </p>
                    <div className="cta-buttons">
                        <button className="btn-dark-mode">Cek Lowongan</button>
                        <button className="btn-dark-mode">Mulai Berjualan</button>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default CTA;