'use client';

import React from 'react';

export interface FlightPassenger {
  title: 'Mr' | 'Ms' | 'Mrs';
  fullName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  seatPreference?: 'Aisle' | 'Window' | 'Middle' | 'No Preference';
  mealPreference?: 'Veg' | 'Non-Veg' | 'None';
  idType?: 'Aadhaar' | 'Passport' | 'Voter ID';
  idNumber?: string;
}

export interface FlightContactInfo {
  email: string;
  phone: string;
}

interface FlightPassengerDetailsModalProps {
  airline: string;
  flightNo: string;
  source: string;
  destination: string;
  depTime: string;
  depAirportCode: string;
  arrTime: string;
  arrAirportCode: string;
  fare: number;
  dateOfJourney?: string;
  passenger: FlightPassenger;
  contact: FlightContactInfo;
  onPassengerChange: (p: FlightPassenger) => void;
  onContactChange: (c: FlightContactInfo) => void;
  onConfirmBooking: () => void;
  onClose: () => void;
  isConfirmed?: boolean;
}

export default function FlightPassengerDetailsModal({
  airline,
  flightNo,
  source,
  destination,
  depTime,
  depAirportCode,
  arrTime,
  arrAirportCode,
  fare,
  dateOfJourney,
  passenger,
  contact,
  onPassengerChange,
  onContactChange,
  onConfirmBooking,
  onClose,
  isConfirmed = false
}: FlightPassengerDetailsModalProps) {
  const displayDate = React.useMemo(() => {
    if (dateOfJourney) return dateOfJourney;
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]}, ${today.getFullYear()}`;
  }, [dateOfJourney]);
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
          background: '#0284c7',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              {isConfirmed ? 'Flight E-Ticket Confirmed!' : `Book Flight: ${airline}`}
            </h3>
            <span style={{ fontSize: '13px', color: '#e0f2fe' }}>
              {flightNo} • {depAirportCode} → {arrAirportCode} • {displayDate}
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
              <h4 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                E-Ticket Confirmed!
              </h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
                Booked for <strong>{passenger.title} {passenger.fullName || 'Alex Carter'}</strong>
              </p>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>PNR / Booking Ref:</span>
                  <strong style={{ color: '#0284c7', fontSize: '15px' }}>6E{Math.floor(100000 + Math.random() * 900000)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Flight & Seat:</span>
                  <strong>{flightNo} (Seat 14C • {passenger.seatPreference || 'Aisle'})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Meal:</span>
                  <strong>{passenger.mealPreference || 'Veg Meal'} Included</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Terminal & Gate:</span>
                  <strong>Terminal 1 • Gate 4</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Total Paid:</span>
                  <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹ {fare.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0284c7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              {/* Flight Summary Card */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Route:</span>
                  <strong>{source} → {destination}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Departure:</span>
                  <strong>{depTime} ({depAirportCode})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Arrival:</span>
                  <strong>{arrTime} ({arrAirportCode})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Total Fare:</span>
                  <strong style={{ color: '#0284c7', fontSize: '17px' }}>₹ {fare.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Passenger Info Form */}
              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-user" style={{ color: '#0284c7' }}></i> Passenger Details
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Title</label>
                  <select
                    value={passenger.title}
                    onChange={(e) => onPassengerChange({ ...passenger, title: e.target.value as any })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Full Name (as on ID)</label>
                  <input
                    type="text"
                    value={passenger.fullName}
                    onChange={(e) => onPassengerChange({ ...passenger, fullName: e.target.value })}
                    placeholder="Enter full name"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Age</label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => onPassengerChange({ ...passenger, age: e.target.value })}
                    placeholder="Age"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Gender</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => onPassengerChange({ ...passenger, gender: e.target.value as any })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Preferences */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Seat Preference</label>
                  <select
                    value={passenger.seatPreference || 'Window'}
                    onChange={(e) => onPassengerChange({ ...passenger, seatPreference: e.target.value as any })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Middle">Middle Seat</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Meal Choice</label>
                  <select
                    value={passenger.mealPreference || 'Veg'}
                    onChange={(e) => onPassengerChange({ ...passenger, mealPreference: e.target.value as any })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="Veg">Vegetarian Meal</option>
                    <option value="Non-Veg">Non-Vegetarian Meal</option>
                    <option value="None">No Meal Required</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <h4 style={{ margin: '14px 0 10px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-envelope" style={{ color: '#0284c7' }}></i> Contact Details (for E-Ticket)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mobile Number</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => onContactChange({ ...contact, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => onContactChange({ ...contact, email: e.target.value })}
                    placeholder="name@email.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={onConfirmBooking}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#0284c7',
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
                <i className="fa-solid fa-lock"></i> Pay & Confirm Flight Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
