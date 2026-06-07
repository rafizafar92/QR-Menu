import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Order } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  ChefHat,
  ArrowRight,
  Check,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminKitchen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    if (!user?.venueId) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, table:tables(table_number), items:order_items(*, menu_item:menu_items(name))')
      .eq('venue_id', user.venueId)
      .in('status', ['confirmed', 'preparing', 'ready'])
      .order('created_at', { ascending: true });

    if (data) {
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id,
        venueId: o.venue_id,
        tableId: o.table?.table_number || 'Walk-in',
        status: o.status,
        totalPrice: o.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
        notes: o.note || '',
        createdAt: o.created_at,
        items: o.items.map((i: any) => ({
          id: i.id,
          orderId: i.order_id,
          menuItemId: i.menu_item_id,
          quantity: i.quantity,
          menuItemName: i.menu_item?.name || 'Unknown Item',
          price: i.price,
          notes: ''
        }))
      }));
      setOrders(mappedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.venueId) return;

    fetchData();

    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `venue_id=eq.${user.venueId}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.venueId]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Failed to update status');
      return;
    }
    
    fetchData();
  };

  const formatTimeAgo = (isoString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    return `${diff} min ago`;
  };

  const OrderCard = ({ order, nextStatus, nextLabel, icon: Icon, accentColor }: any) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-[#1E293B] rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl flex flex-col"
    >
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/50 text-white px-4 py-2 rounded-2xl text-xl font-black border border-slate-700">
            {order.tableId.includes('Table') ? order.tableId : `Table ${order.tableId}`}
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-tighter">Wait Time</span>
            <span className={`text-sm font-black ${parseInt(formatTimeAgo(order.createdAt)) > 15 ? 'text-rose-500' : 'text-slate-300'}`}>
              {formatTimeAgo(order.createdAt)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="text-3xl font-black text-white bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700">
                {item.quantity}
              </span>
              <div className="flex-1 pt-1">
                <span className="text-2xl font-bold text-slate-100 leading-tight block">{item.menuItemName}</span>
              </div>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-200">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Kitchen Note</p>
            <p className="text-lg font-bold italic">"{order.notes}"</p>
          </div>
        )}
      </div>

      <button
        onClick={() => updateStatus(order.id, nextStatus)}
        className={`w-full ${accentColor} text-white font-black py-6 text-2xl flex items-center justify-center gap-3 transition-all active:scale-95 hover:brightness-110 cursor-pointer`}
      >
        <Icon size={28} />
        {nextLabel}
      </button>
    </motion.div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
      <Inbox size={64} strokeWidth={1} />
      <p className="text-lg font-bold uppercase tracking-widest">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] p-6 lg:p-8 flex flex-col gap-8">
      {/* KDS Custom Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <ChefHat size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">KITCHEN DISPLAY</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Live System Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] px-8 py-4 rounded-3xl border border-slate-800 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Station Time</span>
          <span className="text-3xl font-black text-white font-mono">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        
        {/* New Orders */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <h2 className="text-2xl font-black flex items-center justify-between uppercase text-orange-500 px-2">
            <span className="flex items-center gap-3"><Clock size={28} /> New Orders</span>
            <span className="bg-orange-500/10 px-3 py-1 rounded-full text-sm">{orders.filter(o => o.status === 'confirmed').length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none pb-12">
            {orders.filter(o => o.status === 'confirmed').length > 0 ? (
              orders.filter(o => o.status === 'confirmed').map(order => (
                <OrderCard key={order.id} order={order} nextStatus="preparing" nextLabel="ACCEPT" icon={ChefHat} accentColor="bg-orange-600" />
              ))
            ) : (
              <EmptyState message="No New Tickets" />
            )}
          </div>
        </div>

        {/* Preparing */}
        <div className="flex flex-col gap-6 overflow-hidden border-x border-slate-800/50 px-4">
          <h2 className="text-2xl font-black flex items-center justify-between uppercase text-blue-500 px-2">
            <span className="flex items-center gap-3"><UtensilsCrossed size={28} /> Preparing</span>
            <span className="bg-blue-500/10 px-3 py-1 rounded-full text-sm">{orders.filter(o => o.status === 'preparing').length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none pb-12">
            {orders.filter(o => o.status === 'preparing').length > 0 ? (
              orders.filter(o => o.status === 'preparing').map(order => (
                <OrderCard key={order.id} order={order} nextStatus="ready" nextLabel="READY" icon={ArrowRight} accentColor="bg-blue-600" />
              ))
            ) : (
              <EmptyState message="Clean Rail" />
            )}
          </div>
        </div>

        {/* Ready */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <h2 className="text-2xl font-black flex items-center justify-between uppercase text-emerald-500 px-2">
            <span className="flex items-center gap-3"><CheckCircle2 size={28} /> Ready to Serve</span>
            <span className="bg-emerald-500/10 px-3 py-1 rounded-full text-sm">{orders.filter(o => o.status === 'ready').length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none pb-12">
            {orders.filter(o => o.status === 'ready').length > 0 ? (
              orders.filter(o => o.status === 'ready').map(order => (
                <OrderCard key={order.id} order={order} nextStatus="completed" nextLabel="SERVED" icon={Check} accentColor="bg-emerald-600" />
              ))
            ) : (
              <EmptyState message="Nothing Ready" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}