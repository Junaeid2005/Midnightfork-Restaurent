import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { auth, db } from './firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ShieldAlert, CheckCircle, Loader2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import All Page Modules
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { AboutUs } from './pages/AboutUs';
import { Gallery } from './pages/Gallery';
import { Reservations } from './pages/Reservations';
import { ContactUs } from './pages/ContactUs';
import { OrderTracking } from './pages/OrderTracking';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';

export default function App() {
  const { activePage, syncFromFirebase, currentUser, theme, authLoading, cartNotification, closeCartNotification, setActivePage } = useStore();



  // Listen to Firebase authentication state on startup to retain session after refresh
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        // Fetch full profile info from Firestore first
        let role: 'customer' | 'admin' = fUser.email === 'admin@midnightfork.com' ? 'admin' : 'customer';
        let displayName = fUser.email === 'admin@midnightfork.com' ? 'Demo Admin' : (fUser.email?.split('@')[0] || 'Customer');
        let phone = fUser.email === 'admin@midnightfork.com' ? '+880 1711-223344' : '';
        let address = fUser.email === 'admin@midnightfork.com' ? 'Midnight Fork HQ, Banani, Dhaka' : '';
        let dbEmailVerified = false;

        try {
          const docSnap = await getDoc(doc(db, 'users', fUser.uid));
          if (docSnap.exists()) {
            const uData = docSnap.data();
            role = uData.role || role;
            displayName = uData.displayName || displayName;
            phone = uData.phone || phone;
            address = uData.address || address;
            dbEmailVerified = uData.emailVerified || false;
          }
        } catch (dbErr) {
          console.warn("Could not read profile document on auth reload:", dbErr);
        }

        // If email is not verified on both Auth level and DB level, and it's not a bypass account, do not log them in.
        if (!fUser.emailVerified && !dbEmailVerified && fUser.email !== 'admin@midnightfork.com' && fUser.email !== 'shohan@test.com') {
          useStore.getState().setUser(null);
          return;
        }

        useStore.getState().setUser({
          uid: fUser.uid,
          email: fUser.email || '',
          displayName,
          role,
          phone,
          address
        });
      } else {
        useStore.getState().setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);



  // Run real-time Firestore sync on mount and whenever user authorization changes
  useEffect(() => {
    syncFromFirebase();
  }, [currentUser]);

  // Synchronize the DOM classes with the selected theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Route router switcher
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'menu':
        return <Menu />;
      case 'about':
        return <AboutUs />;
      case 'gallery':
        return <Gallery />;
      case 'reservations':
        return <Reservations />;
      case 'contact':
        return <ContactUs />;
      case 'tracking':
        return <OrderTracking />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <AdminDashboard />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      default:
        return <Home />;
    }
  };



  if (authLoading) {
    return (
      <div className="bg-[#050505] text-slate-100 min-h-screen flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 animate-spin"></div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500/80 animate-pulse block mt-2">
            Midnight Alchemy
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-purple-800 selection:text-white transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#050505] text-white' 
        : 'bg-[#faf9fc] text-slate-900'
    }`}>

      {/* Sticky Premium Header Navigation */}
      <Navbar />

      {/* Custom Cart Notification Modal */}
      <AnimatePresence>
        {cartNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-sm w-full bg-[#121212] border border-purple-500/30 p-6 rounded-2xl text-center shadow-2xl shadow-purple-900/20 overflow-hidden"
            >
              {/* Ambient Glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/15 blur-2xl rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-600/15 blur-2xl rounded-full"></div>

              {/* Success Checkmark Ring */}
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-4 animate-bounce">
                <CheckCircle className="w-6 h-6" />
              </div>

              <h3 className="font-serif font-light text-md text-white tracking-wide mb-1">
                Added to Order
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed px-2 mb-6">
                You added <span className="text-purple-400 font-semibold">{cartNotification.quantity}x</span> of <span className="text-slate-100 font-bold">"{cartNotification.itemName}"</span> to your active delivery tray.
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    closeCartNotification();
                    setActivePage('cart');
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View Tray & Checkout</span>
                </button>
                <button
                  onClick={closeCartNotification}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Content Frame with Entry Fade effects */}
      <main className="flex-grow transition-opacity duration-300">
        {renderActivePage()}
      </main>

      {/* Luxury Brand Footer */}
      <Footer />
    </div>
  );
}
