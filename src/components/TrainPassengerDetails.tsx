'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TrainTicketPdfModal, { TrainTicketModalData } from './trains/TrainTicketPdfModal';
import { POPULAR_CITIES } from './trainData';

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
  onConfirmBooking: (bookingMeta?: {
    passengers: TrainPassenger[];
    email?: string;
    phone?: string;
    irctcId?: string;
    boardingStation?: string;
    paymentDetails?: any;
  }) => void;
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
  const router = useRouter();
  const [showErsPdfModal, setShowErsPdfModal] = useState(false);

  // Form state matching image 1
  const [boardingStation, setBoardingStation] = useState(source || 'Perambur (PER)');
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [stationSearchQuery, setStationSearchQuery] = useState('');
  const stationDropdownRef = useRef<HTMLDivElement>(null);

  const [irctcUsername, setIrctcUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stateOfResidence, setStateOfResidence] = useState('');
  const [shareWhatsApp, setShareWhatsApp] = useState(true);

  // Close station dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stationDropdownRef.current && !stationDropdownRef.current.contains(event.target as Node)) {
        setIsStationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter stations based on search query
  const filteredStations = POPULAR_CITIES.filter((st) => {
    const q = stationSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      st.name.toLowerCase().includes(q) ||
      st.code.toLowerCase().includes(q) ||
      st.state.toLowerCase().includes(q)
    );
  });

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
      padding: '0px'
    }}>
      <div style={{
        background: '#f8fafc',
        borderRadius: '0px',
        maxWidth: '100%',
        width: '100%',
        height: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto',
        boxShadow: 'none',
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
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{source.split('-')[0].trim() || 'Chennai'} → {destination.split('-')[0].trim() || 'Bengaluru'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Boarding Station:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{boardingStation || source.split('-')[0].trim() || 'Chennai'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Journey Date:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{dateOfJourney}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>IRCTC ID:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{irctcUsername || 'Confirmed'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Passengers ({passengersList.length || 1}):</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {passengersList.length > 0 ? passengersList.map(p => `${p.name} (${p.age || '25'}, ${p.gender})`).join(', ') : (passenger.name || 'Passenger')}
                    </span>
                  </div>
                  {phoneNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                      <span>Contact:</span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>+91 {phoneNumber} {email ? `• ${email}` : ''}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>CNF / Coach S3, Berth 24</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowErsPdfModal(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#0284c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  <i className="fa-solid fa-file-pdf"></i> View & Download Ticket
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
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

              {/* Electronic Reservation Slip Modal */}
              {showErsPdfModal && (
                <TrainTicketPdfModal
                  ticket={{
                    pnr: `291${Math.floor(1000000 + Math.random() * 9000000)}`,
                    trainNumber,
                    trainName,
                    classCode,
                    source,
                    destination,
                    boardingStation,
                    departureTime: depTime,
                    departureDate: dateOfJourney,
                    destinationTime: arrTime || '11:15 AM',
                    destinationDate: dateOfJourney,
                    bookingDate: `${dateOfJourney} 20:21:44 HRS`,
                    passengers: (passengersList.length > 0 ? passengersList : [passenger]).map((p, idx) => ({
                      name: p.name || 'PASSENGER',
                      age: p.age || 24,
                      gender: p.gender || 'M',
                      bookingStatus: `CNF/Coach S3/Berth ${24 + idx}/${p.berthPreference || 'LOWER'}`,
                      currentStatus: `CNF/Coach S3/Berth ${24 + idx}/${p.berthPreference || 'LOWER'}`
                    })),
                    fare: fare * (passengersList.length || 1),
                    convenienceFee: 11.80,
                    insurancePremium: 0.90,
                    totalFare: totalPayable
                  }}
                  onClose={() => setShowErsPdfModal(false)}
                />
              )}
            </div>
          ) : (
            <>
              {/* 1. Boarding Station Card (Exact matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Boarding station</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>You can board from a different station</p>

                <div
                  ref={stationDropdownRef}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    position: 'relative',
                    background: '#ffffff'
                  }}
                >
                  <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Boarding Station</label>

                  {/* Searchable input box */}
                  <div
                    onClick={() => setIsStationDropdownOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="text"
                      value={isStationDropdownOpen ? stationSearchQuery : boardingStation}
                      onChange={(e) => {
                        setStationSearchQuery(e.target.value);
                        if (!isStationDropdownOpen) setIsStationDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setIsStationDropdownOpen(true);
                        setStationSearchQuery('');
                      }}
                      placeholder="Type station name or code..."
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f172a',
                        background: 'transparent'
                      }}
                    />
                    <i
                      className={`fa-solid fa-chevron-down`}
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        transform: isStationDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    ></i>
                  </div>

                  {/* Autocomplete dropdown options */}
                  {isStationDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        zIndex: 50,
                        marginTop: '4px'
                      }}
                    >
                      {/* Current selected option if source */}
                      {source && (
                        <div
                          onClick={() => {
                            setBoardingStation(source);
                            setIsStationDropdownOpen(false);
                            setStationSearchQuery('');
                          }}
                          style={{
                            padding: '10px 14px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderBottom: '1px solid #f1f5f9',
                            background: boardingStation === source ? '#eff6ff' : '#ffffff',
                            color: '#1e3a8a'
                          }}
                        >
                          <i className="fa-solid fa-train" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                          {source} (Selected Route)
                        </div>
                      )}

                      {filteredStations.map((st) => {
                        const label = `${st.name} (${st.code})`;
                        const isSelected = boardingStation.includes(st.code);
                        return (
                          <div
                            key={st.code}
                            onClick={() => {
                              setBoardingStation(label);
                              setIsStationDropdownOpen(false);
                              setStationSearchQuery('');
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isSelected ? '#f0fdf4' : '#ffffff';
                            }}
                            style={{
                              padding: '10px 14px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: isSelected ? 700 : 500,
                              background: isSelected ? '#f0fdf4' : '#ffffff',
                              color: isSelected ? '#15803d' : '#0f172a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f8fafc'
                            }}
                          >
                            <div>
                              <span>{st.name}</span>
                              <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '6px' }}>({st.code})</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{st.state}</span>
                          </div>
                        );
                      })}

                      {filteredStations.length === 0 && (
                        <div style={{ padding: '12px 14px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                          No matching stations found
                        </div>
                      )}
                    </div>
                  )}
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
                  Username is case sensitive. Eg- <strong>abc123</strong> both can be valid IDs and belong to different users.
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
                      maxLength={10}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(digitsOnly);
                      }}
                      placeholder="Phone Number (10 digits)"
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
                    let finalList = [...passengersList];
                    if (finalList.length === 0 && currentName.trim()) {
                      finalList = [{
                        name: currentName.trim(),
                        age: currentAge || '25',
                        gender: currentGender,
                        berthPreference: currentBerth
                      }];
                      setPassengersList(finalList);
                    }
                    if (finalList.length === 0) {
                      alert('Please enter at least one passenger name');
                      return;
                    }
                    if (finalList.length > 0) {
                      onPassengerChange(finalList[0]);
                    }

                    // Save pending booking details in localStorage for the dedicated payment page
                    const pendingBooking = {
                      trainName,
                      trainNumber,
                      classCode,
                      fare,
                      totalAmount: totalPayable,
                      source,
                      destination,
                      dateOfJourney,
                      depTime,
                      arrTime,
                      passengers: finalList,
                      email: email.trim(),
                      phone: phoneNumber.trim(),
                      irctcId: irctcUsername.trim(),
                      boardingStation: boardingStation.trim(),
                      freeCancel
                    };

                    if (typeof window !== 'undefined') {
                      localStorage.setItem('sart_pending_train_booking', JSON.stringify(pendingBooking));
                    }

                    // Navigate directly to dedicated payment page
                    router.push('/home/ride/train/payment');
                  }}
                  style={{
                    padding: '12px 28px',
                    background: '#2a1373',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(42, 19, 115, 0.35)'
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
