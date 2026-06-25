import React, { useState } from 'react';
import { useStore } from '../store';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, PlusCircle, AlertCircle, Phone, MapPin, KeyRound, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';

export const Register: React.FC = () => {
  const { setUser, setActivePage, sendNotificationEmail, theme } = useStore();
  const isLight = theme === 'light';

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [simulatedUrl, setSimulatedUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpError('');
    setSimulatedUrl('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setOtpLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        if (data.isTestAccount && data.previewUrl) {
          setSimulatedUrl(data.previewUrl);
        }
      } else {
        setError(data.message || 'Failed to dispatch verification code. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Connection to email server failed. Please check your internet or try again later.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegisterWithOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpError('');
    setLoading(true);

    try {
      // Step 1: Verify the OTP with backend
      const verifyResponse = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        setOtpError(verifyData.message || 'Invalid verification code. Please check your inbox.');
        setLoading(false);
        return;
      }

      // Step 2: Proceed with Direct Firebase Auth Registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fUser = userCredential.user;

      // Update auth profile display name
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

      // Set state
      setUser(newUserDoc);

      // Trigger Welcome simulated email
      sendNotificationEmail(email, 'registration_welcome', { 
        customerName: name, 
        id: 'PATRON-' + fUser.uid.slice(0, 5).toUpperCase() 
      });

      alert('Patron enrollment successful! Welcome to Midnight Fork.');
      setActivePage('home');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please check your credentials or connection.');
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
            {otpSent ? 'Security Verification' : 'Patron Enrollment'}
          </span>
          <h1 className={`text-2xl font-serif font-light mt-1 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {otpSent ? 'Verify Your Email' : 'Register Account'}
          </h1>
          {otpSent && (
            <p className="text-gray-400 text-[11px] mt-2">
              We have sent a 6-digit verification code to <span className="text-purple-400 font-semibold">{email}</span>.
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {otpError && (
          <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{otpError}</span>
          </div>
        )}

        {simulatedUrl && (
          <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-lg text-purple-300 text-[11px] mb-6 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-purple-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Sandbox Environment Email Link:
            </p>
            <p>Real SMTP is not configured. View the verification code directly in the sandbox email preview below:</p>
            <a
              href={simulatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              <span>View Sandbox Email</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {!otpSent ? (
          /* Step 1: Account Information Details Form */
          <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
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
              disabled={otpLoading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] mt-4 cursor-pointer font-bold"
            >
              <Mail className="w-3.5 h-3.5 animate-pulse" />
              <span>{otpLoading ? 'Sending Verification Code...' : 'Send Verification OTP'}</span>
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification Code Entrance Form */
          <form onSubmit={handleRegisterWithOTP} className="space-y-6 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">
                6-Digit Verification Code
              </label>
              <div className="relative max-w-[200px] mx-auto">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  maxLength={6}
                  pattern="\d{6}"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-center text-sm font-bold tracking-[0.2em] focus:outline-none focus:border-purple-600 transition-colors ${
                    isLight 
                      ? 'bg-purple-50/30 border-purple-200 text-slate-900 focus:bg-white' 
                      : 'bg-[#050505]/60 border-white/10 text-slate-100 focus:border-purple-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] cursor-pointer font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{loading ? 'Verifying & Registering...' : 'Verify & Register Account'}</span>
              </button>

              <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex items-center gap-1 hover:text-purple-400 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Account Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="flex items-center gap-1 hover:text-purple-400 font-medium disabled:opacity-55 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${otpLoading ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              </div>
            </div>
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
