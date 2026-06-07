import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  Utensils,
  Check,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_CATEGORIES = ['Signature Coffee', 'Gourmet Pastries', 'All-Day Brunch', 'Beverages'];

export default function AdminMenu() {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All', ...DEFAULT_CATEGORIES]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New Item Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Signature Coffee');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (!user?.venueId) {
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .eq('venue_id', user.venueId)
        .order('name');

      if (data) {
        const mapped: MenuItem[] = data.map((i: any) => ({
          id: i.id,
          venueId: i.venue_id,
          name: i.name,
          description: i.description,
          price: i.price,
          imageUrl: i.image_url,
          category: i.category || 'General',
          isAvailable: i.is_available
        }));
        setItems(mapped);

        const cats = Array.from(new Set(mapped.map(i => i.category || 'General')));
        setCategories(['All', ...Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]))]);
        if (cats.length > 0 && !category) setCategory(cats[0]);
      }
      setLoading(false);
    };

    fetchItems();
  }, [user?.venueId]);

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle item availability
  const toggleAvailability = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.isAvailable })
      .eq('id', itemId);

    if (error) return alert('Update failed');

    setItems(prev => 
      prev.map(it => it.id === itemId ? { ...it, isAvailable: !it.isAvailable } : it)
    );
  };

  // Delete item handler
  const deleteItem = async (itemId: string) => {
    if (!confirm('Delete this item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
    if (error) return alert('Delete failed');
    setItems(prev => prev.filter(it => it.id !== itemId));
  };

  // Add Item handler
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert('Item name and price are required.');
    if (!user?.venueId) return alert('Session error: No venue ID found. Please refresh and try again.');

    const { data, error } = await supabase.from('menu_items').insert([{
      venue_id: user.venueId,
      name,
      price: parseFloat(price) || 0,
      description: description || 'No description provided.',
      category,
      image_url: imageUrl,
      is_available: isAvailable
    }]).select().single();

    if (error) {
      console.error('Supabase insert failed:', error);
      return alert(`Failed to add item: ${error.message}`);
    }

    if (!data) return;

    const newItem: MenuItem = {
      id: data.id,
      venueId: data.venue_id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.image_url,
      category: data.category,
      isAvailable: data.is_available
    };

    setItems(prev => [newItem, ...prev]);
    setFormSuccess(true);
    
    // Reset Form
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setIsAvailable(true);

    setTimeout(() => {
      setFormSuccess(false);
      setShowAddForm(false);
    }, 1200);
  };

  return (
    <AdminLayout 
      title="Digital Menu Manager" 
      subtitle="Modify available coffee and culinary treats, set real-time stock levels, and organize food catalog tags."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column - items browser list with filter */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Row - search and Add Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                id="search-menu-items"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food item catalog title & category..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
              />
            </div>

            {/* Quick Filter Select */}
            <div className="flex border border-slate-200 bg-white rounded-xl overflow-hidden self-stretch sm:self-auto">
              <button
                id="btn-add-item-trigger"
                onClick={() => setShowAddForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                id={`mgr-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main Grid display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.div
                  layout
                  key={item.id}
                  id={`config-card-${item.id}`}
                  className={`bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-2xs ${
                    !item.isAvailable ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <div className="p-4 flex gap-4">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-100"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h4>
                        <span className="font-bold text-indigo-600 text-sm whitespace-nowrap">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                      
                      <span className="inline-flex mt-2 items-center gap-1 text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions footer bar */}
                  <div className="bg-slate-50/80 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs font-semibold">
                    <button
                      id={`toggle-stock-btn-${item.id}`}
                      onClick={() => toggleAvailability(item.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        item.isAvailable ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-indigo-500" />
                          <span>In Stock (Live)</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-slate-300" />
                          <span className="text-rose-500">Out of Stock</span>
                        </>
                      )}
                    </button>

                    <button
                      id={`delete-stock-btn-${item.id}`}
                      onClick={() => deleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <Utensils className="w-10 h-10 stroke-1 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-semibold">No food catalog items found matching filters</p>
                <p className="text-slate-400 text-xs mt-1">Select another category tag or create your custom culinary recipe.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right side - forms inputs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Quick Catalog Metrics</h3>
              <p className="text-xs text-slate-400 mt-1">Current state counts for your published menu pages.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 block pb-1">Total Foods</span>
                <span className="text-lg font-black text-slate-900 block">{items.length} Options</span>
              </div>
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-50 text-center">
                <span className="text-indigo-600 block pb-1">Active Now</span>
                <span className="text-lg font-black text-indigo-700 block">
                  {items.filter(i => i.isAvailable).length} Live
                </span>
              </div>
            </div>

            {/* Live New Item Add Drawer form */}
            {showAddForm ? (
              <form onSubmit={handleAddItem} className="space-y-4 pt-2 border-t border-slate-100 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Write New Food Recipe
                  </h4>
                  <button 
                    id="dismiss-form-btn-2"
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold underline"
                  >
                    Hide Form
                  </button>
                </div>

                {formSuccess && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs font-bold p-3 rounded-lg border border-indigo-100 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Added to current digital menu draft!
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label htmlFor="food-name" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Item Name *</label>
                    <input
                      id="food-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., Pistachio Scone, Iced Cappuccino"
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-850"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="food-price" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Price ($ USD) *</label>
                      <input
                        id="food-price"
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="5.25"
                        className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-850"
                      />
                    </div>

                    <div>
                      <label htmlFor="food-category" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category Tag</label>
                      <select
                        id="food-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-850"
                      >
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="food-desc" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea
                      id="food-desc"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide delicate ingredients, allergen tags, preparation details..."
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-850"
                    />
                  </div>

                  <div>
                    <label htmlFor="food-img" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Image Link URL (Optional)</label>
                    <input
                      id="food-img"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-850"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="food-active"
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="food-active" className="text-xs text-slate-600 font-bold select-none cursor-pointer">
                      Publish to digital menus immediately (In Stock)
                    </label>
                  </div>
                </div>

                <button
                  id="submit-new-food"
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Confirm Recipe & Publish Catalog
                </button>
              </form>
            ) : (
              <div className="pt-4 border-t border-slate-100 text-center space-y-3">
                <p className="text-xs text-slate-400">Want to expand your culinary offerings? Creating items publishes them instantly.</p>
                <button
                  id="btn-re-add"
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl border border-indigo-100 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Item Draft</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
