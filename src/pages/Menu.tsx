import React, { useState } from 'react';
import { useStore } from '../store';
import { MenuItem } from '../types';
import { Search, Sparkles, ShoppingCart, Check, Heart, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Menu: React.FC = () => {
  const { 
    menuItems, addToCart, 
    selectedCategory, setSelectedCategory, 
    searchQuery, setSearchQuery,
    wishlist, toggleWishlist,
    theme, showCartNotification
  } = useStore();

  const isLight = theme === 'light';

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // AI Recommendation State
  const [moodInput, setMoodInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);

  const categories = ['All', 'Appetizers', 'Burgers', 'Pizza', 'Main Course', 'Drinks', 'Desserts'];

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQtyChange = (itemId: string, val: number) => {
    if (val < 1) return;
    setQuantities(prev => ({ ...prev, [itemId]: val }));
  };

  const handleAddToCartClick = (item: MenuItem) => {
    const qty = quantities[item.id] || 1;
    addToCart(item, qty);
    // Reset quantity
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    showCartNotification(item.name, qty);
  };

  // Ask Gemini AI for Recommendations
  const askAiAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodInput.trim()) return;

    setAiLoading(true);
    setAiResult(null);
    setRecommendedIds([]);

    try {
      const response = await fetch('/api/gemini-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mood: moodInput,
          menu: menuItems.map(m => ({ id: m.id, name: m.name, desc: m.description, category: m.category, price: m.price }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResult(data.recommendation);
        if (data.recommendedIds && Array.isArray(data.recommendedIds)) {
          setRecommendedIds(data.recommendedIds);
        }
      } else {
        // Fallback Client-side Keyword heuristic if API is not fully up yet
        simulateClientAiRecommend();
      }
    } catch (err) {
      console.error(err);
      simulateClientAiRecommend();
    } finally {
      setAiLoading(false);
    }
  };

  const simulateClientAiRecommend = () => {
    const text = moodInput.toLowerCase();
    const recommended: string[] = [];
    
    if (text.includes('sweet') || text.includes('dessert') || text.includes('chocolate') || text.includes('cake') || text.includes('sugar')) {
      recommended.push('des1', 'des2', 'des3');
    }
    if (text.includes('heavy') || text.includes('steak') || text.includes('meat') || text.includes('hungry') || text.includes('ribeye') || text.includes('dinner')) {
      recommended.push('main1', 'main2', 'burg1');
    }
    if (text.includes('spicy') || text.includes('hot') || text.includes('honey')) {
      recommended.push('piz3', 'app2');
    }
    if (text.includes('drink') || text.includes('cocktail') || text.includes('refreshing') || text.includes('liquid') || text.includes('martini')) {
      recommended.push('drk1', 'drk2', 'drk3');
    }
    if (text.includes('seafood') || text.includes('fish') || text.includes('salmon') || text.includes('calamari')) {
      recommended.push('main2', 'app1');
    }
    if (recommended.length === 0) {
      // default select featured
      recommended.push('burg1', 'piz1', 'main1');
    }

    setRecommendedIds(recommended);
    setAiResult(`Understood! Based on your mood ("${moodInput}"), the Midnight Fork AI suggests experiencing: ${recommended.map(id => menuItems.find(m => m.id === id)?.name).filter(Boolean).join(', ')}. These dishes perfectly complement your evening!`);
  };

  return (
    <div id="menu-view" className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#faf9fc] text-slate-800' : 'bg-[#050505] text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500 font-bold">Midnight Alchemy</span>
          <h1 className={`text-3xl sm:text-5xl font-serif font-light mt-2 tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>The Culinary Manuscript</h1>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <p className={`text-xs sm:text-sm font-light max-w-2xl mx-auto mt-4 leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            Every dish is an intersection of pure ingredients, meticulous culinary craft, and high-contrast plating. Click to order and experience twilight gastronomy.
          </p>
        </div>

        {/* ======================================================================== */}
        {/* GEMINI AI CRAVING ASSISTANT */}
        {/* ======================================================================== */}
        <div className={`mb-16 p-6 sm:p-8 rounded-2xl border relative overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isLight ? 'bg-white border-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.02)]' : 'bg-white/5 border-white/10'
        }`}>
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-48 bg-purple-600/10 blur-[80px] rounded-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/5 blur-[80px] rounded-full -z-10"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/25 border border-purple-500/30 text-purple-300 text-[9px] font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Midnight Fork Intelligent Host</span>
              </div>
              <h2 className={`text-lg sm:text-xl font-serif font-light tracking-widest uppercase ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>Unsure what you crave? Let AI decide</h2>
              <p className={`text-xs mt-1.5 font-light leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-gray-400'
              }`}>
                Describe your mood, appetite level, or flavor preferences (e.g., "I had a long day, I want a luxurious dinner with chocolate for dessert") and our Gemini-powered host will craft your menu mapping.
              </p>
            </div>

            <form onSubmit={askAiAssistant} className="flex-1 w-full max-w-lg flex items-center gap-2">
              <input
                type="text"
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                placeholder="Describe your late-night craving or mood..."
                className={`w-full border rounded-lg px-4 py-3.5 text-xs focus:outline-none transition-all placeholder:text-gray-500 ${
                  isLight 
                    ? 'bg-purple-50/50 border-purple-200 text-slate-900 focus:border-purple-600 focus:bg-white' 
                    : 'bg-[#050505]/60 border-white/10 text-white focus:border-purple-500 placeholder:text-gray-600'
                }`}
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/40 text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/15 cursor-pointer"
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Query</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Result Container */}
          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-6 pt-5 border-t ${isLight ? 'border-purple-100' : 'border-white/10'}`}
              >
                <div className={`p-4 rounded-xl text-xs ${
                  isLight ? 'bg-purple-50 border border-purple-200/60 text-slate-800' : 'bg-purple-950/15 border border-purple-500/20 text-white'
                }`}>
                  <div className="flex items-center gap-1.5 text-purple-600 font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Host Response:</span>
                  </div>
                  <p className={`font-light leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{aiResult}</p>
                  {recommendedIds.length > 0 && (
                    <p className="text-[10px] text-purple-600 font-semibold mt-3">
                      💡 Matches below are marked with a purple sparkling border!
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================================================================== */}
        {/* FILTER & SEARCH */}
        {/* ======================================================================== */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b pb-8 ${
          isLight ? 'border-purple-100' : 'border-white/10'
        }`}>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : isLight 
                      ? 'bg-white text-slate-500 hover:text-purple-600 border border-purple-100 shadow-sm' 
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients..."
              className={`w-full border text-xs px-10 py-3 rounded-lg focus:outline-none transition-all placeholder:text-gray-500 ${
                isLight 
                  ? 'bg-white border-purple-100 hover:border-purple-300 focus:border-purple-600 text-slate-900 shadow-sm' 
                  : 'bg-white/5 border-white/10 hover:border-purple-500/30 focus:border-purple-500 text-slate-100 placeholder:text-gray-600'
              }`}
            />
          </div>
        </div>

        {/* ======================================================================== */}
        {/* MENU ITEMS GRID */}
        {/* ======================================================================== */}
        {filteredItems.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border ${
            isLight ? 'bg-white border-purple-100' : 'bg-white/5 border-white/10'
          }`}>
            <p className={`text-xs ${isLight ? 'text-slate-400 font-medium' : 'text-gray-500'}`}>No matching culinary creations found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const isAiRecommended = recommendedIds.includes(item.id);
              const qty = quantities[item.id] || 1;

              return (
                <motion.div
                  key={item.id}
                  layout
                  whileHover={{ y: -6 }}
                  className={`group rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    isAiRecommended 
                      ? 'border-purple-500 ring-2 ring-purple-600/30 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                      : isLight 
                        ? 'bg-white border-purple-100/80 shadow-[0_10px_30px_rgba(147,51,234,0.02)] hover:border-purple-300' 
                        : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <div>
                    {/* Item Image with hover zoom */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white/40 via-transparent' : 'from-[#050505] via-[#050505]/10'} to-transparent`}></div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                        {item.isBestSeller && (
                          <span className="bg-[#050505]/80 text-purple-300 border border-purple-500/20 text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded">
                            🏆 BEST SELLER
                          </span>
                        )}
                        {item.isRecommended && (
                          <span className="bg-[#050505]/80 text-white border border-white/10 text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded">
                            ✨ RECIPE CHOSEN
                          </span>
                        )}
                        {isAiRecommended && (
                          <span className="bg-purple-600 text-white text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded animate-bounce">
                            🔮 AI RECOMMEND
                          </span>
                        )}
                      </div>

                      {/* Wishlist button */}
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-xs sm:text-sm tracking-widest group-hover:text-purple-600 transition-colors uppercase leading-tight ${
                          isLight ? 'text-slate-900 font-bold' : 'text-white'
                        }`}>
                          {item.name}
                        </h3>
                        <span className="text-purple-600 font-bold text-sm shrink-0">${item.price.toFixed(2)}</span>
                      </div>
                      <p className={`text-xs mt-3 font-light leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-gray-400'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="p-6 pt-2 flex flex-col gap-4">
                    <div className={`flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold ${
                      isLight ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      <span>{item.category}</span>
                      <span className={item.isAvailable ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {item.isAvailable ? '● AVAILABLE NOW' : '● OUT OF STOCK'}
                      </span>
                    </div>

                    <div className={`flex items-center gap-3 border-t pt-4 ${
                      isLight ? 'border-purple-100' : 'border-white/10'
                    }`}>
                      {/* Quantity select */}
                      <div className={`flex items-center rounded-lg py-1 px-3 ${
                        isLight ? 'bg-purple-50/50 border border-purple-100' : 'bg-[#050505]/60 border border-white/10'
                      }`}>
                        <button
                          onClick={() => handleQtyChange(item.id, qty - 1)}
                          className={`px-2 font-bold cursor-pointer ${
                            isLight ? 'text-slate-500 hover:text-purple-600' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          -
                        </button>
                        <span className={`text-xs px-2 min-w-[20px] text-center ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>{qty}</span>
                        <button
                          onClick={() => handleQtyChange(item.id, qty + 1)}
                          className={`px-2 font-bold cursor-pointer ${
                            isLight ? 'text-slate-500 hover:text-purple-600' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => handleAddToCartClick(item)}
                        disabled={!item.isAvailable}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 hover:text-white text-white rounded-lg py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Order for Delivery</span>
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
export default Menu;
