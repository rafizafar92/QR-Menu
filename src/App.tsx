import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminTables from './pages/AdminTables';
import { AuthProvider } from './lib/auth';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { 
  QrCode, 
  ArrowRight, 
  ExternalLink, 
  Utensils, 
  Settings, 
  ShieldCheck, 
  Smartphone,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

// Landing portal page to easily route developers exploring the applet
function HomePortal() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative abstract elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />

      {/* Top logo */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-emerald-600/10">
            QR
          </span>
          <div>
            <span className="font-black text-white text-base tracking-tight block">MenuQR</span>
            <span className="text-[10px] text-slate-500 block">SaaS Platform</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Complete Sandbox Ready
        </span>
      </div>

      {/* Main hero panel */}
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white line-clamp-2 leading-tight">
            Next-Gen <span className="text-emerald-500">Self-Order</span> Menus <br />
            & Real-Time Kitchen Rails.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            A premium full-stack digital menu SaaS layout scaffolded with React, Tailwind, and Supabase integration hooks, enabling contactless dining instantly.
          </p>

          {/* Core Interactive Portal Selection cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 text-left">
            
            {/* Customer portal */}
            <Link 
              to="/menu/venue_sweet_bite/t1" 
              id="btn-goto-customer"
              className="group bg-slate-950/45 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all shadow-md flex flex-col justify-between space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Customer Dining Menu
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Scan QR code, search dishes, filters gourmet recipes, configure notes, inspect bill, and place mobile tickets instantly.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:underline">
                <span>Browse Customer Menu (Table 1)</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Admin portal */}
            <Link 
              to="/admin/login" 
              id="btn-goto-admin"
              className="group bg-slate-950/45 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all shadow-md flex flex-col justify-between space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Administrator Dashboard
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Manage digital menus, toggle active products inventory, track incoming live kitchen tickets, customize desk QR sign cards.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:underline">
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </motion.div>
      </div>

      {/* Footer bar branding */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 border-t border-slate-800/80 pt-6 gap-3">
        <p className="font-semibold text-center sm:text-left">© 2026 MenuQR Inc. All rights reserved.</p>
        <div className="flex gap-4 font-semibold text-slate-400">
          <Link to="/admin/dashboard" className="hover:text-white transition-colors">Direct Dashboard</Link>
          <span className="text-slate-700">•</span>
          <Link to="/admin/tables" className="hover:text-white transition-colors">Direct QR Codes</Link>
          <span className="text-slate-700">•</span>
          <Link to="/admin/menu" className="hover:text-white transition-colors">Direct Menu Manager</Link>
        </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main developers & visitors gateway */}
          <Route path="/" element={<HomePortal />} />

          {/* Customer Route */}
          <Route path="/menu/:venueId/:tableId" element={<CustomerMenu />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/tables" element={<AdminTables />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
