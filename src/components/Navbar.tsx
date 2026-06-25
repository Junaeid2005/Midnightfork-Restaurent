import React, { useState } from 'react';
import { useStore } from '../store';
import { Logo } from './Logo';
import { ShoppingCart, User, Menu, X, LogIn, ChevronDown, ClipboardList, Shield, LogOut, Calendar, Clock, MapPin, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePage, setActivePage, 
    cart, 
    currentUser, logout,
    setActiveCustomerTab, setActiveAdminTab,
    theme, toggleTheme
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'tracking', label: 'Track Order' }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileDropdownClick = (pageId: string, tabId: string) => {
    setActivePage(pageId);
    if (pageId === 'profile') {
      setActiveCustomerTab(tabId);
    } else if (pageId === 'admin') {
      setActiveAdminTab(tabId);
    }
    setIsProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="sticky-header" className={`sticky top-0 z-40 w-full transition-all duration-300 border-b backdrop-blur-md ${
      theme === 'dark' 
        ? 'border-white/10 bg-[#050505]/90 text-white' 
        : 'border-purple-100 bg-white/90 text-slate-900 shadow-[0_2px_15px_rgba(147,51,234,0.03)]'
    }`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-200 border cursor-pointer ${
                activePage === link.id
                  ? theme === 'dark'
                    ? 'text-purple-400 bg-white/5 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'text-purple-600 bg-purple-50 border-purple-200 shadow-[0_4px_12px_rgba(147,51,234,0.1)]'
                  : theme === 'dark'
                    ? 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                    : 'text-slate-600 border-transparent hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Theme Switch Trigger */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'text-gray-400 border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white'
                : 'text-slate-600 border-transparent hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600'
            }`}
            title={theme === 'dark' ? "Switch to Purple & White Theme" : "Switch to Purple & Black Theme"}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-purple-700" />
            )}
          </button>
          
          {/* Shopping Cart Trigger */}
          <button
            onClick={() => handleNavClick('cart')}
            className={`relative p-2 rounded-full border transition-all duration-200 cursor-pointer ${
              activePage === 'cart'
                ? theme === 'dark'
                  ? 'bg-white/5 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'bg-purple-50 text-purple-600 border-purple-200 shadow-[0_4px_12px_rgba(147,51,234,0.1)]'
                : theme === 'dark'
                  ? 'text-gray-400 border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white'
                  : 'text-slate-600 border-transparent hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600'
            }`}
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white ring-2 ${theme === 'dark' ? 'ring-black' : 'ring-white'}`}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-medium border cursor-pointer ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/20'
                    : 'text-slate-700 hover:text-slate-900 bg-purple-50 hover:bg-purple-100/80 border-purple-200'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[70px] truncate hidden sm:inline">{currentUser.displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className={`absolute right-0 mt-2.5 w-56 origin-top-right rounded-xl p-2 shadow-2xl focus:outline-none z-20 text-xs divide-y ${
                    theme === 'dark'
                      ? 'bg-black/95 backdrop-blur-md border border-white/10 text-gray-300 divide-white/10'
                      : 'bg-white border border-purple-100 text-slate-700 divide-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.1)]'
                  }`}>
                    
                    {/* Header Info */}
                    <div className="px-3 py-2.5">
                      <p className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{currentUser.displayName}</p>
                      <p className="text-[10px] text-purple-500 mt-0.5 capitalize">{currentUser.role} Account</p>
                    </div>

                    {/* Customer Actions */}
                    {currentUser.role === 'customer' && (
                      <div className="py-1">
                        <button
                          onClick={() => handleProfileDropdownClick('profile', 'dashboard')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <ClipboardList className="w-4 h-4 text-purple-500" />
                          <span>Customer Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('profile', 'profile')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <User className="w-4 h-4 text-purple-500" />
                          <span>Update Profile</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('profile', 'orders')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>Order History</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('profile', 'reservations')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>Reservations</span>
                        </button>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {currentUser.role === 'admin' && (
                      <div className="py-1">
                        <button
                          onClick={() => handleProfileDropdownClick('admin', 'dashboard')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg font-semibold text-left transition-colors cursor-pointer ${
                            theme === 'dark' 
                              ? 'bg-white/5 hover:bg-white/10 text-purple-300' 
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                          }`}
                        >
                          <Shield className="w-4 h-4 text-purple-500" />
                          <span>Admin Control Panel</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('admin', 'orders')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <ClipboardList className="w-4 h-4 text-purple-500" />
                          <span>Manage Orders</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('admin', 'payments')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>Verify bKash Payments</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('admin', 'reservations')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>Admit Reservations</span>
                        </button>
                        <button
                          onClick={() => handleProfileDropdownClick('admin', 'settings')}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span>Website Settings</span>
                        </button>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="py-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-red-500 text-left transition-colors cursor-pointer ${
                          theme === 'dark' ? 'hover:bg-red-950/20' : 'hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white border border-transparent shadow-lg shadow-purple-600/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-1.5 rounded-lg md:hidden border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'text-slate-300 hover:text-white border-transparent hover:border-white/10 hover:bg-white/5'
                : 'text-slate-600 hover:text-purple-600 border-transparent hover:border-purple-100 hover:bg-purple-50'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-3 space-y-2 z-35 animate-fade-in text-xs ${
          theme === 'dark'
            ? 'border-white/10 bg-[#050505]/95 backdrop-blur-lg'
            : 'border-purple-100 bg-white/95 backdrop-blur-lg shadow-lg'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3.5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activePage === link.id
                  ? theme === 'dark'
                    ? 'text-purple-400 bg-white/5 font-semibold border-l-2 border-purple-500 pl-2.5'
                    : 'text-purple-700 bg-purple-50 font-bold border-l-2 border-purple-600 pl-2.5'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
export default Navbar;
