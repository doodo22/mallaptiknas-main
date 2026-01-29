const Awards = () => {
    return (
        <section className="awards-section">
            <div className="container">
                <div className="awards-content">
                    <h2 style={{ fontSize: '2.5rem', maxWidth: '800px', margin: '0 auto 60px auto', fontWeight: 700 }}>
                        Penghargaan atas inovasi kami yang mewarnai perjalanan MallAptiknas
                    </h2>
                    <div className="awards-grid">
                        <div className="award-card">
                            <div className="award-logo"><i className="fas fa-award"></i></div>
                            <div className="text-gray-400 text-sm mb-2">2022</div>
                            <div className="text-xl font-bold">Tiga penghargaan HR Excellence Award</div>
                        </div>
                        <div className="award-card">
                            <div className="award-logo"><i className="fas fa-lightbulb"></i></div>
                            <div className="text-gray-400 text-sm mb-2">2022</div>
                            <div className="text-xl font-bold">Best Workplaces for Innovators list</div>
                        </div>
                        <div className="award-card">
                            <div className="award-logo"><i className="fas fa-globe-asia"></i></div>
                            <div className="text-gray-400 text-sm mb-2">2022</div>
                            <div className="text-xl font-bold">Best Places to Work Asia-Pacific</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Awards;