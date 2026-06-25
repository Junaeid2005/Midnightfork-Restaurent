import React, { useState } from 'react';
import { useStore } from '../store';
import { MenuItem, OrderStatus, ReservationStatus, WebsiteSettings } from '../types';
import { 
  ShieldCheck, DollarSign, ShoppingCart, Calendar, Users, 
  MapPin, Plus, Edit2, Trash2, Check, X, Search, Filter, 
  Settings, Sparkles, Sliders, FileText, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, reservations, menuItems, settings, saveSettings,
    addMenuItem, editMenuItem, deleteMenuItem, 
    updateOrderStatus, updateReservationStatus,
    activeAdminTab, setActiveAdminTab, currentUser, setActivePage
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New Menu Item Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemCat, setNewItemCat] = useState('Appetizers');
  const [newItemImg, setNewItemImg] = useState('');
  const [newItemAvail, setNewItemAvail] = useState(true);

  // Dynamic Settings States
  const [sName, setSName] = useState(settings.restaurantName);
  const [sBKash, setSBKash] = useState(settings.bKashNumber);
  const [sHours, setSHours] = useState(settings.businessHours);
  const [sAddress, setSAddress] = useState(settings.address);
  const [sPhone, setSPhone] = useState(settings.phone);
  const [sEmail, setSEmail] = useState(settings.email);
  const [sCharge, setSCharge] = useState(settings.deliveryCharge);
  const [sTitle, setSTitle] = useState(settings.bannerTitle);
  const [sSubtitle, setSSubtitle] = useState(settings.bannerSubtitle);

  React.useEffect(() => {
    setSName(settings.restaurantName);
    setSBKash(settings.bKashNumber);
    setSHours(settings.businessHours);
    setSAddress(settings.address);
    setSPhone(settings.phone);
    setSEmail(settings.email);
    setSCharge(settings.deliveryCharge);
    setSTitle(settings.bannerTitle);
    setSSubtitle(settings.bannerSubtitle);
  }, [settings]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="bg-[#050505] text-slate-100 min-h-screen flex items-center justify-center font-sans py-12 px-4">
        <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-sm space-y-4 backdrop-blur-md">
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-semibold uppercase text-white tracking-widest text-xs">Access Restricted</h2>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            This module requires Executive Administrator authorization. Please sign in with an administrator account to continue.
          </p>
          <button
            onClick={() => setActivePage('login')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-widest uppercase rounded-lg cursor-pointer shadow-lg shadow-purple-600/15"
          >
            Access Credentials
          </button>
        </div>
      </div>
    );
  }

  // --- STATS CALCULATIONS ---
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'PENDING PAYMENT' && o.status !== 'PENDING PAYMENT VERIFICATION' && o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);
  const paidOrdersCount = orders.filter(o => o.status === 'PAID').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING PAYMENT' || o.status === 'PENDING PAYMENT VERIFICATION').length;
  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter(r => r.status === 'Pending').length;

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings({
      restaurantName: sName,
      logoText: sName,
      bKashNumber: sBKash,
      deliveryCharge: Number(sCharge),
      businessHours: sHours,
      address: sAddress,
      phone: sPhone,
      email: sEmail,
      bannerTitle: sTitle,
      bannerSubtitle: sSubtitle
    });
    alert('Global Website Settings committed to database successfully!');
  };

  const handleAddMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || newItemPrice <= 0) {
      alert('Please enter valid name and pricing parameters.');
      return;
    }
    await addMenuItem({
      name: newItemName,
      description: newItemDesc,
      price: newItemPrice,
      category: newItemCat,
      image: newItemImg || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
      isAvailable: newItemAvail
    });
    alert(`"${newItemName}" added successfully!`);
    setShowAddForm(false);
    // Reset fields
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice(0);
    setNewItemImg('');
  };

  const handleEditMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await editMenuItem(editingItem.id, editingItem);
    alert('Menu item parameters updated successfully!');
    setEditingItem(null);
  };

  // Filtered lists
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="admin-workspace" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title with Admin Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Midnight Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-light text-white mt-1 tracking-tight">Executive Console</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['dashboard', 'orders', 'payments', 'reservations', 'menu', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAdminTab(tab)}
                className={`px-3.5 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeAdminTab === tab
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================================== */}
        {/* TAB 1: OVERVIEW STATISTICS DASHBOARD */}
        {/* ======================================================================== */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              
              <div className="p-5 rounded-lg bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold block">Total Revenue</span>
                <span className="text-purple-300 font-extrabold text-xl mt-1.5 block">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="p-5 rounded-lg bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold block">Total Orders</span>
                <span className="text-white font-extrabold text-xl mt-1.5 block">{totalOrders}</span>
              </div>
              <div className="p-5 rounded-lg bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold block">Paid Orders</span>
                <span className="text-green-400 font-extrabold text-xl mt-1.5 block">{paidOrdersCount}</span>
              </div>
              <div className="p-5 rounded-lg bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold block">Pending Orders</span>
                <span className="text-yellow-400 font-extrabold text-xl mt-1.5 block">{pendingOrdersCount}</span>
              </div>
              <div className="p-5 rounded-lg bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold block">Reservations</span>
                <span className="text-indigo-400 font-extrabold text-xl mt-1.5 block">{totalReservations}</span>
              </div>
              <div className="p-5 rounded-lg bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold block">Pending Res.</span>
                <span className="text-pink-400 font-extrabold text-xl mt-1.5 block">{pendingReservations}</span>
              </div>

            </div>

            {/* Quick overview of latest activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Recent Orders List */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-white border-b border-white/10 pb-3 mb-4 flex justify-between items-center">
                  <span>Recent Orders Queue</span>
                  <button onClick={() => setActiveAdminTab('orders')} className="text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer">View All &rarr;</button>
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center text-xs text-slate-300 py-1 border-b border-white/5">
                      <div>
                        <span className="font-mono font-bold text-white">{order.id}</span>
                        <p className="text-[10px] text-gray-500 font-light">By {order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-purple-300">${order.total.toFixed(2)}</span>
                        <p className="text-[9px] uppercase font-bold text-gray-500">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reservations List */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-white border-b border-white/10 pb-3 mb-4 flex justify-between items-center">
                  <span>Recent Reservations</span>
                  <button onClick={() => setActiveAdminTab('reservations')} className="text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer">View All &rarr;</button>
                </h3>
                <div className="space-y-3">
                  {reservations.slice(0, 5).map(res => (
                    <div key={res.id} className="flex justify-between items-center text-xs text-slate-300 py-1 border-b border-white/5">
                      <div>
                        <span className="font-bold text-white">{res.date}</span>
                        <p className="text-[10px] text-gray-500 font-light">For {res.name} ({res.guests} guests)</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-indigo-400">{res.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================== */}
        {/* TAB 2: ORDER MANAGEMENT */}
        {/* ======================================================================== */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80 text-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID or Patron Name..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-400">
                <span>Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="All" className="bg-[#050505]">All statuses</option>
                  <option value="PENDING PAYMENT" className="bg-[#050505]">Pending Payment</option>
                  <option value="PENDING PAYMENT VERIFICATION" className="bg-[#050505]">Verification Queue</option>
                  <option value="PAID" className="bg-[#050505]">Paid</option>
                  <option value="PREPARING" className="bg-[#050505]">Preparing</option>
                  <option value="READY" className="bg-[#050505]">Ready / Rider Assigned</option>
                  <option value="OUT FOR DELIVERY" className="bg-[#050505]">Out For Delivery</option>
                  <option value="DELIVERED" className="bg-[#050505]">Delivered</option>
                  <option value="CANCELLED" className="bg-[#050505]">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table Grid */}
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">
              <table className="w-full text-xs text-left text-gray-400 divide-y divide-white/10">
                <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-white/5">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Grand Total</th>
                    <th className="px-6 py-4">Receipt Data</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">No matching orders in database.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-white">{order.id}</td>
                        <td className="px-6 py-4 space-y-0.5">
                          <p className="font-semibold text-slate-200">{order.customerName}</p>
                          <p className="text-[10px] text-gray-500 font-light">{order.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-purple-300 font-bold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 font-mono text-[10px]">
                          {order.bKashTrxId ? (
                            <div className="space-y-0.5">
                              <p className="text-slate-300 font-semibold">TrxID: {order.bKashTrxId}</p>
                              <p className="text-gray-500">Sender: {order.bKashSender}</p>
                            </div>
                          ) : (
                            <span className="text-gray-600 italic font-light">No payment sent</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase block w-fit ${
                            order.status === 'PAID' ? 'bg-blue-950/40 text-blue-400 border border-blue-800/30' :
                            order.status === 'PREPARING' ? 'bg-purple-950/40 text-purple-400 border border-purple-800/30' :
                            order.status === 'DELIVERED' ? 'bg-green-950/40 text-green-400 border border-green-800/30' :
                            'bg-white/5 text-gray-400 border border-white/10'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-[#050505] border border-white/10 text-[10px] rounded px-2.5 py-1.5 focus:outline-none focus:border-purple-600 text-slate-100 cursor-pointer"
                          >
                            <option value="PENDING PAYMENT" className="bg-[#050505]">Pending Payment</option>
                            <option value="PENDING PAYMENT VERIFICATION" className="bg-[#050505]">Verification Queue</option>
                            <option value="PAID" className="bg-[#050505]">Confirm Paid</option>
                            <option value="PREPARING" className="bg-[#050505]">Start Preparing</option>
                            <option value="READY" className="bg-[#050505]">Mark Ready</option>
                            <option value="OUT FOR DELIVERY" className="bg-[#050505]">Out For Delivery</option>
                            <option value="DELIVERED" className="bg-[#050505]">Delivered</option>
                            <option value="CANCELLED" className="bg-[#050505]">Cancel Order</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ======================================================================== */}
        {/* ======================================================================== */}
        {/* TAB 3: bKASH PAYMENT VERIFICATION DESK */}
        {/* ======================================================================== */}
        {activeAdminTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-md font-serif font-light text-white">bKash Verification Queue</h2>
              <p className="text-gray-400 text-xs mt-1 font-light">Cross-reference Submitted Patron Transaction IDs against physical bKash ledger receipts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.filter(o => o.status === 'PENDING PAYMENT VERIFICATION').length === 0 ? (
                <div className="md:col-span-2 text-center py-16 bg-white/5 border border-white/10 rounded-2xl text-gray-500 text-xs backdrop-blur-sm">
                  No payment receipts awaiting manual verification. All ledger sheets are reconciled.
                </div>
              ) : (
                orders.filter(o => o.status === 'PENDING PAYMENT VERIFICATION').map((order) => (
                  <div key={order.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative space-y-4 backdrop-blur-sm">
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] bg-yellow-950 text-yellow-300 px-1.5 py-0.5 rounded font-mono border border-yellow-800/30">
                          VERIFY RECEIPT
                        </span>
                        <h3 className="font-bold text-white text-sm mt-2">Order {order.id}</h3>
                        <p className="text-[10px] text-gray-500 font-light">Patron: {order.customerName} ({order.email})</p>
                      </div>

                      <div className="text-right">
                        <span className="text-purple-300 font-bold text-sm block">${order.total.toFixed(2)}</span>
                        <span className="text-[9px] text-gray-500 font-light block">Amount Due</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#050505]/40 border border-white/10 rounded-lg space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sender Number:</span>
                        <span className="text-white font-bold">{order.bKashSender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID:</span>
                        <span className="text-purple-400 font-extrabold uppercase">{order.bKashTrxId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Submitted Ref:</span>
                        <span className="text-slate-300 font-bold">{order.bKashReference}</span>
                      </div>
                    </div>

                    <div className="flex gap-3.5 justify-end">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'PAID')}
                        className="px-4 py-2 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/20 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify & Confirm Paid</span>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================================== */}
        {/* TAB 4: RESERVATION ADMISSIONS */}
        {/* ======================================================================== */}
        {activeAdminTab === 'reservations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-md font-serif font-light text-white">Table Admissions</h2>
              <p className="text-gray-400 text-xs mt-1 font-light">Approve or Reject Table Bookings. Status updates immediately alert patrons via simulated emails.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.length === 0 ? (
                <div className="md:col-span-2 text-center py-16 bg-white/5 border border-white/10 rounded-2xl text-gray-500 text-xs backdrop-blur-sm">
                  No online table bookings logged.
                </div>
              ) : (
                reservations.map((res) => (
                  <div key={res.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4 backdrop-blur-sm">
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-white text-xs uppercase">{res.date}</h3>
                        <p className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest mt-0.5">{res.time} • 👥 {res.guests} Guests</p>
                        <p className="text-[10px] text-gray-400 font-light mt-1.5 font-sans">Patron: {res.name} ({res.phone})</p>
                        {res.notes && (
                          <p className="text-[10px] text-gray-500 italic mt-2">"Notes: {res.notes}"</p>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase ${
                        res.status === 'Approved' ? 'bg-green-950/40 text-green-400 border border-green-800/30' :
                        res.status === 'Rejected' ? 'bg-red-950/40 text-red-400 border border-red-800/30' :
                        'bg-yellow-950/40 text-yellow-400 border border-yellow-800/30'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    {res.status === 'Pending' && (
                      <div className="flex gap-2.5 justify-end pt-3 border-t border-white/10">
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Rejected')}
                          className="px-3.5 py-2 bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg text-[10px] font-bold uppercase transition-colors border border-white/10 cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Approved')}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer shadow-lg shadow-purple-600/15"
                        >
                          Approve Table
                        </button>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================================== */}
        {/* TAB 5: MENU MANAGEMENT CRUD */}
        {/* ======================================================================== */}
        {activeAdminTab === 'menu' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-md font-serif font-light text-white">Menu Item Catalog</h2>
                <p className="text-gray-400 text-xs mt-1 font-light">Add new dishes, modify prices, and toggle available statuses.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-lg shadow-purple-600/15"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add menu item form overlay */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md"
                >
                  <form onSubmit={handleAddMenuSubmit} className="space-y-4 text-xs">
                    <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">New Dish Specifications</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Dish Name *</label>
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="E.g., Crispy Truffle Fries"
                          className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pricing (USD) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Category</label>
                        <select
                          value={newItemCat}
                          onChange={(e) => setNewItemCat(e.target.value)}
                          className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 cursor-pointer"
                        >
                          <option value="Appetizers" className="bg-[#050505]">Appetizers</option>
                          <option value="Burgers" className="bg-[#050505]">Burgers</option>
                          <option value="Pizza" className="bg-[#050505]">Pizza</option>
                          <option value="Main Course" className="bg-[#050505]">Main Course</option>
                          <option value="Drinks" className="bg-[#050505]">Drinks</option>
                          <option value="Desserts" className="bg-[#050505]">Desserts</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Visual Image URL</label>
                        <input
                          type="url"
                          value={newItemImg}
                          onChange={(e) => setNewItemImg(e.target.value)}
                          placeholder="Paste Unsplash image URL..."
                          className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Description / Ingredient ledger</label>
                      <textarea
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="Detail the taste notes and ingredient compositions..."
                        rows={2.5}
                        className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-bold uppercase text-[9px] tracking-widest transition-colors border border-white/10 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold uppercase text-[9px] tracking-widest transition-colors shadow-lg shadow-purple-600/15 cursor-pointer"
                      >
                        Add Spec to Catalog
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-center backdrop-blur-sm">
                  <img 
                     src={item.image} 
                     alt={item.name} 
                     className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-white truncate uppercase tracking-wider leading-tight">{item.name}</h4>
                    <span className="text-purple-400 font-bold text-[11px] block mt-1">${item.price.toFixed(2)}</span>
                    <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-widest mt-0.5">{item.category}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => editMenuItem(item.id, { isAvailable: !item.isAvailable })}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-center cursor-pointer transition-all ${
                        item.isAvailable 
                          ? 'bg-green-950/40 text-green-400 border border-green-800/20' 
                          : 'bg-red-950/40 text-red-400 border border-red-800/20'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Out'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this dish?')) {
                          deleteMenuItem(item.id);
                        }
                      }}
                      className="p-1.5 bg-white/5 hover:bg-red-600/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors border border-white/10 self-end cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================================== */}
        {/* TAB 6: GLOBAL WEBSITE SETTINGS */}
        {/* ======================================================================== */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-md font-serif font-light text-white">Global Website Control Panel</h2>
              <p className="text-gray-400 text-xs mt-1 font-light">Update brand identity variables, contact phone numbers, and operational bKash numbers dynamically without touching code.</p>
            </div>

            <form onSubmit={handleUpdateSettings} className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6 text-xs backdrop-blur-md">
              
              {/* Row 1: Brand & Pay */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Restaurant / Brand Name</label>
                  <input
                    type="text"
                    value={sName}
                    onChange={(e) => setSName(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Personal bKash Number</label>
                  <input
                    type="text"
                    value={sBKash}
                    onChange={(e) => setSBKash(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Midnight Dispatch Fee (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sCharge}
                    onChange={(e) => setSCharge(Number(e.target.value))}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Concierge Phone Hotline</label>
                  <input
                    type="tel"
                    value={sPhone}
                    onChange={(e) => setSPhone(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Concierge Email</label>
                  <input
                    type="email"
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kitchen Operating Hours</label>
                  <input
                    type="text"
                    value={sHours}
                    onChange={(e) => setSHours(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Slogans & Title */}
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Homepage Hero Heading</label>
                  <input
                    type="text"
                    value={sTitle}
                    onChange={(e) => setSTitle(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Homepage Hero Subtitle</label>
                  <textarea
                    value={sSubtitle}
                    onChange={(e) => setSSubtitle(e.target.value)}
                    rows={2.5}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Restaurant House Address</label>
                  <input
                    type="text"
                    value={sAddress}
                    onChange={(e) => setSAddress(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  Commit Global Settings Change
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
export default AdminDashboard;
