import React, { useState } from 'react';
import { useStore } from '../store';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, User, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { setUser, setActivePage } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manual Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let fUser;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        fUser = userCredential.user;
      } catch (signInErr: any) {
        // If it's a known quick-select account and hasn't been created yet in Firebase Auth, let's auto-register it!
        const isQuickSelectAccount = email === 'shohan@test.com' || email === 'admin@midnightfork.com';
        if (isQuickSelectAccount && (signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-login-credentials')) {
          const registerCredential = await createUserWithEmailAndPassword(auth, email, password);
          fUser = registerCredential.user;
          
          const isDemoAdmin = email === 'admin@midnightfork.com';
          const newUserObj = {
            uid: fUser.uid,
            email: fUser.email || '',
            displayName: isDemoAdmin ? 'Demo Admin' : 'Shohan (Patron)',
            role: isDemoAdmin ? ('admin' as const) : ('customer' as const),
            phone: isDemoAdmin ? '+880 1711-223344' : '+880 1911-556677',
            address: isDemoAdmin ? 'Midnight Fork HQ, Banani, Dhaka' : 'Dhanmondi, Road 27, Dhaka',
            createdAt: new Date().toISOString()
          };
          try {
            await setDoc(doc(db, 'users', fUser.uid), newUserObj);
          } catch (writeErr) {
            console.warn("Could not write initial profile document inside auto-registration:", writeErr);
          }
        } else {
          throw signInErr;
        }
      }

      // Check user role in firestore
      let role: 'customer' | 'admin' = email === 'admin@midnightfork.com' ? 'admin' : 'customer';
      let displayName = email === 'admin@midnightfork.com' ? 'Demo Admin' : (email === 'shohan@test.com' ? 'Shohan (Patron)' : (fUser.email?.split('@')[0] || 'Customer'));
      let phone = email === 'admin@midnightfork.com' ? '+880 1711-223344' : (email === 'shohan@test.com' ? '+880 1911-556677' : '');
      let address = email === 'admin@midnightfork.com' ? 'Midnight Fork HQ, Banani, Dhaka' : (email === 'shohan@test.com' ? 'Dhanmondi, Road 27, Dhaka' : '');

      try {
        const docSnap = await getDoc(doc(db, 'users', fUser.uid));
        if (docSnap.exists()) {
          const uData = docSnap.data();
          role = uData.role || role;
          displayName = uData.displayName || displayName;
          phone = uData.phone || phone;
          address = uData.address || address;
        } else {
          // Fallback for new user without explicit doc
          const newUserObj = {
            uid: fUser.uid,
            email: fUser.email || '',
            displayName,
            role
          };
          try {
            await setDoc(doc(db, 'users', fUser.uid), newUserObj);
          } catch (writeErr) {
            console.warn("Could not save fallback profile document in Firestore:", writeErr);
          }
        }
      } catch (dbErr) {
        console.warn("Could not read profile document from Firestore, applying local user attributes instead:", dbErr);
      }

      setUser({
        uid: fUser.uid,
        email: fUser.email || '',
        displayName,
        role,
        phone,
        address
      });

      setActivePage('home');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid credentials. If you are registering a new account, please click "Register Here" below.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const fUser = userCredential.user;

      let role: 'customer' | 'admin' = 'customer';
      let displayName = fUser.displayName || 'Google Patron';
      let phone = '';
      let address = '';

      try {
        const docRef = doc(db, 'users', fUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          role = data.role || 'customer';
          displayName = data.displayName || displayName;
          phone = data.phone || '';
          address = data.address || '';
        } else {
          // Save new Google user
          const newDoc = {
            uid: fUser.uid,
            email: fUser.email || '',
            displayName,
            role: 'customer',
            createdAt: new Date().toISOString()
          };
          try {
            await setDoc(docRef, newDoc);
          } catch (writeErr) {
            console.warn("Could not write Google profile to Firestore:", writeErr);
          }
        }
      } catch (dbErr) {
        console.warn("Could not read Google profile from Firestore, using default profile info:", dbErr);
      }

      setUser({
        uid: fUser.uid,
        email: fUser.email || '',
        displayName,
        role,
        phone,
        address
      });

      setActivePage('home');
    } catch (err: any) {
      console.error(err);
      setError('Google Sign-In failed or was closed by the frame security rules.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Access
  const handleDemoAccess = (role: 'customer' | 'admin') => {
    setLoading(true);
    setTimeout(() => {
      if (role === 'admin') {
        setUser({
          uid: 'demo-admin-id-999',
          email: 'admin@midnightfork.com',
          displayName: 'Executive Chef Admin',
          role: 'admin',
          phone: '+880 1711-222333',
          address: 'Main Command, Midnight Fork Banani'
        });
      } else {
        setUser({
          uid: 'demo-customer-id-888',
          email: 'shohan@test.com',
          displayName: 'Junaeid Shohan',
          role: 'customer',
          phone: '+880 1712-345678',
          address: 'House 42, Road 11, Banani, Dhaka'
        });
      }
      setLoading(false);
      setActivePage('home');
    }, 500);
  };

  return (
    <div id="login-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background elegant lighting orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-600/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/[0.03] p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative backdrop-blur-md transition-all duration-300 hover:border-white/15">
        
        {/* Soft upper violet glow spot inside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-purple-500/10 blur-[30px] rounded-full pointer-events-none"></div>
        
        {/* Decorative Floating Crest Badge */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full"></div>
            <div className="relative w-12 h-12 rounded-full bg-[#0d0d0d] border border-white/10 flex items-center justify-center text-purple-400 shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-light text-white tracking-tight">Sign In</h1>
          <p className="text-xs text-gray-400 mt-2 font-light">Access your patron profile</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-[#050505]/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050505]/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 transition-all duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{loading ? 'Entering atmosphere...' : 'Authenticate'}</span>
          </button>
        </form>
<div className="mt-4">
  <button
    onClick={handleGoogleSignIn}
    disabled={loading}
    className="w-full py-3 border border-gray-700 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition flex items-center justify-center gap-3 font-medium cursor-pointer rounded-lg"
  >
    Continue with Google
  </button>
</div>
        {/* Footer links */}
        <p className="text-center text-[10px] text-gray-500 mt-6">
          Don't have a late-night patron account yet?{' '}
          <button 
            onClick={() => setActivePage('register')}
            className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer transition-colors"
          >
            Register Here
          </button>
        </p>

      </div>
    </div>
  );
};
export default Login;
