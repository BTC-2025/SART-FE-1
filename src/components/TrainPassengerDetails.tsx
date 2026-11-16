'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TrainTicketPdfModal, { TrainTicketModalData } from './trains/TrainTicketPdfModal';
import { POPULAR_CITIES } from './trainData';

export interface TrainPassenger {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Transgender';
  nationality?: string;
  berthPreference: 'No Preference' | 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper';
  cateringOption?: string;
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
  const [boardingStation, setBoardingStation] = useState(source || 'Type station name');
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
  const [currentNationality, setCurrentNationality] = useState('India');
  const [currentBerth, setCurrentBerth] = useState<'No Preference' | 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper'>('No Preference');

  const handleAddPassenger = () => {
    if (!currentName.trim()) return;
    const newPax: TrainPassenger = {
      name: currentName.trim(),
      age: currentAge || '25',
      gender: currentGender,
      nationality: currentNationality,
      berthPreference: currentBerth,
    };
    setPassengersList([...passengersList, newPax]);
    setCurrentName('');
    setCurrentAge('');
    setCurrentBerth('No Preference');
    setCurrentGender('Male');
    setCurrentNationality('India');
  };

  const handleRemovePassenger = (idx: number) => {
    if (passengersList.length <= 1) return;
    setPassengersList(passengersList.filter((_, i) => i !== idx));
  };

  const [autoUpgradation, setAutoUpgradation] = useState(false);
  const [confirmBerthsOnly, setConfirmBerthsOnly] = useState(false);
  const [reservationChoice, setReservationChoice] = useState('Reservation Choice');
  const [preferredCoach, setPreferredCoach] = useState('');
  const [travelInsurance, setTravelInsurance] = useState<'yes' | 'no'>('yes');
  const [paymentMode, setPaymentMode] = useState<'cards_netbanking' | 'upi'>('cards_netbanking');

  const convenienceFee = paymentMode === 'cards_netbanking' ? 15 : 10;
  const insuranceFee = travelInsurance === 'yes' ? 0.45 * (passengersList.length || 1) : 0;
  const totalPayable = Math.round(fare * (passengersList.length || 1) + (freeCancel ? 50 : 0) + convenienceFee + insuranceFee);

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

              {/* 3. Passenger Details Card (IRCTC Style matching Image 2) */}
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Passenger Details</h3>
                  <i className="fa-solid fa-chevron-up" style={{ color: '#64748b', fontSize: '13px' }}></i>
                </div>

