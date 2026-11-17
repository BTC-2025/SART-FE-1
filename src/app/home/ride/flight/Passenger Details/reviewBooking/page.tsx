'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';

export default function FlightReviewBookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_flight_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookingData(parsed);
        } catch (e) {
          console.error('Failed to parse flight booking from localStorage', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const airline = bookingData?.airline || 'Vistara';
  const flightNo = bookingData?.flightNo || 'UK-922';
  const source = bookingData?.source || 'Bengaluru';
  const sourceAirport = bookingData?.sourceAirport || 'BLR';
  const destination = bookingData?.destination || 'Delhi';
  const destinationAirport = bookingData?.destinationAirport || 'DEL';
  const depTime = bookingData?.depTime || '18:30';
  const arrTime = bookingData?.arrTime || '20:45';
  const dateOfJourney = bookingData?.dateOfJourney || '17 Nov, 2026';

  const passenger = bookingData?.passenger || {
    title: 'Mr',
    fullName: 'Passenger',
    age: '28',
    gender: 'Male',
    seatPreference: 'Window Seat',
    mealChoice: 'Vegetarian Meal'
  };

  const assignedSeatsSummary = useMemo(() => {
    if (bookingData?.seatSelectionList && Array.isArray(bookingData.seatSelectionList)) {
      const seats = bookingData.seatSelectionList
        .filter((p: any) => p.seatCode)
        .map((p: any) => `${p.name || p.typeLabel}: Seat ${p.seatCode}`);
      if (seats.length > 0) return seats.join(' | ');
    }
    if (bookingData?.assignedSeats) {
      const seats = Object.entries(bookingData.assignedSeats).map(([k, v]) => `Seat ${v}`);
      if (seats.length > 0) return seats.join(', ');
    }
    return passenger.seatPreference ? `${passenger.seatPreference} (Seat 29F)` : 'Seat 29F';
  }, [bookingData, passenger]);

  const contact = bookingData?.contact || {
    phone: bookingData?.phone || '+91 9876543210',
    email: bookingData?.email || 'name2000@example.com'
  };

  const baseFare = Number(bookingData?.fare || 5750);
  const taxesAndFees = 450;
  const convenienceFee = 150;
  const totalFare = baseFare + taxesAndFees + convenienceFee;

  const handleProceedToPayment = () => {
    // Save updated total fare
    if (typeof window !== 'undefined') {
      const updated = {
        ...bookingData,
        baseFare,
        taxesAndFees,
        convenienceFee,
        totalFare
      };
      localStorage.setItem('sart_pending_flight_booking', JSON.stringify(updated));
    }
    router.push('/home/ride/flight/PassengerDetails/reviewBooking/Payment');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 90, background: '#ffffff', width: '100%' }}>
        <Navbar />
        <SubNavbar />
      </div>

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '24px 20px 48px 20px',
        boxSizing: 'border-box'
      }}>
        {/* Stepper Header (1 Passenger Details -> 2 Review Journey -> 3 Payment) - Width: 500px */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto 28px auto',
          padding: '4px 0'
        }}>
          {/* Step 1 */}
          <div
            onClick={() => router.push('/home/ride/flight/PassengerDetails')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '110px', cursor: 'pointer' }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#391E84',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fa-solid fa-check" style={{ fontSize: '11px' }}></i>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
              Passenger Details
            </span>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#391E84', marginTop: '-20px', marginInline: '8px' }}></div>

          {/* Step 2 (Active) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '110px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#391E84',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(57, 30, 132, 0.25)'
            }}>
              2
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
              Review Journey
            </span>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#e2e8f0', marginTop: '-20px', marginInline: '8px' }}></div>

          {/* Step 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '110px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              color: '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #cbd5e1'
            }}>
              3
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Payment
            </span>
          </div>
        </div>

        {/* Page Title Row */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
              Review Flight Booking
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Please verify your flight schedule and passenger information before payment
            </p>
          </div>
          <span style={{
            background: '#e0f2fe',
            color: '#0369a1',
            fontSize: '12px',
            fontWeight: 800,
            padding: '6px 12px',
            borderRadius: '20px'
          }}>
            <i className="fa-solid fa-plane-departure" style={{ marginRight: '6px' }}></i> Flight Booking
          </span>
        </div>

        {/* Main 2-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left Column: Flight & Passenger Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Flight Schedule Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              {/* Header */}
              <div style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-plane" style={{ fontSize: '16px' }}></i>
                  <span style={{ fontSize: '15px', fontWeight: 800 }}>{airline} • {flightNo}</span>
                </div>
                <span style={{ fontSize: '12.5px', color: '#e0f2fe', fontWeight: 600 }}>
                  Economy • Standard
                </span>
              </div>

              {/* Route & Timing Body */}
              <div style={{ padding: '20px 22px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '20px',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  {/* Origin */}
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{depTime}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{sourceAirport}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{source}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{dateOfJourney}</div>
                  </div>

                  {/* Flight Duration Line */}
                  <div style={{ textAlign: 'center', padding: '0 10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                      02h 15m
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></div>
                      <div style={{ width: '70px', height: '2px', background: '#cbd5e1' }}></div>
                      <i className="fa-solid fa-plane" style={{ fontSize: '13px', color: '#0284c7', transform: 'rotate(90deg)' }}></i>
                      <div style={{ width: '70px', height: '2px', background: '#cbd5e1' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></div>
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#16a34a', fontWeight: 700, marginTop: '4px' }}>
                      Non-stop
                    </div>
                  </div>

                  {/* Destination */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{arrTime}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{destinationAirport}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{destination}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{dateOfJourney}</div>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12px',
                  color: '#475569'
                }}>
                  <div><i className="fa-solid fa-suitcase" style={{ color: '#0284c7', marginRight: '6px' }}></i> Check-in: <strong>15 kg</strong></div>
                  <div><i className="fa-solid fa-briefcase" style={{ color: '#0284c7', marginRight: '6px' }}></i> Cabin: <strong>7 kg</strong></div>
                  <div><i className="fa-solid fa-utensils" style={{ color: '#0284c7', marginRight: '6px' }}></i> Meal: <strong>{passenger.mealChoice}</strong></div>
                </div>
              </div>
            </div>

            {/* 2. Passenger Information Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '18px 22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-user-check" style={{ color: '#391E84' }}></i>
                  Passenger Information
                </h3>
                <button
                  type="button"
                  onClick={() => router.push('/home/ride/flight/PassengerDetails/SeatSelection')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: '4px' }}></i> Edit
                </button>
              </div>

              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Passenger Name</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {passenger.title} {passenger.fullName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {passenger.age} yrs • {passenger.gender}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Seat Assignment</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                    {assignedSeatsSummary}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Confirmed &amp; Reserved
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Meal Selection</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                    {passenger.mealChoice}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Complimentary
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Contact & Communication Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '18px 22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-envelope" style={{ color: '#0284c7' }}></i>
                Ticket & Boarding Pass Delivery
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Mobile (SMS & WhatsApp updates)</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {contact.phone}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Email (E-Ticket & Invoice PDF)</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {contact.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fare Summary & Proceed Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Fare Summary Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Fare Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Base Fare ({bookingData?.travelers?.summary || (bookingData?.travelers?.total ? `${bookingData.travelers.total} Passengers` : '1 Adult')})</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {baseFare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Taxes & Airport Charges</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {taxesAndFees.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Convenience Fee</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {convenienceFee.toFixed(2)}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '12px',
                  marginTop: '6px'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#391E84' }}>
                    ₹ {totalFare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Secure Booking Badge */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '8px 12px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11.5px',
                color: '#15803d',
                fontWeight: 600
              }}>
                <i className="fa-solid fa-shield-halved"></i>
                <span>100% Safe & Secure Transaction</span>
              </div>

              {/* Bottom Buttons: Back & Proceed to Payment */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => router.push('/home/ride/flight/PassengerDetails/SeatSelection')}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  style={{
                    flex: 1,
                    background: '#391E84',
                    border: 'none',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(57, 30, 132, 0.3)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Proceed to Payment</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
