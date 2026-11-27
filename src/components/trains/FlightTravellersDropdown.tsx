'use client';

import React from 'react';

interface FlightTravellersDropdownProps {
  specialFare: string;
  setSpecialFare: (fare: string) => void;
  adultCount: number;
  setAdultCount: React.Dispatch<React.SetStateAction<number>>;
  seniorCount: number;
  setSeniorCount: React.Dispatch<React.SetStateAction<number>>;
  childCount: number;
  setChildCount: React.Dispatch<React.SetStateAction<number>>;
  infantCount: number;
  setInfantCount: React.Dispatch<React.SetStateAction<number>>;
  cabinClass: string;
  setCabinClass: (cls: string) => void;
  totalPassengers: number;
  expandedSeatOption: string | null;
  setExpandedSeatOption: (opt: string | null) => void;
  onDone: () => void;
}

export default function FlightTravellersDropdown({
  specialFare,
  setSpecialFare,
  adultCount,
  setAdultCount,
  seniorCount,
  setSeniorCount,
  childCount,
  setChildCount,
  infantCount,
  setInfantCount,
  cabinClass,
  setCabinClass,
  totalPassengers,
  expandedSeatOption,
  setExpandedSeatOption,
  onDone
}: FlightTravellersDropdownProps) {
  const syncToStorage = (newClass: string) => {
    if (typeof window !== 'undefined') {
      const payload = {
        adultCount,
        seniorCount,
        childCount,
        infantCount,
        specialFare,
        cabinClass: newClass,
        totalPassengers
      };
      localStorage.setItem('sart_flight_travellers', JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('sart_flight_travellers_changed', { detail: payload }));
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        zIndex: 9999,
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.16)',
        border: '1px solid #cbd5e1',
        padding: '16px 18px',
        width: '390px',
        maxHeight: '520px',
        overflowY: 'auto',
        textAlign: 'left',
        cursor: 'default'
      }}
    >
      {/* Section 1: SPECIAL FARE */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.4px', marginBottom: '8px' }}>
          SPECIAL FARE
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['6Exclusive', 'Students', 'Armed Forces', 'Family & Friends', 'Unaccompanied Minor'].map((fare) => {
            const isSel = specialFare === fare;
            return (
              <button
                key={fare}
                type="button"
                onClick={() => setSpecialFare(fare)}
                style={{
                  border: isSel ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                  background: isSel ? '#f0f9ff' : '#ffffff',
                  color: isSel ? '#0284c7' : '#334155',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {fare}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '10.5px', color: '#dc2626', marginTop: '6px', lineHeight: '1.3' }}>
          6Exclusive fare can only be availed for travel date beyond 3 days
        </div>
        <div style={{
          fontSize: '11px',
          color: '#475569',
          marginTop: '6px',
          paddingBottom: '10px',
          borderBottom: '1px dashed #e2e8f0',
          lineHeight: '1.3'
        }}>
          For group bookings (more than 9 passengers) visit{' '}
          <span style={{ color: '#002970', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
            IndiGo Group Bookings
          </span>
        </div>
      </div>

      {/* Section 2: PASSENGERS COUNT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Adult */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970' }}>Adult</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>12 years onwards</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                disabled={adultCount <= 1}
                onClick={() => setAdultCount((c) => Math.max(1, c - 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: adultCount <= 1 ? '#f8fafc' : '#e0f2fe', color: adultCount <= 1 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: adultCount <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970', minWidth: '16px', textAlign: 'center' }}>
                {adultCount}
              </span>
              <button
                type="button"
                disabled={totalPassengers >= 9}
                onClick={() => setAdultCount((c) => Math.min(9, c + 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: totalPassengers >= 9 ? '#f8fafc' : '#e0f2fe', color: totalPassengers >= 9 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: totalPassengers >= 9 ? 'not-allowed' : 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
          <div
            onClick={() => setExpandedSeatOption(expandedSeatOption === 'adult' ? null : 'adult')}
            style={{ fontSize: '11px', color: '#475569', cursor: 'pointer', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Add Double/Triple Seat</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px' }}></i>
          </div>
        </div>

        {/* Senior Citizen */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970' }}>Senior Citizen</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>(&gt;60 years)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                disabled={seniorCount <= 0}
                onClick={() => setSeniorCount((c) => Math.max(0, c - 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: seniorCount <= 0 ? '#f8fafc' : '#e0f2fe', color: seniorCount <= 0 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: seniorCount <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970', minWidth: '16px', textAlign: 'center' }}>
                {seniorCount}
              </span>
              <button
                type="button"
                disabled={totalPassengers >= 9}
                onClick={() => setSeniorCount((c) => Math.min(9, c + 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: totalPassengers >= 9 ? '#f8fafc' : '#e0f2fe', color: totalPassengers >= 9 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: totalPassengers >= 9 ? 'not-allowed' : 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
          <div
            onClick={() => setExpandedSeatOption(expandedSeatOption === 'senior' ? null : 'senior')}
            style={{ fontSize: '11px', color: '#475569', cursor: 'pointer', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Add Double/Triple Seat</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px' }}></i>
          </div>
        </div>

        {/* Children */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970' }}>Children</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>(2 to 12 years)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                disabled={childCount <= 0}
                onClick={() => setChildCount((c) => Math.max(0, c - 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: childCount <= 0 ? '#f8fafc' : '#e0f2fe', color: childCount <= 0 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: childCount <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970', minWidth: '16px', textAlign: 'center' }}>
                {childCount}
              </span>
              <button
                type="button"
                disabled={totalPassengers >= 9}
                onClick={() => setChildCount((c) => Math.min(9, c + 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: totalPassengers >= 9 ? '#f8fafc' : '#e0f2fe', color: totalPassengers >= 9 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: totalPassengers >= 9 ? 'not-allowed' : 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
          <div
            onClick={() => setExpandedSeatOption(expandedSeatOption === 'children' ? null : 'children')}
            style={{ fontSize: '11px', color: '#475569', cursor: 'pointer', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Add Double/Triple Seat</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px' }}></i>
          </div>
        </div>

        {/* Infant */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970' }}>Infant</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>(3 days to 2 years)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                disabled={infantCount <= 0}
                onClick={() => setInfantCount((c) => Math.max(0, c - 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: infantCount <= 0 ? '#f8fafc' : '#e0f2fe', color: infantCount <= 0 ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: infantCount <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970', minWidth: '16px', textAlign: 'center' }}>
                {infantCount}
              </span>
              <button
                type="button"
                disabled={infantCount >= adultCount}
                onClick={() => setInfantCount((c) => Math.min(adultCount, c + 1))}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: infantCount >= adultCount ? '#f8fafc' : '#e0f2fe', color: infantCount >= adultCount ? '#94a3b8' : '#0284c7',
                  fontSize: '14px', fontWeight: 800, cursor: infantCount >= adultCount ? 'not-allowed' : 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: CABIN CLASS Selection */}
      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', letterSpacing: '0.3px' }}>
            CABIN CLASS
          </div>
          {cabinClass === 'Business' && (
            <span style={{ fontSize: '10.5px', color: '#2563eb', fontWeight: 800 }}>★ Luxury Recliner / Bed</span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {['Economy', 'Premium Economy', 'Business'].map((cls) => {
            const isSel = cabinClass === cls;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => {
                  setCabinClass(cls);
                  syncToStorage(cls);
                }}
                style={{
                  border: isSel ? '2px solid #000080' : '1px solid #cbd5e1',
                  background: isSel ? '#f0f9ff' : '#ffffff',
                  color: isSel ? '#000080' : '#1e293b',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  fontSize: '12px',
                  fontWeight: isSel ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  boxShadow: isSel ? '0 2px 8px rgba(0, 0, 128, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cls}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
          {cabinClass === 'Business'
            ? 'Front XL Cabin (Rows 1–3) with flatbed seating & luxury dining. Higher pricing applies.'
            : cabinClass === 'Premium Economy'
              ? 'Rows 4–39 with extra legroom & priority boarding.'
              : 'Standard Economy seating across Rows 4–39.'}
        </div>
      </div>

      {/* Section 4: Bottom Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px dashed #cbd5e1'
      }}>
        <div>
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#002970', display: 'block' }}>
            {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            {cabinClass}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            syncToStorage(cabinClass);
            onDone();
          }}
          style={{
            background: '#000080',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 26px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 128, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