                {/* Display Current Added Passengers */}
                {passengersList.filter(p => p.name && p.name.trim().length > 0).map((pax, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                        {idx + 1}. {pax.name}
                      </span>
                      <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                        {pax.age} yrs • {pax.gender} • {pax.nationality || 'India'}
                      </span>
                      <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {pax.berthPreference}
                      </span>
                      {pax.cateringOption && (
                        <span style={{ fontSize: '12px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {pax.cateringOption}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(idx)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', padding: '4px' }}
                      title="Remove passenger"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}

                {/* Passenger Form Input Row (Horizontal Grid matching Image 2) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1.4fr) 70px 110px 140px minmax(140px, 1.1fr) 28px',
                  gap: '8px',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  {/* Name Input */}
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder="Passenger Name"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />

                  {/* Age Input */}
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    placeholder="Age"
                    style={{
                      width: '100%',
                      padding: '8px 8px',
                      borderRadius: '4px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      textAlign: 'center',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />

                  {/* Gender Select */}
                  <select
                    value={currentGender}
                    onChange={(e) => setCurrentGender(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 8px',
                      borderRadius: '4px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>

                  {/* Nationality Select */}
                  <select
                    value={currentNationality}
                    onChange={(e) => setCurrentNationality(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 8px',
                      borderRadius: '4px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Berth Preference Select */}
                  <select
                    value={currentBerth}
                    onChange={(e) => setCurrentBerth(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 8px',
                      borderRadius: '4px',
                      border: '1.5px solid #2563eb',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1e3a8a',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Lower">Lower</option>
                    <option value="Middle">Middle</option>
                    <option value="Upper">Upper</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>

                  {/* Clear / Reset action icon */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentName('');
                      setCurrentAge('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                    title="Clear row"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>



                {/* Bottom Action Links matching Image 2 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={handleAddPassenger}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1d4ed8',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    + Add Passenger/ Add Infant With Berth
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Infant under 5 years can be added without berth for free.')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1d4ed8',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    + Add Infant Without Berth
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '6px' }}>
                  *Children under 5 years of age shall be carried free and no purchase of any ticket is required. (If no separate berth is opted.)
                </div>
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

              {/* 5. Other Preferences Card (Matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Other Preferences</h3>
                  <i className="fa-solid fa-chevron-up" style={{ color: '#64748b', fontSize: '13px' }}></i>
                </div>

                {/* Checkboxes Row */}
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={autoUpgradation}
                      onChange={(e) => setAutoUpgradation(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                    />
                    <span>Consider for Auto Upgradation (In higher class you may or may not get lower berth)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={confirmBerthsOnly}
                      onChange={(e) => setConfirmBerthsOnly(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                    />
                    <span>Book only if confirm berths are allotted.</span>
                  </label>
                </div>

                {/* Reservation Choice Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', maxWidth: '360px' }}>
                  <div style={{ flex: 1, border: '1.5px solid #cbd5e1', borderRadius: '4px', padding: '7px 10px', background: '#ffffff' }}>
                    <select
                      value={reservationChoice}
                      onChange={(e) => setReservationChoice(e.target.value)}
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
                      <option value="Reservation Choice">Reservation Choice</option>
                      <option value="None">None</option>
                      <option value="Book, only if all berths are allotted in same coach">Book, only if all berths are allotted in same coach</option>
                      <option value="Book, only if at least 1 lower berth is allotted">Book, only if at least 1 lower berth is allotted</option>
                      <option value="Book, only if 2 lower berths are allotted">Book, only if 2 lower berths are allotted</option>
                    </select>
                  </div>
                  <i className="fa-solid fa-circle-info" style={{ color: '#16a34a', fontSize: '16px' }} title="Reservation choice info"></i>
                </div>

                {/* Preferred Coach No. Input */}
                <div style={{ maxWidth: '360px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={preferredCoach}
                    onChange={(e) => setPreferredCoach(e.target.value)}
                    placeholder="Preferred Coach No."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Travel Insurance Section */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    Travel Insurance (Incl. of GST){' '}
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>
                      Do you want to take Travel Insurance (₹0.45/person)?
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      <input
                        type="radio"
                        name="travelInsurance"
                        value="yes"
                        checked={travelInsurance === 'yes'}
                        onChange={() => setTravelInsurance('yes')}
                        style={{ accentColor: '#ea580c', width: '16px', height: '16px' }}
                      />
                      <span>
                        Yes, and I accept the{' '}
                        <a href="#insurance-terms" onClick={(e) => e.preventDefault()} style={{ color: '#0284c7', textDecoration: 'none' }}>
                          terms & conditions
                        </a>
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                      <input
                        type="radio"
                        name="travelInsurance"
                        value="no"
                        checked={travelInsurance === 'no'}
                        onChange={() => setTravelInsurance('no')}
                        style={{ accentColor: '#ea580c', width: '16px', height: '16px' }}
                      />
                      <span>No, I don&apos;t want travel insurance</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 6. Payment Mode Card (Matching Image 1) */}
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Payment Mode</h3>
                  <i className="fa-solid fa-chevron-up" style={{ color: '#64748b', fontSize: '13px' }}></i>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Option 1: Credit & Debit Cards / Net Banking / Wallets / EMI */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cards_netbanking"
                      checked={paymentMode === 'cards_netbanking'}
                      onChange={() => setPaymentMode('cards_netbanking')}
                      style={{ accentColor: '#ea580c', width: '16px', height: '16px', marginTop: '2px' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Pay through Credit & Debit Cards / Net Banking / Wallets / EMI / UPI_CC / UPI_CL / Rewards and Others
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Convenience Fee: ₹15/- + GST
                      </div>
                    </div>
                  </label>

                  {/* Option 2: BHIM/UPI */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="upi"
                      checked={paymentMode === 'upi'}
                      onChange={() => setPaymentMode('upi')}
                      style={{ accentColor: '#ea580c', width: '16px', height: '16px', marginTop: '2px' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Pay through BHIM/UPI
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Convenience Fee: ₹10/- + GST
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bottom Right Actions: Back and Continue Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '16px',
                marginBottom: '8px'
              }}>
                {/* Back Button */}
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '8px 22px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Back
                </button>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => {
                    let finalList = [...passengersList];
                    if (finalList.length === 0 && currentName.trim()) {
                      finalList = [{
                        name: currentName.trim(),
                        age: currentAge || '25',
                        gender: currentGender,
                        nationality: currentNationality,
                        berthPreference: currentBerth,
                        cateringOption: currentCatering
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

                    // Save pending booking details in localStorage for the review & payment pages
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
                      travelInsurance,
                      paymentMode,
                      autoUpgradation,
                      confirmBerthsOnly,
                      preferredCoach
                    };
                    try {
                      localStorage.setItem('sart_pending_train_booking', JSON.stringify(pendingBooking));
                    } catch (e) {
                      console.error('Error saving pending booking', e);
                    }

                    // Navigate to review booking page
                    router.push('/home/ride/train/passenger-details/reviewBooking');
                  }}
                  style={{
                    background: '#f97316',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 26px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(249, 115, 22, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Continue
                </button>
              </div>


            </>
          )}
        </div>
      </div>
    </div>
  );
}
