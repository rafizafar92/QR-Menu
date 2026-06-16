import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase'; // Updated to use owner email logic
import { useAuth } from '../lib/auth';
import { 
  Users, 
  Store, 
  CreditCard, 
  AlertOctagon, 
  ShieldCheck, 
  LogOut,
  Calendar,
  Zap,
  MoreVertical,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SuperAdminDashboard() {
  const { logout } = useAuth();
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVenues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setVenues(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('venues').update({ is_active: !current }).eq('id', id);
    fetchVenues();
  };

  const changePlan = async (id: string, plan: string) => {
    await supabase.from('venues').update({ subscription_plan: plan }).eq('id', id);
    fetchVenues();
  };

  const extendTrial = async (id: string, currentEnd: string) => {
    const newDate = new Date(currentEnd || new Date());
    newDate.setDate(newDate.getDate() + 7);
    await supabase.from('venues').update({ trial_ends_at: newDate.toISOString() }).eq('id', id);
    fetchVenues();
  };

  const stats = useMemo(() => {
    return {
      total: venues.length,
      trials: venues.filter(v => v.subscription_status === 'trial').length,
      paid: venues.filter(v => v.subscription_status === 'paid').length,
      suspended: venues.filter(v => v.is_active === false).length
    };
  }, [venues]);

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      {/* Sidebar/Header Navigation */}
      <header className="bg-slate-900/40 border-b border-slate-800 px-8 py-4 flex justify-between items-center backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF6B35] p-2 rounded-lg text-white shadow-lg shadow-[#FF6B35]/20">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase italic text-white">Platform Owner</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{user?.email}</p>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Platform Owner</p>
          </div>
          <button onClick={logout} className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Venues', value: stats.total, icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Active Trials', value: stats.trials, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Paid Customers', value: stats.paid, icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Suspended', value: stats.suspended, icon: AlertOctagon, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          ].map((kpi, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex justify-between items-center shadow-xl">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-black text-white">{kpi.value}</h3>
              </div>
              <div className={`${kpi.bg} ${kpi.color} p-4 rounded-2xl`}>
                <kpi.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Management Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Users className="text-indigo-500" />
              Management Directory
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search venues..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Venue & Email</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Trial Ends</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-500">Loading venues...</td></tr>
                ) : filteredVenues.map(venue => (
                  <tr key={venue.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{venue.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{venue.owner_email || 'owner@example.id'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={venue.subscription_plan || 'trial'}
                        onChange={(e) => changePlan(venue.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-[10px] font-black uppercase text-indigo-400 px-2.5 py-1.5 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="trial">Trial</option>
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleActive(venue.id, venue.is_active)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border cursor-pointer transition-all ${
                          venue.is_active !== false 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}
                      >
                        {venue.is_active !== false ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {venue.trial_ends_at ? new Date(venue.trial_ends_at).toLocaleDateString() : '-'}
                        </span>
                        <button 
                          onClick={() => extendTrial(venue.id, venue.trial_ends_at)}
                          className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-md hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                          title="Extend Trial +7 Days"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(venue.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-600 hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Hint */}
        <div className="mt-8 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
          <p>Total {venues.length} records processed</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> DB Connection Live</span>
            <span>Ordio Platform Engine v2.4.0</span>
          </div>
        </div>
      </main>
    </div>
  );
}