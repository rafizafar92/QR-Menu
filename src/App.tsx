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
  Layout,
  MessageCircle,
  Zap,
  Users,
  Wallet,
  ArrowDown,
  BadgeCheck,
  Coffee
} from 'lucide-react';
import { motion } from 'motion/react';

function HomePortal() {
  const scrollToDemo = () => {
    document.getElementById('demo-request')?.scrollIntoView({ behavior: 'smooth' });
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
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">How It Works</button>
          <button onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">Product</button>
          <Link to="/admin/login" className="hover:text-white transition-colors">Sign In</Link>
          <button onClick={scrollToDemo} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer">
            Book Free Demo
          </button>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
              <Sparkles size={14} />
              <span>#1 Contactless Ordering for Modern Restaurants</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
              Customers Scan, Order, <br />
              <span className="text-emerald-500">and Pay Faster</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              Boost table turnover and eliminate order mistakes with our all-in-one QR Menu, 
              Kitchen Display, and Cashier Dashboard. <strong>No app download required.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToDemo} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/20 active:scale-95 cursor-pointer">
                Book Free Demo
                <ArrowRight size={20} />
              </button>
              <a href="https://wa.me/yournumber" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95">
                <MessageCircle size={20} className="text-emerald-500" />
                Chat with Sales
              </a>
            </div>
          </motion.div>
        </div>

        {/* Visual Flow / Product Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-slate-900/50 rounded-[3rem] p-8 border border-white/5 shadow-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Customer Interface */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 aspect-[9/19] bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-xl overflow-hidden">
                <div className="p-2 space-y-2">
                  <div className="h-2 w-8 bg-emerald-500 rounded-full" />
                  <div className="h-10 w-full bg-slate-800 rounded-md" />
                  <div className="h-10 w-full bg-slate-800 rounded-md" />
                </div>
                <div className="absolute bottom-2 inset-x-2 h-6 bg-emerald-600 rounded-md flex items-center justify-center text-[8px] font-bold">Order Now</div>
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-white block">1. Customer Scans</span>
                <span className="text-[10px] text-slate-500">Self-ordering menu</span>
              </div>
            </div>

            <div className="hidden md:flex justify-center text-emerald-500/30"><ArrowRight size={32} /></div>

            {/* KDS Interface */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-video bg-slate-900 rounded-xl border-4 border-slate-800 shadow-xl p-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-12 bg-orange-500/20 border border-orange-500/30 rounded-md" />
                  <div className="h-12 bg-blue-500/20 border border-blue-500/30 rounded-md" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-white block">2. Kitchen Receives</span>
                <span className="text-[10px] text-slate-500">Real-time display</span>
              </div>
            </div>

            <div className="hidden md:flex justify-center text-emerald-500/30"><ArrowRight size={32} /></div>

            {/* Cashier/Admin */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-video bg-slate-900 rounded-xl border-4 border-slate-800 shadow-xl p-2">
                <div className="flex gap-2">
                  <div className="w-1/3 h-12 bg-slate-800 rounded-md" />
                  <div className="flex-1 h-12 bg-slate-800 rounded-md" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-white block">3. Cashier Processes</span>
                <span className="text-[10px] text-slate-500">Quick checkout</span>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <BadgeCheck className="text-emerald-600" />
            <span className="text-sm font-black uppercase tracking-tight">Increases table turnover by up to 35%</span>
          </div>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <div className="bg-slate-900 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8">
          {[
            { icon: Smartphone, text: 'No App Download Required' },
            { icon: Zap, text: 'Setup in 24 Hours' },
            { icon: QrCode, text: 'Unlimited QR Tables' },
            { icon: Users, text: 'Works on Any Smartphone' },
            { icon: Activity, text: 'Real-Time Kitchen Orders' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <item.icon size={18} className="text-emerald-500" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 italic uppercase">Seamless Digital Workflow</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium">From the moment they sit down to the final payment.</p>
        </div>
        
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {[
              { icon: QrCode, title: 'Scan QR', desc: 'Customer scans the custom table QR code.' },
              { icon: Utensils, title: 'Browse Menu', desc: 'Interactive menu with photos and descriptions.' },
              { icon: ShoppingBag, title: 'Place Order', desc: 'Order sent instantly without waiting for staff.' },
              { icon: ChefHat, title: 'Kitchen Prep', desc: 'KDS notifies chefs exactly what to cook.' },
              { icon: Wallet, title: 'Easy Payment', desc: 'Process payment at the cashier in seconds.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-500 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">
                  <step.icon size={32} />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{i+1}. {step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Showcase Sections */}
      <section id="product" className="py-24 space-y-32">
        {/* Customer Experience */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative flex justify-center">
            <div className="w-64 aspect-[9/19] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=800&fit=crop" className="w-full h-full object-cover opacity-80" alt="Customer Menu UI" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-10 inset-x-6 space-y-3">
                <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                <div className="h-12 w-full bg-emerald-600 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-black text-white mb-6">Frictionless Ordering for Guests</h2>
            <ul className="space-y-6">
              {[
                { title: 'Reduce Wait Times', desc: 'Guests order as soon as they sit down. No more waving at waiters.' },
                { title: 'Stunning Visual Menus', desc: 'Upsell items with high-quality photos that make customers hungry.' },
                { title: 'Easy Customization', desc: 'Guests can add notes (e.g., "No onions") directly to their order.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={14} /></div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kitchen KDS */}
        <div className="bg-slate-900/50 py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-white mb-6">Eliminate Lost Tickets & Confusion</h2>
              <ul className="space-y-6">
                {[
                  { title: 'Orders Reach Kitchen Instantly', desc: 'No more walking back and forth. Tickets appear on screen immediately.' },
                  { title: 'Color-Coded Urgency', desc: 'Track wait times visually. Alerts flash when orders are running late.' },
                  { title: 'Digital Organization', desc: 'Organize orders by status: New, Preparing, and Ready to Serve.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={14} /></div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-slate-800 rounded-3xl p-3 border border-slate-700 shadow-3xl">
                <div className="bg-[#0F172A] rounded-2xl aspect-video p-4 flex gap-4 overflow-hidden">
                  <div className="w-1/3 h-full bg-orange-500/10 border border-orange-500/20 rounded-xl" />
                  <div className="w-1/3 h-full bg-blue-500/10 border border-blue-500/20 rounded-xl" />
                  <div className="w-1/3 h-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin/Management */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="bg-slate-800 rounded-3xl p-3 border border-slate-700 shadow-3xl">
              <div className="bg-[#0F172A] rounded-2xl aspect-video p-6 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="h-20 flex-1 bg-slate-900 border border-white/5 rounded-xl" />
                  <div className="h-20 flex-1 bg-slate-900 border border-white/5 rounded-xl" />
                </div>
                <div className="h-32 w-full bg-slate-900 border border-white/5 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-black text-white mb-6">Manage Your Business in Seconds</h2>
            <ul className="space-y-6">
              {[
                { title: 'Update Prices Instantly', desc: 'Inflation changed your costs? Update your entire menu across all tables in 2 seconds.' },
                { title: 'Mark Items "Out of Stock"', desc: 'Ran out of croissants? Hide them from guests instantly to prevent disappointment.' },
                { title: 'Track Real-Time Sales', desc: 'See which items are your best sellers and track revenue live from your phone.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={14} /></div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Business Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 py-4">
            <h2 className="text-4xl font-black text-white mb-4 italic uppercase">Why Switch to MenuQR?</h2>
            <p className="text-slate-400 font-medium">Tangible business outcomes for smart restaurant owners.</p>
            <div className="mt-8">
              <button onClick={scrollToDemo} className="flex items-center gap-2 text-emerald-500 font-bold hover:gap-4 transition-all">
                See All Benefits <ArrowRight size={20} />
              </button>
            </div>
          </div>
          {[
            { icon: Zap, label: 'Faster Service', value: '+35%', desc: 'Increase in table turnover rate during peak hours.' },
            { icon: AlertTriangle, label: 'Fewer Mistakes', value: '-90%', desc: 'Reduction in order entry errors and food waste.' },
            { icon: Printer, label: 'Save Money', value: '$200+', desc: 'Saved per month on printing physical menus.' },
            { icon: Coffee, label: 'Happy Guests', value: '4.8/5', desc: 'Average customer rating for QR ordering experience.' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <stat.icon size={20} />
                </div>
                <span className="text-2xl font-black text-white">{stat.value}</span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">{stat.label}</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-12 rounded-[3rem] max-w-2xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-black rotate-12 uppercase tracking-widest">Beta Access</div>
          <h2 className="text-4xl font-black text-white mb-2">Premium Partner</h2>
          <p className="text-emerald-500 text-2xl font-black mb-8">Free During Beta</p>
          
          <div className="text-left max-w-xs mx-auto mb-10 space-y-4">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">What's Included:</p>
            {[
              'Unlimited Menu Items', 
              'Real-Time Kitchen Dashboard', 
              'Cashier / Admin Panel', 
              'Unlimited QR Table Setup',
              'Staff Training Included',
              '24/7 Priority Support'
            ].map((li, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                <CheckCircle2 className="text-emerald-500" size={18} />
                {li}
              </div>
            ))}
          </div>
          
          <button onClick={scrollToDemo} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95 cursor-pointer">
            Reserve Beta Access
          </button>
          <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">No Credit Card Required</p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="demo-request" className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#ffffff22,transparent)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Modernize <br />Your Restaurant?</h2>
            <p className="text-emerald-100 text-lg mb-12 max-w-xl mx-auto font-medium">
              Join hundreds of innovative restaurants who have ditched paper menus for a smarter, faster digital experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/yournumber" className="bg-white text-emerald-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-50 transition-all shadow-xl active:scale-95">
                WhatsApp Us Now
              </a>
              <Link to="/admin/register" className="bg-emerald-900/30 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-900/40 transition-all active:scale-95">
                Book Free Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/yournumber" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all"
      >
        <MessageCircle size={32} />
      </a>

      {/* 6. Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 grayscale opacity-50">
          <QrCode className="text-white" size={24} />
          <span className="text-lg font-black text-white tracking-tight">MenuQR</span>
        </div>
        <p className="text-slate-500 text-xs font-medium mb-6">The modern operating system for the restaurant industry.</p>
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