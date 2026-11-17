'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import { FlightBoardingPassModal, FlightBoardingPassData } from '@/components/FlightBoardingPassModal';

export default function FlightPaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('irctc_ipay');
  const [selectedSubOption, setSelectedSubOption] = useState('irctc_ipay_new');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  // UPI payment gateway modal state
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'paytm' | 'gpay' | 'phonepe' | 'supermoney'>('paytm');
  const [isQrBlurred, setIsQrBlurred] = useState(true);
  const [upiTimer, setUpiTimer] = useState(416); // 06 min : 56 sec
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');

  useEffect(() => {
    let interval: any;
    if (showUpiModal && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showUpiModal, upiTimer]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_flight_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookingData(parsed);
        } catch (e) {
          console.error('Failed to parse flight booking', e);
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
  const totalFare = Number(bookingData?.totalFare || bookingData?.fare || 6350).toFixed(2);

  const passenger = bookingData?.passenger || {
    title: 'Mr',
    fullName: 'Passenger',
    age: '28',
    gender: 'Male',
    seatPreference: 'Window Seat',
    mealChoice: 'Vegetarian Meal'
  };

  const contact = bookingData?.contact || {
    phone: bookingData?.phone || '+91 9876543210',
    email: bookingData?.email || 'name2000@example.com'
  };

  const paymentMethods = [
    {
      id: 'irctc_ipay',
      label: 'UPI / QR & Instant Pay',
      icon: 'fa-solid fa-qrcode',
      hasOrangeAccent: true
    },
    {
      id: 'multiple_payment',
      label: 'Multiple Payment Service',
      icon: 'fa-solid fa-handshake'
    },
    {
      id: 'netbanking',
      label: 'Netbanking',
      icon: 'fa-solid fa-building-columns'
    },
    {
      id: 'payment_gateway',
      label: 'Credit / Debit Card',
      icon: 'fa-regular fa-credit-card'
    },
    {
      id: 'wallets',
      label: 'Wallets',
      icon: 'fa-solid fa-wallet'
    }
  ];

  const handlePayAndBook = async () => {
    if (selectedMethod === 'irctc_ipay') {
      setShowUpiModal(true);
      return;
    }
    await processPaymentAndBooking();
  };

  const processPaymentAndBooking = async () => {
    setIsProcessing(true);
    const chosenProvider = selectedMethod === 'multiple_payment'
      ? `${selectedBank === 'SBI' ? 'State Bank of India' : selectedBank + ' Bank'} Gateway`
      : (selectedSubOption || selectedMethod || 'UPI');
    const totalAmount = parseFloat(totalFare);

    try {
      const generatedPnr = `UK${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedTxnId = `TXN${Date.now()}`;
      const passengerName = `${passenger.title} ${passenger.fullName || 'Passenger'}`;

      const confirmedRecord = {
        id: `flight-${Date.now()}`,
        title: `${airline} (${flightNo})`,
        type: 'Flight',
        airline,
        flightNo,
        pnr: generatedPnr,
        bookingId: `FLT${Math.floor(100000 + Math.random() * 900000)}`,
        txnId: generatedTxnId,
        source: `${source} (${sourceAirport})`,
        destination: `${destination} (${destinationAirport})`,
        sourceTime: depTime,
        destinationTime: arrTime,
        dateOfJourney,
        passengerName,
        passengerAge: passenger.age,
        passengerGender: passenger.gender,
        seatPreference: passenger.seatPreference,
        mealChoice: passenger.mealChoice,
        assignedSeat: `14C (${passenger.seatPreference})`,
        phone: contact.phone,
        email: contact.email,
        price: totalAmount,
        cost: totalAmount,
        paymentMethod: chosenProvider,
        terminal: 'Terminal 1',
        gate: 'Gate 4',
        status: 'CONFIRMED',
        statusBadge: 'CNF',
        statusText: 'Flight E-Ticket Confirmed',
        isActive: true,
        isCancelled: false,
        bookingDate: `${dateOfJourney} | 06:30 PM`
      };

      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('sart_global_bookings') || '[]');
        existing.unshift(confirmedRecord);
        localStorage.setItem('sart_global_bookings', JSON.stringify(existing));
        localStorage.removeItem('sart_pending_flight_booking');
      }

      setConfirmedBookingData(confirmedRecord);
      setPaymentSuccess(true);
    } catch (e) {
      console.error('Error confirming flight booking', e);
      alert('Payment authorization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 90, background: '#ffffff', width: '100%' }}>
        <Navbar />
        <SubNavbar />
      </div>

      <main style={{
        flex: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '24px',
        paddingBottom: '32px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Stepper Header (1 Passenger Details -> 2 Review Journey -> 3 Payment Active) */}
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

          {/* Step 2 */}
          <div
            onClick={() => router.push('/home/ride/flight/PassengerDetails/reviewBooking')}
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
              Review Journey
            </span>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#391E84', marginTop: '-20px', marginInline: '8px' }}></div>

          {/* Step 3 (Active) */}
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
              3
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
              Payment
            </span>
          </div>
        </div>

        {/* Header Row */}
        <div style={{ maxWidth: '1020px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Flight Payment Options
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontSize: '13px', fontWeight: 700 }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '15px' }}></i>
            <span>Safe & Secure Payments</span>
          </div>
        </div>

        {/* Success Modal */}
        {paymentSuccess && confirmedBookingData && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px 36px',
              maxWidth: '440px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 12px 0' }}>
                Booking Confirmed!
              </h2>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#334155'
              }}>
                PNR Number: <strong style={{ color: '#0284c7', fontSize: '18px', fontWeight: 900 }}>{confirmedBookingData.pnr}</strong>
              </div>

              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.5', margin: '0 0 24px 0' }}>
                Your flight ticket for <strong>{airline} ({flightNo})</strong> has been successfully booked and recorded in the database.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowBoardingPass(true)}
                  style={{
                    flex: 1,
                    background: '#000080',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0, 0, 128, 0.25)'
                  }}
                >
                  <i className="fa-solid fa-ticket" style={{ marginRight: '6px' }}></i> View Ticket
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/booking')}
                  style={{
                    flex: 1,
                    background: '#391E84',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  My Bookings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Boarding Pass Ticket View Modal */}
        {showBoardingPass && confirmedBookingData && (
          <FlightBoardingPassModal
            data={{
              airline: confirmedBookingData.airline || airline,
              flightNo: confirmedBookingData.flightNo || flightNo,
              sourceCity: source,
              sourceAirport: sourceAirport,
              destinationCity: destination,
              destinationAirport: destinationAirport,
              passengerName: passenger.fullName,
              passengerTitle: passenger.title,
              seatCode: bookingData?.assignedSeats
                ? Object.values(bookingData.assignedSeats)[0] as string
                : passenger.seatPreference?.match(/[0-9]+[A-F]/)?.[0] || '4E',
              gate: confirmedBookingData.gate?.replace(/\D/g, '') || '06',
              boardingZone: 'Zone 3',
              boardingTime: '1820 Hrs',
              departureTime: `${depTime} hrs`,
              departureDate: dateOfJourney,
              pnr: confirmedBookingData.pnr,
              sequenceNo: '0004',
              services: passenger.mealChoice ? 'MEAL' : 'NIL'
            }}
            onClose={() => setShowBoardingPass(false)}
          />
        )}

        {/* UPI QR Modal */}
        {showUpiModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '16px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '8px',
              maxWidth: '430px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <button
                  type="button"
                  onClick={() => setShowUpiModal(false)}
                  style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#002970' }}>
                    pay<span style={{ color: '#00baf2' }}>tm</span>
                  </span>
                  <span style={{ background: '#00baf2', color: '#fff', fontWeight: 900, fontSize: '11px', padding: '2px 6px', borderRadius: '12px' }}>
                    PG
                  </span>
                </div>
                <div style={{ width: '24px' }}></div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>WEB UPI</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7' }}>{airline}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Select option to pay</span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>₹{totalFare}</span>
                </div>

                {/* UPI App Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { id: 'gpay', name: 'GPay', img: '/images/payments/gpay.png', color: '#ea4335' },
                    { id: 'phonepe', name: 'PhonePe', img: '/images/payments/phonepe.png', color: '#5f259f' },
                    { id: 'paytm', name: 'Paytm', img: '/images/payments/paytm.png', color: '#00baf2' },
                    { id: 'supermoney', name: 'SuperMoney', img: '/images/payments/supermoney.png', color: '#f59e0b' }
                  ].map((app) => {
                    const isSelected = selectedUpiApp === app.id;
                    return (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedUpiApp(app.id as any);
                          setIsQrBlurred(false);
                        }}
                        style={{
                          border: isSelected ? `2px solid ${app.color}` : '1px solid #e2e8f0',
                          background: isSelected ? '#f8fafc' : '#ffffff',
                          borderRadius: '8px',
                          padding: '8px 4px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <img src={app.img} alt={app.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 600, color: '#0f172a' }}>{app.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Scan & Pay Button */}
                <button
                  type="button"
                  onClick={async () => {
                    setShowUpiModal(false);
                    await processPaymentAndBooking();
                  }}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    background: '#00baf2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 900,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fa-solid fa-qrcode"></i>
                  {isProcessing ? 'Verifying...' : `Scan & Pay ₹${totalFare}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid: Left Payment Box, Right Summary */}
        <div style={{ maxWidth: '1020px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 580px) 340px', gap: '24px', alignItems: 'start', justifyContent: 'center' }}>
          {/* Left Column: Payment Methods Box */}
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              maxWidth: '580px',
              minHeight: '340px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              {/* Left Sub-Column */}
              <div style={{ borderRight: '1px solid #e2e8f0', background: '#ffffff' }}>
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{
                        padding: '12px 14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#e2e8f0' : '#ffffff',
                        borderLeft: isSelected ? '4px solid #ea580c' : '4px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <i className={method.icon} style={{ fontSize: '14px', color: '#475569', minWidth: '16px' }}></i>
                      <div style={{ fontSize: '13px', fontWeight: isSelected ? 800 : 600, color: '#0f172a' }}>
                        {method.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Sub-Column */}
              <div style={{ padding: '20px', background: '#ffffff' }}>
                {/* 1. UPI Apps */}
                {selectedMethod === 'irctc_ipay' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div
                      onClick={() => setShowUpiModal(true)}
                      style={{
                        border: '1.5px solid #391E84',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        background: '#f5f3ff'
                      }}
                    >
                      <i className="fa-solid fa-qrcode" style={{ fontSize: '18px', color: '#391E84' }}></i>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Instant UPI / QR</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Scan with GPay, PhonePe, Paytm</div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#391E84', background: '#ede9fe', padding: '3px 8px', borderRadius: '4px' }}>
                        Pay via UPI
                      </span>
                    </div>

                    {/* 4 UPI Apps row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '6px',
                      padding: '4px 0'
                    }}>
                      {[
                        { id: 'gpay', name: 'Google Pay', shortName: 'GPay', img: '/images/payments/gpay.png' },
                        { id: 'phonepe', name: 'PhonePe', shortName: 'PhonePe', img: '/images/payments/phonepe.png' },
                        { id: 'paytm', name: 'Paytm', shortName: 'Paytm', img: '/images/payments/paytm.png' },
                        { id: 'supermoney', name: 'SuperMoney', shortName: 'super.money', img: '/images/payments/supermoney.png' }
                      ].map((app) => (
                        <div
                          key={app.id}
                          onClick={() => {
                            setSelectedUpiApp(app.id as any);
                            setShowUpiModal(true);
                          }}
                          style={{
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            borderRadius: '6px',
                            padding: '8px 2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <img src={app.img} alt={app.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#1e293b' }}>{app.shortName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Multiple Payment Service (Banks in a row: HDFC, Axis, SBI) */}
                {selectedMethod === 'multiple_payment' && (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                      Select Bank Gateway
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                      {[
                        { id: 'HDFC', name: 'HDFC Bank', img: '/images/payments/hdfc.png' },
                        { id: 'AXIS', name: 'Axis Bank', img: '/images/payments/axis.png' },
                        { id: 'SBI', name: 'State Bank of India', shortName: 'SBI', img: '/images/payments/sbi.png' }
                      ].map((bank) => {
                        const isChosen = selectedBank === bank.id;
                        return (
                          <div
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            style={{
                              border: isChosen ? '2px solid #391E84' : '1px solid #cbd5e1',
                              background: isChosen ? '#f5f3ff' : '#ffffff',
                              borderRadius: '8px',
                              padding: '12px 6px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            <img src={bank.img} alt={bank.name} style={{ maxHeight: '36px', maxWidth: '80px', objectFit: 'contain' }} />
                            <span style={{ fontSize: '11px', fontWeight: isChosen ? 800 : 700, color: isChosen ? '#391E84' : '#1e293b' }}>
                              {bank.shortName || bank.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '8px 36px',
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
                onClick={handlePayAndBook}
                disabled={isProcessing}
                style={{
                  background: '#391E84',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 48px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#ffffff',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? 'Processing...' : 'Pay & Confirm Flight Ticket'}
              </button>
            </div>
          </div>

          {/* Right Column: Fare Summary */}
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Journey & Fare Summary
            </h3>
            <div style={{ fontSize: '12.5px', color: '#475569', marginBottom: '12px' }}>
              <div><strong>{airline} ({flightNo})</strong></div>
              <div>{sourceAirport} → {destinationAirport} • {dateOfJourney}</div>
              <div>Passenger: <strong>{passenger.title} {passenger.fullName}</strong></div>
            </div>
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Total Amount:</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#391E84' }}>₹{totalFare}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
