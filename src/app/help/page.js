
import FaqAccordion from '@/components/help/FaqAccordion';
import { faqData } from '@/data/faq';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const metadata = {
    title: 'Pusat Bantuan & FAQ | Mall Aptiknas',
    description: 'Pusat Bantuan dan Pertanyaan Seputar SCM & Marketplace Mall Aptiknas',
};

export default async function HelpPage() {
    let manuals = {};
    try {
        const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (data?.site?.manuals) {
            manuals = data.site.manuals;
        }
    } catch (error) {
        console.error("Gagal memuat dokumen user manual", error);
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            <main className="flex-grow pt-[120px] pb-20 container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Pusat Bantuan</h1>
                    <p className="text-gray-600 text-lg">
                        Temukan jawaban untuk pertanyaan seputar platform SCM dan Marketplace Mall APTIKNAS.
                    </p>
                </div>

                {/* Section User Manuals */}
                <div className="mb-16">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <i className="fas fa-book-open text-3xl text-blue-600"></i>
                        <h2 className="text-3xl font-bold text-gray-800 text-center">Buku Panduan Penggunaan (User Manual)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Principal */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
                                <i className="fas fa-industry"></i>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Principal</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">Panduan lengkap menggunakan sistem SCM khusus untuk Principal.</p>
                            {manuals.principal ? (
                                <a href={manuals.principal} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                    <i className="fas fa-download"></i> Unduh / Baca
                                </a>
                            ) : (
                                <button disabled className="w-full bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl cursor-not-allowed">Belum Tersedia</button>
                            )}
                        </div>

                        {/* Distributor & MD */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-2xl mb-4">
                                <i className="fas fa-truck-loading"></i>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Distributor & MD</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">Panduan operasional dan transaksi untuk level Distributor/MD.</p>
                            {manuals.distributor ? (
                                <a href={manuals.distributor} target="_blank" rel="noopener noreferrer" className="w-full bg-orange-500 text-white font-semibold py-2.5 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                                    <i className="fas fa-download"></i> Unduh / Baca
                                </a>
                            ) : (
                                <button disabled className="w-full bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl cursor-not-allowed">Belum Tersedia</button>
                            )}
                        </div>

                        {/* Reseller */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
                                <i className="fas fa-store-alt"></i>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Mitra Usaha / Reseller</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">Langkah-langkah bertransaksi dan kulakan khusus Reseller.</p>
                            {manuals.reseller ? (
                                <a href={manuals.reseller} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                    <i className="fas fa-download"></i> Unduh / Baca
                                </a>
                            ) : (
                                <button disabled className="w-full bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl cursor-not-allowed">Belum Tersedia</button>
                            )}
                        </div>

                        {/* Marketplace */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Marketplace</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">Panduan belanja bagi konsumen di web & aplikasi Mall APTIKNAS.</p>
                            {manuals.marketplace ? (
                                <a href={manuals.marketplace} target="_blank" rel="noopener noreferrer" className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                    <i className="fas fa-download"></i> Unduh / Baca
                                </a>
                            ) : (
                                <button disabled className="w-full bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl cursor-not-allowed">Belum Tersedia</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Kolom Kiri: SCM */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <i className="fas fa-building"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">FAQ SCM Mall APTIKNAS</h2>
                        </div>

                        <div className="space-y-6">
                            {faqData.scm.map((section, idx) => (
                                <FaqAccordion key={idx} title={section.name} items={section.faqs} />
                            ))}
                        </div>
                    </div>

                    {/* Kolom Kanan: Marketplace */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center text-xl">
                                <i className="fas fa-store"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">FAQ Marketplace MAll APTIKNAS</h2>
                        </div>

                        <div className="space-y-6">
                            {faqData.mp.map((section, idx) => (
                                <FaqAccordion key={idx} title={section.name} items={section.faqs} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section Keluhan */}
                <div className="mt-16 bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                        <i className="fas fa-envelope text-9xl"></i>
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Masih Perlu Bantuan?</h2>
                        <p className="text-blue-100 text-lg mb-6">
                            Jika Anda memiliki keluhan lebih lanjut atau tidak menemukan jawaban di atas, tim kami siap membantu Anda. <br />
                            Hubungi email:
                        </p>
                        <div className="inline-block bg-white text-blue-800 font-mono font-bold text-2xl md:text-3xl py-4 px-8 rounded-xl shadow-inner select-all">
                            help.mallaptiknas@gmail.com
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
