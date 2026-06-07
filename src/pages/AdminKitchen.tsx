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
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminKitchen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.venueId) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, table:tables(table_number), items:order_items(*, menu_item:menu_items(name))')
      .eq('venue_id', user.venueId)
      .in('status', ['pending', 'preparing', 'ready'])
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
    const minutes = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 60000);
    return `${minutes}m ago`;
  };

  const OrderCard = ({ order, nextStatus, nextLabel, icon: Icon, buttonColor }: any) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl border-4 border-slate-200 p-6 shadow-lg flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-2xl font-black">
          T{order.tableId.replace(/\D/g, '') || order.tableId}
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-400 block uppercase">Time</span>
          <span className="text-lg font-black text-slate-700">{formatTimeAgo(order.createdAt)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex items-start gap-4 border-b border-slate-100 pb-3">
            <span className="text-3xl font-black text-indigo-600">{item.quantity}x</span>
            <div className="flex-1">
              <span className="text-2xl font-bold text-slate-900 leading-tight block">{item.menuItemName}</span>
            </div>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="bg-amber-50 border-2 border-amber-100 rounded-xl p-4 text-amber-900">
          <p className="text-xs font-black uppercase tracking-wider mb-1">Kitchen Notes:</p>
          <p className="text-xl font-bold italic">"{order.notes}"</p>
        </div>
      )}

      <button
        onClick={() => updateStatus(order.id, nextStatus)}
        className={`w-full ${buttonColor} text-white font-black py-6 rounded-2xl text-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl cursor-pointer`}
      >
        <Icon size={32} />
        {nextLabel}
      </button>
    </motion.div>
  );

  return (
    <AdminLayout 
      title="Kitchen Display" 
      subtitle="Live order stream for the production team. Optimized for monitors."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* New Orders */}
        <div className="bg-slate-100/50 rounded-3xl p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase text-amber-500">
            <Clock size={32} /> New Orders ({orders.filter(o => o.status === 'pending').length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none">
            {orders.filter(o => o.status === 'pending').map(order => (
              <OrderCard key={order.id} order={order} nextStatus="preparing" nextLabel="ACCEPT" icon={ChefHat} buttonColor="bg-amber-500" />
            ))}
          </div>
        </div>

        {/* Preparing */}
        <div className="bg-slate-100/50 rounded-3xl p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase text-sky-500">
            <UtensilsCrossed size={32} /> Preparing ({orders.filter(o => o.status === 'preparing').length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none">
            {orders.filter(o => o.status === 'preparing').map(order => (
              <OrderCard key={order.id} order={order} nextStatus="ready" nextLabel="READY" icon={ArrowRight} buttonColor="bg-sky-500" />
            ))}
          </div>
        </div>

        {/* Ready */}
        <div className="bg-slate-100/50 rounded-3xl p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase text-emerald-500">
            <CheckCircle2 size={32} /> Ready to Serve ({orders.filter(o => o.status === 'ready').length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none">
            {orders.filter(o => o.status === 'ready').map(order => (
              <OrderCard key={order.id} order={order} nextStatus="completed" nextLabel="SERVED" icon={Check} buttonColor="bg-emerald-500" />
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}