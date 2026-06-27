import React, { useState } from 'react';
import { useStore } from '../store';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, AlertCircle, Phone, MapPin, LogIn } from 'lucide-react';

export const Register: React.FC = () => {
  const { setActivePage, sendNotificationEmail, theme } = useStore();
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
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fUser = userCredential.user;

      // Step 2: Update display name
      await updateProfile(fUser, { displayName: name });

      // Step 3: Save user document to Firestore
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

      // Step 4: Send Firebase Auth Verification Email
      await sendEmailVerification(fUser);

      // Step 5: Immediately sign out to prevent auto login
      await signOut(auth);

      // Step 6: Show verification screen
      setLinkSent(true);

      // Trigger Welcome simulated email
      sendNotificationEmail(email, 'registration_welcome', { 
        customerName: name, 
        id: 'PATRON-' + fUser.uid.slice(0, 5).toUpperCase() 
      });

    } catch (err: any) {
      console.error(err);
      let errMsg = 'Registration failed. Please check your credentials or connection.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email address is already in use by another patron account.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'The password is too weak. Please choose a stronger password.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
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
          /* Account Information Details Form */
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
