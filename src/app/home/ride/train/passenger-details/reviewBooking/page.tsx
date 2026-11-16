'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';

export default function TrainReviewBookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_train_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookingData(parsed);
        } catch (e) {
          console.error('Failed to parse pending booking', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <SubNavbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Loading review details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const trainName = bookingData?.trainName || 'Train Express';
  const trainNumber = bookingData?.trainNumber || '';
  const classCode = bookingData?.classCode || 'SL';
  const source = bookingData?.source || '';
  const destination = bookingData?.destination || '';
  const dateOfJourney = bookingData?.dateOfJourney || '';
  const depTime = bookingData?.depTime || '';
  const arrTime = bookingData?.arrTime || '';
  const boardingStation = bookingData?.boardingStation || source;

  const passengers = bookingData?.passengers && bookingData.passengers.length > 0
    ? bookingData.passengers
    : [];

  const email = bookingData?.email || '';
  const phone = bookingData?.phone || '';

  const ticketFare = Number(bookingData?.fare || 0);
  const totalBaseFare = ticketFare * (passengers.length || 1);
  const convenienceFee = bookingData?.paymentMode === 'upi' ? 11.80 : 17.70;
  const travelInsurance = bookingData?.travelInsurance === 'yes' ? 0.45 * (passengers.length || 1) : 0.45;
  const totalFare = (totalBaseFare + convenienceFee + travelInsurance).toFixed(2);

  const maskEmail = (mail: string) => {
    if (!mail) return '';
    const [name, domain] = mail.split('@');
    if (!domain) return mail;
    const masked = name.length > 2 ? `${name.slice(0, 2)}******` : `${name}******`;
    return `${masked}@${domain}`;
  };

  const maskPhone = (ph: string) => {
    if (!ph) return '';
    if (ph.length >= 4) {
      return `${ph.slice(0, 2)}******${ph.slice(-2)}`;
    }
    return ph;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: 1, maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '24px 16px' }}>
        
        {/* Stepper Header (1 Passenger Details -> 2 Review Journey -> 3 Payment) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '36px',
          marginBottom: '28px',
          padding: '12px 0'
        }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f97316',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              1
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Passenger Details</span>
          </div>

          <div style={{ width: '90px', height: '2px', background: '#f97316', marginTop: '-18px' }}></div>

          {/* Step 2 (Active with Glowing Ring) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ea580c',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(234, 88, 12, 0.25)'
            }}>
              2
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>Review Journey</span>
          </div>

          <div style={{ width: '90px', height: '2px', background: '#cbd5e1', marginTop: '-18px' }}></div>

          {/* Step 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#cbd5e1',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Payment</span>
          </div>
        </div>

        {/* Main Grid: Left Journey & Passenger Details, Right Fare Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '20px', alignItems: 'start' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Train & Journey Card matching reference image */}
            <div style={{
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              padding: '16px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              {/* Header: Train Name & Train Number & Location Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.3px' }}>
                  {trainName.toUpperCase()} {trainNumber ? `(${trainNumber})` : ''}
                </h2>
                <i className="fa-solid fa-location-dot" style={{ fontSize: '17px', color: '#0f172a' }}></i>
              </div>

              {/* Station Timing Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                {/* Departure */}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {depTime} | {source.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginTop: '2px' }}>
                    {dateOfJourney}
                  </div>
                </div>

                {/* Duration Line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                  <span>— {arrTime && depTime ? `${depTime} to ${arrTime}` : '02:13'} —</span>
                </div>

                {/* Arrival */}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {arrTime} | {destination.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginTop: '2px' }}>
                    {dateOfJourney}
                  </div>
                </div>

                {/* Availability Badge */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#16a34a',
                  letterSpacing: '0.2px'
                }}>
                  AVAILABLE
                </div>
              </div>

              {/* Metadata Sub-Bar */}
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '10px'
              }}>
                <span>{passengers.length} Adult</span>
                <span>|</span>
                <span>Class: {classCode}</span>
                <span>|</span>
                <span>General</span>
                <span>|</span>
                <span>Boarding at {boardingStation}</span>
                <span>|</span>
                <span>Boarding Date: {dateOfJourney} {depTime}</span>
              </div>

              {/* NTES note */}
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                Please check <span style={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>NTES website</span> or{' '}
                <span style={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>NTES app</span> for actual time before boarding
              </div>
            </div>

            {/* Passenger Details Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              padding: '16px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Passenger Details</h3>
                <i className="fa-solid fa-chevron-up" style={{ color: '#64748b', fontSize: '13px' }}></i>
              </div>

              {/* Passenger List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                {passengers.map((pax: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', color: '#0f172a' }}>
                    <span style={{ fontWeight: 800, minWidth: '16px' }}>{idx + 1}</span>
                    <span style={{ fontWeight: 900, textTransform: 'uppercase' }}>{pax.name}</span>
                    <span style={{ color: '#475569', fontSize: '12.5px', fontWeight: 500 }}>
                      {pax.age} yrs | {pax.gender || 'Male'} | {pax.nationality || 'India'} | {pax.berthPreference || 'No Preference'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ticket Sent Notification */}
              {(email || phone) && (
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  color: '#334155',
                  fontWeight: 600
                }}>
                  Your ticket will be sent to <strong>{maskEmail(email)}</strong> / <strong>{maskPhone(phone)}</strong>
                </div>
              )}
            </div>

            {/* View Cancellation Policy Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#cancellation" onClick={(e) => { e.preventDefault(); alert('IRCTC Cancellation Policy applies as per Indian Railways guidelines.'); }} style={{ color: '#0284c7', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                View Cancellation Policy
              </a>
            </div>

            {/* Navigation Buttons: Back and Continue */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '7px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => router.push('/home/ride/train/PassengerDetails/reviewBooking/Payment')}
                style={{
                  background: '#f97316',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 28px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(249, 115, 22, 0.35)'
                }}
              >
                Continue
              </button>
            </div>

          </div>

          {/* Right Column: Fare Summary Card in Navbar Purple #2a1373 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>Fare Summary</h3>
              </div>

              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155' }}>
                  <span>Ticket Fare</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {totalBaseFare.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155' }}>
                  <span>Convenience Fee (Incl. of GST)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {convenienceFee.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155' }}>
                  <span>Travel Insurance (Incl. of GST)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {travelInsurance.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Fare Bar matching Navbar purple #2a1373 */}
              <div style={{
                background: '#2a1373',
                color: '#ffffff',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '15px', fontWeight: 800 }}>Total Fare</span>
                <span style={{ fontSize: '18px', fontWeight: 900 }}>₹ {totalFare}</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
