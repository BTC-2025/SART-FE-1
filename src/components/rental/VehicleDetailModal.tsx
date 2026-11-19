'use client';

import React, { useState } from 'react';
import './VehicleDetailModal.css';
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

  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  const galleryList = (vehicle.images && vehicle.images.length > 0)
    ? vehicle.images
    : [
      vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80'
    ];

  const totalPrice = (vehicle.price || 2200) * totalDays;
  const engineVal = vehicle.engine || (vehicle.category?.toLowerCase().includes('bike') ? '350 cc' : '1493 cc');
  const colorVal = vehicle.vehicleColor || 'Phantom Black';
  const pickupLoc = pickupLocation || vehicle.city || vehicle.location || 'Katpadi';

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
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          animation: 'fbFadeInDown 0.22s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              {vehicle.name}
            </span>
            <span style={{
              fontSize: '11.5px',
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '3px 11px',
              borderRadius: '12px',
              fontWeight: 700
            }}>
              {vehicle.category || 'Sedan'}
            </span>
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '15px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body - Exactly matching Image 1 UI */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Centered Vehicle Display with 360 Arc & Thumbnails */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '24px 20px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Centered Vehicle Graphic with Left & Right Arrows */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGalleryIdx(prev => (prev === 0 ? galleryList.length - 1 : prev - 1));
                }}
                style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  fontSize: '14px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                title="Previous Image"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <img
                src={galleryList[selectedGalleryIdx] || vehicle.image}
                alt={vehicle.name}
                style={{
                  width: '500px',
                  height: '200px',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.12))',
                  transition: 'all 0.25s ease'
                }}
              />

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGalleryIdx(prev => (prev === galleryList.length - 1 ? 0 : prev + 1));
                }}
                style={{
                  position: 'absolute',
                  right: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  fontSize: '14px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                title="Next Image"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Interactive 360 Arc Indicator */}
            <div style={{
              width: '100%',
              maxWidth: '400px',
              margin: '16px 0 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>



              </div>
            </div>

            {/* Thumbnails Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {galleryList.slice(0, 5).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryIdx(idx)}
                  style={{
                    width: '64px',
                    height: '48px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedGalleryIdx === idx ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: '#ffffff',
                    padding: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                  />
                </div>
              ))}


            </div>
          </div>

          {/* Quick Specs Pill Row (Blue Icons matching Image 1) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            fontSize: '13px',
            color: '#334155',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 700 }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#2563eb' }}></i>
              <span>{pickupLoc}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-users" style={{ color: '#2563eb' }}></i>
              <span>{vehicle.seats}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-gauge-high" style={{ color: '#2563eb' }}></i>
              <span>{engineVal}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-gas-pump" style={{ color: '#2563eb' }}></i>
              <span>{vehicle.fuel}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-wrench" style={{ color: '#2563eb' }}></i>
              <span>{vehicle.transmission}</span>
            </div>
          </div>

          {/* Detailed Vehicle Specs Table (Blue Icons, matching Image 1) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 800,
              color: '#0f172a'
            }}>
              <i className="fa-solid fa-car" style={{ color: '#2563eb', fontSize: '14px' }}></i>
              <span>Vehicle Specifications & Details</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Engine', icon: 'fa-gauge-high', value: engineVal },
                { label: 'Fuel Type', icon: 'fa-gas-pump', value: vehicle.fuel },
                { label: 'Transmission', icon: 'fa-gear', value: vehicle.transmission },
                { label: 'Seating Capacity', icon: 'fa-users', value: vehicle.seats },
                { label: 'Color', icon: 'fa-palette', value: colorVal },
                { label: 'Distance from Hub', icon: 'fa-location-dot', value: vehicle.distance || `1.2 km from ${pickupLoc}` }
              ].map((spec, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 4px',
                    borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '13px', fontWeight: 600 }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '7px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      <i className={`fa-solid ${spec.icon}`}></i>
                    </div>
                    <span>{spec.label}</span>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA matching Image 1 (Blue Button) */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
              ₹{totalPrice.toLocaleString()}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
              For {durationLabel} (₹{(vehicle.price || 2200).toLocaleString()}/day)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              type="button"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(vehicle);
              }}
              type="button"
              style={{
                padding: '10px 26px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
