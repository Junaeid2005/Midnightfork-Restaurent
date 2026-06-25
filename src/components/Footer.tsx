import React from 'react';
import { Logo } from './Logo';
import { useStore } from '../store';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActivePage, theme } = useStore();
  const isLight = theme === 'light';

  const quickLinks = [
    { label: 'Savour Our Menu', page: 'menu' },
    { label: 'Book Table Reservation', page: 'reservations' },
    { label: 'Our Story', page: 'about' },
    { label: 'The Gallery', page: 'gallery' },
    { label: 'Track Active Order', page: 'tracking' },
    { label: 'Privacy Policy', page: 'privacy' },
    { label: 'Terms & Conditions', page: 'terms' }
  ];

  const handleLinkClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="premium-footer" className={`transition-all duration-300 ${
      isLight 
        ? 'bg-white text-slate-600 border-t border-purple-100 shadow-[0_-10px_30px_rgba(147,51,234,0.02)]' 
        : 'bg-[#050505] text-gray-400 border-t border-white/10'
    } pt-16 pb-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className={`mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 border-b pb-12 mb-10 ${
        isLight ? 'border-purple-50' : 'border-white/10'
      }`}>
        
        {/* Column 1: Brand & Logo */}
        <div className="flex flex-col gap-4">
          <Logo size="lg" />
          <p className={`text-xs leading-relaxed font-light mt-2 ${
            isLight ? 'text-slate-500' : 'text-gray-400'
          }`}>
            A premium sanctuary where shadows, violet tones, and masterclass gastronomy intertwine. Crafting culinary memories until the twilight fades.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <a 
              href={settings.facebookLink} 
              target="_blank" 
              rel="noreferrer"
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isLight 
                  ? 'border-purple-100 hover:border-purple-600 hover:text-purple-600 bg-purple-50/50 hover:bg-purple-100' 
                  : 'border-white/10 hover:border-purple-600 hover:text-white bg-white/5 hover:bg-purple-950/30'
              }`}
            >
              <Facebook className="w-4 h-4 text-purple-500" />
            </a>
            <a 
              href={settings.instagramLink} 
              target="_blank" 
              rel="noreferrer"
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isLight 
                  ? 'border-purple-100 hover:border-purple-600 hover:text-purple-600 bg-purple-50/50 hover:bg-purple-100' 
                  : 'border-white/10 hover:border-purple-600 hover:text-white bg-white/5 hover:bg-purple-950/30'
              }`}
            >
              <Instagram className="w-4 h-4 text-purple-500" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className={`font-semibold uppercase tracking-widest text-xs mb-6 border-l-2 border-purple-500 pl-3 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Quick Navigation
          </h3>
          <ul className="space-y-3.5 text-xs">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleLinkClick(link.page)}
                  className={`hover:text-purple-600 flex items-center gap-1.5 transition-colors group text-left cursor-pointer`}
                >
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-500" />
                  <span className={`font-medium transition-colors ${
                    isLight ? 'text-slate-700 group-hover:text-purple-600' : 'text-gray-300 group-hover:text-purple-400'
                  }`}>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div>
          <h3 className={`font-semibold uppercase tracking-widest text-xs mb-6 border-l-2 border-purple-500 pl-3 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Concierge Desk
          </h3>
          <ul className="space-y-4 text-xs font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>{settings.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-purple-500 shrink-0" />
              <a href={`tel:${settings.phone}`} className={`transition-colors ${
                isLight ? 'text-slate-700 hover:text-purple-600' : 'text-gray-300 hover:text-purple-400'
              }`}>
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-purple-500 shrink-0" />
              <a href={`mailto:${settings.email}`} className={`transition-colors ${
                isLight ? 'text-slate-700 hover:text-purple-600' : 'text-gray-300 hover:text-purple-400'
              }`}>
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Business Hours */}
        <div>
          <h3 className={`font-semibold uppercase tracking-widest text-xs mb-6 border-l-2 border-purple-500 pl-3 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Business Hours
          </h3>
          <div className={`p-4 rounded-xl space-y-3 text-xs border ${
            isLight ? 'bg-purple-50/40 border-purple-100/70 shadow-sm' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`flex items-center gap-2 ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="font-semibold">Midnight Kitchen</span>
            </div>
            <p className={`font-medium leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              {settings.businessHours}
            </p>
            <p className={`text-[10px] italic mt-2 font-light ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
              *Reservations can be requested online 24/7. bKash payment verification occurs until 4:00 AM.
            </p>
          </div>
        </div>

      </div>

      {/* Copyright info */}
      <div className={`mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-[11px] font-light gap-4 ${
        isLight ? 'text-slate-400' : 'text-gray-500'
      }`}>
        <div>
          &copy; {new Date().getFullYear()} <span className={isLight ? 'text-slate-800 font-semibold' : 'text-gray-400 font-medium'}>{settings.restaurantName}</span>. All rights reserved. Dhaka, Bangladesh.
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => handleLinkClick('privacy')} className={`transition-colors cursor-pointer ${isLight ? 'text-slate-500 hover:text-purple-600' : 'text-gray-400 hover:text-purple-400'}`}>Privacy Policy</button>
          <button onClick={() => handleLinkClick('terms')} className={`transition-colors cursor-pointer ${isLight ? 'text-slate-500 hover:text-purple-600' : 'text-gray-400 hover:text-purple-400'}`}>Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
