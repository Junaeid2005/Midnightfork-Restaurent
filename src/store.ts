import { create } from 'zustand';
import { 
  MenuItem, CartItem, Order, Reservation, WebsiteSettings, 
  AppUser, EmailNotification, OrderStatus, ReservationStatus 
} from './types';
import { initialMenuItems } from './data/menu';
import { db, auth } from './firebase';
import { 
  doc, setDoc, getDoc, collection, addDoc, getDocs, 
  updateDoc, query, where, onSnapshot, orderBy, deleteDoc
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppState {
  // Navigation
  activePage: string;
  activeAdminTab: string;
  activeCustomerTab: string;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Data
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  reservations: Reservation[];
  settings: WebsiteSettings;
  currentUser: AppUser | null;
  authLoading: boolean;
  emails: EmailNotification[];
  wishlist: string[];
  currentTrackingOrderId: string | null;

  // Search & Filter
  selectedCategory: string;
  searchQuery: string;

  // Actions
  setActivePage: (page: string) => void;
  setActiveAdminTab: (tab: string) => void;
  setActiveCustomerTab: (tab: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleWishlist: (itemId: string) => void;
  setCurrentTrackingOrderId: (id: string | null) => void;

  // Cart Actions
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Auth Actions
  setUser: (user: AppUser | null) => void;
  logout: () => Promise<void>;

  // Order & Payment Actions
  placeOrder: (orderData: Omit<Order, 'id' | 'paymentReference' | 'status' | 'createdAt' | 'lastUpdatedTime'>) => Promise<Order>;
  submitPaymentVerification: (orderId: string, sender: string, trxId: string, reference: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, estimatedTime?: string) => Promise<void>;
  
  // Reservation Actions
  createReservation: (resData: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => Promise<Reservation>;
  updateReservationStatus: (resId: string, status: ReservationStatus) => Promise<void>;

  // Settings Actions
  saveSettings: (updatedSettings: Partial<WebsiteSettings>) => Promise<void>;
  
  // Menu Management
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  editMenuItem: (itemId: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;

  // Email Notification Engine
  sendNotificationEmail: (to: string, type: string, orderOrReservation: any) => void;
  clearEmails: () => void;

  // Sync state
  syncFromFirebase: () => void;
}

const defaultSettings: WebsiteSettings = {
  restaurantName: "Midnight Fork",
  logoText: "Midnight Fork",
  bKashNumber: "01712345678",
  deliveryCharge: 5.00,
  businessHours: "Daily: 6:00 PM - 4:00 AM",
  address: "Plot 12, Road 4, Banani, Dhaka, Bangladesh",
  phone: "+880 1712-345678",
  email: "concierge@midnightfork.com",
  facebookLink: "https://facebook.com/midnightfork",
  instagramLink: "https://instagram.com/midnightfork",
  bannerTitle: "Savour the Shadows of Culinary Craftsmanship",
  bannerSubtitle: "Bangladesh's finest midnight culinary destination. Open until 4:00 AM for premium burgers, artisanal pizzas, and luxury desserts."
};

export const useStore = create<AppState>((set, get) => {
  let unsubscribeOrders: (() => void) | null = null;
  let unsubscribeReservations: (() => void) | null = null;
  let unsubscribeSettings: (() => void) | null = null;
  let unsubscribeMenu: (() => void) | null = null;

  return {
    // Navigation
    activePage: localStorage.getItem('activePage') || 'home',
    activeAdminTab: localStorage.getItem('activeAdminTab') || 'dashboard',
    activeCustomerTab: localStorage.getItem('activeCustomerTab') || 'profile',

    // Theme state and action
    theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      set({ theme: nextTheme });
    },

    // Data
    menuItems: initialMenuItems,
    cart: [],
    orders: [],
    reservations: [],
    settings: defaultSettings,
    currentUser: null,
    authLoading: true,
    emails: [],
    wishlist: [],
    currentTrackingOrderId: null,

    // Search & Filter
    selectedCategory: 'All',
    searchQuery: '',

    // Navigation Setters
    setActivePage: (page) => {
      localStorage.setItem('activePage', page);
      set({ activePage: page });
    },
    setActiveAdminTab: (tab) => {
      localStorage.setItem('activeAdminTab', tab);
      set({ activeAdminTab: tab });
    },
    setActiveCustomerTab: (tab) => {
      localStorage.setItem('activeCustomerTab', tab);
      set({ activeCustomerTab: tab });
    },
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setCurrentTrackingOrderId: (id) => set({ currentTrackingOrderId: id }),

    toggleWishlist: (itemId) => {
      const { wishlist } = get();
      const updated = wishlist.includes(itemId)
        ? wishlist.filter(id => id !== itemId)
        : [...wishlist, itemId];
      set({ wishlist: updated });
    },

    // Cart Actions
    addToCart: (item, quantity) => {
      const { cart } = get();
      const existing = cart.find(i => i.menuItem.id === item.id);
      if (existing) {
        set({
          cart: cart.map(i => 
            i.menuItem.id === item.id 
              ? { ...i, quantity: i.quantity + quantity } 
              : i
          )
        });
      } else {
        set({ cart: [...cart, { menuItem: item, quantity }] });
      }
    },

    removeFromCart: (itemId) => {
      const { cart } = get();
      set({ cart: cart.filter(i => i.menuItem.id !== itemId) });
    },

    updateCartQuantity: (itemId, quantity) => {
      const { cart } = get();
      if (quantity <= 0) {
        set({ cart: cart.filter(i => i.menuItem.id !== itemId) });
      } else {
        set({
          cart: cart.map(i => 
            i.menuItem.id === itemId ? { ...i, quantity } : i
          )
        });
      }
    },

    clearCart: () => set({ cart: [] }),

    // Auth Actions
    setUser: (user) => {
      set({ currentUser: user, authLoading: false });
      if (user) {
        // Automatically sync customer specific data
        get().syncFromFirebase();

        // If admin, automatically verify and seed menu items and default settings to Firestore
        if (user.role === 'admin') {
          console.log("Admin logged in: seeding default items and settings to Firestore...");
          // Seed settings (idempotent, won't wipe unless deleted, but setDoc configures initial)
          setDoc(doc(db, 'settings', 'global'), defaultSettings)
            .catch(err => console.warn("Failed to seed settings on admin login:", err));

          // Seed menu items
          initialMenuItems.forEach(async (item) => {
            try {
              // Set each item directly (idempotent because of unique fixed item IDs)
              await setDoc(doc(db, 'menu', item.id), item);
            } catch (err) {
              console.warn(`Failed to seed item ${item.id} on admin login:`, err);
            }
          });
        }
      }
    },

    logout: async () => {
      await auth.signOut();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeReservations) unsubscribeReservations();
      localStorage.setItem('activePage', 'home');
      localStorage.removeItem('activeAdminTab');
      localStorage.removeItem('activeCustomerTab');
      set({ currentUser: null, orders: [], reservations: [], activePage: 'home', authLoading: false });
    },

    // Order & Payment Actions
    placeOrder: async (orderData) => {
      const orderCount = get().orders.length;
      const orderNum = 1025 + orderCount + Math.floor(Math.random() * 10);
      const orderId = `MF${orderNum}`;
      const paymentReference = `PAYMF${orderNum}`;

      const newOrder: Order = {
        ...orderData,
        id: orderId,
        paymentReference,
        status: 'PENDING PAYMENT',
        createdAt: new Date().toISOString(),
        lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDeliveryTime: '30-45 minutes'
      };

      // Save to Firestore
      try {
        await setDoc(doc(db, 'orders', orderId), newOrder);
        get().sendNotificationEmail(newOrder.email, 'order_received', newOrder);
        return newOrder;
      } catch (err) {
        console.error("Firestore order save failed. Saving locally.", err);
        // Fallback local save
        set(state => ({ orders: [newOrder, ...state.orders] }));
        get().sendNotificationEmail(newOrder.email, 'order_received', newOrder);
        return newOrder;
      }
    },

    submitPaymentVerification: async (orderId, sender, trxId, reference) => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const updates = {
          bKashSender: sender,
          bKashTrxId: trxId,
          bKashReference: reference,
          status: 'PENDING PAYMENT VERIFICATION' as OrderStatus,
          lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        await updateDoc(orderRef, updates);
      } catch (err) {
        console.error("Failed to update payment status in Firestore. Saving local state.", err);
        set(state => ({
          orders: state.orders.map(o => 
            o.id === orderId 
              ? { 
                  ...o, 
                  bKashSender: sender, 
                  bKashTrxId: trxId, 
                  bKashReference: reference, 
                  status: 'PENDING PAYMENT VERIFICATION',
                  lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                } 
              : o
          )
        }));
      }
    },

    updateOrderStatus: async (orderId, status, estimatedTime) => {
      const updates: any = {
        status,
        lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      if (estimatedTime) {
        updates.estimatedDeliveryTime = estimatedTime;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, updates);
        
        // Retrieve order details to trigger dynamic email
        const snap = await getDoc(orderRef);
        if (snap.exists()) {
          const order = snap.data() as Order;
          get().sendNotificationEmail(order.email, status.toLowerCase().replace(/ /g, '_'), order);
        }
      } catch (err) {
        console.error("Failed status change in firestore. Local updates applied.", err);
        set(state => {
          const updated = state.orders.map(o => {
            if (o.id === orderId) {
              const uOrder = { ...o, ...updates };
              get().sendNotificationEmail(o.email, status.toLowerCase().replace(/ /g, '_'), uOrder);
              return uOrder;
            }
            return o;
          });
          return { orders: updated };
        });
      }
    },

    // Reservation Actions
    createReservation: async (resData) => {
      const resId = `RES${Math.floor(100000 + Math.random() * 900000)}`;
      const newRes: Reservation = {
        ...resData,
        id: resId,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'reservations', resId), newRes);
        get().sendNotificationEmail(newRes.email, 'reservation_received', newRes);
        return newRes;
      } catch (err) {
        console.error("Firestore reservation fail. Fallback to local.", err);
        set(state => ({ reservations: [newRes, ...state.reservations] }));
        get().sendNotificationEmail(newRes.email, 'reservation_received', newRes);
        return newRes;
      }
    },

    updateReservationStatus: async (resId, status) => {
      try {
        const resRef = doc(db, 'reservations', resId);
        await updateDoc(resRef, { status });
        
        const snap = await getDoc(resRef);
        if (snap.exists()) {
          const res = snap.data() as Reservation;
          get().sendNotificationEmail(res.email, `reservation_${status.toLowerCase()}`, res);
        }
      } catch (err) {
        console.error("Firestore reservation update failed. Doing local fallback.", err);
        set(state => {
          const updated = state.reservations.map(r => {
            if (r.id === resId) {
              const uRes = { ...r, status };
              get().sendNotificationEmail(r.email, `reservation_${status.toLowerCase()}`, uRes);
              return uRes;
            }
            return r;
          });
          return { reservations: updated };
        });
      }
    },

    // Website Settings
    saveSettings: async (updatedSettings) => {
      try {
        const settingsRef = doc(db, 'settings', 'global');
        await setDoc(settingsRef, updatedSettings, { merge: true });
      } catch (err) {
        console.error("Failed to write settings to Firestore, applying locally.", err);
        set(state => ({ settings: { ...state.settings, ...updatedSettings } }));
      }
    },

    // Menu Management Actions
    addMenuItem: async (item) => {
      const newItem: MenuItem = {
        ...item,
        id: `item-${Date.now()}`
      };
      try {
        await setDoc(doc(db, 'menu', newItem.id), newItem);
      } catch (err) {
        set(state => ({ menuItems: [...state.menuItems, newItem] }));
      }
    },

    editMenuItem: async (itemId, updates) => {
      try {
        await updateDoc(doc(db, 'menu', itemId), updates);
      } catch (err) {
        set(state => ({
          menuItems: state.menuItems.map(item => item.id === itemId ? { ...item, ...updates } : item)
        }));
      }
    },

    deleteMenuItem: async (itemId) => {
      try {
        // We will mock deletion, or delete from Firestore if setup
        set(state => ({ menuItems: state.menuItems.filter(item => item.id !== itemId) }));
      } catch (err) {
        console.error(err);
      }
    },

    // Automatic Email System Simulation
    sendNotificationEmail: (to, type, data) => {
      let subject = 'Midnight Fork Notification';
      let body = '';

      if (type === 'order_received') {
        subject = `🍽️ Order Received - Midnight Fork (${data.id})`;
        body = `Hi ${data.customerName},\n\nWe have received your order reference ${data.id} for a total of $${data.total.toFixed(2)}.\n\nSince this is a Personal bKash payment, please complete the transfer of $${data.total.toFixed(2)} to ${get().settings.bKashNumber}. Ensure you input Reference Code: "${data.paymentReference}" during send-money. Once sent, submit your Sender Number and Transaction ID in your dashboard tracking screen.\n\nThank you for choosing Midnight Fork!\nOpen until 4:00 AM.`;
      } else if (type === 'pending_payment_verification') {
        subject = `⏳ Payment Submitted for Verification (${data.id})`;
        body = `Hi ${data.customerName},\n\nThank you for submitting your payment transaction. We are verifying TrxID: "${data.bKashTrxId}" from Sender Number: ${data.bKashSender}.\n\nYour order is currently "PENDING PAYMENT VERIFICATION". Our admins are checking the ledger and will update you shortly!`;
      } else if (type === 'paid') {
        subject = `✅ Payment Confirmed! Order is Paid (${data.id})`;
        body = `Hi ${data.customerName},\n\nAwesome news! We verified your payment of $${data.total.toFixed(2)} with TrxID: ${data.bKashTrxId}.\n\nYour order status is now "PAID". Our culinary experts have been alerted and are getting ready to prepare your luxurious food!`;
      } else if (type === 'preparing') {
        subject = `🍳 Preparing Your Midnight Feast (${data.id})`;
        body = `Hi ${data.customerName},\n\nOur kitchen is currently preparing your delicious feast. We are using premium, fresh ingredients to craft your culinary masterpiece.\n\nEstimated Delivery Time: ${data.estimatedDeliveryTime || '35 minutes'}. Stay tuned!`;
      } else if (type === 'ready') {
        subject = `📦 Your Feast is Ready for Pickup / Dispatch (${data.id})`;
        body = `Hi ${data.customerName},\n\nYour order is fully prepared, quality-checked, and packaged beautifully in our custom luxury wrapping.\n\nIt is now awaiting the rider assignment. Preparing for departure!`;
      } else if (type === 'out_for_delivery') {
        subject = `🛵 Out For Delivery! Midnight Fork on the Way (${data.id})`;
        body = `Hi ${data.customerName},\n\nYour premium meal is officially on the road! Our rider is racing through the night to bring you your fresh, piping hot food.\n\nEstimated delivery: ${data.estimatedDeliveryTime || '15 minutes'}. Make sure your phone ${data.phone} is active!`;
      } else if (type === 'delivered') {
        subject = `✨ Delivered! Bon Appétit from Midnight Fork (${data.id})`;
        body = `Hi ${data.customerName},\n\nOur rider reported that your order ${data.id} has been delivered successfully. We hope you enjoy the culinary craftsmanship!\n\nIf you enjoyed your meal, please leave a review on our website. Till next midnight!`;
      } else if (type === 'cancelled') {
        subject = `❌ Order Cancelled (${data.id})`;
        body = `Hi ${data.customerName},\n\nWe regret to inform you that your order ${data.id} has been cancelled. If payment was sent, our team will initiate a manual refund. For questions, contact us at ${get().settings.phone}.`;
      } else if (type === 'reservation_received') {
        subject = `🔔 Reservation Received - Midnight Fork`;
        body = `Hi ${data.name},\n\nWe have received your online table reservation request for ${data.guests} guests on ${data.date} at ${data.time}.\n\nStatus: PENDING ADMISSION. We will review table layouts and send an email as soon as your booking is approved!`;
      } else if (type === 'reservation_approved') {
        subject = `✨ Reservation APPROVED! See You at Midnight Fork`;
        body = `Hi ${data.name},\n\nCongratulations! Your booking request for ${data.guests} guests on ${data.date} at ${data.time} is officially APPROVED!\n\nWe have set aside an elegant premier table for you. For any specific spatial requests or allergy notifications, feel free to reply directly or call ${get().settings.phone}.\n\nSee you soon under the violet lights!`;
      } else if (type === 'reservation_rejected') {
        subject = `⚠️ Reservation Update - Midnight Fork`;
        body = `Hi ${data.name},\n\nWe appreciate your request for a table at Midnight Fork on ${data.date} at ${data.time}.\n\nUnfortunately, we are fully booked or have restricted capacity for your requested slot, so your reservation was rejected.\n\nPlease feel free to request an alternative date or slot. Thank you for your understanding.`;
      } else if (type === 'otp_verification') {
        subject = `🔑 One-Time Password (OTP) - Midnight Fork Email Verification`;
        body = `Hi ${data.customerName},\n\nWelcome to Midnight Fork. To complete your patron registration, please verify your email address.\n\nYour One-Time Password (OTP) is:\n\n👉 ${data.otp} 👈\n\nThis code is valid for 10 minutes. If you did not initiate this request, please ignore this email.\n\nThank you for choosing Midnight Fork!\nMidnight Alchemy Concierge Team`;
      } else if (type === 'registration_welcome') {
        subject = `✨ Welcome to the Midnight Fork Patron Circle!`;
        body = `Hi ${data.customerName},\n\nWelcome to the official Midnight Fork inner circle! Your unique patron ID is ${data.id}.\n\nAs a verified member, you can now enjoy full access to premium late-night delivery tracking, online table reservations, personalized flavor menus curated by our Gemini AI, and much more.\n\nWe look forward to serving you under the violet lights!\n\nBest regards,\nThe Midnight Fork Concierge Team`;
      }

      const newEmail: EmailNotification = {
        id: `email-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        to,
        subject,
        body,
        timestamp: new Date().toLocaleString(),
        type
      };

      set(state => ({ emails: [newEmail, ...state.emails] }));

      // Send real email via Express backend API
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject, body })
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          console.log("Real email dispatched successfully:", result);
          if (result.isTestAccount && result.previewUrl) {
            console.log(`[Ethereal Sandbox] Test email can be viewed here: ${result.previewUrl}`);
          }
        } else {
          console.error("Server reported failure to dispatch email:", result.message);
        }
      })
      .catch(err => {
        console.error("Failed to connect to email API endpoint:", err);
      });
    },

    clearEmails: () => set({ emails: [] }),

    // Real-Time Sync function
    syncFromFirebase: () => {
      // Unsubscribe from previous listeners to prevent multiple listener leaks
      if (unsubscribeSettings) {
        try { unsubscribeSettings(); } catch(e) {}
        unsubscribeSettings = null;
      }
      if (unsubscribeMenu) {
        try { unsubscribeMenu(); } catch(e) {}
        unsubscribeMenu = null;
      }
      if (unsubscribeOrders) {
        try { unsubscribeOrders(); } catch(e) {}
        unsubscribeOrders = null;
      }
      if (unsubscribeReservations) {
        try { unsubscribeReservations(); } catch(e) {}
        unsubscribeReservations = null;
      }

      // 1. Sync global settings
      unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          set({ settings: docSnap.data() as WebsiteSettings });
        } else {
          // Seed settings/global with defaultSettings only if admin
          const user = get().currentUser;
          if (user?.role === 'admin') {
            setDoc(doc(db, 'settings', 'global'), defaultSettings)
              .catch((err) => {
                handleFirestoreError(err, OperationType.WRITE, 'settings/global');
              });
          } else {
            set({ settings: defaultSettings });
          }
        }
      }, (error) => {
        console.warn("Firestore settings sync error:", error);
        handleFirestoreError(error, OperationType.GET, 'settings/global');
      });

      // 2. Sync menu items
      unsubscribeMenu = onSnapshot(collection(db, 'menu'), (querySnap) => {
        if (!querySnap.empty) {
          const items: MenuItem[] = [];
          querySnap.forEach((doc) => {
            items.push(doc.data() as MenuItem);
          });
          set({ menuItems: items });
        } else {
          // Seed initialMenuItems to Firebase collection only if admin
          const user = get().currentUser;
          if (user?.role === 'admin') {
            console.log("Seeding initial menu items to Firestore...");
            initialMenuItems.forEach(async (item) => {
              try {
                await setDoc(doc(db, 'menu', item.id), item);
              } catch (err) {
                console.warn("Error seeding menu item to Firestore:", err);
                handleFirestoreError(err, OperationType.WRITE, `menu/${item.id}`);
              }
            });
          }
          set({ menuItems: initialMenuItems });
        }
      }, (error) => {
        console.warn("Firestore menu sync error:", error);
        handleFirestoreError(error, OperationType.GET, 'menu');
      });

      // 3. Sync orders and reservations
      const user = get().currentUser;
      if (user) {
        // If admin, listen to ALL orders and reservations
        if (user.role === 'admin') {
          const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
          unsubscribeOrders = onSnapshot(ordersQuery, (snap) => {
            const list: Order[] = [];
            snap.forEach((docSnap) => {
              list.push(docSnap.data() as Order);
            });
            set({ orders: list });
          }, (error) => {
            console.warn("Firestore admin orders sync error:", error);
            handleFirestoreError(error, OperationType.GET, 'orders');
          });

          const resQuery = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
          unsubscribeReservations = onSnapshot(resQuery, (snap) => {
            const list: Reservation[] = [];
            snap.forEach((docSnap) => {
              list.push(docSnap.data() as Reservation);
            });
            set({ reservations: list });
          }, (error) => {
            console.warn("Firestore admin reservations sync error:", error);
            handleFirestoreError(error, OperationType.GET, 'reservations');
          });
        } else {
          // If customer, listen only to their orders & reservations
          const ordersQuery = query(
            collection(db, 'orders'), 
            where('email', '==', user.email)
          );
          unsubscribeOrders = onSnapshot(ordersQuery, (snap) => {
            const list: Order[] = [];
            snap.forEach((docSnap) => {
              list.push(docSnap.data() as Order);
            });
            // Sort client side
            list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            set({ orders: list });
          }, (error) => {
            console.warn("Firestore customer orders sync error:", error);
            handleFirestoreError(error, OperationType.GET, 'orders');
          });

          const resQuery = query(
            collection(db, 'reservations'), 
            where('email', '==', user.email)
          );
          unsubscribeReservations = onSnapshot(resQuery, (snap) => {
            const list: Reservation[] = [];
            snap.forEach((docSnap) => {
              list.push(docSnap.data() as Reservation);
            });
            list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            set({ reservations: list });
          }, (error) => {
            console.warn("Firestore customer reservations sync error:", error);
            handleFirestoreError(error, OperationType.GET, 'reservations');
          });
        }
      }
    }
  };
});
