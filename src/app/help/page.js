
import FaqAccordion from '@/components/help/FaqAccordion';
import { faqData } from '@/data/faq';

export const metadata = {
    title: 'Pusat Bantuan & FAQ | Mall Aptiknas',
    description: 'Pusat Bantuan dan Pertanyaan Seputar SCM & Marketplace Mall Aptiknas',
};

export default function HelpPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            
            <main className="flex-grow pt-[120px] pb-20 container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Pusat Bantuan</h1>
                    <p className="text-gray-600 text-lg">
                        Temukan jawaban untuk pertanyaan seputar platform SCM dan Marketplace Mall APTIKNAS.
                    </p>
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
                            Jika Anda memiliki keluhan lebih lanjut atau tidak menemukan jawaban di atas, tim kami siap membantu Anda. <br/>
                            Hubungi email:
                        </p>
                        <div className="inline-block bg-white text-blue-800 font-mono font-bold text-2xl md:text-3xl py-4 px-8 rounded-xl shadow-inner select-all">
                            keluhan.inx@gmail.com
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
