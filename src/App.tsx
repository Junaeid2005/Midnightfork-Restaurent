import React, { useEffect } from 'react';
import { useStore } from './store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

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
  const { activePage, syncFromFirebase, currentUser, theme } = useStore();

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

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-purple-800 selection:text-white transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#050505] text-white' 
        : 'bg-[#faf9fc] text-slate-900'
    }`}>
      {/* Sticky Premium Header Navigation */}
      <Navbar />

      {/* Dynamic Content Frame with Entry Fade effects */}
      <main className="flex-grow transition-opacity duration-300">
        {renderActivePage()}
      </main>

      {/* Luxury Brand Footer */}
      <Footer />
    </div>
  );
}
