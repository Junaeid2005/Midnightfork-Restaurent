import React from 'react';
import { Compass, Clock, Award, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutUs: React.FC = () => {
  const leadership = [
    { name: 'Chef Julianne Ray', role: 'Executive Culinary Artist', bio: 'Former Head of Gastronomy at Michelin-starred Le Saphir, Paris. Passionate about marrying lavender extracts with game meats.', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Tahmid Rahman', role: 'Chief Sommelier & Mixologist', bio: 'Renowned Dhaka-based flavor scientist, inventor of the color-shifting Midnight Orchid Elixir.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { name: 'Fardeen Khan', role: 'Maitre d\'Hôtel', bio: 'Over 15 years overseeing luxury hospitality across top-tier South Asian dining establishments.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
  ];

  return (
    <div id="about-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Our Heritage</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 tracking-tight">The Story of Midnight Fork</h1>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-light text-white mb-4 tracking-tight">Born in the Midnight Hours</h2>
            <p className="text-gray-400 text-xs font-light leading-relaxed mb-4">
              Founded in 2024, Midnight Fork was born out of a simple observation: Dhaka's finest minds, creatives, and night-owls had limited premium dining options when the clock struck midnight. Fast-food and roadside stalls were plentiful, but a sanctuary of quiet luxury, masterclass culinary art, and violet glow was missing.
            </p>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              We envisioned a space where patrons could indulge in pan-seared dry-aged Wagyu ribeyes, handcrafted fig and gorgonzola pizzas, and color-shifting floral mocktails at 2:00 AM. A place where fine service is delivered with absolute precision directly to your dining table or residential address, fully integrated with seamless electronic payments.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 border border-white/10 shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80" 
              alt="Kitchen crafting" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-20 relative backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px] rounded-full"></div>
          <h2 className="text-center text-xs uppercase font-extrabold tracking-widest text-white mb-8">Culinary Philosophies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-purple-400 text-sm font-semibold">✨ Precision</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                Every micro-herb is placed using precise culinary tweezers. Every steak rests exactly five minutes before plating to seal juices and aroma.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-purple-400 text-sm font-semibold">🌱 Integrity</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                No artificial food colourings or flavour enhancers. Our purple hues come entirely from red cabbage water, butterfly pea flowers, and fresh ube purée.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-purple-400 text-sm font-semibold">🛋️ Sanctum</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                A physical and virtual refuge of high-contrast elegance. Midnight is when thoughts settle and senses elevate — we design our service to mirror that serenity.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-center text-lg uppercase font-bold text-white mb-12">The Masters Behind The Craft</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((member, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl text-center p-6 backdrop-blur-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-white/10 shadow-lg"
                />
                <h3 className="font-semibold text-sm text-white uppercase tracking-wider">{member.name}</h3>
                <p className="text-[10px] text-purple-400 font-bold tracking-widest mt-1 uppercase">{member.role}</p>
                <p className="text-gray-400 text-[11px] mt-4 font-light leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default AboutUs;
