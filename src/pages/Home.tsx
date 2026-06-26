import React from 'react';
import { useStore } from '../store';
import { sampleReviews, sampleTestimonials, sampleGalleryImages } from '../data/menu';
import { ArrowRight, Calendar, Sparkles, Clock, Compass, Award, ShieldCheck, MessageSquare, Utensils } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { settings, setActivePage, setSelectedCategory, menuItems, addToCart, theme } = useStore();
  const isLight = theme === 'light';

  const featuredItems = menuItems.filter(item => item.isFeatured && item.isAvailable).slice(0, 3);
  
  const categories = [
    { name: 'Appetizers', icon: '🍷', desc: 'Indulge early' },
    { name: 'Burgers', icon: '🍔', desc: 'Wagyu masterpieces' },
    { name: 'Pizza', icon: '🍕', desc: 'Artisanal fire-baked' },
    { name: 'Main Course', icon: '🥩', desc: 'Decadent dinners' },
    { name: 'Drinks', icon: '🍹', desc: 'Mystical mixtures' },
    { name: 'Desserts', icon: '🍰', desc: 'Sweet endings' }
  ];
const featuredItems = [
  {
    id: 101,
    name: "Royal Butter Chicken",
    description: "Tender chicken simmered in a rich creamy tomato sauce with aromatic spices.",
    price: 14.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 102,
    name: "Midnight Signature Curry",
    description: "A bold and flavorful house-special curry crafted with premium ingredients.",
    price: 16.99,
    category: "Chef Special",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 103,
    name: "Purple Flame Burger",
    description: "Juicy flame-grilled beef burger with premium cheese and Midnight Fork signature sauce.",
    price: 13.99,
    category: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
  }
];
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActivePage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="home-view" className={`selection:bg-purple-600 selection:text-white font-sans overflow-x-hidden transition-colors duration-300 ${
      isLight ? 'bg-[#faf9fc] text-slate-800' : 'bg-[#050505] text-white'
    }`}>
      
      {/* 1. HERO BANNER */}
      <section className={`relative w-full min-h-[650px] flex items-center justify-center overflow-hidden border-b py-16 ${
        isLight ? 'border-purple-100' : 'border-white/10'
      }`}>
        {/* Background Image with Dark Purple overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80" 
            alt="Midnight Fork Luxury Hall" 
            className={`w-full h-full object-cover object-center scale-105 filter transition-all duration-300 ${
              isLight ? 'brightness-[0.9] opacity-15' : 'brightness-[0.25]'
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isLight 
              ? 'from-[#faf9fc] via-[#faf9fc]/80 to-purple-50/10' 
              : 'from-[#050505] via-[#050505]/90 to-purple-950/30'
          }`}></div>
          {/* Radial ambient light/blur circles from the Design HTML */}
          <div className={`absolute top-1/2 left-1/4 w-[500px] h-[500px] blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ${
            isLight ? 'bg-purple-200/30' : 'bg-purple-900/15'
          }`}></div>
          <div className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] blur-[130px] rounded-full transition-all duration-300 ${
            isLight ? 'bg-purple-100/20' : 'bg-purple-800/10'
          }`}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[10px] font-semibold uppercase tracking-[0.25em] mb-8 transition-all duration-300 ${
              isLight 
                ? 'bg-purple-100/60 border-purple-200 text-purple-700 shadow-[0_4px_12px_rgba(147,51,234,0.05)]' 
                : 'bg-purple-900/20 border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Dhaka's Premier Late-Night Dining</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`font-serif font-light text-5xl sm:text-7xl leading-tight sm:leading-none tracking-tight mb-6 max-w-4xl mx-auto ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Elegance Served <br /> At <span className="italic text-purple-600 font-normal">Midnight.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-sm sm:text-base font-light max-w-2xl mx-auto mb-12 leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}
          >
            {settings.bannerSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <button
              onClick={() => handleCtaClick('menu')}
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
            >
              Order Online Now
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All');
                handleCtaClick('menu');
              }}
              className={`w-full sm:w-auto px-8 py-4 border text-xs font-semibold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-purple-50 text-slate-800 border-purple-200 shadow-sm' 
                  : 'bg-transparent hover:bg-white/5 text-white border border-white/20'
              }`}
            >
              Explore Menu
            </button>
            <button
              onClick={() => handleCtaClick('reservations')}
              className={`w-full sm:w-auto px-8 py-4 border text-xs font-semibold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLight
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-500" />
              Reserve Table
            </button>
          </motion.div>
        </div>

        {/* Ambient Bottom Fade */}
        <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t to-transparent z-10 ${
          isLight ? 'from-[#faf9fc]' : 'from-[#050505]'
        }`}></div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">Curated Offerings</span>
          <h2 className={`text-3xl sm:text-4.5xl font-serif font-light mt-2 tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>Popular Food Categories</h2>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, borderColor: 'rgba(147,51,234,0.4)', backgroundColor: isLight ? '#f5f0ff' : 'rgba(255,255,255,0.06)' }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`p-6 rounded-2xl border hover:shadow-[0_10px_30px_rgba(147,51,234,0.06)] cursor-pointer text-center transition-all duration-300 flex flex-col items-center justify-center group ${
                isLight 
                  ? 'bg-white border-purple-100 shadow-sm shadow-purple-500/5' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h3 className={`font-semibold text-xs tracking-widest uppercase transition-colors ${
                isLight ? 'text-slate-700 group-hover:text-purple-700' : 'text-gray-200 group-hover:text-white'
              }`}>{cat.name}</h3>
              <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED DISHES */}
      <section className={`py-24 border-y transition-colors duration-300 ${
        isLight ? 'bg-purple-50/20 border-purple-100' : 'bg-white/[0.02] border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">Chef Recommendations</span>
              <h2 className={`text-3xl sm:text-4.5xl font-serif font-light mt-2 tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>Featured Culinary Masterpieces</h2>
            </div>
            <button
              onClick={() => handleCtaClick('menu')}
              className={`text-xs font-semibold hover:text-purple-600 flex items-center gap-1.5 mt-4 sm:mt-0 uppercase tracking-widest transition-colors group cursor-pointer ${
                isLight ? 'text-purple-700' : 'text-purple-400'
              }`}
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
            {featuredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className={`group rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 flex flex-col ${
                  isLight ? 'bg-white border-purple-100/80 shadow-[0_10px_30px_rgba(147,51,234,0.03)]' : 'bg-[#050505]/60 border-white/10'
                }`}
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isLight ? 'from-white/60 via-transparent' : 'from-[#050505] via-[#050505]/10'
                  } to-transparent`}></div>
                  {/* Badge */}
                  <span className="absolute top-4 right-4 bg-purple-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded">
                    FEATURED
                  </span>
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-semibold text-sm tracking-widest group-hover:text-purple-600 transition-colors uppercase ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {item.name}
                      </h3>
                      <span className="text-purple-600 font-bold text-sm">${item.price.toFixed(2)}</span>
                    </div>
                    <p className={`text-xs mt-3.5 font-light leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  <div className={`mt-8 pt-4 border-t flex items-center justify-between ${
                    isLight ? 'border-purple-50' : 'border-white/10'
                  }`}>
                    <span className={`text-[10px] uppercase tracking-widest font-semibold ${
                      isLight ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {item.category}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(item, 1);
                        alert(`Added "${item.name}" to cart!`);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">The Midnight Standard</span>
          <h2 className={`text-3xl sm:text-4.5xl font-serif font-light mt-2 tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>Why Dining Here is Exceptional</h2>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center shadow-xl transition-all duration-300 ${
            isLight ? 'bg-white border-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.02)]' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`p-4 rounded-full border mb-2 ${
              isLight ? 'bg-purple-50/50 border-purple-100' : 'bg-white/5 border-white/10'
            }`}>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className={`font-semibold text-xs tracking-widest uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>Twilight Operations</h3>
            <p className={`text-xs font-light leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              Open daily from 6:00 PM until 4:00 AM. Midnight Fork satisfies your fine-dining cravings during the silent late hours with premium fresh culinary dispatch.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center shadow-xl transition-all duration-300 ${
            isLight ? 'bg-white border-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.02)]' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`p-4 rounded-full border mb-2 ${
              isLight ? 'bg-purple-50/50 border-purple-100' : 'bg-white/5 border-white/10'
            }`}>
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className={`font-semibold text-xs tracking-widest uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>Masterclass Gastronomy</h3>
            <p className={`text-xs font-light leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              Every dish is conceptualized and prepared by Michelin-recognized culinary artisans, using premium cuts, hand-kneaded crusts, and organic saffron threads.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center shadow-xl transition-all duration-300 ${
            isLight ? 'bg-white border-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.02)]' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`p-4 rounded-full border mb-2 ${
              isLight ? 'bg-purple-50/50 border-purple-100' : 'bg-white/5 border-white/10'
            }`}>
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className={`font-semibold text-xs tracking-widest uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>Secure Personal bKash Sync</h3>
            <p className={`text-xs font-light leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              Our manual bKash validation system features transaction verification within 10-15 minutes, with instant automated email confirmations at each milestone.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SPECIAL MIDNIGHT OFFERS */}
      <section className={`py-24 border-y transition-colors duration-300 ${
        isLight 
          ? 'bg-gradient-to-tr from-[#faf9fc] via-[#faf9fc]/90 to-purple-50 border-purple-100' 
          : 'bg-gradient-to-tr from-[#050505] via-[#050505]/95 to-purple-950/30 border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">Exclusive Late-Night Perks</span>
              <h2 className={`text-3xl sm:text-4.5xl font-serif font-light mt-2 tracking-tight mb-6 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>Midnight Special Offers</h2>
              <p className={`text-xs font-light leading-relaxed mb-8 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                We believe late nights deserve premium rewards. Take advantage of our carefully curated twilight dining promotions, valid for online delivery orders made directly through our system.
              </p>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex gap-4 ${
                  isLight ? 'bg-white border-purple-100/70 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h4 className={`font-semibold text-xs uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Midnight Hour Special</h4>
                    <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Get complimentary charcoal activated lemonade with any Premium Wagyu Burger purchased between 12:00 AM and 2:00 AM.</p>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border flex gap-4 ${
                  isLight ? 'bg-white border-purple-100/70 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="text-2xl">🛵</div>
                  <div>
                    <h4 className={`font-semibold text-xs uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Zero Delivery Charge</h4>
                    <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Free delivery across Banani & Gulshan areas for checkout totals exceeding $50. No discount code required.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative rounded-2xl overflow-hidden shadow-2xl h-80 sm:h-[400px] border ${
              isLight ? 'border-purple-100' : 'border-white/10'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" 
                alt="Ribeye Steak Special" 
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white/80 via-transparent' : 'from-[#050505] via-black/20'}`}></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">Limited Offer</span>
                <h3 className={`font-serif font-light text-lg uppercase tracking-widest mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Wagyu Ribeye & Saffron Rice Combo</h3>
                <p className={`text-[11px] font-light mt-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Enjoy a premium seared ribeye paired with aromatic saffron risotto for only $45.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS & REVIEWS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">Patron Acclaim</span>
          <h2 className={`text-3xl sm:text-4.5xl font-serif font-light mt-2 tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>Praise From The Critics</h2>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleTestimonials.map((test) => (
            <div 
              key={test.id}
              className={`p-8 rounded-2xl border flex flex-col justify-between relative shadow-xl transition-all duration-300 ${
                isLight ? 'bg-white border-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.02)]' : 'bg-white/5 border-white/10'
              }`}
            >
              <MessageSquare className={`absolute top-6 right-6 w-8 h-8 shrink-0 ${isLight ? 'text-purple-600/5' : 'text-white/5'}`} />
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <span key={i} className="text-purple-500 text-xs">★</span>
                  ))}
                </div>
                <p className={`text-xs font-light leading-relaxed italic mb-6 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  "{test.comment}"
                </p>
              </div>

              <div className={`flex items-center gap-3.5 border-t pt-4 ${
                isLight ? 'border-purple-50' : 'border-white/10'
              }`}>
                <img 
                  src={test.avatar} 
                  alt={test.author} 
                  className={`w-10 h-10 rounded-full object-cover border ${isLight ? 'border-purple-100' : 'border-white/20'}`}
                />
                <div>
                  <h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{test.author}</h4>
                  <p className="text-[10px] text-purple-600 mt-0.5 font-light">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className={`py-24 border-t transition-colors duration-300 ${
        isLight ? 'bg-purple-50/20 border-purple-100' : 'bg-white/[0.02] border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">Visual Artistry</span>
              <h2 className={`text-3xl sm:text-4.5xl font-serif font-light mt-2 tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>Dining Room Preview</h2>
            </div>
            <button
              onClick={() => handleCtaClick('gallery')}
              className={`text-xs font-semibold hover:text-purple-600 flex items-center gap-1.5 mt-4 sm:mt-0 uppercase tracking-widest transition-colors group cursor-pointer ${
                isLight ? 'text-purple-700' : 'text-purple-400'
              }`}
            >
              <span>View Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sampleGalleryImages.map((img) => (
              <div 
                key={img.id}
                className={`relative rounded-xl overflow-hidden h-48 sm:h-64 group border ${
                  isLight ? 'border-purple-100' : 'border-white/10'
                }`}
              >
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white/80 via-transparent' : 'from-[#050505] via-[#050505]/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4`}>
                  <p className={`text-[10px] font-medium truncate w-full ${isLight ? 'text-slate-800' : 'text-white'}`}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RESERVATION CTA */}
      <section className="py-28 relative w-full overflow-hidden">
        {/* Background Overlay image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80" 
            alt="VIP lounge" 
            className={`w-full h-full object-cover filter transition-all duration-300 ${
              isLight ? 'brightness-[0.95] opacity-20' : 'brightness-[0.2]'
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${
            isLight 
              ? 'from-[#faf9fc] via-[#faf9fc]/80 to-purple-50/20' 
              : 'from-[#050505] via-[#050505]/90 to-purple-950/40'
          }`}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">Reserve a Dining Table</span>
          <h2 className={`text-3xl sm:text-5xl font-serif font-light mt-2 tracking-tight mb-6 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>Experience the Velvet Ambience</h2>
          <p className={`text-sm font-light max-w-2xl mx-auto mb-10 leading-relaxed ${
            isLight ? 'text-slate-700' : 'text-gray-300'
          }`}>
            Planning a late-night dinner date or a confidential business gathering? Book a premium luxury table today and receive priority admission, personalized service, and curated chef custom menu upgrades.
          </p>
          <button
            onClick={() => handleCtaClick('reservations')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
          >
            Book Table Reservation
          </button>
        </div>
      </section>

      {/* 9. CONTACT CTA */}
      <section className={`py-24 border-t text-center px-4 sm:px-6 lg:px-8 ${
        isLight ? 'bg-purple-50/20 border-purple-100' : 'bg-white/[0.02] border-white/10'
      }`}>
        <div className="max-w-2xl mx-auto">
          <Utensils className="w-8 h-8 text-purple-500 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold uppercase tracking-widest mb-2 font-serif font-light ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>Need Instant Guidance?</h3>
          <p className={`text-xs font-light mb-8 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Our concierge desk is fully staffed and ready to answer queries, take large custom bookings, or help you track an active parcel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs font-semibold tracking-widest text-purple-600">
            <a href={`tel:${settings.phone}`} className="hover:text-purple-700 transition-colors">📞 {settings.phone}</a>
            <span className={`hidden sm:inline ${isLight ? 'text-purple-200' : 'text-gray-800'}`}>|</span>
            <a href={`mailto:${settings.email}`} className="hover:text-purple-700 transition-colors">✉️ {settings.email}</a>
          </div>
        </div>
      </section>

    </div>
  );
};
export default Home;
