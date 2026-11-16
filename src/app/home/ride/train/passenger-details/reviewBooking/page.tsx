'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';

export default function TrainReviewBookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    }
  }, []);

  const trainName = bookingData?.trainName || 'SMVB DURONTO EXP';
  const trainNumber = bookingData?.trainNumber || '12245';
  const classCode = bookingData?.classCode || 'SL';
  const source = bookingData?.source || 'HOWRAH JN';
  const destination = bookingData?.destination || 'SMVT BENGALURU';
  const dateOfJourney = bookingData?.dateOfJourney || 'Wed, 19 Aug';
  const depTime = bookingData?.depTime || '10:40';
  const arrTime = bookingData?.arrTime || '15:45';
  const boardingStation = bookingData?.boardingStation || source;

  const passengers = bookingData?.passengers && bookingData.passengers.length > 0
    ? bookingData.passengers
    : [
      {
        name: 'Rakesh Kumar',
        age: '25',
        gender: 'Male',
        nationality: 'India',
        berthPreference: 'Upper',
        cateringOption: 'Veg'
      }
    ];

  const email = bookingData?.email || 'ra******@gmail.com';
  const phone = bookingData?.phone || '62******47';

  const ticketFare = Number(bookingData?.fare || 1565);
  const totalBaseFare = ticketFare * (passengers.length || 1);
  const convenienceFee = bookingData?.paymentMode === 'upi' ? 11.80 : 17.70;
  const travelInsurance = bookingData?.travelInsurance === 'yes' ? 0.45 * (passengers.length || 1) : 0;
  const totalFare = (totalBaseFare + convenienceFee + travelInsurance).toFixed(2);

  const maskEmail = (mail: string) => {
    if (!mail) return 'ra******@gmail.com';
    const [name, domain] = mail.split('@');
    if (!domain) return mail;
    const masked = name.length > 2 ? `${name.slice(0, 2)}******` : `${name}******`;
    return `${masked}@${domain}`;
  };

  const maskPhone = (ph: string) => {
    if (!ph) return '62******47';
    if (ph.length >= 4) {
      return `${ph.slice(0, 2)}******${ph.slice(-2)}`;
    }
    return ph;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '24px 16px' }}>
        {/* Stepper Header (1 Passenger Details -> 2 Review Journey -> 3 Payment) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '24px',
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
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              1
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Passenger Details</span>
          </div>

          <div style={{ width: '80px', height: '2px', background: '#f97316', marginTop: '-20px' }}></div>

          {/* Step 2 (Active) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ea580c',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(234, 88, 12, 0.2)'
            }}>
              2
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Review Journey</span>
          </div>

          <div style={{ width: '80px', height: '2px', background: '#cbd5e1', marginTop: '-20px' }}></div>

          {/* Step 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#e2e8f0',
              color: '#64748b',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Payment</span>
          </div>
        </div>

        {/* Main Content Grid: Left Journey & Passenger Details, Right Fare Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', alignItems: 'start' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Train & Journey Card (Matching IRCTC Review Booking Top Box) */}
            <div style={{
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              padding: '16px 20px',
              position: 'relative'
            }}>
              {/* Left yellow corner badge mark */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderTop: '16px solid #eab308',
                borderRight: '16px solid transparent'
              }}></div>

              {/* Header: Train Name & Train Number & Location Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                  {trainName.toUpperCase()} ({trainNumber})
                </h2>
                <i className="fa-solid fa-location-dot" style={{ fontSize: '16px', color: '#0f172a' }}></i>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                  <span>— 29:05 —</span>
                </div>

                {/* Arrival */}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {arrTime} | {destination.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginTop: '2px' }}>
                    Thu, 20 Aug
                  </div>
                </div>

                {/* Availability Badge */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#15803d',
                  background: '#f0fdf4',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #bbf7d0'
                }}>
                  AVAILABLE-0301
                </div>
              </div>

              {/* Metadata Sub-Bar */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '8px 14px',
                fontSize: '12.5px',
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
                <span>Sleeper ({classCode})</span>
                <span>|</span>
                <span>General</span>
                <span>|</span>
                <span>Boarding at {boardingStation}</span>
                <span>|</span>
                <span>Boarding Date: 19 Aug 2026 {depTime}</span>
              </div>

              {/* NTES note */}
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                Please check <span style={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>NTES website</span> or{' '}
                <span style={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>NTES app</span> for actual time before boarding
              </div>
            </div>

            {/* Passenger Details Card (Matching IRCTC Review Passenger Box) */}
            <div style={{
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              padding: '16px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Passenger Details</h3>
                <i className="fa-solid fa-chevron-up" style={{ color: '#64748b', fontSize: '13px' }}></i>
              </div>

              {/* Passenger List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                {passengers.map((pax: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#0f172a' }}>
                    <span style={{ fontWeight: 800, minWidth: '18px' }}>{idx + 1}</span>
                    <span style={{ fontWeight: 800 }}>{pax.name || 'Passenger'}</span>
                    <span style={{ color: '#475569', fontSize: '13px' }}>
                      {pax.age || '25'} yrs | {pax.gender || 'Male'} | {pax.cateringOption ? pax.cateringOption.replace(' Food', '') : 'Veg'} | {pax.nationality || 'India'} | {pax.berthPreference || 'Upper'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ticket Sent Notification */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '13px',
                color: '#334155',
                fontWeight: 600
              }}>
                Your ticket will be sent to <strong>{maskEmail(email)}</strong> / <strong>{maskPhone(phone)}</strong>
              </div>
            </div>

            {/* Navigation Buttons: Back and Proceed to Payment */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '8px 24px',
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
                onClick={() => router.push('/home/ride/train/passenger-details/payment')}
                style={{
                  background: '#f97316',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(249, 115, 22, 0.35)'
                }}
              >
                Proceed to Payment
              </button>
            </div>

          </div>

          {/* Right Column: Fare Summary Card & Promo Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Fare Summary Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden'
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

              {/* Total Fare Bar */}
              <div style={{
                background: '#1e3a8a',
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

            {/* Promo / App Graphic Box (matching bottom right graphic in Image 4) */}
            <div style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              borderRadius: '8px',
              border: '1px solid #93c5fd',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>IRCTC</span>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>CONFIRM</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', marginBottom: '8px' }}>
                Instant Booking Confirmation
              </div>
              <div style={{ fontSize: '11px', color: '#0284c7', lineHeight: '1.4' }}>
                Safe, verified railway booking with official IRCTC integration
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
