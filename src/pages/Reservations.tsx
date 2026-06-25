import React, { useState } from 'react';
import { useStore } from '../store';
import { Calendar, Users, Clock, AlignLeft, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Reservations: React.FC = () => {
  const { createReservation, currentUser, reservations, setActivePage } = useStore();

  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const availableSlots = [
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', 
    '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', 
    '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', 
    '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM'
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !email || !date || !time) {
      setError('Please fill in all required fields to complete your table request.');
      return;
    }

    setLoading(true);
    try {
      await createReservation({
        name,
        phone,
        email,
        date,
        time,
        guests,
        notes
      });
      setSuccess(true);
      // Reset form fields
      setDate('');
      setTime('');
      setGuests(2);
      setNotes('');
    } catch (err) {
      setError('Failed to book reservation. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-950/40 text-green-400 border border-green-800/30';
      case 'Rejected': return 'bg-red-950/40 text-red-400 border border-red-800/30';
      case 'Completed': return 'bg-slate-900 text-slate-400 border border-slate-800';
      default: return 'bg-yellow-950/40 text-yellow-400 border border-yellow-800/30 animate-pulse';
    }
  };

  return (
    <div id="reservations-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-14">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Atmosphere Admission</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 tracking-tight">Online Table Admission</h1>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <p className="text-gray-400 text-xs sm:text-sm font-light max-w-2xl mx-auto mt-4 leading-relaxed">
            Reserve your premier table under the soothing violet lights of Midnight Fork. Experience specialized table-side service, custom chef creations, and unparalleled luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Reservation Form */}
          <div className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative backdrop-blur-md">
            <div className="absolute top-0 right-0 w-48 h-32 bg-purple-600/5 blur-[60px] rounded-full -z-10"></div>
            
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-white mb-6">Booking Details</h2>
            
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/20 rounded-lg text-red-400 text-xs flex items-center gap-2 mb-6">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <CheckCircle className="w-12 h-12 text-purple-400 mx-auto" />
                <h3 className="font-semibold text-xs tracking-widest uppercase text-white">Reservation Request Received!</h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  We have received your table booking request. A virtual confirmation email has been dispatched to <span className="text-purple-300 font-medium">{email}</span>. Our concierge team is checking table spacing and will update your status shortly.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Book Another Table
                  </button>
                  <button
                    onClick={() => {
                      if (currentUser) {
                        setActivePage('profile');
                      } else {
                        setActivePage('login');
                      }
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    View Status Dashboard
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                
                {/* Guest & Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
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
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Reservation Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Available Slot *</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors appearance-none"
                        required
                      >
                        <option value="">Select Time</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Party Size */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Number of Guests</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5, 6, 8].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          guests === num
                            ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                            : 'bg-[#050505]/60 text-gray-400 border-white/10 hover:text-white hover:border-purple-500/30'
                        }`}
                      >
                        {num === 8 ? '8+' : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Special Requests or Notes</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g., Window seat, quiet layout, anniversary, gluten allergy..."
                      rows={3}
                      className="w-full bg-[#050505]/60 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-950/40 text-white font-semibold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 transition-transform hover:scale-[1.01] mt-2 cursor-pointer"
                >
                  {loading ? 'Submitting request...' : 'Submit Booking Request'}
                </button>

              </form>
            )}
          </div>

          {/* Right Sidebar: Atmosphere details & Client Reservation List */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>The VIP Dining Experience</span>
              </h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed mb-4">
                Booking table reservations at Midnight Fork grants you full, unhindered access to our premium sensory hall, designed with soundproof booth buffers, lavender aromas, and deep violet custom down-lighting.
              </p>
              <ul className="space-y-2.5 text-xs font-light text-gray-300">
                <li className="flex items-center gap-2">✔ No admission cover charge or reservation fees</li>
                <li className="flex items-center gap-2">✔ High-privacy layouts for couples or executives</li>
                <li className="flex items-center gap-2">✔ Custom dessert message plating on anniversaries</li>
              </ul>
            </div>

            {/* User Booking History Preview */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-white mb-4">Your Table Bookings</h3>
              
              {!currentUser ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-xs font-light mb-4">Please log in to view active reservation statuses.</p>
                  <button
                    onClick={() => setActivePage('login')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 hover:text-white rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all cursor-pointer"
                  >
                    Sign In To Track
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {reservations.length === 0 ? (
                    <p className="text-gray-500 text-xs font-light text-center py-6">You have no booking requests yet.</p>
                  ) : (
                    reservations.map((res) => (
                      <div key={res.id} className="p-3 bg-[#050505]/60 border border-white/10 rounded-lg space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-xs text-white uppercase">{res.date}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${getStatusColor(res.status)}`}>
                            {res.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1.5 font-light">
                          <span>⌚ {res.time}</span>
                          <span>•</span>
                          <span>👥 {res.guests} Guests</span>
                        </p>
                        {res.notes && (
                          <p className="text-[9px] text-gray-500 italic truncate mt-0.5">Note: "{res.notes}"</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Reservations;
