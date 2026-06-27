import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { auth, db } from './firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ShieldAlert, CheckCircle, Loader2, Award } from 'lucide-react';

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

  // States for verification link processing
  const [verifyingStatus, setVerifyingStatus] = useState<string | null>(null);
  const [verifyingError, setVerifyingError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);

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

  // Process verify-token query parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('verify-token');
    if (!token) return;

    const performVerification = async () => {
      setVerifyingStatus("Verifying your registration token...");
      setVerifyingError(null);
      setVerificationSuccess(null);

      try {
        // Step 1: Verify token with server backend
        const res = await fetch('/api/verify-registration-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Invalid or expired verification token.");
        }

        // Step 2: Register user in Firebase Authentication
        setVerifyingStatus("Securing credentials and creating account...");
        const { name, email, password, phone, address } = data.registration;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fUser = userCredential.user;

        // Step 3: Update Auth profile
        await updateProfile(fUser, { displayName: name });

        // Step 4: Write Firestore user doc with bypass verification enabled
        setVerifyingStatus("Enrolling patron profile in Firestore...");
        const newUserDoc = {
          uid: fUser.uid,
          email,
          displayName: name,
          role: 'customer' as const,
          phone,
          address,
          emailVerified: true,
          savedAddresses: address ? [address] : [],
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', fUser.uid), newUserDoc);

        // Success - log them in
        useStore.getState().setUser({
          uid: fUser.uid,
          email,
          displayName: name,
          role: 'customer',
          phone,
          address
        });

        setVerificationSuccess("Your email address was successfully verified! Welcome to Midnight Fork.");
        
        // Clear query parameter
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('verify-token');
        window.history.replaceState({}, document.title, cleanUrl.toString());

      } catch (err: any) {
        console.error("Verification failed:", err);
        setVerifyingError(err.message || "Failed to complete email verification.");
      } finally {
        setVerifyingStatus(null);
      }
    };

    performVerification();
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

  const renderVerificationOverlay = () => {
    if (!verifyingStatus && !verifyingError && !verificationSuccess) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-md px-4 font-sans text-xs">
        <div className="max-w-md w-full bg-[#121212] border border-white/10 p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full"></div>
          
          {verifyingStatus && (
            <div className="space-y-6">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              </div>
              <h2 className="text-base font-serif font-light text-white tracking-tight">Email Verification in Progress</h2>
              <p className="text-gray-400 leading-relaxed text-xs">{verifyingStatus}</p>
            </div>
          )}

          {verifyingError && (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-red-950/40 border border-red-500/20 text-red-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-base font-serif font-light text-white tracking-tight">Verification Failed</h2>
              <p className="text-red-400/80 leading-relaxed text-xs">{verifyingError}</p>
              <button
                onClick={() => {
                  setVerifyingError(null);
                  useStore.getState().setActivePage('register');
                }}
                className="w-full py-3 bg-red-900/30 hover:bg-red-900/50 text-red-200 font-semibold uppercase tracking-widest rounded-lg border border-red-500/30 transition-colors cursor-pointer text-[10px]"
              >
                Go to Registration
              </button>
            </div>
          )}

          {verificationSuccess && (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Award className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-base font-serif font-light text-white tracking-tight">Welcome, Verified Patron!</h2>
              <p className="text-purple-300 leading-relaxed text-xs">{verificationSuccess}</p>
              <button
                onClick={() => {
                  setVerificationSuccess(null);
                  useStore.getState().setActivePage('home');
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/20 transition-colors cursor-pointer text-[10px]"
              >
                Access Concierge
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
      {renderVerificationOverlay()}
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
