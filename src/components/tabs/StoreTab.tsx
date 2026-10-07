'use client';
import React, { useEffect, useState } from 'react';
import './StoreTab.css'; 
import { useSartStore } from '@/store/useSartStore';

const STORE_PRODUCTS = [
  // Accessories
  { id: 'acc-1', name: 'Smart Fast Charger Pro', price: 18500, icon: 'fa-bolt', category: 'Accessories', badge: 'Top Seller', desc: 'Ultra-compact 7.2kW AC home charger with auto battery cut-off.' },
  { id: 'acc-2', name: 'GPS Tracker Pro', price: 4200, icon: 'fa-compass', category: 'Accessories', badge: 'New', desc: 'Anti-theft satellite-linked tracker featuring real-time geofence alerts.' },
  { id: 'acc-3', name: 'Smart Tire Pressure Gauge', price: 2800, icon: 'fa-circle-dot', category: 'Accessories', badge: 'Safety', desc: 'Bluetooth tire valve caps displaying precise PSI diagnostics.' },
  { id: 'acc-4', name: 'Chauffeur Comfort Cushion', price: 1950, icon: 'fa-couch', category: 'Accessories', badge: 'Upgrade', desc: 'Ergonomic memory foam cushion with orthopedic support.' },
  
  // Spare Parts
  { id: 'sp-1', name: 'Ceramic Brake Pads (Set of 4)', price: 4500, icon: 'fa-truck-fast', category: 'Spare Parts', badge: 'OEM Part', desc: 'High-performance ceramic brake pads for superior stopping power and low dust.' },
  { id: 'sp-2', name: 'HEPA Cabin Air Filter', price: 850, icon: 'fa-wind', category: 'Spare Parts', badge: 'Essential', desc: 'Medical-grade cabin air filtration system blocking 99.9% of urban pollutants.' },
  { id: 'sp-3', name: 'LED Sports Headlamps', price: 1890, icon: 'fa-lightbulb', category: 'Spare Parts', badge: 'Upgrade', desc: 'High intensity 6500K illumination bulbs delivering 200% brighter beams.' },
  
  // Stations & Bunks (Petrol / EV)
  { id: 'stat-1', name: 'Shell Fast-Charge Pass (100kWh)', price: 1200, icon: 'fa-charging-station', category: 'Stations & Bunks', badge: 'EV', desc: 'Pre-paid 100kWh fast-charging credits valid at all partner EV networks.' },
  { id: 'stat-2', name: 'Bharat Petrol Top-up Voucher', price: 2500, icon: 'fa-gas-pump', category: 'Stations & Bunks', badge: 'Fuel', desc: '₹2500 pre-paid fuel credits redeemable at any major bunk across the city.' },
  
  // Mechanics
  { id: 'mech-1', name: 'Express Diagnostic Check', price: 999, icon: 'fa-screwdriver-wrench', category: 'Mechanics', badge: 'Service', desc: 'Full vehicle 360° OBD2 diagnostic scan by a SART certified mobile mechanic.' },
  { id: 'mech-2', name: 'Wheel Alignment & Balancing', price: 1499, icon: 'fa-dharmachakra', category: 'Mechanics', badge: 'Service', desc: 'Precision laser wheel alignment and high-speed balancing at our local workshops.' },

  // Wash & Care
  { id: 'wash-1', name: 'Premium Foam Water Wash', price: 650, icon: 'fa-shower', category: 'Wash & Care', badge: 'Service', desc: 'Complete exterior snow foam wash, underbody cleaning, and interior vacuum.' },
  { id: 'wash-2', name: 'Ceramic Coating (1 Year)', price: 8500, icon: 'fa-spray-can-sparkles', category: 'Wash & Care', badge: 'Detailing', desc: '1-year 9H ceramic coating protection for your car exterior paint.' },

  // Air & Tires
  { id: 'air-1', name: 'Nitrogen Air Filling (4 Tires)', price: 150, icon: 'fa-fan', category: 'Air & Tires', badge: 'Quick Service', desc: 'Pre-book Nitrogen air filling at any partner station to maintain tire life.' },
  { id: 'air-2', name: 'Puncture Repair Assist', price: 300, icon: 'fa-toolbox', category: 'Air & Tires', badge: 'Emergency', desc: 'On-demand tubeless tire puncture repair by a mobile technician.' }
];

const CATEGORIES = ['All', 'Accessories', 'Spare Parts', 'Stations & Bunks', 'Mechanics', 'Wash & Care', 'Air & Tires'];

export default function StoreTab() {
  const { activeTab, addToCart } = useSartStore();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      icon: item.icon,
      category: item.category,
      quantity: 1
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-cart' }));
    }
  };

  if (!mounted) return null;

  const filteredProducts = activeCategory === 'All' 
    ? STORE_PRODUCTS 
    : STORE_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <section className={`tab-screen ${activeTab === 'store' ? 'active' : ''}`} id="tab-store">
      <div className="store-container">
        
        {/* E-Commerce Hero */}
        <div className="store-hero">
          <div className="store-hero-text">
            <h1>SART Hub E-Commerce</h1>
            <p>Your one-stop shop for everything automotive. From telemetry upgrades and certified spare parts to pre-paid charging passes and mechanic bookings.</p>
          </div>
          <div className="store-hero-image"><i className="fa-solid fa-store" style={{ color: '#fff', fontSize: '56px' }}></i></div>
        </div>

        {/* Categories Navigation */}
        <div className="store-categories-nav">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`store-category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="store-ecommerce-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="store-product-card">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <div className="product-image-container">
                <i className={`fa-solid ${product.icon}`}></i>
              </div>
              <div className="product-info">
                <span className="product-category-label">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
              </div>
              <div className="product-footer">
                <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                <button className="product-buy-btn" onClick={() => handleAddToCart(product)}>
                  {['Accessories', 'Spare Parts'].includes(product.category) ? 'Add to Cart' : 'Book Service'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
