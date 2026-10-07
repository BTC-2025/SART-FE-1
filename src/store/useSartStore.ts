import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Booking, CartItem, NotificationItem, Transaction } from './types';

const DEFAULT_STATE: AppState = {
  wallet: {
    balance: 15000.00,
    points: 2450,
    cashback: 350.00,
    transactions: [
      { id: 'tx-001', title: 'Airport Taxi Booking', amount: 800.00, date: new Date(Date.now() - 7200000).toLocaleString(), isCredit: false, category: 'Ride' },
      { id: 'tx-002', title: 'Tire Air Replacement Kit', amount: 3500.00, date: new Date(Date.now() - 86400000).toLocaleString(), isCredit: false, category: 'Store' },
      { id: 'tx-003', title: 'Visa Top-up Loaded', amount: 10000.00, date: new Date(Date.now() - 172800000).toLocaleString(), isCredit: true, category: 'Deposit' }
    ]
  },
  bookings: [
    {
      id: 'bk-001',
      title: 'Tata Nexon EV Rental',
      type: 'rental',
      dateTime: new Date(Date.now() + 172800000).toLocaleString(),
      details: 'Pickup: 10:00 AM • 3 Days Duration',
      status: 'Active',
      cost: 4500.00
    },
    {
      id: 'bk-002',
      title: 'Tire Diagnostics & Balance',
      type: 'mechanic',
      dateTime: new Date(Date.now() - 259200000).toLocaleString(),
      details: 'Assigned: Rajesh Kumar • Completed',
      status: 'Completed',
      cost: 1200.00
    }
  ],
  cart: [],
  wishlist: [],
  notifications: [
    { id: 'notif-1', title: 'Gold Tier Perks Unlocked!', desc: 'Enjoy free airport terminal lounge access & priority dispatch.', read: false, date: 'Today' },
    { id: 'notif-2', title: 'EV Battery Status Optimized', desc: 'Tata Nexon EV charge finished cycle. Ready for commutes.', read: false, date: 'Yesterday' },
    { id: 'notif-3', title: 'Toll Refund Processed', desc: '₹120 refund credited for NH-44 Fastag anomaly.', read: true, date: '3 days ago' }
  ],
  location: "Indiranagar, Bengaluru",
  activeBookingId: null,
  activeTab: 'home'
};

interface SartStore extends AppState {
  // Actions
  addTransaction: (tx: Transaction) => void;
  updateBalance: (amount: number, isDeposit: boolean) => void;
  addBooking: (booking: Booking) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (itemId: string) => void;
  setLocation: (loc: string) => void;
  setActiveBookingId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
}

export const useSartStore = create<SartStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      addTransaction: (tx) =>
        set((state) => ({
          wallet: {
            ...state.wallet,
            transactions: [tx, ...state.wallet.transactions],
          },
        })),

      updateBalance: (amount, isDeposit) =>
        set((state) => {
          const newBalance = isDeposit
            ? state.wallet.balance + amount
            : state.wallet.balance - amount;
          return {
            wallet: {
              ...state.wallet,
              balance: newBalance,
            },
          };
        }),

      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
          activeBookingId: booking.id,
        })),

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== itemId),
        })),
        
      updateCartQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (itemId) =>
        set((state) => {
          const exists = state.wishlist.includes(itemId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== itemId)
              : [...state.wishlist, itemId],
          };
        }),

      setLocation: (loc) => set({ location: loc }),
      
      setActiveBookingId: (id) => set({ activeBookingId: id }),

      setActiveTab: (tab) => {
        set({ activeTab: tab });
        
        if (typeof window !== 'undefined') {
          // Cosmetic URL update logic
          let newUrl = '/';
          const topLevelTabs = ['store', 'booking', 'wallet', 'profile'];
          
          if (topLevelTabs.includes(tab)) {
            newUrl = `/${tab}`;
          } else if (tab !== 'home') {
            // It's a sub-page of home (like ride, carrier, etc.)
            newUrl = `/home/${tab}`;
          }
          
          if (window.location.pathname !== newUrl) {
            window.history.pushState({ tab }, '', newUrl);
          }

          // Also trigger the legacy Map resize if 'home' is selected
          if (tab === 'home') {
            setTimeout(() => {
              if ((window as any).leafletMap) {
                (window as any).leafletMap.invalidateSize();
                if ((window as any).recenterMap) (window as any).recenterMap();
              }
            }, 200);
          }
        }
      },
    }),
    {
      name: 'sart-storage-v2', // unique name
      partialize: (state) => ({
        wallet: state.wallet,
        bookings: state.bookings,
        cart: state.cart,
        wishlist: state.wishlist,
        location: state.location,
      }), // only persist these fields
    }
  )
);
