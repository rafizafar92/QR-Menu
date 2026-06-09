import AdminDashboard from './pages/AdminDashboard';
import AdminKitchen from './pages/AdminKitchen';
import AdminMenu from './pages/AdminMenu';
import AdminTables from './pages/AdminTables';
import AdminSettings from './pages/AdminSettings';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import { AuthProvider } from './lib/auth';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { 
  QrCode,
  ArrowRight,
  Utensils,
  Smartphone,
  Sparkles,
  ChefHat,
  Activity,
  Printer,
  Monitor,
  ClipboardList,
  CheckCircle2,
  Layout
} from 'lucide-react';
import { motion } from 'motion/react';

function HomePortal() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans antialiased text-slate-200 relative overflow-x-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <QrCode size={24} />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">MenuQR</span>
            <span className="text-[10px] text-emerald-500 block font-bold uppercase tracking-widest leading-none mt-0.5">Indonesia</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
          <button onClick={scrollToFeatures} className="hover:text-white transition-colors cursor-pointer">Features</button>
          <Link to="/admin/login" className="hover:text-white transition-colors">Sign In</Link>
          <Link to="/admin/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
            <Sparkles size={14} />
            <span>#1 Digital Menu Platform for Indonesian Cafés</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6">
            The Smartest Way <br />
            <span className="text-emerald-500 whitespace-nowrap">To Take Orders</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
            QR-based digital menu and ordering system for cafés, restaurants, and food stalls. 
            Boost efficiency, reduce wait times, and delight your customers instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/admin/register" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <button onClick={scrollToFeatures} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all cursor-pointer active:scale-95">
              See How It Works
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-tr from-emerald-600 to-indigo-600 rounded-[3rem] p-2 shadow-2xl">
             <div className="bg-[#0F172A] rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/3] flex items-center justify-center">
                <div className="relative w-1/2 aspect-[9/19] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex justify-center items-end pb-1">
                    <div className="w-12 h-1 bg-slate-700 rounded-full" />
                  </div>
                  <div className="p-4 pt-10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 mb-4" />
                    <div className="h-4 w-3/4 bg-slate-800 rounded-md mb-2" />
                    <div className="h-4 w-1/2 bg-slate-800 rounded-md mb-6" />
                    <div className="space-y-3">
                      <div className="h-20 w-full bg-slate-800/50 rounded-xl" />
                      <div className="h-20 w-full bg-slate-800/50 rounded-xl" />
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/4 bg-emerald-600 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <ChefHat className="text-white" />
                  <span className="text-white text-xs font-black">ORDER RECEIVED!</span>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white mb-4">Everything you need to grow</h2>
          <p className="text-slate-400 max-w-2xl mx-auto italic font-medium">Built for the modern dining experience, from street food stalls to fine dining.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Smartphone, title: 'QR Code Ordering', desc: 'Customers scan, browse, and order directly from their smartphones. No app required.' },
            { icon: ChefHat, title: 'Kitchen Display (KDS)', desc: 'Real-time order management for your kitchen staff. No more lost paper tickets.' },
            { icon: ClipboardList, title: 'Easy Menu Management', desc: 'Update prices, photos, and availability instantly from your admin dashboard.' },
            { icon: Activity, title: 'Order Tracking', desc: 'Monitor the status of every table and every order from a single central view.' },
            { icon: Printer, title: 'Print Receipts', desc: 'Professional thermal receipt generation for customer checkout and kitchen labels.' },
            { icon: Monitor, title: 'Works on Any Device', desc: 'Manage your restaurant from your laptop, tablet, or mobile phone anywhere.' },
          ].map((f, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl hover:border-emerald-500/30 transition-all hover:translate-y-[-4px] group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-16">Get Started in 3 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '1', title: 'Setup Your Menu', desc: 'Register your venue and upload your menu items with photos and descriptions.' },
              { num: '2', title: 'Print QR Codes', desc: 'Generate and print professional QR cards for every table in your restaurant.' },
              { num: '3', title: 'Go Live!', desc: 'Customers scan the code and start ordering instantly. Service begins!' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white text-2xl font-black flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20">
                  {s.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-12 rounded-[3rem] max-w-2xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-black rotate-12 uppercase tracking-widest">Limited Offer</div>
          <h2 className="text-4xl font-black text-white mb-2">Beta Access</h2>
          <p className="text-emerald-500 text-2xl font-black mb-8">Free During Beta</p>
          <ul className="space-y-4 text-left max-w-xs mx-auto mb-10">
            {['Unlimited Menu Items', 'Real-Time KDS Access', 'Unlimited QR Generators', 'Sales Reports & Analytics'].map((li, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                <CheckCircle2 className="text-emerald-500" size={18} />
                {li}
              </li>
            ))}
          </ul>
          <Link to="/admin/register" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 grayscale opacity-50">
          <QrCode className="text-white" size={24} />
          <span className="text-lg font-black text-white tracking-tight">MenuQR</span>
        </div>
        <p className="text-slate-500 text-xs font-medium mb-6">The modern operating system for the Indonesian food industry.</p>
        <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">© 2026 MenuQR Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePortal />} />
          <Route path="/menu/:venueId/:tableId" element={<CustomerMenu />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/kitchen" element={<AdminKitchen />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/tables" element={<AdminTables />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}