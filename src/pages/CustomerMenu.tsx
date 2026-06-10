import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Check,
  Clock,
  MapPin,
  AlertTriangle,
  Info,
  Star,
  Coffee,
  Croissant,
  Cake,
  GlassWater,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Banknote
} from 'lucide-react';
import { MenuItem, Venue } from '../types';
import { supabase } from '../lib/supabase';

export default function CustomerMenu() {
  const { venueId, tableId } = useParams<{ venueId: string; tableId: string }>();
  
  // States
  const [venue, setVenue] = useState<Venue | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number; notes: string }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);
  const [activeItemNotes, setActiveItemNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState<{ id: string; table_number: string } | null>(null);

  useEffect(() => {
    if (!venueId) return;

    const fetchData = async () => {
      setLoading(true);
      // Fetch venue metadata and tables in parallel
      const { data: vData } = await supabase.from('venues').select('*').eq('id', venueId).single();
      if (vData) setVenue({ id: vData.id, name: vData.name, description: vData.description, logoUrl: vData.logo_url });

      // Fetch menu items
      const { data: mData } = await supabase
        .from('menu_items')
        .select('*')
        .eq('venue_id', venueId)
        .order('name');
      
      if (mData) {
        const mapped: MenuItem[] = mData.map((i: any) => ({
          id: i.id,
          venueId: i.venue_id,
          name: i.name,
          description: i.description,
          price: i.price,
          imageUrl: i.image_url,
          category: i.category,
          isAvailable: i.is_available
        }));
        setMenuItems(mapped);
        const cats = Array.from(new Set(mapped.map(i => i.category)));
        setCategories(['All', ...cats]);
      }

      // Resolve table info for display
      const { data: tData } = await supabase.from('tables').select('id, table_number').eq('venue_id', venueId);
      if (tData && tableId) {
        const searchId = tableId.toLowerCase().trim();
        const found = tData.find(t => 
          t.id === tableId || 
          t.table_number.toLowerCase().trim() === searchId ||
          t.table_number.toLowerCase().trim() === `table ${searchId}` ||
          t.table_number.toLowerCase().trim() === `table${searchId}`
        );
        if (found) setActiveTable(found);
      }

      setLoading(false);
    };

    fetchData();
  }, [venueId, tableId]);

  // Update browser tab title dynamically
  useEffect(() => {
    if (venue?.name) {
      document.title = `${venue.name} - Ordio`;
    } else {
      document.title = 'Ordio'; // Default title if venue name is not available
    }
  }, [venue?.name]);

  // Human descriptive names

  // Filter items
  // Cart operations
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const popularItems = useMemo(() => {
    // Taking the first 4 available items as "Popular Picks" for design simulation
    return menuItems.filter(i => i.isAvailable).slice(0, 4);
  }, [menuItems]);

  const getCategoryIcon = (cat: string) => {
    const name = cat.toLowerCase();
    if (name.includes('coffee')) return <Coffee className="w-4 h-4" />;
    if (name.includes('bakery') || name.includes('pastries')) return <Croissant className="w-4 h-4" />;
    if (name.includes('dessert')) return <Cake className="w-4 h-4" />;
    if (name.includes('drink') || name.includes('beverage')) return <GlassWater className="w-4 h-4" />;
    if (name === 'all') return <Sparkles className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, current) => acc + current.quantity, 0);
  }, [cart]);

  const addToCart = (item: MenuItem, notes: string = '') => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id && i.notes === notes);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, notes }];
    });
    setActiveItemDetails(null);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(cartItem => {
        if (cartItem.item.id === itemId) {
          const newQuantity = Math.max(0, cartItem.quantity + delta);
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      }).filter(cartItem => cartItem.quantity > 0);
      
      if (updated.length === 0) setIsCartOpen(false);
      return updated;
    });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !venueId) return;
    setIsOrdering(true);

    try {
      // Resolve the human-friendly tableId from URL to its actual UUID in the database
      const { data: venueTables } = await supabase
        .from('tables')
        .select('id, table_number')
        .eq('venue_id', venueId);

      const searchId = tableId?.toLowerCase().trim() || '';
      const tableRecord = venueTables?.find(t => {
        const num = t.table_number.toLowerCase().trim();
        return t.id === tableId || 
               num === searchId || 
               num === `table ${searchId}` || 
               num === `table${searchId}`;
      });

      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        venue_id: venueId,
        table_id: tableRecord?.id || null,
        status: 'pending_payment',
        note: ''
      }).select();

      const order = orderData?.[0];

      if (orderError || !order?.id) throw orderError || new Error('Order creation failed');

      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.item.id,
        quantity: item.quantity,
        price: item.item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) console.error('Non-critical error inserting order items:', itemsError);

      setOrderId(order.id.slice(0, 8).toUpperCase());
      setOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);
    } catch (err: any) {
      console.error('Full error:', err);
      alert('Error details: ' + (err?.message || err?.details || JSON.stringify(err)));
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading Menu...</div>;

  // Human descriptive names (now that loading is complete and venue is available)
  const venueName = venue?.name || 'Venue Not Found';
  const tableDisplay = activeTable?.table_number || (
    tableId 
      ? (tableId.toLowerCase().startsWith('table') ? tableId : `Table ${tableId.replace(/\D/g, '') || tableId}`) 
      : 'Table Seat'
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans text-[#2C1810] pb-32 relative">
      {/* Premium Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-[#F5F0E8]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <img 
            src={venue?.logoUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop'} 
            alt={venueName} 
            className="w-12 h-12 rounded-full border-2 border-[#2C1810] object-cover shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight truncate">{venueName}</h1>
            <p className="text-[10px] text-[#2C1810]/60 line-clamp-1">{venue?.description || 'Premium Coffee & Bakery'}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-[#2C1810] text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <ShoppingBag size={18} />
          <span className="text-xs font-bold">{cartItemCount} | ${cartTotal.toFixed(2)}</span>
        </button>
      </header>

      {/* Info Pills */}
      <div className="flex gap-2 px-6 mb-6">
        <div className="bg-white/60 px-3 py-1.5 rounded-full border border-[#2C1810]/10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>{tableDisplay}</span>
        </div>
        <div className="bg-white/60 px-3 py-1.5 rounded-full border border-[#2C1810]/10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>08:00 - 22:00</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-6 mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1810]/40 w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our menu..."
            className="w-full bg-white border-none rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-[#2C1810]/10 shadow-sm placeholder:text-[#2C1810]/30"
          />
        </div>
        <button className="bg-white p-3.5 rounded-2xl shadow-sm text-[#2C1810] border border-transparent active:bg-slate-50">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Categories with Icons */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-6 scrollbar-none">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex flex-col items-center gap-2 min-w-[70px] group transition-all`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              selectedCategory === category 
                ? 'bg-[#2C1810] text-white shadow-xl shadow-amber-900/20 scale-110' 
                : 'bg-white text-[#2C1810]/60'
            }`}>
              {getCategoryIcon(category)}
            </div>
            <span className={`text-[11px] font-bold ${selectedCategory === category ? 'text-[#2C1810]' : 'text-[#2C1810]/40'}`}>
              {category}
            </span>
          </button>
        ))}
      </div>

      {/* Popular Picks Horizontal Scroll */}
      {popularItems.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <section className="mt-8 mb-4">
          <div className="px-6 flex justify-between items-end mb-4">
            <h2 className="text-xl font-black italic">Popular Picks 🔥</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-6 scrollbar-none">
            {popularItems.map(item => (
              <motion.div 
                key={`popular-${item.id}`}
                onClick={() => setActiveItemDetails(item)}
                className="bg-white min-w-[190px] p-3 rounded-[2rem] shadow-sm flex flex-col gap-3 relative"
              >
                <img src={item.imageUrl} className="w-full h-40 object-cover rounded-[1.5rem]" />
                <div className="px-1">
                  <h3 className="font-bold text-sm truncate">{item.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-black">4.9</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-[#2C1810]">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="bg-[#2C1810] text-white p-1.5 rounded-xl transition-transform active:scale-90"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Menu Section */}
      <div className="max-w-3xl mx-auto px-6 mt-4">
        <h2 className="text-xl font-black italic mb-6">All Menu</h2>
        
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm">
            <Info className="w-10 h-10 text-[#2C1810]/20 mx-auto mb-3" />
            <p className="text-[#2C1810]/60 font-medium text-sm">No items match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
              <motion.div 
                layout
                key={item.id}
                onClick={() => item.isAvailable && setActiveItemDetails(item)}
                className={`bg-white rounded-[2rem] p-4 flex gap-5 transition-shadow hover:shadow-md ${
                  !item.isAvailable ? 'opacity-70' : ''
                }`}
              >
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-slate-50 flex-shrink-0 shadow-sm"
                  />
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-[#2C1810] text-base line-clamp-1">{item.name}</h3>
                      <span className="font-black text-[#2C1810]">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F5F0E8] rounded-full text-[#2C1810]/60 uppercase">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-black">4.8</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#2C1810]/50 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="flex justify-end items-center mt-2">
                    {item.isAvailable ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="bg-[#2C1810] text-white py-1.5 px-4 rounded-xl text-xs font-black transition-transform active:scale-95"
                      >
                        Add
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-rose-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Persistent Order Success Modal Overlay */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-slate-100 shadow-xl"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Order Received!</h2>
              <p className="text-xs text-slate-400 mt-1">Ticket: <span className="font-mono font-bold text-slate-700">{orderId}</span></p>
              
              <div className="bg-slate-50 rounded-lg p-3 my-4 text-left border border-slate-100 text-xs">
                <p className="font-semibold text-slate-700 mb-1">📋 Delivery details:</p>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Merchant:</span>
                  <span className="font-semibold">{venueName}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Destination:</span>
                  <span className="font-semibold text-indigo-600">{tableDisplay}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex flex-col items-center gap-2">
                <Banknote className="w-6 h-6 text-amber-600" />
                <p className="text-xs font-bold text-amber-900 leading-snug">
                  Please pay at the cashier to confirm your order. Thank you!
                </p>
              </div>

              <button
                id="btn-close-success"
                onClick={() => setOrderSuccess(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
              >
                Okay, Perfect!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <div 
            id="cart-drawer-backdrop"
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-950/55 z-40 backdrop-blur-sm transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer Sheet */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#F5F0E8] shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-[#2C1810]/5 flex justify-between items-center bg-[#2C1810] text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-lg">My Tray</h2>
              </div>
              <button 
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white/50 text-[#2C1810]/60 text-[10px] font-bold uppercase tracking-widest flex justify-between">
              <span>Ordering for: <strong>{tableDisplay}</strong></span>
              <span>{venueName}</span>
            </div>

            {/* Cart Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.map(cartItem => (
                <div 
                  key={cartItem.item.id} 
                  className="flex gap-4 justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#2C1810] block line-clamp-1">{cartItem.item.name}</span>
                    <span className="text-xs text-[#2C1810]/50 block mt-1">${cartItem.item.price.toFixed(2)} each</span>
                    {cartItem.notes && (
                      <span className="text-[10px] text-[#2C1810]/40 bg-white px-2 py-1 rounded-lg inline-block mt-2 italic">
                        Note: {cartItem.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-black text-[#2C1810]">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-2 border border-[#2C1810]/10 rounded-xl p-1 bg-white">
                      <button
                        onClick={() => updateQuantity(cartItem.item.id, -1)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(cartItem.item.id, 1)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Your ordering tray is empty</p>
                  <p className="text-xs mt-1 max-w-xs mx-auto">Select fresh coffees and foods from the list to populate your tray.</p>
                </div>
              )}
            </div>

            {/* Drawer Footer controls */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#2C1810]/5">
                <div className="space-y-2 text-xs text-[#2C1810]/60 mb-6 px-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (Sales)</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-[#2C1810] border-t border-[#2C1810]/5 pt-3 text-sm">
                    <span>Total Bill</span>
                    <span>${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={isOrdering}
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#2C1810] hover:opacity-90 disabled:bg-slate-400 text-white font-black py-4 px-4 rounded-[1.5rem] text-sm transition-all shadow-xl shadow-amber-900/20 flex justify-center items-center gap-2"
                >
                  {isOrdering ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>PLACING ORDER...</span>
                    </>
                  ) : (
                    <span>CONFIRM ORDER • ${(cartTotal * 1.08).toFixed(2)}</span>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Item Customizer Modal */}
      <AnimatePresence>
        {activeItemDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden border border-slate-100 shadow-xl flex flex-col"
            >
              <div className="relative h-56 bg-slate-100">
                {activeItemDetails.imageUrl ? (
                  <img 
                    src={activeItemDetails.imageUrl} 
                    alt={activeItemDetails.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">No Image</div>
                )}
                <button
                  id="close-customizer-btn"
                  onClick={() => setActiveItemDetails(null)}
                  className="absolute right-3.5 top-3.5 bg-slate-900/70 hover:bg-slate-900 bg-slate-950/50 hover:bg-slate-950 text-white p-1 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{activeItemDetails.name}</h3>
                    <span className="font-bold text-indigo-600 text-lg">${activeItemDetails.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{activeItemDetails.description}</p>
                </div>

                <div>
                  <label htmlFor="item-notes-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="item-notes-input"
                    rows={2}
                    value={activeItemNotes}
                    onChange={(e) => setActiveItemNotes(e.target.value)}
                    placeholder="E.g., No ice, dressing on the side, extra hot..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    id="btn-cancel-customizer"
                    onClick={() => setActiveItemDetails(null)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-add-customizer-item"
                    onClick={() => addToCart(activeItemDetails, activeItemNotes)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Add to Tray
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Sticky Cart Action Bar at bottom */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 px-6 flex justify-center z-30 pointer-events-none">
          <button
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto w-full max-w-sm bg-[#2C1810] text-white font-black py-4 px-6 rounded-[2rem] shadow-2xl flex items-center justify-between transition-transform active:scale-95"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
              <span className="text-xs uppercase tracking-widest">View Tray</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black">${cartTotal.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
