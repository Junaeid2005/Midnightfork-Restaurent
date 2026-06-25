import React, { useState } from 'react';
import { useStore } from '../store';
import { User, ClipboardList, Calendar, MapPin, Key, Clock, LogOut, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';

export const Profile: React.FC = () => {
  const { 
    currentUser, setUser, 
    orders, reservations, logout,
    activeCustomerTab, setActiveCustomerTab,
    setCurrentTrackingOrderId, setActivePage
  } = useStore();

  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-[#050505] text-slate-100 min-h-screen flex items-center justify-center font-sans py-12 px-4">
        <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-sm space-y-4 backdrop-blur-md">
          <AlertCircle className="w-12 h-12 text-purple-400 mx-auto" />
          <h2 className="font-semibold uppercase tracking-widest text-xs text-white">Dashboard Unavailable</h2>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Please authenticate using your patron credentials to access active logs, table bookings, and delivery tracking.
          </p>
          <button
            onClick={() => setActivePage('login')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-widest uppercase rounded-lg cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess(false);

    try {
      if (currentUser.uid.startsWith('demo-')) {
        // Mock success for demo account
        setTimeout(() => {
          setUser({ ...currentUser, displayName: name, phone, address });
          setSuccess(true);
          setUpdating(false);
        }, 500);
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { displayName: name, phone, address });
      
      setUser({ ...currentUser, displayName: name, phone, address });
      setSuccess(true);
    } catch (err: any) {
      setError('Failed to update user profile doc. Try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING PAYMENT': return 'bg-orange-950/40 text-orange-400 border border-orange-900/30';
      case 'PENDING PAYMENT VERIFICATION': return 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/30';
      case 'PAID': return 'bg-blue-950/40 text-blue-400 border border-blue-900/30';
      case 'PREPARING': return 'bg-purple-950/40 text-purple-400 border border-purple-900/30';
      case 'READY': return 'bg-teal-950/40 text-teal-400 border border-teal-900/30';
      case 'OUT FOR DELIVERY': return 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 animate-pulse';
      case 'DELIVERED': return 'bg-green-950/40 text-green-400 border border-green-900/30';
      default: return 'bg-red-950/40 text-red-400 border border-red-900/30';
    }
  };

  const handleTrackOrderClick = (orderId: string) => {
    setCurrentTrackingOrderId(orderId);
    setActivePage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="customer-profile" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6 shrink-0 backdrop-blur-md">
          <div className="text-center pb-4 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center text-xl font-bold text-white mx-auto shadow-xl">
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-semibold text-xs uppercase tracking-widest text-white mt-3 truncate">{currentUser.displayName}</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-0.5 truncate">{currentUser.email}</p>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-1.5 text-xs">
            <button
              onClick={() => setActiveCustomerTab('profile')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-lg hover:text-white transition-all text-left font-semibold cursor-pointer ${
                activeCustomerTab === 'profile'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patron Profile</span>
            </button>
            <button
              onClick={() => setActiveCustomerTab('orders')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-lg hover:text-white transition-all text-left font-semibold relative cursor-pointer ${
                activeCustomerTab === 'orders'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Active Orders</span>
              {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length > 0 && (
                <span className="absolute right-3 bg-purple-950 border border-purple-400 text-purple-300 rounded-full px-1.5 py-0.5 text-[8px] font-bold">
                  {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveCustomerTab('reservations')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-lg hover:text-white transition-all text-left font-semibold cursor-pointer ${
                activeCustomerTab === 'reservations'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Reservations</span>
            </button>
            <button
              onClick={() => setActiveCustomerTab('addresses')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-lg hover:text-white transition-all text-left font-semibold cursor-pointer ${
                activeCustomerTab === 'addresses'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={async () => {
                await logout();
              }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950/20 hover:text-white transition-all text-left font-semibold mt-4 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Dashboard Panels */}
        <div className="md:col-span-9 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl relative backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] rounded-full -z-10"></div>
          
          {/* TAB 1: PROFILE INFORMATION */}
          {activeCustomerTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">Patron Information</h2>
                <p className="text-gray-400 text-xs mt-1 font-light">View and customize your late-night delivery and identity parameters.</p>
              </div>

              {success && (
                <div className="p-3 bg-green-950/40 border border-green-800/30 rounded-lg text-green-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Profile variables committed successfully.</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1712-345678"
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-[#050505]/40 border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 focus:outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Default Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House Number, Flat, Street name, Area/Zone, Dhaka"
                    rows={3}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 transition-all cursor-pointer"
                >
                  {updating ? 'Committing changes...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ACTIVE & INACTIVE ORDERS */}
          {activeCustomerTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">Your Orders</h2>
                <p className="text-gray-400 text-xs mt-1 font-light">Track delivery vectors, review past invoice details, and verify pending bKash transactions.</p>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-[#050505]/40 border border-white/10 rounded-lg">
                    <p className="text-gray-500 text-xs font-light">You have not submitted any food orders yet.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-5 bg-[#050505]/40 border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs">{order.id}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] text-gray-500 font-light">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-light max-w-sm truncate">
                          {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                        </p>
                        <div className="pt-1 flex items-center gap-4 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          <span>💵 Total: <strong className="text-purple-300 font-bold">${order.total.toFixed(2)}</strong></span>
                          <span>⌚ {order.lastUpdatedTime}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest text-center uppercase ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {/* Invoice Button */}
                          <button
                            onClick={() => {
                              alert(`PRINT INVOICE:\n\nMidnight Fork Restaurant\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}`);
                            }}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 font-semibold uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                          >
                            Invoice
                          </button>

                          {/* Live Track Trigger */}
                          <button
                            onClick={() => handleTrackOrderClick(order.id)}
                            className="px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white text-[10px] font-bold uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                          >
                            Live Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RESERVATIONS */}
          {activeCustomerTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">Table Reservations</h2>
                  <p className="text-gray-400 text-xs mt-1 font-light">Admit details and statuses for table bookings at Midnight Fork.</p>
                </div>
                <button
                  onClick={() => setActivePage('reservations')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg transition-transform hover:scale-102 shrink-0 cursor-pointer"
                >
                  Book New Table
                </button>
              </div>

              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="text-center py-12 bg-[#050505]/40 border border-white/10 rounded-lg">
                    <p className="text-gray-500 text-xs font-light">You have no active or historical reservations.</p>
                  </div>
                ) : (
                  reservations.map((res) => (
                    <div key={res.id} className="p-4 bg-[#050505]/40 border border-white/10 rounded-lg flex items-center justify-between gap-4">
                      <div className="space-y-1 text-xs font-light">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{res.date}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{res.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">👥 Party: {res.guests} Guests</p>
                        {res.notes && (
                          <p className="text-[10px] text-gray-500 italic">"Notes: {res.notes}"</p>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase ${getStatusStyle(res.status === 'Approved' ? 'PAID' : res.status === 'Rejected' ? 'CANCELLED' : 'PENDING PAYMENT')}`}>
                        {res.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeCustomerTab === 'addresses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">Saved Delivery Locations</h2>
                <p className="text-gray-400 text-xs mt-1 font-light">Manage geographic descriptors for zero-friction night deliveries.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.address ? (
                  <div className="p-4 bg-[#050505]/40 border border-white/10 rounded-lg flex flex-col justify-between h-36 relative">
                    <MapPin className="absolute top-4 right-4 w-5 h-5 text-purple-400" />
                    <div>
                      <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border border-purple-800/30">
                        Default Home
                      </span>
                      <p className="text-xs text-slate-300 font-light mt-3 leading-relaxed">
                        {currentUser.address}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500 italic font-light pt-2 border-t border-white/10">Primary coordinate</span>
                  </div>
                ) : (
                  <div className="sm:col-span-2 text-center py-12 bg-[#050505]/40 border border-white/10 rounded-lg">
                    <p className="text-gray-500 text-xs font-light">No saved delivery addresses yet. Please update in Patron Profile.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default Profile;
