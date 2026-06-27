import React, { useState } from 'react';
import { useStore } from '../store';
import { MapPin, Phone, Mail, User, AlertCircle, Copy, Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout: React.FC = () => {
  const { cart, clearCart, currentUser, placeOrder, submitPaymentVerification, settings, setCurrentTrackingOrderId, setActivePage, showAlert } = useStore();

  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  
  // Location System
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [optionalNotes, setOptionalNotes] = useState('');

  // bKash transaction workflow
  const [bKashSender, setBKashSender] = useState('');
  const [bKashTrxId, setBKashTrxId] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  
  const [step, setStep] = useState<1 | 2>(1); // 1: Delivery Details, 2: bKash Transfer Workspace
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Completed order summary variables
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : settings.deliveryCharge;
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + deliveryFee + tax;

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const gMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
          setLocationLink(gMapsLink);
          showAlert('Location Synced', 'Coordinates synced! Google Maps Location URL populated successfully.', 'success');
        },
        (error) => {
          console.error(error);
          showAlert('Location Error', 'Geolocation failed or permission denied. Please paste your Google Maps URL manually.', 'error');
        }
      );
    } else {
      showAlert('Unsupported Browser', 'Geolocation is not supported by your browser. Please paste your Google Maps URL manually.', 'error');
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !email || !address || !area || !city || !postalCode) {
      setError('Please fill in all geographic and contact fields before continuing.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Order in database (sets state to PENDING PAYMENT)
      const order = await placeOrder({
        customerName: name,
        email,
        phone,
        address,
        area,
        city,
        postalCode,
        locationLink,
        locationNotes,
        notes: optionalNotes,
        items: cart,
        subtotal,
        deliveryFee,
        tax,
        total: grandTotal
      });

      setCreatedOrder(order);
      setPaymentReference(order.paymentReference);
      setStep(2); // Jump to bKash workflow
    } catch (err) {
      setError('Failed to log delivery parameters. Check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bKashSender || !bKashTrxId) {
      setError('Sender Number and transaction TrxID are mandatory to verify bKash receipts.');
      return;
    }

    setLoading(true);
    try {
      // Step 2: Submit transaction particulars
      await submitPaymentVerification(
        createdOrder.id,
        bKashSender,
        bKashTrxId,
        paymentReference
      );

      // Trigger automatic receipt verification notification
      useStore.getState().sendNotificationEmail(email, 'pending_payment_verification', {
        customerName: name,
        id: createdOrder.id,
        bKashTrxId,
        bKashSender
      });

      showAlert('Receipt Submitted', 'bKash particulars submitted successfully! An administrator is verifying your receipt.', 'success');
      clearCart();
      setCurrentTrackingOrderId(createdOrder.id);
      setActivePage('tracking'); // Redirect to tracking timeline
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to submit receipt details. Retry or contact concierge.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(settings.bKashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="checkout-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Checkout</span>
          <h1 className="text-3xl sm:text-4.5xl font-serif font-light text-white mt-1 tracking-tight">
            {step === 1 ? 'Dispatch Details' : 'Manual bKash Transfer'}
          </h1>
          <div className="h-[1px] w-16 bg-purple-500/50 mx-auto mt-3 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
        </div>

        {!currentUser ? (
          <div className="text-center py-16 px-6 bg-white/5 border border-white/10 rounded-2xl max-w-md mx-auto backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full"></div>
            <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-serif text-white mb-2 font-light">Patron Verification Required</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              To place gourmet orders and enable real-time dispatch tracking, please sign into your verified Midnight Fork patron account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => { setActivePage('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase rounded-lg cursor-pointer tracking-wider transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setActivePage('register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-[10px] uppercase rounded-lg cursor-pointer tracking-wider transition-colors"
              >
                Register Account
              </button>
            </div>
          </div>
        ) : cart.length === 0 && step === 1 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl max-w-sm mx-auto backdrop-blur-md">
            <p className="text-gray-400 text-xs">No active items inside basket to checkout.</p>
            <button onClick={() => setActivePage('menu')} className="mt-4 px-4 py-2 bg-purple-600 text-white font-semibold text-[10px] uppercase rounded-lg cursor-pointer">
              Back to manuscript
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Step 1: Contact and location details form */}
            {step === 1 ? (
              <div className="md:col-span-7 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative backdrop-blur-md">
                <div className="absolute top-0 right-0 w-48 h-32 bg-purple-600/5 blur-[60px] rounded-full"></div>
                
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Dispatch Coordinate collection</span>
                </h2>

                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2 mb-6">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleDetailsSubmit} className="space-y-4 text-xs">
                  
                  {/* Personal details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1712-345678"
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      placeholder="jane@example.com"
                      className="w-full bg-[#050505]/40 border border-white/5 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed focus:outline-none"
                      required
                    />
                    <p className="text-[9px] text-purple-400/60 mt-1">Locked to your verified patron account email.</p>
                  </div>

                  {/* Delivery Location descriptors */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Delivery Address *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, House, Street..."
                      rows={2.5}
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Area / Zone *</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="E.g., Banani, Gulshan..."
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Postal Code *</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="1212"
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Google Maps link & Notes */}
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="space-y-0.5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Google Maps Location Link</label>
                        <p className="text-[10px] text-gray-500 font-light">Share your direct residential coordinates link.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleShareLocation}
                        className="px-4 py-2 bg-[#050505]/40 hover:bg-purple-600 text-purple-400 hover:text-white border border-white/10 rounded-lg font-bold text-[9px] tracking-widest uppercase transition-all cursor-pointer"
                      >
                        Share Your Location
                      </button>
                    </div>

                    <input
                      type="url"
                      value={locationLink}
                      onChange={(e) => setLocationLink(e.target.value)}
                      placeholder="Paste google maps coordinate link here..."
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    />

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Location Notes</label>
                      <input
                        type="text"
                        value={locationNotes}
                        onChange={(e) => setLocationNotes(e.target.value)}
                        placeholder="E.g., Beside Banani graveyard, 4th floor flat B..."
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Optional Courier Instructions</label>
                      <input
                        type="text"
                        value={optionalNotes}
                        onChange={(e) => setOptionalNotes(e.target.value)}
                        placeholder="Leave at reception, call when arriving..."
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
                  >
                    <span>Proceed To Payment Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              </div>
            ) : (
              // Step 2: manual personal bKash workspace
              <div className="md:col-span-7 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative space-y-6 backdrop-blur-md">
                <div className="absolute top-0 right-0 w-48 h-32 bg-purple-600/5 blur-[60px] rounded-full"></div>
                
                <div className="text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600/10 border border-pink-500/20 text-pink-500 font-extrabold text-sm mb-2 font-mono">
                    bK
                  </div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-white">Personal bKash Transfer Desk</h2>
                  <p className="text-gray-400 text-[10px] font-light mt-1 max-w-sm mx-auto">
                    Transfer the grand total manually. Reference mapping secures automatic validation logs.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Instructions Box */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-xs leading-relaxed space-y-3 font-light text-gray-300">
                  <div className="flex items-center gap-2 text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Payment Guidelines</span>
                  </div>
                  <p>
                    1. Send the exact grand total <strong className="text-white font-bold">${grandTotal.toFixed(2)}</strong> to the restaurant personal bKash number below.
                  </p>
                  <p>
                    2. <strong className="text-purple-300 font-bold">CRITICAL:</strong> Input the Payment Reference Code <strong className="text-white font-bold">"{paymentReference}"</strong> in the Reference field of your bKash transaction.
                  </p>
                </div>

                {/* bKash Details Block */}
                <div className="p-4 bg-[#050505]/40 border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: copy box */}
                  <div className="sm:col-span-7 space-y-3">
                    <div className="space-y-0.5 text-xs">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Restaurant bKash Number</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-extrabold text-white text-base font-mono">{settings.bKashNumber}</span>
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                          title="Copy Number"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Required Payment Reference</span>
                      <div className="text-purple-400 font-mono font-bold text-sm">{paymentReference}</div>
                    </div>
                  </div>

                  {/* Right: Simulated QR Code */}
                  <div className="sm:col-span-5 flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg h-24 w-24 flex items-center justify-center border-2 border-pink-500/25 relative shadow-lg">
                      {/* Simple visual QR representation */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                        <rect x="0" y="0" width="25" height="25" fill="black" />
                        <rect x="75" y="0" width="25" height="25" fill="black" />
                        <rect x="0" y="75" width="25" height="25" fill="black" />
                        <rect x="10" y="10" width="5" height="5" fill="white" />
                        <rect x="85" y="10" width="5" height="5" fill="white" />
                        <rect x="10" y="85" width="5" height="5" fill="white" />
                        <rect x="40" y="40" width="20" height="20" fill="#db2777" /> {/* bKash Pink central node */}
                        {/* Fake noise pixels */}
                        <rect x="30" y="10" width="10" height="10" fill="black" />
                        <rect x="50" y="20" width="5" height="15" fill="black" />
                        <rect x="15" y="45" width="15" height="5" fill="black" />
                        <rect x="75" y="55" width="15" height="10" fill="black" />
                      </svg>
                      {/* overlay badge */}
                      <div className="absolute -bottom-1 bg-pink-600 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase font-mono shadow">bKash</div>
                    </div>
                    <span className="text-[9px] text-gray-500 font-light mt-2">Scan with bKash App</span>
                  </div>

                </div>

                {/* Submit Receipt Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Sender bKash Number *</label>
                    <input
                      type="tel"
                      value={bKashSender}
                      onChange={(e) => setBKashSender(e.target.value)}
                      placeholder="E.g., 017xxxxxxxx"
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      value={bKashTrxId}
                      onChange={(e) => setBKashTrxId(e.target.value)}
                      placeholder="E.g., AM93KLS29"
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors font-mono uppercase"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
                  >
                    <span>Submit Payment Verification</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-gray-500 hover:text-gray-300 text-[10px] font-bold uppercase tracking-widest transition-colors mt-2 cursor-pointer"
                  >
                    &larr; Back to delivery details
                  </button>
                </form>
              </div>
            )}

            {/* Right: Cart Summary column */}
            <div className="md:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between shadow-2xl relative space-y-6 backdrop-blur-md">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-white border-b border-white/10 pb-3 mb-4">
                  Basket Review
                </h3>
                
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.menuItem.id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-light truncate max-w-[150px]">{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-semibold text-slate-200">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total calculations block */}
              <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs text-gray-400 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Midnight Delivery</span>
                  <span className="font-semibold text-slate-200">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastronomy Tax (15%)</span>
                  <span className="font-semibold text-slate-200">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between text-xs font-bold uppercase tracking-widest text-white">
                  <span>Total Amount Due</span>
                  <span className="text-purple-400 font-extrabold text-sm">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default Checkout;
