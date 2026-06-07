import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  Utensils, 
  QrCode, 
  LogOut, 
  Menu, 
  X, 
  ArrowUpRight,
  ExternalLink,
  ChefHat
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [venueLogo, setVenueLogo] = useState<string | null>(null);
  
  const venueDisplayName = user?.venueName || 'MenuQR Admin';

  useEffect(() => {
    if (!user?.venueId) return;
    const getLogo = async () => {
      const { data } = await supabase.from('venues').select('logo_url').eq('id', user.venueId).single();
      if (data?.logo_url) setVenueLogo(data.logo_url);
    };
    getLogo();
  }, [user?.venueId]);

  // Nav configuration
  const menuItems = [
    {
      name: 'Incoming Orders',
      path: '/admin/dashboard',
      icon: ClipboardList,
      badge: '2 New'
    },
    {
      name: 'Kitchen',
      path: '/admin/kitchen',
      icon: ChefHat,
    },
    {
      name: 'Menu Manager',
      path: '/admin/menu',
      icon: Utensils,
    },
    {
      name: 'Tables & QR Codes',
      path: '/admin/tables',
      icon: QrCode,
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (e) {
      console.error(e);
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      
      {/* Desktop Sidebar (Sidebar element stays fixed) */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white text-slate-600 border-r border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm tracking-tighter">
              QR
            </span>
            <div>
              <span className="text-slate-800 font-bold text-sm block">MenuQR Admin</span>
              <span className="text-[10px] text-slate-400 block">SaaS Dashboard</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
        </div>

        {/* Current Active Venue Stripe */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 min-h-16 flex items-center">
          <div className="flex items-center gap-3 min-w-0">
            {venueLogo ? (
              <img 
                src={venueLogo} 
                alt={venueDisplayName} 
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">QR</div>
            )}
            <div className="min-w-0">
              <span className="text-slate-800 text-xs font-bold block truncate">{venueDisplayName}</span>
              <span className="text-[10px] text-slate-400 block truncate">Primary Merchant</span>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                id={`sidebar-link-${item.path.split('/').pop()}`}
                className={`flex items-center justify-between p-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-3xs' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 border-t border-slate-100 mt-6">
            {user?.venueId && (
              <Link
                to={`/menu/${user.venueId}/t1`}
                target="_blank"
                className="flex items-center justify-between p-3 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span>Test Customer Page</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </nav>

        {/* Footer Admin controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Client Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Menu bar */}
        <header className="md:hidden bg-white text-slate-800 border-b border-slate-200 p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
              QR
            </span>
            <span className="font-extrabold text-sm tracking-tight text-slate-800">MenuQR Admin</span>
          </div>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-500 hover:text-slate-850"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile menu sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white text-slate-600 border-b border-slate-200 p-4 space-y-2 shadow-xs">
            <div className="px-2 py-3 bg-slate-50 rounded-lg flex items-center gap-3 mb-2 min-h-13">
              {venueLogo ? (
                <img 
                  src={venueLogo} 
                  alt={venueDisplayName} 
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">QR</div>
              )}
              <span className="text-slate-800 text-xs font-bold truncate">{venueDisplayName}</span>
            </div>

            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  id={`mobile-nav-${item.path.split('/').pop()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-lg text-xs font-bold ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[9px] font-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 mt-2">
              {user?.venueId && (
                <Link
                  to={`/menu/${user.venueId}/t1`}
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-xs text-slate-500 hover:bg-slate-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Test Customer Page</span>
                </Link>
              )}
              
              <button
                id="mobile-logout-btn"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-xs text-rose-500 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Viewport Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-6 gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
              </div>

              <div className="bg-white border border-slate-200 shadow-3xs px-4 py-2 rounded-xl flex items-center gap-3 self-start text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-slate-600">Live Supabase Connection</span>
              </div>
            </div>

            {/* Page specific slot */}
            {children}

          </div>
        </main>

      </div>
    </div>
  );
}
