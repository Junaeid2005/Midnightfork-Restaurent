export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isRecommended?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus =
  | 'PENDING PAYMENT'
  | 'PENDING PAYMENT VERIFICATION'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string; // e.g., MF1025
  paymentReference: string; // e.g., PAYMF1025
  customerName: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  postalCode: string;
  locationLink?: string;
  locationNotes?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  bKashSender?: string;
  bKashTrxId?: string;
  bKashReference?: string;
  createdAt: string;
  estimatedDeliveryTime?: string; // e.g., "35 minutes" or "15 minutes"
  lastUpdatedTime: string;
}

export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface WebsiteSettings {
  restaurantName: string;
  logoText: string;
  bKashNumber: string;
  deliveryCharge: number;
  businessHours: string;
  address: string;
  phone: string;
  email: string;
  facebookLink: string;
  instagramLink: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  menuItemId?: string;
  date: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  savedAddresses?: string[];
}

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  type: string; // 'order_received' | 'payment_confirmed' | etc.
}
