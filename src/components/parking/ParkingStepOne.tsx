'use client';

import React from 'react';
import { CITIES } from './parkingData';

interface ParkingStepOneProps {
  city: string;
  setCity: (c: string) => void;
  vehicleType: string;
  setVehicleType: (v: string) => void;
  vehicleNumber: string;
  setVehicleNumber: (v: string) => void;
  isLiveLocationOn: boolean;
  liveLocationStatus: string;
  toggleLiveLocation: () => void;
  handleStartSearch: (e: React.FormEvent) => void;
}

export default function ParkingStepOne({
  city,
  setCity,
  vehicleType,
  setVehicleType,
  vehicleNumber,
  setVehicleNumber,
  isLiveLocationOn,
  liveLocationStatus,
  toggleLiveLocation,
  handleStartSearch
}: ParkingStepOneProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 30px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        {/* Top Navigation Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          <button
            type="button"
            style={{
              padding: '10px 24px',
              borderRadius: '10px 10px 0 0',
              border: '1px solid #e2e8f0',
              borderBottom: 'none',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Parking
          </button>
        </div>

        {/* Main Search Filter Box */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px',
            marginBottom: '24px'
          }}
        >
          <form onSubmit={handleStartSearch}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.3fr 1.3fr auto',
                gap: '18px',
                alignItems: 'end'
              }}
            >
              {/* Your City */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Your city
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                </div>
              </div>

              {/* Vehicle Type Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Vehicle type
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="bike">Bike / Scooter</option>
                    <option value="car">Car / Jeep</option>
                    <option value="bus">Bus</option>
                    <option value="minibus">Mini bus</option>
                    <option value="autorickshaw">Auto rickshaw</option>
                    <option value="truck">Truck</option>
                    <option value="minitruck">Mini truck</option>
                    <option value="pickup">Pickup</option>
                  </select>
                  <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                </div>
              </div>

              {/* Vehicle Number */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Vehicle number
                </label>
                <input
                  type="text"
                  placeholder="Last 4 digits or Plate (e.g. 2324)"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  style={{
                    padding: '13px 36px',
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#18181b'}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Live Location Toggle Banner */}
            <div
              style={{
                marginTop: '20px',
                padding: '14px 18px',
                borderRadius: '12px',
                backgroundColor: isLiveLocationOn ? '#f0fdf4' : '#f8fafc',
                border: isLiveLocationOn ? '1.5px solid #86efac' : '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isLiveLocationOn ? '#22c55e' : '#e2e8f0',
                    color: isLiveLocationOn ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}
                >
                  <i className={`fa-solid ${isLiveLocationOn ? 'fa-satellite-dish' : 'fa-location-dot'}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    Enable Live Location Radar
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {liveLocationStatus}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleLiveLocation}
                style={{
                  padding: '9px 18px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: isLiveLocationOn ? '#15803d' : '#0284c7',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className={`fa-solid ${isLiveLocationOn ? 'fa-check' : 'fa-crosshairs'}`}></i>
                {isLiveLocationOn ? 'Live Location ON' : 'Turn ON Live Location'}
              </button>
            </div>
          </form>
        </div>

        {/* Value Proposition Section */}
        <div style={{ marginTop: '36px', padding: '0 8px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>
            Why choose smart parking?
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', maxWidth: '850px', margin: '0 0 24px 0' }}>
            At SART Parking, we are passionate about providing seamless, guaranteed parking spots that exceed our customers’ expectations.
            Turn on live location to instantly detect available spots in your perimeter and pay strictly for the minutes you stay.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
                <i className="fa-solid fa-satellite-dish"></i>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Live Radar Tracking</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Only shows lots with guaranteed open slots in real-time when GPS is active.</p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
                <i className="fa-solid fa-clock"></i>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Minute-Accurate Billing</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>If you leave earlier or exceed your slot, prices automatically calculate on exit.</p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>24x7 Security & CCTV</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Gated barriers, verified attendants, and protected bays for all vehicle types.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
