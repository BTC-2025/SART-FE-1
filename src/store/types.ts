// SART-FE Global Type Definitions

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  isCredit: boolean;
  category: string;
}

export interface Wallet {
  balance: number;
  points: number;
  cashback: number;
  transactions: Transaction[];
}

export interface Booking {
  id: string;
  title: string;
  type: 'rental' | 'mechanic' | 'ride' | 'carrier' | 'drivers' | 'parking' | 'sea' | 'air' | 'train';
  dateTime: string;
  details: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  cost: number;
  meta?: any;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  quantity: number;
  category: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  read: boolean;
  date: string;
}

export interface AppState {
  wallet: Wallet;
  bookings: Booking[];
  cart: CartItem[];
  wishlist: string[];
  notifications: NotificationItem[];
  location: string;
  activeBookingId: string | null;
  activeTab: string;
  activeRideMode?: 'bike' | 'auto' | 'car' | 'bus' | 'train' | 'flight' | 'helicopter';
}
