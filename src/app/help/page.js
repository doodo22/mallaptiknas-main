import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'Pusat Bantuan | Mall Aptiknas',
    description: 'Halaman Pusat Bantuan Mall Aptiknas',
};

export default function HelpPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <div className="flex-grow pt-[120px] pb-20 container mx-auto px-4 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
                    <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
                        <i className="fas fa-tools"></i>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Dalam Pengembangan</h1>
                    <p className="text-gray-500 mb-8 text-lg">
                        Halaman <strong>Pusat Bantuan</strong> sedang kami persiapkan untuk memberikan layanan terbaik bagi Anda.
                    </p>
                    <div className="inline-block px-6 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold uppercase tracking-wide mb-8">
                        Segera Hadir
                    </div>
                    <div>
                        <Link href="/" className="btn btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30">
                            <i className="fas fa-arrow-left"></i> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
