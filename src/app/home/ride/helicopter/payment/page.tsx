'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Lock,
  Clock,
  Sparkles
} from 'lucide-react';
import HelicopterTicketModal from '@/components/helicopter/HelicopterTicketModal';

function HelicopterPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Booking parameters from query or localStorage
  const [booking, setBooking] = useState<any>({
    operator: searchParams.get('operator') || 'Pawan Hans Charters',
    heliNo: searchParams.get('heliNo') || 'PH-702',
    source: searchParams.get('source') || 'Dehradun (Sahastradhara)',
    destination: searchParams.get('destination') || 'Kedarnath (Sirsi Helipad)',
    sourceCode: searchParams.get('sourceCode') || 'DED',
    destCode: searchParams.get('destCode') || 'KDN',
    date: searchParams.get('date') || '26 Nov, 2026',
    depTime: searchParams.get('depTime') || '08:30 AM',
    arrTime: searchParams.get('arrTime') || '09:15 AM',
    model: searchParams.get('model') || 'Bell 407 (6-Seater Shuttle)',
    passengerName: searchParams.get('passengerName') || 'Mr sai kumar',
    passengerWeight: searchParams.get('weight') || '72',
    excessWeight: searchParams.get('excess') || '0',
    totalFare: Number(searchParams.get('totalFare')) || 9100
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sart_pending_heli_booking');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBooking((prev: any) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);

  // Payment states
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [upiId, setUpiId] = useState('saikumar@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [boardingPassIssued, setBoardingPassIssued] = useState(false);
  const [showOfficialTicketModal, setShowOfficialTicketModal] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setBoardingPassIssued(true);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 20px 60px 20px' }}>
        {/* Stepper Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Step 1 */}
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => router.back()}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#391E84',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#391E84' }}>
                Passenger Details
              </span>
            </div>

            <div style={{ width: '60px', height: '2px', backgroundColor: '#391E84', marginBottom: '18px' }} />

            {/* Step 2 */}
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => router.back()}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#391E84',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#391E84' }}>
                Review Journey
              </span>
            </div>

            <div style={{ width: '60px', height: '2px', backgroundColor: '#391E84', marginBottom: '18px' }} />

            {/* Step 3 Active */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#391E84',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: '0 0 0 4px rgba(57, 30, 132, 0.15)'
                }}
              >
                {isSuccess ? <CheckCircle2 size={18} /> : '3'}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#391E84' }}>
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Success / Boarding Pass State */}
        {isSuccess ? (
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Helicopter Charter Booking Confirmed!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>
              Payment of ₹{Number(booking.totalFare).toLocaleString('en-IN')}.00 received successfully. DGCA helipad security pass issued.
            </p>

            {/* Boarding Pass Preview Box */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'left',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: 700 }}>DGCA MANIFEST PNR</span>
                  <strong style={{ fontSize: '18px', color: '#391E84', letterSpacing: '1px' }}>SART-HL-9482</strong>
                </div>
                <span
                  style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 800
                  }}
                >
                  🚁 Helipad Express Clearance
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Passenger</span>
                  <strong style={{ color: '#0f172a' }}>{booking.passengerName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Operator &amp; Tail</span>
                  <strong style={{ color: '#0f172a' }}>{booking.operator} • {booking.heliNo}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Seat</span>
                  <strong style={{ color: '#0284c7' }}>Seat H-03 (Window)</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Route</span>
                  <strong style={{ color: '#0f172a' }}>{booking.sourceCode} ⇄ {booking.destCode}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Reporting Time</span>
                  <strong style={{ color: '#0f172a' }}>{booking.depTime} ({booking.date})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Certified Weight</span>
                  <strong style={{ color: '#16a34a' }}>{booking.passengerWeight} kg (Verified)</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowOfficialTicketModal(true)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#0a2540',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(10, 37, 64, 0.25)'
                }}
              >
                <span>🎫 View &amp; Download Official Boarding Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/home')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Payment Options View */
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#09090b', margin: '0 0 6px 0' }}>
                  Secure Helipad Booking Payment
                </h1>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  Select your preferred payment method. 256-bit encrypted with instant DGCA clearance.
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <ShieldCheck size={16} /> Verified Safe Gateway
              </span>
            </div>

            {/* Split Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
              {/* Left Column: Payment Method Tabs & Inputs */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
                  Payment Methods
                </h3>

                {/* Method Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: <QrCode size={18} /> },
                    { id: 'card', label: 'Credit / Debit', icon: <CreditCard size={18} /> },
                    { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={18} /> },
                    { id: 'wallet', label: 'Wallets', icon: <Wallet size={18} /> }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '12px',
                        border: selectedMethod === m.id ? '2px solid #391E84' : '1px solid #e2e8f0',
                        backgroundColor: selectedMethod === m.id ? '#f5f3ff' : '#ffffff',
                        color: selectedMethod === m.id ? '#391E84' : '#475569',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* UPI Method Details */}
                {selectedMethod === 'upi' && (
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '10px' }}>
                      Choose UPI App or Scan QR
                    </span>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      {[
                        { id: 'gpay', name: 'Google Pay' },
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'paytm', name: 'Paytm UPI' }
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id as any)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '10px',
                            border: selectedUpiApp === app.id ? '1.5px solid #391E84' : '1px solid #cbd5e1',
                            backgroundColor: selectedUpiApp === app.id ? '#f5f3ff' : '#f8fafc',
                            color: selectedUpiApp === app.id ? '#391E84' : '#334155',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {app.name}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Enter Virtual Payment Address (UPI ID)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                          backgroundColor: '#f8fafc',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Card Method Details */}
                {selectedMethod === 'card' && (
                  <div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                          backgroundColor: '#f8fafc',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            fontWeight: 600,
                            backgroundColor: '#f8fafc',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            fontWeight: 600,
                            backgroundColor: '#f8fafc',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Netbanking Method Details */}
                {selectedMethod === 'netbanking' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Select Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 600,
                        backgroundColor: '#f8fafc',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Wallets */}
                {selectedMethod === 'wallet' && (
                  <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '13px', color: '#475569' }}>
                    Available linked wallet balance: <strong>₹12,450.00</strong> (SART Travel Pay)
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Pay Button */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                  Booking Summary
                </h3>

                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{booking.operator} • {booking.heliNo}</div>
                  <div>{booking.sourceCode} ⇄ {booking.destCode}</div>
                  <div>{booking.date} | {booking.depTime}</div>
                  <div style={{ color: '#0284c7', fontWeight: 700 }}>Passenger: {booking.passengerName}</div>
                </div>

                <div
                  style={{
                    borderTop: '1.5px dashed #cbd5e1',
                    paddingTop: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Amount Payable</span>
                  <strong style={{ fontSize: '20px', fontWeight: 900, color: '#391E84' }}>
                    ₹ {Number(booking.totalFare).toLocaleString('en-IN')}.00
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#391E84',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(57, 30, 132, 0.25)',
                    opacity: isProcessing ? 0.7 : 1
                  }}
                >
                  <Lock size={15} />
                  <span>{isProcessing ? 'Processing Secure Payment...' : `Pay ₹${Number(booking.totalFare).toLocaleString('en-IN')}.00`}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11.5px', color: '#64748b', marginTop: '14px' }}>
                  <ShieldCheck size={14} color="#16a34a" />
                  <span>DGCA Compliance Verified • Instant Pass Issued</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Official Boarding Ticket Modal */}
      <HelicopterTicketModal
        isOpen={showOfficialTicketModal}
        onClose={() => setShowOfficialTicketModal(false)}
        bookingId={booking.bookingId || '1680306985'}
        bookingDateTime={booking.date ? `${booking.date} 10:32 PM` : '20-04-2024 10:32 PM'}
        reportingTime={booking.depTime ? `${booking.date} ${booking.depTime} (Mandatory 1 hr before flight)` : '17-10-2024 8:00 AM (Mandatory 1 hr before flight)'}
        passengersCount={Array.isArray(booking.passengers) ? booking.passengers.length : 1}
        sourceHelipad={booking.source || 'Phata (Pawan Hans Helipad)'}
        destHelipad={booking.destination || 'Shri Kedarnath (Kedarnath Helipad)'}
        journeyDate={booking.date || '17-10-2024'}
        flightWindow={`${booking.depTime || '09:00 AM'} - ${booking.arrTime || '12:00 PM'}`}
        operatorName={booking.operator || 'Pawan Hans Limited'}
        heliModel={booking.model || 'Bell 407'}
        passengers={Array.isArray(booking.passengers) && booking.passengers.length > 0 ? booking.passengers.map((p: any) => ({
          name: p.name || p.fullName || 'PASSENGER',
          gender: p.gender || 'Male',
          age: p.age || 30,
          idProof: p.idProof || `${p.idType || 'Aadhaar'} (Verified)`,
          status: 'CONFIRMED'
        })) : [
          {
            name: booking.passengerName || 'VIJAY KASHINATH KUMKAR',
            gender: 'Male',
            age: 53,
            idProof: 'Aadhaar (Verified)',
            status: 'CONFIRMED'
          }
        ]}
        baseFare={Number(booking.baseFare) || Number(booking.totalFare) || 5774.00}
        excessWeightCharge={Number(booking.excessCharge) || 0.00}
        irctcConvenienceFee={354.00}
        totalPaid={Number(booking.totalFare) || 6128.00}
      />

      <Footer />
    </div>
  );
}

export default function HelicopterPaymentPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading payment gateway...</div>}>
      <HelicopterPaymentContent />
    </Suspense>
  );
}
