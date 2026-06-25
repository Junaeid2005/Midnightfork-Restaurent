import React from 'react';
import { Shield, Eye, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div id="privacy-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Legal Architecture</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-1 tracking-tight">Privacy Philosophy</h1>
          <div className="h-[1px] w-16 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <p className="text-[10px] text-gray-500 font-light mt-4">Effective Date: June 25, 2026. Midnight Fork Culinary House.</p>
        </div>

        {/* Contents */}
        <div className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl shadow-xl space-y-6 text-xs text-gray-400 font-light leading-relaxed backdrop-blur-md">
          
          <div className="space-y-2">
            <h2 className="text-white font-serif font-light flex items-center gap-2 text-sm tracking-wider">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>1. Information Collection Vectors</span>
            </h2>
            <p>
              We collect your personal identities, physical home delivery descriptors, active phone hotlines, and manual payment transaction IDs (bKash TrxID) to ensure flawless late-night deliveries and financial validations. No passwords or secure payment keys are processed directly by our servers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-white font-serif font-light flex items-center gap-2 text-sm tracking-wider">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>2. Data Utilization & Processing</span>
            </h2>
            <p>
              Your contact parameters are shared solely with our dedicated kitchen coordinators and evening dispatch couriers. We never sell, lease, or distribute patron metrics to third-party marketing entities.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-white font-serif font-light flex items-center gap-2 text-sm tracking-wider">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>3. Geolocation Anchors</span>
            </h2>
            <p>
              When utilizing our geographic sharing buttons, coordinates are fetched strictly on the client side via standard HTML5 location scopes. The platform stores only the resultant Google Maps locator hyperlink provided voluntarily.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
export default PrivacyPolicy;
