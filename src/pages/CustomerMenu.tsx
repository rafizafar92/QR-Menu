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
  Info
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

  // Human descriptive names
  const venueName = venue?.name || 'Loading...';
  const tableDisplay = activeTable?.table_number || (
    tableId 
      ? (tableId.toLowerCase().startsWith('table') ? tableId : `Table ${tableId.replace(/\D/g, '') || tableId}`) 
      : 'Table Seat'
  );

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
    setIsCartOpen(true);
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

      const { data: order, error: orderError } = await supabase.from('orders').insert({
        venue_id: venueId,
        table_id: tableRecord?.id || null,
        status: 'pending',
        note: ''
      }).select().single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.item.id,
        quantity: item.quantity,
        price: item.item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setOrderId(order.id.slice(0, 8).toUpperCase());
      setOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
      alert('Order submission failed. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading Menu...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 relative">
      {/* Banner & Brand Info Container */}
      <div className="relative h-44 bg-slate-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-[1px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&fit=crop')` }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-6">
          <div className="flex items-center gap-4">
            <img 
              src={venue?.logoUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop'} 
              alt={venueName} 
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md"
            />
            <div>
              <span className="inline-flex items-center gap-1 text-xs bg-indigo-600/95 text-white font-medium px-2 py-0.5 rounded-full mb-1">
                <Clock className="w-3 h-3" /> Welcoming Orders
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{venueName}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Info stripe */}
      <div className="bg-white border-b border-slate-100 py-3 px-6 shadow-xs flex flex-wrap justify-between items-center gap-2">
        <p className="text-slate-500 text-xs md:text-sm max-w-md line-clamp-1">{venue?.description || 'Welcoming orders for our fresh signature selections.'}</p>
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-sm border border-indigo-100">
          <MapPin className="w-3.5 h-3.5" />
          <span>{tableDisplay}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text"
            id="menu-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search savory bites, sweet treats, coffees..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
          />
          {searchQuery && (
            <button 
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Floating Horizontal Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none sticky top-0 bg-slate-50 z-10 py-2">
          {categories.map(category => (
            <button
              key={category}
              id={`cat-btn-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === category 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Listings */}
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 mt-4">
          {selectedCategory} Selects ({filteredItems.length})
        </h2>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center mt-4">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">No items found matching your filter</p>
            <button 
              id="reset-filters-btn"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-indigo-600 font-semibold underline mt-1"
            >
              View entire menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
              <motion.div 
                layout
                key={item.id}
                id={`menu-item-card-${item.id}`}
                className={`bg-white rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-xs flex gap-4 ${
                  !item.isAvailable ? 'opacity-70' : ''
                }`}
              >
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-slate-950 text-base line-clamp-1">{item.name}</h3>
                      <span className="font-bold text-indigo-600 whitespace-nowrap">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-sm text-slate-500">
                      {item.category}
                    </span>
                    {item.isAvailable ? (
                      <button
                        id={`btn-add-item-${item.id}`}
                        onClick={() => {
                          setActiveItemDetails(item);
                          setActiveItemNotes('');
                        }}
                        className="bg-indigo-600 text-white p-1 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 px-2.5 text-xs font-medium cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
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
              <h2 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h2>
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
                <p className="text-[10px] text-slate-400 mt-2 text-center">Your order has been sent to the kitchen. It is currently being processed by the staff.</p>
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
            id="cart-drawer-sheet"
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
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

            <div className="p-3 bg-indigo-50 text-indigo-700 text-xs border-b border-indigo-100 font-medium flex justify-between">
              <span>Ordering for: <strong>{tableDisplay}</strong></span>
              <span>{venueName}</span>
            </div>

            {/* Cart Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map(cartItem => (
                <div 
                  key={cartItem.item.id} 
                  id={`cart-item-${cartItem.item.id}`}
                  className="flex gap-3 justify-between pb-3 border-b border-slate-100 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-900 block line-clamp-1">{cartItem.item.name}</span>
                    <span className="text-xs text-slate-500 block">${cartItem.item.price.toFixed(2)} each</span>
                    {cartItem.notes && (
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm inline-block mt-1">
                        Note: {cartItem.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-slate-950">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                      <button
                        id={`btn-cart-minus-${cartItem.item.id}`}
                        onClick={() => updateQuantity(cartItem.item.id, -1)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
                      <button
                        id={`btn-cart-plus-${cartItem.item.id}`}
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
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-white p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (Sales)</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5 text-sm">
                    <span>Total Bill</span>
                    <span>${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="btn-submit-order"
                  disabled={isOrdering}
                  onClick={handlePlaceOrder}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-base transition-colors shadow-md flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isOrdering ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Sending to Kitchen...</span>
                    </>
                  ) : (
                    <span>Submit Order (${(cartTotal * 1.08).toFixed(2)})</span>
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
              <div className="relative h-44 bg-slate-100">
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
        <div className="fixed bottom-0 inset-x-0 bg-transparent p-4 flex justify-center z-30 pointer-events-none">
          <button
            id="view-cart-floating-btn"
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-between transition-transform transform hover:scale-102 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
              <span className="text-sm">Review your custom tray</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">${cartTotal.toFixed(2)}</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
