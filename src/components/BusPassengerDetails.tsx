'use client';

import React from 'react';

export interface BusPassenger {
  seatNumber: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female';
}

export interface BusContactDetails {
  phone: string;
  email: string;
}

interface BusPassengerDetailsModalProps {
  busOperator: string;
  busType: string;
  source: string;
  destination: string;
  boardingPoint: string;
  droppingPoint: string;
  selectedSeats: string[];
  passengers: Record<string, { name: string; age: string; gender: 'Male' | 'Female' }>;
  contact: BusContactDetails;
  totalFare: number;
  onPassengerChange: (seat: string, field: 'name' | 'age' | 'gender', value: any) => void;
  onContactChange: (field: 'phone' | 'email', value: string) => void;
  onConfirmBooking: () => void;
  onClose: () => void;
  isConfirmed?: boolean;
}

export default function BusPassengerDetailsModal({
  busOperator,
  busType,
  source,
  destination,
  boardingPoint,
  droppingPoint,
  selectedSeats,
  passengers,
  contact,
  totalFare,
  onPassengerChange,
  onContactChange,
  onConfirmBooking,
  onClose,
  isConfirmed = false
}: BusPassengerDetailsModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15,23,42,0.7)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: '#dc2626',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              {isConfirmed ? 'Bus Ticket Confirmed!' : `Passenger Details: ${busOperator}`}
            </h3>
            <span style={{ fontSize: '13px', color: '#fee2e2' }}>
              {busType} • Seats: {selectedSeats.join(', ') || 'Selected Seats'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '22px 24px' }}>
          {isConfirmed ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 16px auto'
              }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                Booking Confirmed!
              </h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '13px' }}>
                Ticket ID: <strong>BUS{Math.floor(100000 + Math.random() * 900000)}</strong>
              </p>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Journey:</span>
                  <strong>{source} → {destination}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Boarding:</span>
                  <strong>{boardingPoint || 'Main Terminal'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Dropping:</span>
                  <strong>{droppingPoint || 'City Drop'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Seats:</span>
                  <strong style={{ color: '#dc2626' }}>{selectedSeats.join(', ')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Total Fare:</span>
                  <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹ {totalFare.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              {/* Trip Summary Card */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Route:</span>
                  <strong>{source} to {destination}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Boarding:</span>
                  <span>{boardingPoint || 'Selected Boarding Bay'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Dropping:</span>
                  <span>{droppingPoint || 'Selected Dropping Bay'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ fontWeight: 700 }}>Total Payable:</span>
                  <strong style={{ color: '#dc2626', fontSize: '16px' }}>₹ {totalFare.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Passenger Inputs for each seat */}
              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-users" style={{ color: '#dc2626' }}></i> Passenger Details ({selectedSeats.length || 1} Seat{selectedSeats.length > 1 ? 's' : ''})
              </h4>

              {(selectedSeats.length > 0 ? selectedSeats : ['Seat 1']).map((seatId, idx) => {
                const pax = passengers[seatId] || { name: '', age: '', gender: 'Male' };
                return (
                  <div key={seatId} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626', marginBottom: '10px' }}>
                      Passenger {idx + 1} • {seatId}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Name</label>
                        <input
                          type="text"
                          value={pax.name}
                          onChange={(e) => onPassengerChange(seatId, 'name', e.target.value)}
                          placeholder="Enter passenger name"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Age</label>
                        <input
                          type="number"
                          value={pax.age}
                          onChange={(e) => onPassengerChange(seatId, 'age', e.target.value)}
                          placeholder="Age"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Gender</label>
                        <select
                          value={pax.gender}
                          onChange={(e) => onPassengerChange(seatId, 'gender', e.target.value as any)}
                          style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Contact Information */}
              <h4 style={{ margin: '14px 0 10px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-phone" style={{ color: '#dc2626' }}></i> Contact Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => onContactChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => onContactChange('email', e.target.value)}
                    placeholder="email@example.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                type="button"
                onClick={onConfirmBooking}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-lock"></i> Pay & Confirm Bus Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
