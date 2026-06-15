import { useState, useEffect, useMemo, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Order } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  PackageCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdminReports() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const reportRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace(/\s/g, ' ');
  };

  const fetchOrders = async () => {
    if (!user?.venueId) return;
    setLoading(true);

    let query = supabase
      .from('orders')
      .select('*, table:tables(table_number), items:order_items(*, menu_item:menu_items(name))')
      .eq('venue_id', user.venueId)
      .in('status', ['confirmed', 'preparing', 'ready', 'completed'])
      .order('created_at', { ascending: false });

    const now = new Date();
    if (filter === 'today') {
      const start = new Date(now.setHours(0,0,0,0)).toISOString();
      query = query.gte('created_at', start);
    } else if (filter === 'week') {
      const start = new Date(now.setDate(now.getDate() - 7)).toISOString();
      query = query.gte('created_at', start);
    } else if (filter === 'month') {
      const start = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      query = query.gte('created_at', start);
    } else if (filter === 'custom' && customRange.start && customRange.end) {
      query = query.gte('created_at', new Date(customRange.start).toISOString())
                   .lte('created_at', new Date(customRange.end).toISOString());
    }

    const { data } = await query;

    if (data) {
      const mapped: Order[] = data.map((o: any) => ({
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
      setOrders(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.venueId, filter, customRange]);

  const stats = useMemo(() => {
    const validStatuses = ['confirmed', 'preparing', 'ready', 'completed'];
    const completedOrders = orders.filter(o => validStatuses.includes(o.status));
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = orders.length;
    const avgOrder = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    
    const itemCounts: Record<string, { name: string, count: number }> = {};
    orders.forEach(o => o.items.forEach(i => {
      if (!itemCounts[i.menuItemId]) itemCounts[i.menuItemId] = { name: i.menuItemName, count: 0 };
      itemCounts[i.menuItemId].count += i.quantity;
    }));
    const bestItem = Object.values(itemCounts).sort((a,b) => b.count - a.count)[0]?.name || '-';

    return { totalRevenue, totalOrders, avgOrder, bestItem };
  }, [orders]);

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    const validStatuses = ['confirmed', 'preparing', 'ready', 'completed'];
    orders.filter(o => validStatuses.includes(o.status)).forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      data[date] = (data[date] || 0) + o.totalPrice;
    });
    return Object.entries(data).map(([name, total]) => ({ name, total }));
  }, [orders]);

  const topItems = useMemo(() => {
    const aggregation: Record<string, { name: string, quantity: number, revenue: number }> = {};
    const validStatuses = ['confirmed', 'preparing', 'ready', 'completed'];
    orders.filter(o => validStatuses.includes(o.status)).forEach(order => {
      order.items.forEach(item => {
        if (!aggregation[item.menuItemId]) aggregation[item.menuItemId] = { name: item.menuItemName, quantity: 0, revenue: 0 };
        aggregation[item.menuItemId].quantity += item.quantity;
        aggregation[item.menuItemId].revenue += item.price * item.quantity;
      });
    });
    return Object.values(aggregation).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Ordio_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <AdminLayout title="Laporan Penjualan" subtitle="Pantau performa bisnis dan statistik pesanan Anda.">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {(['today', 'week', 'month', 'custom'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === t ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {t === 'today' ? 'Hari Ini' : t === 'week' ? 'Minggu Ini' : t === 'month' ? 'Bulan Ini' : 'Kustom'}
            </button>
          ))}
        </div>
        {filter === 'custom' && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <input type="date" className="text-xs p-1 outline-none" value={customRange.start} onChange={e => setCustomRange({...customRange, start: e.target.value})} />
            <span className="text-slate-300">-</span>
            <input type="date" className="text-xs p-1 outline-none" value={customRange.end} onChange={e => setCustomRange({...customRange, end: e.target.value})} />
          </div>
        )}
        <button onClick={exportPDF} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all cursor-pointer">
          <Download size={16} /> Ekspor PDF
        </button>
      </div>

      <div ref={reportRef} className="space-y-8 p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pendapatan</p>
              <h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalRevenue)}</h4>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]"><DollarSign size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pesanan</p>
              <h4 className="text-2xl font-black text-slate-900">{stats.totalOrders}</h4>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><ShoppingBag size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rata-rata Pesanan</p>
              <h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.avgOrder)}</h4>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><TrendingUp size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Produk Terlaris</p>
              <h4 className="text-sm font-black text-slate-900 truncate max-w-[120px]">{stats.bestItem}</h4>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><PackageCheck size={24} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-[#FF6B35]" /> Tren Pendapatan</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={(v: number) => [formatCurrency(v), 'Pendapatan']} />
                  <Bar dataKey="total" fill="#FF6B35" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-[#FF6B35]" /> 5 Produk Terlaris</h3>
            <div className="space-y-4">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex flex-col"><span className="text-sm font-bold text-slate-700">{item.name}</span><span className="text-[10px] text-slate-400 font-bold uppercase">{item.quantity} terjual</span></div>
                  <span className="text-sm font-black text-slate-900">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden">
          <div className="p-6 border-b border-slate-100"><h3 className="font-black text-slate-900 flex items-center gap-2"><Calendar size={18} className="text-[#FF6B35]" /> Ringkasan Pesanan</h3></div>
          <div className="overflow-x-auto"><table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Meja</th><th className="px-6 py-4">Item</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{order.tableId}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-[200px]">{order.items.map(i => `${i.quantity}x ${i.menuItemName}`).join(', ')}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-900">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-6 py-4"><span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </AdminLayout>
  );
}