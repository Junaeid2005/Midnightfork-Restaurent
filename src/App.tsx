import React, { useEffect } from 'react';
import { useStore } from './store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { auth, db } from './firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  const { activePage, syncFromFirebase, currentUser, theme, authLoading } = useStore();
  const [verifying, setVerifying] = React.useState(false);

  // Parse verification-token on startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify-token');
    
    if (token) {
      setVerifying(true);
      
      // Clean query parameters from URL immediately to keep it clean
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);

      // Verify the token with backend
      fetch('/api/verify-registration-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.success) {
          throw new Error(data.message || 'Verification failed.');
        }

        const { name, email, password, phone, address } = data.registration;

        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fUser = userCredential.user;

        await updateProfile(fUser, { displayName: name });

        // Save user doc to Firestore
        const newUserDoc = {
          uid: fUser.uid,
          email: fUser.email || '',
          displayName: name,
          role: 'customer' as const,
          phone,
          address,
          savedAddresses: address ? [address] : [],
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', fUser.uid), newUserDoc);

        // Update state
        useStore.getState().setUser(newUserDoc);

        // Trigger Welcome simulated email
        useStore.getState().sendNotificationEmail(email, 'registration_welcome', { 
          customerName: name, 
          id: 'PATRON-' + fUser.uid.slice(0, 5).toUpperCase() 
        });

        alert('Email verified & Patron enrollment successful! Welcome to Midnight Fork.');
        useStore.getState().setActivePage('home');
      })
      .catch((err: any) => {
        console.error(err);
        alert(err.message || 'Failed to verify email link. Please try registering again.');
        useStore.getState().setActivePage('register');
      })
      .finally(() => {
        setVerifying(false);
      });
    }
  }, []);

  // Listen to Firebase authentication state on startup to retain session after refresh
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        // Fetch full profile info from Firestore
        let role: 'customer' | 'admin' = fUser.email === 'admin@midnightfork.com' ? 'admin' : 'customer';
        let displayName = fUser.email === 'admin@midnightfork.com' ? 'Demo Admin' : (fUser.email?.split('@')[0] || 'Customer');
        let phone = fUser.email === 'admin@midnightfork.com' ? '+880 1711-223344' : '';
        let address = fUser.email === 'admin@midnightfork.com' ? 'Midnight Fork HQ, Banani, Dhaka' : '';

        try {
          const docSnap = await getDoc(doc(db, 'users', fUser.uid));
          if (docSnap.exists()) {
            const uData = docSnap.data();
            role = uData.role || role;
            displayName = uData.displayName || displayName;
            phone = uData.phone || phone;
            address = uData.address || address;
          }
        } catch (dbErr) {
          console.warn("Could not read profile document on auth reload:", dbErr);
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

  if (verifying) {
    return (
      <div className="bg-[#050505] text-slate-100 min-h-screen flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 animate-spin"></div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500 animate-pulse block mt-2">
            Verifying Patron Credentials...
          </span>
          <p className="text-xs text-gray-400">Completing secure enrollment, please do not close this window.</p>
        </div>
      </div>
    );
  }

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

      {/* Dynamic Content Frame with Entry Fade effects */}
      <main className="flex-grow transition-opacity duration-300">
        {renderActivePage()}
      </main>

      {/* Luxury Brand Footer */}
      <Footer />
    </div>
  );
}
