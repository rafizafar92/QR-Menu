import React from 'react';
import { motion } from 'motion/react';
import {
  QrCode,
  ArrowRight,
  Search,
  ShoppingBag,
  Plus,
  ChefHat,
  Star,
  CheckCircle2,
  MessageCircle,
  Zap,
  Wallet,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Ensure Link is imported

// --- Sub-components (Defined before the main export) ---

const LANDING_IMAGES = {
  customer: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600',
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  cashier: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'
};
const PhoneMenuMockup = () => (
  <div className="relative mx-auto bg-slate-900 w-[280px] h-[580px] rounded-[3rem] border-[10px] border-slate-900 shadow-[0_0_50px_rgba(255,107,53,0.15)] overflow-hidden">
    <div className="bg-[#FFF8F3] h-full flex flex-col font-sans">
      {/* Status Bar */}
      <div className="h-6 w-full flex justify-between items-center px-6 pt-2">
        <div className="h-1.5 w-8 bg-slate-300 rounded-full" />
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* App Header */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white">
            <QrCode size={16} />
          </div>
          <Search size={18} className="text-slate-400" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-800">Warung Modern Kita</h4>
          <p className="text-[10px] text-slate-500">Meja 05 • Grogol, Jakarta</p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-hidden">
          {['Semua', 'Makanan', 'Minuman'].map((cat, i) => (
            <div key={cat} className={`px-3 py-1.5 rounded-full text-[9px] font-bold ${i === 0 ? 'bg-[#FF6B35] text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Food Items */}
      <div className="flex-1 px-4 space-y-3 overflow-hidden">
        {[
          { name: 'Nasi Goreng Spesial', price: '35.000', desc: 'Nasi goreng dengan telur, ayam, dan kerupuk.' },
          { name: 'Ayam Bakar Madu', price: '45.000', desc: 'Ayam bakar bumbu madu khas Solo.' },
          { name: 'Es Kopi Susu', price: '22.000', desc: 'Kopi susu gula aren segar.' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-3 rounded-2xl flex gap-3 border border-slate-50 shadow-sm">
            <div className="w-14 h-14 bg-slate-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h5 className="text-[10px] font-bold text-slate-800 truncate">{item.name}</h5>
                <span className="text-[10px] font-bold text-[#FF6B35]">Rp {item.price}</span>
              </div>
              <p className="text-[8px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</p>
              <div className="mt-2 flex justify-end">
                <div className="w-5 h-5 rounded-md bg-[#FF6B35] flex items-center justify-center text-white">
                  <Plus size={12} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Cart */}
      <div className="p-4">
        <div className="bg-slate-900 rounded-2xl p-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={14} />
            <span className="text-[10px] font-bold">2 Item</span>
          </div>
          <span className="text-[10px] font-bold">Lanjut • Rp 57.000</span>
        </div>
      </div>
    </div>
  </div>
);

const DashboardCardKitchen = () => (
  <div className="bg-white p-5 rounded-3xl shadow-xl w-56 border border-slate-100">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
        <ChefHat size={16} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dapur</span>
    </div>
    <div className="space-y-3">
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-800">Meja 04</span>
          <span className="text-[8px] font-bold text-orange-500">DIPROSES</span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium">1x Nasi Goreng Spesial</span>
      </div>
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 opacity-50">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-800">Meja 02</span>
          <span className="text-[8px] font-bold text-slate-400">ANTRIAN</span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium">2x Es Kopi Susu</span>
      </div>
    </div>
  </div>
);

const CashierDashboardCard = () => (
  <div className="bg-[#1A1A1A] p-5 rounded-3xl shadow-2xl w-56 border border-white/5">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35]">
        <ShoppingBag size={16} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">🧾 Kasir Dashboard</span>
    </div>
    <div className="space-y-3">
      {[
        { table: 'Meja 03', items: 2, price: '83.000' },
        { table: 'Meja 07', items: 1, price: '38.000' },
      ].map((order, i) => (
        <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-black text-white">{order.table}</span>
            <span className="text-[10px] font-bold text-slate-400">{order.items} Items</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-[#FF6B35]">Rp {order.price}</span>
            <button className="bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors">
              Konfirmasi
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t border-white/5">
      <span className="text-[10px] text-slate-500 font-bold">2 Pesanan Menunggu</span>
    </div>
  </div>
);

// --- Main Landing Page Component ---

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-slate-900 font-sans selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shadow-lg shadow-[#FF6B35]/20">
            <QrCode size={24} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight">Ordio</span>
            <span className="text-[10px] text-[#FF6B35] block font-bold uppercase tracking-widest leading-none mt-0.5">Indonesia</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <button onClick={() => scrollToSection('features')} className="hover:text-[#FF6B35] transition-colors">Fitur</button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#FF6B35] transition-colors">Cara Kerja</button>
          <Link to="/admin/login" className="hover:text-[#FF6B35] transition-colors">Masuk</Link> {/* This is already correct */}
          <Link to="/admin/register" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl shadow-lg shadow-[#FF6B35]/20 font-black hover:bg-[#e85a24] transition-all">
            Coba Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-6 lg:pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <div className="flex items-center gap-2 text-[#FF6B35] bg-[#FF6B35]/5 w-fit px-4 py-1.5 rounded-full border border-[#FF6B35]/10">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-wider">Solusi No. 1 di Indonesia</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Upgrade Bisnis <br />
              Kuliner Anda <br className="hidden sm:block" />
              <span className="text-[#FF6B35]">Tanpa Ribet.</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Tingkatkan omzet dan efisiensi operasional dengan sistem Menu QR, 
              Dashboard Kasir, dan KDS terintegrasi. Pelanggan pesan, Anda cuan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/admin/register" className="flex items-center justify-center gap-2 bg-[#FF6B35] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#FF6B35]/20 hover:bg-[#e85a24] transition-all group">
                Mulai Sekarang
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="https://wa.me/6287855585366?text=Halo,%20saya%20tertarik%20dengan%20Ordio,%20boleh%20minta%20info%20lebih%20lanjut?" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all">
                <MessageCircle size={20} />
                Tanya Sales
              </a>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#FFF8F3] bg-slate-200" />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span className="text-slate-900 font-black">1.200+</span> Restoran telah bergabung
              </p>
            </div>
          </motion.div>

          {/* Right Column (Mockups) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex items-center justify-center h-auto lg:h-[600px] mt-8 lg:mt-0"
          >
            {/* Decoration Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#FF6B35]/5 rounded-full blur-[100px] -z-10" />
            
            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-[20%] z-30 hidden md:block"
            > 
              <CashierDashboardCard />
            </motion.div>

            {/* Main Phone Mockup */}
            <div className="z-20 flex justify-center w-full max-w-[260px] lg:max-w-none">
              <div className="scale-90 lg:scale-110">
                <PhoneMenuMockup />
              </div>
            </div>

            {/* Floating Kitchen Card */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-0 bottom-[25%] z-30 hidden md:block"
            >
              <DashboardCardKitchen />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 bg-white rounded-[4rem] shadow-sm border border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 uppercase italic tracking-tight">Fitur Unggulan</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Segala yang Anda butuhkan untuk menjalankan bisnis kuliner di era digital, 
            mulai dari pemesanan mandiri hingga manajemen dapur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: 'Setup Cepat', desc: 'Daftar dan buat menu Anda dalam hitungan menit, langsung siap digunakan.' },
            { icon: Smartphone, title: 'Tanpa Aplikasi', desc: 'Pelanggan cukup scan QR tanpa perlu download aplikasi apapun.' },
            { icon: ChefHat, title: 'KDS Terintegrasi', desc: 'Pesanan masuk langsung ke layar dapur secara real-time.' },
            { icon: Wallet, title: 'Dashboard Kasir', desc: 'Pantau laporan penjualan dan transaksi dari mana saja.' }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 hover:border-[#FF6B35]/20 hover:shadow-xl hover:shadow-[#FF6B35]/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/5 flex items-center justify-center text-[#FF6B35] mb-6 group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Siap untuk Berakselerasi?</h2>
        
        <div className="bg-[#1A1A1A] rounded-[4rem] p-12 lg:p-24 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[#FF6B35]/5 opacity-50" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h3 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Bergabung dengan ribuan <br /> 
              bisnis kuliner lainnya.
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { label: 'Menu Item', value: 'Unlimited' },
                { label: 'Transaksi', value: 'Tanpa Biaya' },
                { label: 'Support', value: '24/7 CS' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-black text-[#FF6B35]">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-10"> {/* This button is a CTA to register */}
              <Link to="/admin/register" className="bg-[#FF6B35] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-[#FF6B35]/20 hover:bg-[#e85a24] transition-all">
                Mulai Gratis Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Tiga Langkah Mudah <br />
              Digitalisasi Resto.
            </h2>
            
            <div className="space-y-8">
              {[
                { step: '01', title: 'Buat Menu Digital', desc: 'Upload foto produk, tentukan harga, dan cetak QR Code unik untuk setiap meja.' },
                { step: '02', title: 'Pelanggan Scan & Pesan', desc: 'Tamu langsung pesan dari smartphone mereka tanpa perlu menunggu pelayan.' },
                { step: '03', title: 'Dapur Siapkan Pesanan', desc: 'Notifikasi otomatis masuk ke dapur untuk segera diproses dan disajikan.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-3xl font-black text-[#FF6B35]/20">{step.step}</div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 flex items-center justify-center relative group">
            <div className="absolute inset-12 bg-[#FF6B35]/5 rounded-3xl blur-[40px] group-hover:bg-[#FF6B35]/10 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-8 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4 w-64">
                <div className="w-40 h-40 bg-slate-900 rounded-2xl flex items-center justify-center p-3">
                  <QrCode size={120} className="text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-black uppercase tracking-widest text-[#FF6B35] mb-1">Meja 01</div>
                  <div className="text-sm font-bold text-slate-900">Scan untuk Pesan</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-black uppercase">Sistem Aktif & Terkoneksi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white">
                <QrCode size={24} />
              </div>
              <span className="text-xl font-black tracking-tight">Ordio</span>
            </div>
            <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
              Ordio membantu pemilik restoran di Indonesia mentransformasi 
              operasional mereka menjadi lebih cerdas dan efisien.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#FF6B35] hover:border-[#FF6B35]/20 cursor-pointer transition-colors" />)}
            </div>
          </div>
          
          <div className="space-y-6">
            <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">Produk</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li className="hover:text-[#FF6B35] cursor-pointer">Menu Digital</li>
              <li className="hover:text-[#FF6B35] cursor-pointer">Kasir Pintar</li>
              <li className="hover:text-[#FF6B35] cursor-pointer">Kitchen Display</li>
              <li className="hover:text-[#FF6B35] cursor-pointer">Statistik Penjualan</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">Perusahaan</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li className="hover:text-[#FF6B35] cursor-pointer">Tentang Kami</li>
              <li className="hover:text-[#FF6B35] cursor-pointer">Hubungi Kami</li>
              <li className="hover:text-[#FF6B35] cursor-pointer">Privasi</li>
              <li className="hover:text-[#FF6B35] cursor-pointer">Syarat & Ketentuan</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 Ordio Indonesia. All rights reserved.</p>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Made in Indonesia</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA */}
      <a href="https://wa.me/6287855585366?text=Halo,%20saya%20tertarik%20dengan%20Ordio,%20boleh%20minta%20info%20lebih%20lanjut?" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-[100]">
        <div className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all">
          <MessageCircle size={28} />
        </div>
      </a>
    </div>
  );
}