'use client';

import React from 'react';
import { RentalVehicle } from './rentalData';

interface VehicleDetailModalProps {
  vehicle: RentalVehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (v: RentalVehicle) => void;
  totalDays: number;
  durationLabel: string;
  pickupLocation: string;
}

export default function VehicleDetailModal({
  vehicle,
  isOpen,
  onClose,
  onBookNow,
  totalDays,
  durationLabel,
  pickupLocation
}: VehicleDetailModalProps) {
  if (!isOpen || !vehicle) return null;

  const totalPrice = vehicle.price * totalDays;
  const engineVal = vehicle.engine || (vehicle.category.toLowerCase().includes('bike') ? '110 cc - 350 cc' : '1493 cc');
  const colorVal = vehicle.vehicleColor || 'Phantom Black';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '880px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          animation: 'fbFadeInDown 0.22s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{vehicle.name}</span>
            <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
              {vehicle.category}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body - Matching User Image 2 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Dual Vehicle Image Presentation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px', borderRadius: '18px', overflow: 'hidden' }}>
            <div style={{ height: '240px', background: '#f1f5f9', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={vehicle.image}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#111827', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                Profile View
              </span>
            </div>
            <div style={{ height: '240px', background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={vehicle.galleryImages?.[0] || 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=400&q=80'}
                alt={`${vehicle.name} Front`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#111827', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                Front Fascia
              </span>
            </div>
          </div>

          {/* Quick Specs Pill Header (From Image 2) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '13.5px',
            color: '#475569',
            fontWeight: 700
          }}>
            <span style={{ color: '#0f172a', fontWeight: 800 }}>{pickupLocation || 'Gurugram'}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-users" style={{ color: '#94a3b8' }}></i> {vehicle.seats}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-gauge" style={{ color: '#94a3b8' }}></i> {engineVal}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
              <i className="fa-solid fa-gas-pump" style={{ color: '#94a3b8' }}></i> {vehicle.fuel}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-wrench" style={{ color: '#94a3b8' }}></i> {vehicle.transmission}
            </span>
          </div>



          {/* Detailed Vehicle Specs Table (From Image 2) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800, color: '#b45309' }}>
              <i className="fa-solid fa-car-side"></i> Vehicle Specifications & Details
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Engine', icon: 'fa-gauge-high', value: engineVal },
                { label: 'Fuel Type', icon: 'fa-gas-pump', value: vehicle.fuel.toUpperCase() },
                { label: 'Transmission', icon: 'fa-gear', value: vehicle.transmission },
                { label: 'Seating Capacity', icon: 'fa-users', value: vehicle.seats },
                { label: 'Color', icon: 'fa-palette', value: colorVal },
                { label: 'Distance from Hub', icon: 'fa-location-dot', value: vehicle.distance || '1.2 km' },
                { label: 'Free Kilometers', icon: 'fa-road', value: vehicle.kms || '500 Kms Included' }
              ].map((spec, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 6px',
                    borderBottom: i < 6 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                      <i className={`fa-solid ${spec.icon}`}></i>
                    </div>
                    <span>{spec.label}</span>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>₹{totalPrice}</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>For {durationLabel} (₹{vehicle.price}/day)</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(vehicle);
              }}
              style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#f25a1b', color: '#ffffff', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(242, 90, 27, 0.3)' }}
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
