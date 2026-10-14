'use client';

import React, { useState } from 'react';

export interface TrainPassenger {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Transgender';
  berthPreference: 'No Preference' | 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper';
}

interface TrainPassengerDetailsModalProps {
  trainName: string;
  trainNumber: string;
  classCode: string;
  fare: number;
  source: string;
  destination: string;
  dateOfJourney: string;
  depTime?: string;
  arrTime?: string;
  passenger: TrainPassenger;
  freeCancel?: boolean;
  onPassengerChange: (p: TrainPassenger) => void;
  onConfirmBooking: () => void;
  onClose: () => void;
  isConfirmed?: boolean;
}

export default function TrainPassengerDetailsModal({
  trainName,
  trainNumber,
  classCode,
  fare,
  source,
  destination,
  dateOfJourney,
  depTime = '12:05 AM',
  arrTime,
  passenger,
  freeCancel = false,
  onPassengerChange,
  onConfirmBooking,
  onClose,
  isConfirmed = false
}: TrainPassengerDetailsModalProps) {
  // Form state matching image 1
  const [boardingStation, setBoardingStation] = useState(source || '');
  const [irctcUsername, setIrctcUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stateOfResidence, setStateOfResidence] = useState('');
  const [shareWhatsApp, setShareWhatsApp] = useState(true);

  // Multiple passengers list support - only show when added
  const [passengersList, setPassengersList] = useState<TrainPassenger[]>(
    passenger.name && passenger.name.trim().length > 0
      ? [
          {
            name: passenger.name,
            age: passenger.age || '',
            gender: passenger.gender || 'Male',
            berthPreference: (passenger.berthPreference as any) || 'No Preference'
          }
        ]
      : []
  );

  const [currentName, setCurrentName] = useState('');
  const [currentGender, setCurrentGender] = useState<'Male' | 'Female' | 'Transgender'>('Male');
  const [currentAge, setCurrentAge] = useState('');
  const [currentBerth, setCurrentBerth] = useState<'No Preference' | 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper'>('No Preference');

  const handleAddPassenger = () => {
    if (!currentName.trim()) return;
    const newPax: TrainPassenger = {
      name: currentName.trim(),
      age: currentAge || '25',
      gender: currentGender,
      berthPreference: currentBerth
    };
    setPassengersList([...passengersList, newPax]);
    setCurrentName('');
    setCurrentAge('');
    setCurrentBerth('No Preference');
    setCurrentGender('Male');
  };

  const handleRemovePassenger = (idx: number) => {
    if (passengersList.length <= 1) return;
    setPassengersList(passengersList.filter((_, i) => i !== idx));
  };

  const totalPayable = fare * (passengersList.length || 1) + (freeCancel ? 50 : 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#f8fafc',
        borderRadius: '16px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '94vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {isConfirmed ? 'Booking Confirmed' : 'Passenger Details'}
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {trainName} (#{trainNumber}) • Class: <span style={{ fontWeight: 700, color: '#dc2626' }}>{classCode}</span> • ₹{fare} / seat
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '16px'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isConfirmed ? (
            /* Confirmation View */
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
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
                Ticket Confirmed!
              </h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '13px' }}>
                Your ticket for <strong>{trainName}</strong> ({classCode}) has been booked.
              </p>

              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Journey:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{source.split('-')[0].trim()} → {destination.split('-')[0].trim()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Boarding Station:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{boardingStation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Journey Date:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{dateOfJourney}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>IRCTC ID:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{irctcUsername}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Passengers ({passengersList.length}):</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{passengersList.map(p => p.name).join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>CNF / Coach S3, Berth 24</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close & View Bookings
              </button>
            </div>
          ) : (
            <>
              {/* 1. Boarding Station Card (Exact matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Boarding station</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>You can board from a different station</p>

                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  position: 'relative',
                  background: '#ffffff'
                }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Boarding Station</label>
                  <select
                    value={boardingStation}
                    onChange={(e) => setBoardingStation(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={source}>{source}</option>
                    <option value="Perambur (PER)">Perambur (PER)</option>
                    <option value="Chennai Central (MAS)">Chennai Central (MAS)</option>
                    <option value="Tambaram (TBM)">Tambaram (TBM)</option>
                    <option value="Vijayawada Jn (BZA)">Vijayawada Jn (BZA)</option>
                    <option value="Secunderabad (SC)">Secunderabad (SC)</option>
                    <option value="KSR Bengaluru (SBC)">KSR Bengaluru (SBC)</option>
                  </select>
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px', fontWeight: 500 }}>
                  Boarding time: <span style={{ fontWeight: 600 }}>{dateOfJourney} • {depTime}</span>
                </div>
              </div>

              {/* 2. IRCTC Username Card (Exact matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>IRCTC Username</h3>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Required</span>
                  </div>
                  {/* IRCTC Logo representation */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0284c7',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 900
                  }}>
                    IRCTC
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    value={irctcUsername}
                    onChange={(e) => setIrctcUsername(e.target.value)}
                    placeholder="IRCTC Username"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      color: '#0f172a'
                    }}
                  />
                </div>
                <p style={{ margin: '6px 0 8px 0', fontSize: '11px', color: '#64748b' }}>
                  Username is case sensitive. Eg- <strong>ABC123</strong> and <strong>abc123</strong> both can be valid IDs and belong to different users.
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please visit irctc.co.in to recover your username'); }} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                    Forgot username
                  </a>
                  <a href="#create" onClick={(e) => { e.preventDefault(); alert('Please visit irctc.co.in to register a new account'); }} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                    Create new IRCTC account
                  </a>
                </div>
              </div>

              {/* 3. Select Passengers Card (Exact matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Select passengers</h3>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{passengersList.length} Added</span>
                </div>

                {/* Display Current Added Passengers (only when entered) */}
                {passengersList.filter(p => p.name && p.name.trim().length > 0).map((pax, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        {idx + 1}. {pax.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {pax.gender || 'Male'} • {pax.age ? `${pax.age} yrs` : 'Age N/A'} • {pax.berthPreference || 'No Preference'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}
                      title="Remove passenger"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}

                {/* Name Input */}
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder="Name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Gender Radio Pills */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Gender</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['Male', 'Female', 'Others'] as const).map((g) => {
                      const actualGender = g === 'Others' ? 'Transgender' : g;
                      const isSelected = currentGender === actualGender;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setCurrentGender(actualGender)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '20px',
                            border: `1.5px solid ${isSelected ? '#0284c7' : '#cbd5e1'}`,
                            background: isSelected ? '#f0f9ff' : '#ffffff',
                            color: isSelected ? '#0284c7' : '#334155',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{g}</span>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? '#0284c7' : '#94a3b8'}`,
                            display: 'inline-block',
                            background: isSelected ? '#0284c7' : 'transparent'
                          }}></span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age Input */}
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    placeholder="Age"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Berth Dropdown */}
                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  background: '#ffffff',
                  marginBottom: '4px'
                }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Berth</label>
                  <select
                    value={currentBerth}
                    onChange={(e) => setCurrentBerth(e.target.value as any)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="No Preference">No Pref</option>
                    <option value="Lower">Lower Berth</option>
                    <option value="Middle">Middle Berth</option>
                    <option value="Upper">Upper Berth</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '12px' }}>
                  Berth Preference not guaranteed
                </div>

                {/* Add to passengers list button */}
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Add to passengers list
                </button>
              </div>

              {/* 4. Contact Details Card (Exact matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Contact details</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>
                  Booking details will be sent to the contact information provided below
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    background: '#ffffff'
                  }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>State of residence</label>
                    <select
                      value={stateOfResidence}
                      onChange={(e) => setStateOfResidence(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f172a',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', marginBottom: '12px' }}>
                  Required for GST Tax Invoicing
                </div>

                {/* WhatsApp Notification Card */}
                <div
                  onClick={() => setShareWhatsApp(!shareWhatsApp)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#eff6ff',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-brands fa-whatsapp" style={{ color: '#22c55e', fontSize: '18px' }}></i>
                  <span style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: 600, flex: 1 }}>
                    Booking details and trip updates will be shared on WhatsApp
                  </span>
                  <input
                    type="checkbox"
                    checked={shareWhatsApp}
                    onChange={(e) => setShareWhatsApp(e.target.checked)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </div>
              </div>

              {/* Bottom Sticky Total and Proceed Button */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Payable ({passengersList.length} Pax)</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (passengersList.length > 0) {
                      onPassengerChange(passengersList[0]);
                    }
                    onConfirmBooking();
                  }}
                  style={{
                    padding: '12px 28px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <i className="fa-solid fa-lock"></i> Pay & Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
