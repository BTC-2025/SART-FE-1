'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '@/store/useSartStore';
import { ALL_STORE_PRODUCTS, StoreProduct } from '@/components/tabs/StoreTab';
import { USED_CARS_MOCK_DATA, UsedCarItem } from './store/usedCarsData';
import { USED_BIKES_MOCK_DATA } from './store/usedBikesData';
import { USED_COMMERCIAL_MOCK_DATA } from './store/commercialVehiclesData';

export default function FavoritesTab() {
  const router = useRouter();
  const { activeTab, wishlist, toggleWishlist, addToCart, setActiveTab } = useSartStore();
  const [filter, setFilter] = useState<'ALL' | 'VEHICLES' | 'STORE' | 'RIDES' | 'CARRIERS' | 'RENTALS' | 'DRIVERS' | 'PARKINGS'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // All vehicles pooled
  const allVehicles = useMemo<UsedCarItem[]>(() => {
    return [
      ...USED_CARS_MOCK_DATA,
      ...USED_BIKES_MOCK_DATA,
      ...USED_COMMERCIAL_MOCK_DATA
    ];
  }, []);

  // Map wishlist IDs to actual Store accessories & parts
  const storeWishlistItems = useMemo(() => {
    return (wishlist || [])
      .map((id) => ALL_STORE_PRODUCTS.find((p) => p.id === id))
      .filter((p): p is StoreProduct => Boolean(p));
  }, [wishlist]);

  // Map wishlist IDs to actual Vehicles saved by user
  const vehicleWishlistItems = useMemo(() => {
    return (wishlist || [])
      .map((id) => allVehicles.find((v) => v.id === id))
      .filter((v): v is UsedCarItem => Boolean(v));
  }, [wishlist, allVehicles]);

  const totalWishlistCount = storeWishlistItems.length + vehicleWishlistItems.length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddStoreItemToCart = (item: StoreProduct) => {
    addToCart({
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      icon: item.icon || 'fa-box',
      category: item.category,
      quantity: 1,
    });
    showToast(`Added to cart: ${item.name}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-cart' }));
    }
  };

  const handleAddVehicleToCart = (vehicle: UsedCarItem) => {
    addToCart({
      id: vehicle.id,
      name: `${vehicle.name} (${vehicle.year} • ${vehicle.variant})`,
      price: vehicle.rawPrice,
      originalPrice: vehicle.rawPrice + 25000,
      icon: 'fa-car-side',
      image: vehicle.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80',
      quantity: 1,
      category: `${vehicle.bodyType} - Verified Pre-Owned`,
      brand: vehicle.brand,
      description: `Verified seller: ${vehicle.sellerDetails.name} • ${vehicle.location}`,
      rating: vehicle.sellerDetails.rating || 4.8,
      inStock: true
    });
    showToast(`Added ${vehicle.name} to Cart! Opening Cart...`);
    router.push('/home/cart');
  };

  if (activeTab !== 'favorites') return null;

  return (
    <div className="fade-in" style={{ padding: '32px 24px', maxWidth: '1280px', margin: '0 auto', minHeight: '85vh' }}>

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontWeight: 600,
          fontSize: '14px'
        }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px'
          }}>
            <i className="fa-solid fa-heart"></i>
          </div>
          <div>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '30px', fontWeight: '900', color: '#0f172a' }}>
              Your Wishlist &amp; Favorites
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
              Saved vehicle accessories, parts, mechanic bookings, rides, and services.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('store')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0f172a',
            color: '#fff',
            padding: '12px 22px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <i className="fa-solid fa-shop"></i>
          <span>Continue Shopping in Store</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '6px' }}>
        {[
          { id: 'ALL', label: `All Wishlist (${totalWishlistCount})`, icon: 'fa-globe' },
          { id: 'VEHICLES', label: `Vehicles (${vehicleWishlistItems.length})`, icon: 'fa-car-side' },
          { id: 'STORE', label: `Store Items (${storeWishlistItems.length})`, icon: 'fa-bag-shopping' },
          { id: 'RIDES', label: 'Rides', icon: 'fa-car' },
          { id: 'CARRIERS', label: 'Carriers', icon: 'fa-truck-fast' },
          { id: 'RENTALS', label: 'Rentals', icon: 'fa-key' },
          { id: 'DRIVERS', label: 'Drivers', icon: 'fa-user-tie' },
          { id: 'PARKINGS', label: 'Parkings', icon: 'fa-square-parking' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '24px',
              border: filter === cat.id ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              background: filter === cat.id ? '#ef4444' : '#ffffff',
              color: filter === cat.id ? '#ffffff' : '#475569',
              boxShadow: filter === cat.id ? '0 4px 14px rgba(239, 68, 68, 0.25)' : 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
          </button>
        ))}
      </div>

      {/* Section 1: Store Products Wishlist */}
      {(filter === 'ALL' || filter === 'STORE') && (
        <div style={{ marginBottom: '40px' }}>


          {storeWishlistItems.length === 0 ? (
            <div >


            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {storeWishlistItems.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1.5px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Thumbnail & Remove Heart Button */}
                  <div style={{ position: 'relative', width: '100%', height: '170px', background: '#f8fafc' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <button
                      onClick={() => {
                        toggleWishlist(product.id);
                        showToast(`Removed from Wishlist: ${product.name}`);
                      }}
                      title="Remove from wishlist"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: 'none',
                        color: '#ef4444',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px'
                      }}
                    >
                      <i className="fa-solid fa-heart"></i>
                    </button>
                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {product.vehicle} • {product.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: '#0f172a',
                      margin: '0 0 6px 0',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '12.5px',
                      color: '#64748b',
                      margin: '0 0 14px 0',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.desc}
                    </p>

                    {/* Price and Add to Cart Action */}
                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                        {product.originalPrice && (
                          <div style={{ fontSize: '11.5px', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddStoreItemToCart(product)}
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#0f172a'; }}
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 2: Saved Vehicles */}
      {(filter === 'ALL' || filter === 'VEHICLES') && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-car-side" style={{ color: '#ef4444' }}></i>
              Saved Vehicles ({vehicleWishlistItems.length})
            </h2>
          </div>

          {vehicleWishlistItems.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '40px 24px',
              textAlign: 'center',
              border: '1.5px dashed #cbd5e1',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 16px auto'
              }}>
                <i className="fa-regular fa-heart"></i>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                No vehicles saved in wishlist yet
              </h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
                Browse verified cars, bikes, and trucks in the Buy &amp; Sell Store, and click the heart icon on any card to save it here.
              </p>
              <button
                onClick={() => setActiveTab('store')}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <i className="fa-solid fa-car-side"></i> Explore Verified Vehicles
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {vehicleWishlistItems.map((vehicle) => (
                <div
                  key={vehicle.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1.5px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Thumbnail & Remove Heart Button */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', background: '#f8fafc' }}>
                    <img
                      src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'}
                      alt={vehicle.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80';
                      }}
                    />
                    <button
                      onClick={() => {
                        toggleWishlist(vehicle.id);
                        showToast(`Removed from Wishlist: ${vehicle.name}`);
                      }}
                      title="Remove from wishlist"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: 'none',
                        color: '#ef4444',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px'
                      }}
                    >
                      <i className="fa-solid fa-heart"></i>
                    </button>
                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {vehicle.year} • {vehicle.fuel} • {vehicle.transmission}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: '#0f172a',
                      margin: '0 0 6px 0',
                      lineHeight: '1.3'
                    }}>
                      {vehicle.name}
                    </h3>
                    <p style={{
                      fontSize: '12.5px',
                      color: '#64748b',
                      margin: '0 0 14px 0',
                      lineHeight: '1.4'
                    }}>
                      {vehicle.variant} • {vehicle.kmsDisplay} • RTO {vehicle.rto} • {vehicle.location}
                    </p>

                    {/* Price and Actions Row */}
                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                        {vehicle.price}
                      </div>

                      <button
                        onClick={() => handleAddVehicleToCart(vehicle)}
                        style={{
                          background: '#ff5722',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e64a19'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ff5722'; }}
                      >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>Buy from Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
