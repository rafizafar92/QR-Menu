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
  Search,
  Plus,
  Eye,
  Trash2,
  X,
  Filter,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SuperAdminDashboard() {
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [platformRevenue, setPlatformRevenue] = useState(0);
  const [selectedVenueDetails, setSelectedVenueDetails] = useState<any>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '', logo_url: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<{ id: string; name: string } | null>(null);
  const [venueToToggle, setVenueToToggle] = useState<any>(null);
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string } | null>(null);

  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const fetchVenues = async () => {
    console.log('DEBUG: fetchVenues initiated');
    setLoading(true);
    const { data: vData, error: vError } = await supabase.rpc('get_venues_with_owners');
    const { data: rData, error: rError } = await supabase.rpc('get_platform_revenue');
    
    if (vError) {
      console.error("Supabase RPC Error: get_venues_with_owners failed", vError);
    }
    if (rError) {
      console.error("Supabase RPC Error: get_platform_revenue failed", rError);
    }
    
    if (vData) setVenues(vData as any[]); // Cast to any[] as RPC return type is generic
    if (rData) setPlatformRevenue(rData as number); // Cast to number
    console.log('DEBUG: fetchVenues completed, state updated with', vData?.length, 'venues');
    setLoading(false);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const confirmToggleActive = async () => {
    if (!venueToToggle) return;
    const { error } = await supabase.from('venues').update({ is_active: !venueToToggle.is_active }).eq('id', venueToToggle.id);
    if (error) {
      setAlertConfig({ title: 'System Error', message: `Gagal memperbarui status: ${error.message}` });
    } else {
      fetchVenues();
    }
    setVenueToToggle(null);
  };

  const changePlan = async (id: string, plan: string) => {
    console.log('DEBUG: changePlan function executed', { venueId: id, newPlan: plan });
    const { error } = await supabase.from('venues').update({ subscription_plan: plan }).eq('id', id);
    if (error) console.error('changePlan error:', error);
    fetchVenues();
  };

  const updateTrialDate = async (id: string, newDate: string) => {
    await supabase.from('venues').update({ trial_ends_at: new Date(newDate).toISOString() }).eq('id', id);
    fetchVenues();
  };

  const updateVenueNotes = async (id: string, notes: string) => {
    await supabase.from('venues').update({ notes }).eq('id', id);
  };

  const deleteVenue = (id: string, name: string) => {
  setVenueToDelete({ id, name });
};

const confirmDelete = async () => {
  if (!venueToDelete) return;
  const { error } = await supabase.from('venues').delete().eq('id', venueToDelete.id);
  if (error) {
    setAlertConfig({ title: 'Delete Error', message: `Error deleting venue: ${error.message}` });
  } else {
    fetchVenues();
  }
  setVenueToDelete(null);
};

  const viewDetails = async (venue: any) => {
    setIsDetailsLoading(true);
    setSelectedVenueDetails({ ...venue, stats: null });
    setEditData({ 
      name: venue.name, 
      description: venue.description || '', 
      logo_url: venue.logo_url || '' 
    });
    
    const { data, error } = await supabase.rpc('get_superadmin_venue_details', { v_id: venue.id });
    
    if (!error && data) {
      setSelectedVenueDetails((prev: any) => ({ ...prev, stats: data }));
    }
    setIsDetailsLoading(false);
  };

  const handleSaveVenue = async () => {
    if (!selectedVenueDetails) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('venues')
      .update(editData)
      .eq('id', selectedVenueDetails.id);
    
    if (error) {
      setAlertConfig({ title: 'Save Error', message: `Error saving venue: ${error.message}` });
    } else {
      setSaveSuccess(true);
      fetchVenues();
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setIsSaving(false);
  };

  const stats = useMemo(() => {
    return {
      total: venues.length,
      trials: venues.filter(v => v.subscription_status === 'trial').length,
      paid: venues.filter(v => v.subscription_status === 'paid').length,
      suspended: venues.filter(v => v.is_active === false).length
    };
  }, [venues]);

  const filteredVenues = useMemo(() => {
    return venues.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                            (v.owner_email && v.owner_email.toLowerCase().includes(search.toLowerCase()));
      
      const matchesFilter = 
        statusFilter === 'All' ||
        (statusFilter === 'Active' && v.is_active !== false) ||
        (statusFilter === 'Suspended' && v.is_active === false) ||
        (statusFilter === 'Trial' && v.subscription_status === 'trial') ||
        (statusFilter === 'Paid' && v.subscription_status === 'paid');

      return matchesSearch && matchesFilter;
    });
  }, [venues, search, statusFilter]);

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Venues', value: stats.total, icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Active Trials', value: stats.trials, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Paid Customers', value: stats.paid, icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Suspended', value: stats.suspended, icon: AlertOctagon, color: 'text-rose-400', bg: 'bg-rose-500/10' },
            { label: 'Total Revenue', value: formatPrice(platformRevenue || 0), icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((kpi, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-5 rounded-[1.5rem] flex justify-between items-center shadow-xl transition-transform hover:scale-[1.02]">
              <div className="min-w-0">
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
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Trial">Trial Only</option>
                  <option value="Paid">Paid Only</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Venue & Owner</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Trial Ends</th>
                  <th className="px-6 py-4">Internal Notes</th>
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
                        onClick={() => setVenueToToggle(venue)}
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
                      <input 
                        type="date"
                        defaultValue={venue.trial_ends_at ? venue.trial_ends_at.split('T')[0] : ''}
                        onChange={(e) => updateTrialDate(venue.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-[10px] text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea 
                        defaultValue={venue.notes || ''}
                        onBlur={(e) => updateVenueNotes(venue.id, e.target.value)}
                        placeholder="Add private note..."
                        className="bg-slate-950/50 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500 w-full h-10 resize-none scrollbar-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => viewDetails(venue)}
                          className="p-2 text-slate-500 hover:text-white transition-colors"
                        title="Venue Control Center"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => deleteVenue(venue.id, venue.name)}
                          className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                          title="Delete Venue"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

      {/* Details Modal */}
      <AnimatePresence>
        {selectedVenueDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Venue Control</h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedVenueDetails.owner_email}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedVenueDetails(null)}
                    className="p-2 text-slate-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                {isDetailsLoading ? (
                  <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                    Fetching Venue Intelligence...
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Venue Name</label>
                        <input 
                          type="text" 
                          value={editData.name} 
                          onChange={e => setEditData({...editData, name: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Description / Location</label>
                        <input 
                          type="text" 
                          value={editData.description} 
                          onChange={e => setEditData({...editData, description: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={isSaving}
                        onClick={handleSaveVenue}
                        className={`flex-1 font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg active:scale-95 ${
                          saveSuccess 
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                        }`}
                      >
                        {isSaving ? 'Updating...' : saveSuccess ? 'Changes Saved!' : 'Save Changes'}
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Venue Intelligence</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Menu Items</span>
                          <span className="text-xl font-black text-white">{selectedVenueDetails.stats?.menu_count}</span>
                        </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Tables</span>
                        <span className="text-xl font-black text-white">{selectedVenueDetails.stats?.table_count}</span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Total Orders</span>
                        <span className="text-xl font-black text-white">{selectedVenueDetails.stats?.order_count}</span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Last Activity</span>
                        <span className="text-xs font-bold text-white">
                          {selectedVenueDetails.stats?.last_order ? new Date(selectedVenueDetails.stats.last_order).toLocaleString() : 'No activity'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      <span>Venue ID: {selectedVenueDetails.id.slice(0, 18)}...</span>
                      <button 
                        onClick={() => setSelectedVenueDetails(null)}
                        className="bg-slate-800 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {venueToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertOctagon size={32} />
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Hapus Venue?</h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Hapus venue <span className="text-white font-bold">"{venueToDelete.name}"</span>? 
                Seluruh data menu, meja, dan pesanan akan ikut terhapus selamanya. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setVenueToDelete(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Status Toggle Modal */}
      <AnimatePresence>
        {venueToToggle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                venueToToggle.is_active !== false ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {venueToToggle.is_active !== false ? <AlertOctagon size={32} /> : <Zap size={32} />}
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">
                {venueToToggle.is_active !== false ? 'Suspend Venue?' : 'Aktifkan Venue?'}
              </h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                {venueToToggle.is_active !== false 
                  ? `Suspend akses untuk "${venueToToggle.name}"? Venue ini tidak akan bisa menerima pesanan.` 
                  : `Aktifkan kembali "${venueToToggle.name}"?`}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setVenueToToggle(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmToggleActive}
                  className={`flex-1 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg ${
                    venueToToggle.is_active !== false 
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' 
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  }`}
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Alert Modal */}
      <AnimatePresence>
        {alertConfig && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[70] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">{alertConfig.title}</h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">{alertConfig.message}</p>
              <button 
                onClick={() => setAlertConfig(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}