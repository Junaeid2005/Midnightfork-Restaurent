import React from 'react';
import { FileText, Compass, AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';

export const TermsConditions: React.FC = () => {
  return (
    <div id="terms-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Patron Contract</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-1 tracking-tight">Terms & Conditions</h1>
          <div className="h-[1px] w-16 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <p className="text-[10px] text-gray-500 font-light mt-4">Effective Date: June 25, 2026. Midnight Fork Culinary House.</p>
        </div>

        {/* Contents */}
        <div className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl shadow-xl space-y-6 text-xs text-gray-400 font-light leading-relaxed backdrop-blur-md">
          
          <div className="space-y-2">
            <h2 className="text-white font-serif font-light flex items-center gap-2 text-sm tracking-wider">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>1. Late Night Delivery Dispatches</span>
            </h2>
            <p>
              Midnight Fork operates specifically during late-night schedules (e.g., up to 4:00 AM). Delivery operations are subject to regional traffic closures, extreme climate disruptions, and physical courier availability inside designated zones of Dhaka.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-white font-serif font-light flex items-center gap-2 text-sm tracking-wider">
              <AlertOctagon className="w-4 h-4 text-purple-400" />
              <span>2. Manual bKash Payments & Cancellations</span>
            </h2>
            <p>
              We enforce a manual bKash validation system. All orders placed remain in a "PENDING PAYMENT VERIFICATION" status until our financial admins audit your submitted bKash TrxID. We reserve the right to cancel any orders with fraudulent or repeated transaction hashes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-white font-serif font-light flex items-center gap-2 text-sm tracking-wider">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>3. Online Table Reservations</span>
            </h2>
            <p>
              Submitting a table booking proposal on our website is a reservation request. The reservation is only active once an admin approves it, generating a "Confirmed" booking status. Patrons must arrive within 15 minutes of their approved slot to retain reservation privileges.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
export default TermsConditions;
