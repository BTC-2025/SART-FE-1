'use client';

import React from 'react';
import { ParkingSpot, VehicleTypeOption, DURATION_PACKS } from './parkingData';

interface ParkingStepThreeProps {
  selectedSpot: ParkingSpot;
  selectedVehicleObj: VehicleTypeOption;
  vehicleModelName: string;
  vehicleNumber: string;
  selectedDuration: string;
  setSelectedDuration: (d: string) => void;
  checkInTime: string;
  checkInDate: string;
  checkOutTime: string;
  checkOutDate: string;
  parkingTotal: number;
  setStep: (step: 1 | 2 | 3 | 4) => void;
}

export default function ParkingStepThree({
  selectedSpot,
  selectedVehicleObj,
  vehicleModelName,
  vehicleNumber,
  selectedDuration,
  setSelectedDuration,
  checkInTime,
  checkInDate,
  checkOutTime,
  checkOutDate,
  parkingTotal,
  setStep
}: ParkingStepThreeProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Top Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => setStep(2)}
            style={{
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#334155',
              fontSize: '14px',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Live Spots
          </button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
              Select Parking Duration &amp; Access Pass
            </h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{selectedSpot.name} • {selectedSpot.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', padding: '6px 14px', borderRadius: '20px', color: '#059669', fontSize: '12px', fontWeight: 800 }}>
            <i className="fa-solid fa-shield-check"></i> Spot Reserved
          </div>
        </div>

        {/* Laptop Split Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '28px',
            alignItems: 'start'
          }}
        >
          {/* Left Laptop Panel: Spot overview, Vehicle, Amenities, Hours, Reviews */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              <img
                src={selectedSpot.image}
                alt={selectedSpot.name}
                style={{ width: '90px', height: '80px', borderRadius: '14px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                    {selectedSpot.name}
                  </h3>
                  <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontWeight: 800 }}>
                    ★ {selectedSpot.rating} ({selectedSpot.reviewsCount})
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {selectedSpot.address} • Hosted by <strong>{selectedSpot.host}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                  <i className="fa-solid fa-circle-check"></i> {selectedSpot.availableSlots} bays currently open • Barrier Automated
                </div>
              </div>
            </div>

            <div
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '18px' }}>
                  <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {vehicleModelName} ({selectedVehicleObj.label})
                  </h5>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Registration: <strong>{vehicleNumber ? vehicleNumber : 'KL 01 AD 2324'}</strong>
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 800, background: '#dcfce7', padding: '4px 10px', borderRadius: '20px' }}>
                FastTag Linked
              </span>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                Amenities &amp; Facilities
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                  <i className="fa-regular fa-eye" style={{ color: '#059669', fontSize: '16px' }}></i> 24 X 7 cctv surveillance
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                  <i className="fa-solid fa-user-shield" style={{ color: '#059669', fontSize: '16px' }}></i> Dedicated Security Guard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                  <i className="fa-solid fa-wifi" style={{ color: '#059669', fontSize: '16px' }}></i> High-speed Free Wifi
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                  <i className="fa-solid fa-bottle-water" style={{ color: '#059669', fontSize: '16px' }}></i> Restroom &amp; Refreshment
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Operating Hours</h4>
                <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>Open Today</span>
                  <span style={{ color: '#475569' }}>{selectedSpot.operatingHours}</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Verified Reviews</h4>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textDecoration: 'underline', cursor: 'pointer' }}>See all {selectedSpot.reviewsCount}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  98% positive check-in ratings
                </div>
              </div>
            </div>
          </div>

          {/* Right Laptop Panel: Duration Packs, Check-in / Check-out, Pricing & Continue */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
              Choose Required Duration
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {DURATION_PACKS.slice(0, 4).map((pack) => {
                const isSelected = selectedDuration === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedDuration(pack.id)}
                    style={{
                      position: 'relative',
                      padding: '16px 12px',
                      borderRadius: '16px',
                      border: isSelected ? '2.5px solid #2563eb' : '1.5px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {pack.tag && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {pack.tag}
                      </span>
                    )}
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                      {pack.label}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: pack.saveText ? '#16a34a' : '#64748b', marginTop: '2px' }}>
                      {pack.saveText || 'Basic'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>CHECK-IN</span>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{checkInTime}</div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{checkInDate}</span>
              </div>

              <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '16px' }}></i>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>CHECK-OUT</span>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{checkOutTime}</div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{checkOutDate}</span>
              </div>

              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}
                onClick={() => alert('Adjust check-in/out times')}
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
            </div>

            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className={`fa-solid ${selectedVehicleObj.icon}`} style={{ color: '#64748b', fontSize: '13px' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Total</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                    10% Off
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a' }}>
                    ₹{parkingTotal}.00
                  </span>
                  <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{parkingTotal + 10}.00
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(4)}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: '#facc15',
                  color: '#0f172a',
                  fontSize: '17px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(250, 204, 21, 0.45)',
                  transition: 'all 0.15s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#facc15'}
              >
                Continue to Checkout <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
