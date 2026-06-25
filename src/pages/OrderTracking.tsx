import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, Compass, AlertCircle, Clock, MapPin, Truck, CheckCircle2, User, RefreshCw } from 'lucide-react';
import { OrderStatus } from '../types';
import { motion } from 'motion/react';

export const OrderTracking: React.FC = () => {
  const { orders, currentTrackingOrderId, setCurrentTrackingOrderId } = useStore();
  const [searchId, setSearchId] = useState('');

  const activeOrder = orders.find(o => o.id === (currentTrackingOrderId || searchId).toUpperCase());

  // Define the 8 sequential tracking steps
  const stepsList: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'PENDING PAYMENT', label: 'Order Received', desc: 'Your order was locked in our database.' },
    { status: 'PENDING PAYMENT VERIFICATION', label: 'Payment Verification', desc: 'Our finance team is auditing your bKash TrxID.' },
    { status: 'PAID', label: 'Payment Confirmed', desc: 'Transaction verified! Preparing queue.' },
    { status: 'PREPARING', label: 'Preparing Food', desc: 'Michelin-recognized experts are crafting your feast.' },
    { status: 'READY', label: 'Ready For Pickup', desc: 'Feast packed in our signature luxury wrapping.' },
    { status: 'READY', label: 'Rider Assigned', desc: 'Late-night dispatch rider assigned to your parcel.' }, // sharing READY status
    { status: 'OUT FOR DELIVERY', label: 'Out For Delivery', desc: 'Rider racing through the silent midnight roads.' },
    { status: 'DELIVERED', label: 'Delivered', desc: 'Feast hand-delivered successfully. Bon Appétit!' }
  ];

  // Helper to determine the current step index based on order status
  const getActiveStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'PENDING PAYMENT': return 0;
      case 'PENDING PAYMENT VERIFICATION': return 1;
      case 'PAID': return 2;
      case 'PREPARING': return 3;
      case 'READY': return 5; // Awaiting dispatch (Rider assigned)
      case 'OUT FOR DELIVERY': return 6;
      case 'DELIVERED': return 7;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getActiveStepIndex(activeOrder.status) : 0;
  const progressPercent = activeOrder ? ((currentStepIdx + 1) / 8) * 100 : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    setCurrentTrackingOrderId(searchId.toUpperCase());
  };
  return (
    <div id="tracking-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Search bar header */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Parcel Vector</span>
          <h1 className="text-3xl sm:text-4.5xl font-serif font-light text-white mt-1 tracking-tight">Live Order Tracking</h1>
          <div className="h-[1px] w-16 bg-purple-500/50 mx-auto mt-3 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          
          <form onSubmit={handleSearchSubmit} className="mt-8 flex max-w-md mx-auto items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g., MF1025)..."
                className="w-full bg-[#050505]/60 border border-white/10 focus:border-purple-600 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-lg shadow-lg shadow-purple-600/15 transition-transform hover:scale-[1.01] cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* Display tracked order */}
        {!activeOrder ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center py-16 text-xs text-gray-400 space-y-3 backdrop-blur-md">
            <Compass className="w-8 h-8 text-gray-500 mx-auto animate-spin" />
            <p>Please insert an active Order ID or log in to view active tracking streams.</p>
            {orders.length > 0 && (
              <div className="pt-2 text-gray-500">
                <span>Try Tracking: </span>
                {orders.slice(0, 3).map((o, idx) => (
                  <button 
                    key={o.id} 
                    onClick={() => {
                      setSearchId(o.id);
                      setCurrentTrackingOrderId(o.id);
                    }}
                    className="text-purple-400 hover:text-white font-mono font-bold mx-1 cursor-pointer"
                  >
                    {o.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Summary status Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl relative backdrop-blur-md">
              <div className="absolute top-0 right-0 w-48 h-32 bg-purple-600/5 blur-[60px] rounded-full"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                <div className="space-y-1">
                  <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono border border-purple-800/30">
                    ORDER {activeOrder.id}
                  </span>
                  <h2 className="text-xs font-extrabold text-white uppercase tracking-widest">
                    {stepsList[currentStepIdx].label}
                  </h2>
                </div>

                <div className="text-xs sm:text-right">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-widest font-semibold">Estimated Delivery Time</span>
                  <span className="text-purple-400 font-bold text-sm">{activeOrder.estimatedDeliveryTime || '35 minutes'}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-light">
                  <span>Progress phase</span>
                  <span className="font-mono">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-[#050505] rounded-lg h-1.5 border border-white/10 overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.7)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 italic font-light pt-1">
                  <span>Last Checked: {activeOrder.lastUpdatedTime}</span>
                  <span>Contact courier: {useStore.getState().settings.phone}</span>
                </div>
              </div>
            </div>

            {/* Timeline details Grid */}
            <div className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h3 className="font-extrabold text-xs uppercase tracking-widest text-white border-b border-white/10 pb-3 mb-6">
                Vector Timetable
              </h3>

              <div className="space-y-6">
                {stepsList.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isActive = idx === currentStepIdx;
                  const isFuture = idx > currentStepIdx;

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Vertical connector line */}
                      {idx !== stepsList.length - 1 && (
                        <div className={`absolute left-2.5 top-5 w-0.5 h-12 -z-10 ${
                          isCompleted ? 'bg-purple-600' : 'bg-white/10'
                        }`}></div>
                      )}

                      {/* Dot icon indicator */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div className="h-5.5 w-5.5 rounded-full bg-purple-600/20 border border-purple-500 text-purple-400 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : isActive ? (
                          <div className="h-5.5 w-5.5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-pulse border border-purple-400">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          </div>
                        ) : (
                          <div className="h-5.5 w-5.5 rounded-full bg-[#050505] border border-white/10 text-slate-700 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-gray-800 rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Step description */}
                      <div className="space-y-0.5 text-xs">
                        <h4 className={`font-semibold tracking-wide ${
                          isActive ? 'text-purple-400 font-extrabold text-xs' : isCompleted ? 'text-slate-300 font-medium' : 'text-slate-600'
                        }`}>
                          {step.label}
                        </h4>
                        <p className={`text-[10px] font-light leading-relaxed ${
                          isActive ? 'text-slate-200' : isCompleted ? 'text-slate-500' : 'text-slate-700'
                        }`}>
                          {step.desc}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location coordinates summary card */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-gray-400 backdrop-blur-md">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Courier Coordinates</span>
                <p className="text-slate-200">{activeOrder.customerName}</p>
                <p className="text-gray-400">{activeOrder.address}, {activeOrder.area}</p>
                <p className="text-gray-400">{activeOrder.city} - {activeOrder.postalCode}</p>
              </div>

              {activeOrder.locationLink && (
                <div className="space-y-1.5 flex flex-col justify-between">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Geographic anchor</span>
                  <a 
                    href={activeOrder.locationLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-purple-400 hover:text-white font-medium hover:underline flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open anchor coordinates</span>
                  </a>
                  {activeOrder.locationNotes && (
                    <p className="text-[10px] text-gray-600 italic mt-1">"Anchor: {activeOrder.locationNotes}"</p>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default OrderTracking;
