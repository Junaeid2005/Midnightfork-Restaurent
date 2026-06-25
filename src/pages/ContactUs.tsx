import React, { useState } from 'react';
import { useStore } from '../store';
import { Mail, Phone, MapPin, Send, MessageSquareCode, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactUs: React.FC = () => {
  const { settings } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div id="contact-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Concierge Desk</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 tracking-tight">Connect With Us</h1>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <p className="text-gray-400 text-xs font-light max-w-2xl mx-auto mt-4 leading-relaxed">
            Have a catering inquiry, want to propose a private lounge booking, or need support with an ongoing delivery order? Get in touch with our concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Coordinates Details Cards */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Phone */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 backdrop-blur-md">
              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-purple-400 h-fit">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-semibold text-white uppercase tracking-wider text-[10px]">Direct Hotlines</h3>
                <p className="text-gray-400 font-light">Available for phone orders and inquiries until 4:00 AM.</p>
                <a href={`tel:${settings.phone}`} className="text-purple-300 font-bold block mt-1 hover:text-white transition-colors">{settings.phone}</a>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 backdrop-blur-md">
              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-purple-400 h-fit">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-semibold text-white uppercase tracking-wider text-[10px]">Email Concierge</h3>
                <p className="text-gray-400 font-light">We aim to respond to general business proposals within 24 hours.</p>
                <a href={`mailto:${settings.email}`} className="text-purple-300 font-bold block mt-1 hover:text-white transition-colors">{settings.email}</a>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 backdrop-blur-md">
              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-purple-400 h-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-semibold text-white uppercase tracking-wider text-[10px]">Culinary House</h3>
                <p className="text-gray-400 font-light">Experience the luxury in person. Centered in the heart of Dhaka.</p>
                <p className="text-slate-200 mt-1.5 font-light leading-relaxed">{settings.address}</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative backdrop-blur-md">
            <div className="absolute top-0 right-0 w-48 h-32 bg-purple-600/5 blur-[60px] rounded-full -z-10"></div>
            
            <h2 className="text-xs font-serif font-light uppercase tracking-widest text-white mb-6">Leave a Message</h2>
            
            {sent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto" />
                <h3 className="font-bold text-sm uppercase text-white">Message Transmitted</h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  Thank you for connecting. Your message has been logged successfully at our concierge workspace. An administrator will review your query and respond shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-lg shadow-purple-600/15"
                >
                  Write Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-600 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-600 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="General Inquiry, Event Booking, Catering proposal..."
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Message *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your detailed thoughts here..."
                    rows={4}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Message</span>
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
export default ContactUs;
