import React, { useState } from 'react';
import { useStore } from '../store';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Mail, Lock, User, AlertCircle, Phone, MapPin, LogIn } from 'lucide-react';

export const Register: React.FC = () => {
  const { setActivePage, sendNotificationEmail, theme, setUser } = useStore();
  const isLight = theme === 'light';

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Registration states
  const [linkSent, setLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists in Firestore (since uid is random but email is unique)
      const q = query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('This email address is already in use by another patron account.');
        setLoading(false);
        return;
      }

      // Call our secure custom email backend to dispatch the verification link
      const response = await fetch('/api/send-verification-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
          phone,
          address,
          origin: window.location.origin
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch verification email.');
      }

      setLinkSent(true);

      // Trigger Welcome simulated/real notification email
      sendNotificationEmail(email, 'registration_welcome', { 
        customerName: name, 
        id: 'PATRON-' + Math.random().toString(36).substring(2, 7).toUpperCase()
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please check your SMTP configuration or connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-view" className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#faf9fc] text-slate-800' : 'bg-[#050505] text-slate-100'
    }`}>
      <div className={`max-w-md w-full p-8 rounded-2xl border shadow-2xl relative backdrop-blur-md transition-all duration-300 ${
        isLight ? 'bg-white border-purple-100 shadow-[0_10px_30px_rgba(147,51,234,0.02)]' : 'bg-white/5 border-white/10'
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[80px] rounded-full -z-10"></div>

        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-500">
            {linkSent ? 'Verification Sent' : 'Patron Enrollment'}
          </span>
          <h1 className={`text-2xl font-serif font-light mt-1 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {linkSent ? 'Verify Your Email' : 'Register Account'}
          </h1>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {linkSent ? (
          <div className="space-y-6 text-center py-4">
            <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              We have sent you a verification email to <span className="text-purple-400 font-semibold">{email}</span>. Verify it and log in.
            </p>

            <button
              onClick={() => setActivePage('login')}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer font-bold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        ) : (
          <>
            {/* Account Information Details Form */}
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition-colors ${
                    isLight 
                      ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                      : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition-colors ${
                    isLight 
                      ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                      : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition-colors ${
                      isLight 
                        ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                        : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                    }`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition-colors ${
                      isLight 
                        ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                        : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition-colors ${
                      isLight 
                        ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                        : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, Street, Area..."
                    className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition-colors ${
                      isLight 
                        ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                        : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] mt-4 cursor-pointer font-bold"
            >
              <Mail className="w-3.5 h-3.5 animate-pulse" />
              <span>{loading ? 'Creating Account...' : 'Enroll Account'}</span>
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isLight ? 'border-purple-100' : 'border-white/10'}`}></div>
            </div>
            <span className={`relative px-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold ${isLight ? 'bg-white' : 'bg-[#0d0d0d]'}`}>
              OR
            </span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className={`w-full py-3 disabled:opacity-50 font-medium text-[10px] uppercase tracking-widest rounded-lg border flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm ${
              isLight 
                ? 'bg-white border-purple-200 text-slate-700 hover:bg-purple-50/50' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 shadow-md'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>
          </>
        )}

        {/* Footer links */}
        <p className="text-center text-[10px] text-gray-500 mt-6">
          Already a late-night dining patron?{' '}
          <button 
            onClick={() => setActivePage('login')}
            className="text-purple-500 hover:text-purple-600 font-semibold cursor-pointer font-bold"
          >
            Access Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
