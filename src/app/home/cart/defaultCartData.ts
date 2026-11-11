// Default pre-populated cart items for new visitors so the cart is never empty and showcases rich product info
import { CartItem } from '@/store/types';

export const DEFAULT_CART_ITEMS: CartItem[] = [
  {
    id: 'prod-dashcam-4k',
    name: 'SART Ultra 4K Dual Dashcam with ADAS & Night Vision',
    price: 4999,
    originalPrice: 8499,
    quantity: 2,
    icon: 'fa-video',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
    category: 'Car Electronics & Safety',
    brand: 'SART Tech Automotive',
    description: 'Dual Sony Starvis 2 sensors, 4K UHD front + 1080p rear recording with built-in GPS tracker and 24H parking impact monitor.',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    deliveryEstimate: 'Tomorrow by 2:00 PM',
    badge: 'BESTSELLER',
    savedAt: Date.now()
  },
  {
    id: 'prod-solar-tpms',
    name: 'Solar Smart TPMS Tyre Pressure Monitor (Internal Wireless)',
    price: 1899,
    originalPrice: 3299,
    quantity: 1,
    icon: 'fa-gauge-high',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    category: 'Tyre & Wheel Care',
    brand: 'Autovolt Pro',
    description: 'Real-time wireless solar display for tyre temperature, leak detection & PSI pressure with instant audible alarm.',
    rating: 4.8,
    reviewsCount: 96,
    inStock: true,
    deliveryEstimate: 'Delivered in 2 Days',
    badge: 'NEW LAUNCH',
    savedAt: Date.now()
  },
  {
    id: 'prod-ev-charger-7kw',
    name: 'SART 7.4kW Smart EV Portable Rapid Charger (Type 2, 32A)',
    price: 14500,
    originalPrice: 22000,
    quantity: 1,
    icon: 'fa-bolt',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
    category: 'Electric Vehicle Spares',
    brand: 'SART Volt Dynamics',
    description: 'IP67 waterproof smart charger with LCD display, current adjustment (10A-32A), timer, and surge leakage protection.',
    rating: 4.95,
    reviewsCount: 68,
    inStock: true,
    deliveryEstimate: 'Express Next-Day Delivery',
    badge: 'PREMIUM CHOICE',
    savedAt: Date.now()
  }
];

