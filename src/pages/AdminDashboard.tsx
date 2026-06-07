import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Order, OrderStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTablesCount, setActiveTablesCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.venueId) return;

    const fetchData = async () => {
      setLoading(true);
      // Fetch tables count
      const { count } = await supabase
        .from('tables')
        .select('*', { count: 'exact', head: true })
        .eq('venue_id', user.venueId);
      setActiveTablesCount(count || 0);

      // Fetch orders with items
      const { data } = await supabase
        .from('orders')
        .select('*, table:tables(table_number), items:order_items(*, menu_item:menu_items(name))')
        .eq('venue_id', user.venueId)
        .order('created_at', { ascending: false });

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
        if (mappedOrders.length > 0 && !selectedOrderId) setSelectedOrderId(mappedOrders[0].id);
      }
      setLoading(false);
    };

    fetchData();

    // Set up Realtime subscription for incoming orders
    const channel = supabase
      .channel('dashboard-orders')
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

  // Calculate high level metrics
  const stats = {
    grossSales: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0),
    activeTables: activeTablesCount,
    pendingCount: orders.filter(o => o.status === 'pending').length,
    preparingCount: orders.filter(o => o.status === 'preparing').length,
  };

  // Modify order status dynamically in memory
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) return alert('Failed to update status');

    setOrders(prev => 
      prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord)
    );
  };

  const filteredOrders = orders.filter(ord => {
    if (activeFilter === 'all') return true;
    return ord.status === activeFilter;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Status color pill helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">● Pending</span>;
      case 'preparing':
        return <span className="bg-sky-500/10 text-sky-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">● Preparing</span>;
      case 'completed':
        return <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">● Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">● Cancelled</span>;
    }
  };

  // Human date display helper
  const formatTime = (isoString: string) => {
    const timeValue = new Date(isoString);
    return timeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout 
      title="Incoming Orders Console" 
      subtitle="Monitor live guest kitchen orders and manage ticket workflows in real-time."
    >
      
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div id="stat-sales" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Today's Sales</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">${stats.grossSales.toFixed(2)}</span>
            <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% from lunch ticket average
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <div id="stat-tables" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Connected Tables</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.activeTables} Areas</span>
            <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">Self-order enabled via QR</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
        </div>

        <div id="stat-pending" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pending Queue</span>
            <span className={`text-2xl font-black mt-1 block ${stats.pendingCount > 0 ? 'text-amber-500' : 'text-slate-900'}`}>
              {stats.pendingCount} Tickets
            </span>
            <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">Needs immediate acceptance</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
        </div>

        <div id="stat-preparing" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">In Production</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.preparingCount} Kitchen</span>
            <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">Being prepared by culinary</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <UtensilsCrossed className="w-5 h-5 text-sky-500" />
          </div>
        </div>

      </div>

      {/* 2. Management Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ticket List side */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Status Buttons row */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {(['all', 'pending', 'preparing', 'completed', 'cancelled'] as const).map(filter => (
              <button
                key={filter}
                id={`filter-btn-${filter}`}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                  activeFilter === filter 
                    ? 'bg-white text-slate-950 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Ticket Listing */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <PackageCheck className="w-12 h-12 stroke-1 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">No tickets in this section today</p>
                <p className="text-xs text-slate-400 mt-1">Order submissions from customer tables will trigger notification streams instantly.</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const isSelected = order.id === selectedOrderId;
                return (
                  <motion.div
                    layout
                    key={order.id}
                    id={`order-row-${order.id}`}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all flex gap-4 ${
                      isSelected 
                        ? 'border-indigo-500 ring-1 ring-indigo-500/20 bg-indigo-50/5' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-extrabold text-slate-700 flex-shrink-0">
                      T{order.tableId.replace(/\D/g, '') || order.tableId}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-bold text-slate-950 block text-sm">
                            Order {order.id.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-medium">
                            Placed at {formatTime(order.createdAt)} • {order.items.reduce((sum, i) => sum + i.quantity, 0)} Items
                          </span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Snippet of food items */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                        {order.items.map(i => `${i.quantity}x ${i.menuItemName}`).join(', ')}
                      </p>

                      {order.notes && (
                        <div className="mt-2 bg-slate-50 border border-slate-100 rounded-md p-2 text-[11px] text-slate-500 font-medium truncate">
                          💡 Notes: {order.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-slate-400">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Order Detailed side panel widget */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                id="order-detail-panel"
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-8 space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-start pb-2">
                    <h3 className="font-extrabold text-slate-900 text-base">Selected Ticket Details</h3>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-1">
                    <span>Ticket ID: <strong className="text-slate-700 font-mono">{selectedOrder.id.toUpperCase()}</strong></span>
                    <span>Received: {formatTime(selectedOrder.createdAt)}</span>
                  </div>
                </div>

                {/* Destination area */}
                <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-xs border border-slate-100">
                  <span className="font-semibold text-slate-500">Service Destination:</span>
                  <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    Table {selectedOrder.tableId.replace(/\D/g, '') || selectedOrder.tableId}
                  </span>
                </div>

                {/* Items Bills listing */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ordered Foods</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs pb-2 border-b border-slate-50">
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-slate-900">{item.quantity}x</span>{' '}
                          <span className="font-semibold text-slate-700">{item.menuItemName}</span>
                          {item.notes && (
                            <span className="block text-[11px] text-slate-400 italic font-medium">
                              Note: "{item.notes}"
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-700 whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes if any */}
                {selectedOrder.notes && (
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase block flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Dining Notes
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      "{selectedOrder.notes}"
                    </p>
                  </div>
                )}

                {/* Bill Sum */}
                <div className="border-t border-slate-100 pt-4 text-xs space-y-1.5 font-medium text-slate-500">
                  <div className="flex justify-between">
                    <span>Menu Price (Subtotal)</span>
                    <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kitchen Tax & Service (8%)</span>
                    <span>${(selectedOrder.totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 border-t border-slate-100 pt-2 text-sm">
                    <span>Total Bill</span>
                    <span>${(selectedOrder.totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions workflows */}
                <div className="space-y-2 pt-2">
                  {selectedOrder.status === 'pending' && (
                    <button
                      id="btn-action-start-cooking"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Accept Ticket & Start Cooking</span>
                    </button>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <button
                      id="btn-action-complete"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      <span>Ready for Table Delivery</span>
                    </button>
                  )}

                  {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                    <button
                      id="btn-action-cancel"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      className="w-full text-rose-500 hover:bg-rose-50 border border-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Decline & Cancel Ticket
                    </button>
                  )}

                  {(selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled') && (
                    <div className="text-center text-[11px] text-slate-400 p-2 border border-slate-100 rounded-lg bg-slate-50 font-medium">
                      Ticket status modified successfully. Live databases will sync records instantly.
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Select an entry in the incoming tickets list to inspect details.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </AdminLayout>
  );
}
