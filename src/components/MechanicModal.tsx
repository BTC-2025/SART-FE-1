'use client';

import React, { useState } from 'react';

const NEARBY_SHOPS = [
  { id: 'ms-1', name: 'AutoCare Garage', type: 'Multi-Brand Service', distance: '1.2 km', rating: 4.8, address: 'OMR Road, Chennai', available: true },
  { id: 'ms-2', name: 'Elite Motors', type: 'Premium Vehicles', distance: '2.5 km', rating: 4.9, address: 'T-Nagar, Chennai', available: true },
  { id: 'ms-3', name: 'QuickFix Auto', type: 'Two-Wheeler Specialist', distance: '3.1 km', rating: 4.5, address: 'Velachery, Chennai', available: false },
];

const ROADSIDE_SERVICES = [
  { id: 'rs-1', name: 'Flat Tire / Puncture', icon: 'fa-truck-pickup', price: '₹500', time: '15 mins' },
  { id: 'rs-2', name: 'Battery Jumpstart', icon: 'fa-car-battery', price: '₹400', time: '20 mins' },
  { id: 'rs-3', name: 'Empty Fuel Delivery', icon: 'fa-gas-pump', price: '₹200 + Fuel', time: '15 mins' },
  { id: 'rs-4', name: 'Towing Service', icon: 'fa-truck-fast', price: '₹1500 (Base)', time: '30 mins' },
];

export default function MechanicModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="sart-modal-backdrop" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '900px', width: '95%', height: '85vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-wrench" style={{ color: '#f59e0b' }}></i> Mechanics & Roadside Assistance
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          <div style={{ marginBottom: '24px', padding: '16px', background: '#e0f2fe', borderRadius: '16px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '24px', color: '#0ea5e9' }}></i>
            <div>
              <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600' }}>Your Current Location</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0c4a6e' }}>Chennai, Tamil Nadu (Based on Top Nav)</div>
            </div>
            <button style={{ marginLeft: 'auto', background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Change</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

            {/* Left Column: Roadside Assistance */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444' }}></i> Emergency Roadside Service
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {ROADSIDE_SERVICES.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    style={{
                      background: '#ffffff',
                      border: selectedService === service.id ? '2px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: selectedService === service.id ? '0 4px 12px rgba(239, 68, 68, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 12px auto', background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      <i className={`fa-solid ${service.icon}`}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>{service.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>ETA: {service.time}</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444' }}>{service.price}</div>
                  </div>
                ))}
              </div>

              <button
                disabled={!selectedService}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  background: selectedService ? '#ef4444' : '#f3f4f6',
                  color: selectedService ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: selectedService ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s'
                }}
                onClick={() => { alert('Emergency Service Dispatched!'); onClose(); }}
              >
                Request SOS Service Now
              </button>
            </div>

            {/* Right Column: Nearby Shops */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-shop" style={{ color: '#10b981' }}></i> Nearby Mechanic Shops
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {NEARBY_SHOPS.map(shop => (
                  <div key={shop.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#4b5563' }}>
                        <i className="fa-solid fa-toolbox"></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {shop.name}
                          {shop.available ? <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span> : <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{shop.type}</div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                          <span><i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i> {shop.rating}</span>
                          <span><i className="fa-solid fa-location-dot"></i> {shop.distance}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        background: '#ecfdf5',
                        color: '#10b981',
                        border: '1px solid #a7f3d0',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                      onClick={() => alert(`Navigating to ${shop.name}...`)}
                    >
                      Navigate
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
