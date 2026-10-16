'use client';

import React, { useState } from 'react';
import './HelicopterPassengerDetails.css';
import { HelicopterItem } from './helicopterData';

export interface HelicopterPassenger {
  title: string;
  fullName: string;
  age: string;
  gender: string;
  seatPreference: string;
  weightKg: string; // Crucial for helicopter weight & balance
}

export interface HelicopterContactInfo {
  email: string;
  phone: string;
}

interface HelicopterPassengerDetailsModalProps {
  heli: HelicopterItem;
  source: string;
  destination: string;
  dateOfJourney: string;
  passenger: HelicopterPassenger;
  contact: HelicopterContactInfo;
  onPassengerChange: (p: HelicopterPassenger) => void;
  onContactChange: (c: HelicopterContactInfo) => void;
  onConfirmBooking: () => void;
  onClose: () => void;
  isConfirmed: boolean;
}

export default function HelicopterPassengerDetailsModal({
  heli,
  source,
  destination,
  dateOfJourney,
  passenger,
  contact,
  onPassengerChange,
  onContactChange,
  onConfirmBooking,
  onClose,
  isConfirmed
}: HelicopterPassengerDetailsModalProps) {
  const [activeStep, setActiveStep] = useState<'form' | 'addons' | 'payment'>('form');
  const [selectedSeat, setSelectedSeat] = useState('Front Co-Pilot View Seat');
  const [selectedLoungeAccess, setSelectedLoungeAccess] = useState(true);
  const [noiseCancellingHeadset, setNoiseCancellingHeadset] = useState(true);
  const [helipadShuttle, setHelipadShuttle] = useState(false);

  const calculateTotal = () => {
    let t = heli.fare;
    if (selectedLoungeAccess) t += 1200;
    if (noiseCancellingHeadset) t += 450;
    if (helipadShuttle) t += 1800;
    return t;
  };

  if (isConfirmed) {
    return (
      <div className="hp-overlay">
        <div className="hp-modal-card hp-confirmed-card">
          <div className="hp-confirmed-header">
            <div className="hp-confirmed-badge">
              <i className="fa-solid fa-helicopter"></i>
            </div>
            <h2>Helicopter Charter Confirmed!</h2>
            <p>Your helipad boarding pass and DGCA manifest have been issued.</p>
          </div>

          <div className="hp-ticket-stub">
            <div className="hp-stub-row">
              <div>
                <span className="hp-stub-label">OPERATOR &amp; TAIL NO</span>
                <span className="hp-stub-val">{heli.operator} • {heli.heliNo}</span>
              </div>
              <div>
                <span className="hp-stub-label">AIRCRAFT</span>
                <span className="hp-stub-val">{heli.heliModel}</span>
              </div>
            </div>

            <div className="hp-stub-row">
              <div>
                <span className="hp-stub-label">DEPARTURE HELIPAD</span>
                <span className="hp-stub-val">{heli.depHeliCode} ({heli.depCity})</span>
              </div>
              <div>
                <span className="hp-stub-label">LANDING HELIPAD</span>
                <span className="hp-stub-val">{heli.arrHeliCode} ({heli.arrCity})</span>
              </div>
            </div>

            <div className="hp-stub-row">
              <div>
                <span className="hp-stub-label">REPORTING TIME</span>
                <span className="hp-stub-val">{heli.depTime} • {dateOfJourney}</span>
              </div>
              <div>
                <span className="hp-stub-label">PASSENGER / SEAT</span>
                <span className="hp-stub-val">{passenger.fullName} ({selectedSeat})</span>
              </div>
            </div>

            <div className="hp-stub-row hp-stub-total-row">
              <span>Total Paid Amount</span>
              <strong style={{ color: '#059669', fontSize: '18px' }}>₹{calculateTotal().toLocaleString()}</strong>
            </div>
          </div>

          <div className="hp-confirmed-actions">
            <button type="button" className="hp-btn-primary" onClick={onClose}>
              <i className="fa-solid fa-check"></i> Done &amp; View in My Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hp-overlay">
      <div className="hp-modal-card">
        {/* Header */}
        <div className="hp-modal-header">
          <div>
            <span className="hp-modal-tag"><i className="fa-solid fa-helicopter"></i> Helicopter Charter</span>
            <h3>{heli.operator} ({heli.heliNo})</h3>
            <p>{heli.depCity} ({heli.depHeliCode}) <i className="fa-solid fa-arrow-right"></i> {heli.arrCity} ({heli.arrHeliCode}) • {dateOfJourney}</p>
          </div>
          <button type="button" className="hp-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="hp-modal-body">
          {activeStep === 'form' && (
            <div className="hp-form-flow">
              <h4 className="hp-section-title"><i className="fa-solid fa-user-astronaut"></i> Primary Passenger Information (DGCA Mandated)</h4>
              
              <div className="hp-input-grid">
                <div>
                  <label>Title</label>
                  <select
                    value={passenger.title}
                    onChange={(e) => onPassengerChange({ ...passenger, title: e.target.value })}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div>
                  <label>Full Name (As on Govt ID)</label>
                  <input
                    type="text"
                    value={passenger.fullName}
                    onChange={(e) => onPassengerChange({ ...passenger, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label>Age</label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => onPassengerChange({ ...passenger, age: e.target.value })}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label>Body Weight (Kg) *Required for Balance</label>
                  <input
                    type="number"
                    value={passenger.weightKg}
                    onChange={(e) => onPassengerChange({ ...passenger, weightKg: e.target.value })}
                    placeholder="e.g. 72"
                  />
                </div>
              </div>

              <h4 className="hp-section-title" style={{ marginTop: '20px' }}><i className="fa-solid fa-envelope"></i> Contact &amp; Manifest Details</h4>
              <div className="hp-input-grid">
                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => onContactChange({ ...contact, email: e.target.value })}
                    placeholder="e.g. user@domain.com"
                  />
                </div>
                <div>
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => onContactChange({ ...contact, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <h4 className="hp-section-title" style={{ marginTop: '20px' }}><i className="fa-solid fa-couch"></i> Seat Preference</h4>
              <div className="hp-seat-options">
                {[
                  { name: 'Front Co-Pilot View Seat', desc: 'Panoramic 180° Cockpit View', badge: '+₹1,500' },
                  { name: 'Window Club Leather Seat', desc: 'Direct Skyview & Foldout Desk', badge: 'Standard' },
                  { name: 'Rear Cabin Spacious Berth', desc: 'Max Legroom & Privacy Curtain', badge: 'Standard' }
                ].map((s) => (
                  <div
                    key={s.name}
                    className={`hp-seat-card ${selectedSeat === s.name ? 'active' : ''}`}
                    onClick={() => setSelectedSeat(s.name)}
                  >
                    <div>
                      <strong>{s.name}</strong>
                      <span>{s.desc}</span>
                    </div>
                    <span className="hp-seat-badge">{s.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 'addons' && (
            <div className="hp-addons-flow">
              <h4 className="hp-section-title"><i className="fa-solid fa-champagne-glasses"></i> VIP Helipad Addons</h4>
              
              <div
                className={`hp-addon-card ${selectedLoungeAccess ? 'active' : ''}`}
                onClick={() => setSelectedLoungeAccess(prev => !prev)}
              >
                <div className="hp-addon-left">
                  <input type="checkbox" checked={selectedLoungeAccess} readOnly />
                  <div>
                    <strong>VIP Helipad Terminal Lounge Access</strong>
                    <p>Priority boarding, gourmet beverages, and air-conditioned private lounge suite.</p>
                  </div>
                </div>
                <strong>+₹1,200</strong>
              </div>

              <div
                className={`hp-addon-card ${noiseCancellingHeadset ? 'active' : ''}`}
                onClick={() => setNoiseCancellingHeadset(prev => !prev)}
              >
                <div className="hp-addon-left">
                  <input type="checkbox" checked={noiseCancellingHeadset} readOnly />
                  <div>
                    <strong>Bose Aviation Active Noise-Cancelling Headsets</strong>
                    <p>Crystal-clear cockpit intercom audio &amp; noise suppression during flight.</p>
                  </div>
                </div>
                <strong>+₹450</strong>
              </div>

              <div
                className={`hp-addon-card ${helipadShuttle ? 'active' : ''}`}
                onClick={() => setHelipadShuttle(prev => !prev)}
              >
                <div className="hp-addon-left">
                  <input type="checkbox" checked={helipadShuttle} readOnly />
                  <div>
                    <strong>Tarmac / Helipad Chauffeured Mercedes Shuttle</strong>
                    <p>Seamless door-to-helipad apron transfer in luxury executive sedan.</p>
                  </div>
                </div>
                <strong>+₹1,800</strong>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="hp-modal-footer">
          <div className="hp-fare-preview">
            <span>Total Payable:</span>
            <strong>₹{calculateTotal().toLocaleString()}</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeStep === 'addons' && (
              <button
                type="button"
                className="hp-btn-secondary"
                onClick={() => setActiveStep('form')}
              >
                Back to Form
              </button>
            )}

            {activeStep === 'form' ? (
              <button
                type="button"
                className="hp-btn-primary"
                onClick={() => setActiveStep('addons')}
              >
                Continue to VIP Addons <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                className="hp-btn-primary"
                onClick={onConfirmBooking}
              >
                <i className="fa-solid fa-bolt"></i> Confirm &amp; Issue Helipad Pass
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
