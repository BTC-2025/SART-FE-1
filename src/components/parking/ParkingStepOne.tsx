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
  isLiveLocationOn?: boolean;
  liveLocationStatus?: string;
  toggleLiveLocation?: () => void;
  handleStartSearch: (e: React.FormEvent) => void;
}

export default function ParkingStepOne({
  city,
  setCity,
  vehicleType,
  setVehicleType,
  vehicleNumber,
  setVehicleNumber,
  handleStartSearch
}: ParkingStepOneProps) {
  return (
    <div style={{ flex: 1, padding: '36px 30px', background: '#f8fafc', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        {/* Main Search Filter Box */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px'
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
          </form>
        </div>
      </div>
    </div>
  );
}
