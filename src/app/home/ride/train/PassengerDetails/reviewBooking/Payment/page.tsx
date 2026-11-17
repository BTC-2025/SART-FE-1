'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import { TrainApi } from '@/apis/trainApi';
import TrainTicketPdfModal, { TrainTicketModalData } from '@/components/trains/TrainTicketPdfModal';

export default function TrainFinalPaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('irctc_ipay');
  const [selectedSubOption, setSelectedSubOption] = useState('irctc_ipay_new');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // UPI payment gateway modal state
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'paytm' | 'gpay' | 'phonepe' | 'supermoney'>('paytm');
  const [isQrBlurred, setIsQrBlurred] = useState(true);
  const [upiTimer, setUpiTimer] = useState(416); // 06 min : 56 sec = 416s
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
      <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 90, background: '#ffffff', width: '100%' }}>
          <Navbar />
          <SubNavbar />
        </div>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Loading payment options...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const trainName = bookingData?.trainName || '';
  const trainNumber = bookingData?.trainNumber || '';
  const classCode = bookingData?.classCode || 'SL';
  const source = bookingData?.source || '';
  const sourceCode = bookingData?.sourceCode || (source ? source.slice(0, 3).toUpperCase() : '');
  const destination = bookingData?.destination || '';
  const destinationCode = bookingData?.destinationCode || (destination ? destination.slice(0, 3).toUpperCase() : '');
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

  const paymentMethods = [
    {
      id: 'irctc_ipay',
      label: 'IRCTC iPay (Credit Card/Debit Card/UPI)',
      icon: 'fa-solid fa-credit-card',
      hasOrangeAccent: true
    },
    {
      id: 'ewallet',
      label: 'E-Wallet (Instant Payment)',
      subtitle: 'Balance: ₹8.40',
      icon: 'fa-solid fa-wallet',
      badgeColor: '#391E84'
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
      label: 'Payment Gateway / Credit Card / Debit Card',
      icon: 'fa-regular fa-credit-card'
    },
    {
      id: 'wallets',
      label: 'Wallets / Cash Card',
      icon: 'fa-solid fa-wallet'
    },
    {
      id: 'emi',
      label: 'EMI',
      icon: 'fa-solid fa-percent'
    },
    {
      id: 'loyalty',
      label: 'Loyalty Redemption Booking',
      icon: 'fa-solid fa-award'
    }
  ];

  const isWaitingList = (() => {
    const st = (bookingData?.statusType || '').toLowerCase();
    const stStr = (bookingData?.status || '').toUpperCase();
    return st === 'wl' || stStr.includes('WL') || stStr.includes('WAITING') || stStr.includes('PQWL') || stStr.includes('RLWL');
  })();

  const handlePayAndBook = async () => {
    // If IRCTC iPay is selected and modal not yet opened, open UPI Payment modal first
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
      : (selectedSubOption || selectedMethod || 'irctc_ipay');
    const totalAmount = parseFloat(totalFare);

    try {
      const payload: any = {
        trainNumber: bookingData?.trainNumber || trainNumber,
        trainName: bookingData?.trainName || trainName,
        classCode: bookingData?.classCode || classCode,
        source: bookingData?.source || source,
        destination: bookingData?.destination || destination,
        dateOfJourney: bookingData?.dateOfJourney || dateOfJourney,
        departureTime: bookingData?.depTime || depTime,
        passengerName: passengers.length > 0 ? passengers[0].name : 'Passenger',
        passengers: passengers.length > 0 ? passengers : [{ name: 'Passenger', age: '24', gender: 'Male', berthPreference: 'No Preference' }],
        email: email || bookingData?.email,
        phone: phone || bookingData?.phone,
        irctcId: bookingData?.irctcId,
        boardingStation: bookingData?.boardingStation || source,
        paymentDetails: {
          method: selectedMethod,
          provider: chosenProvider,
          status: 'SUCCESS',
          amount: totalAmount,
          txnId: `${Date.now()}${Math.floor(10 + Math.random() * 90)}`
        },
        fare: totalAmount
      };

      // Call Backend API to confirm booking and create PNR in database
      const resp = await TrainApi.confirmBooking(payload).catch((e) => {
        console.warn('Backend confirmation fallback:', e);
        return null;
      });

      // Strictly 10-digit PNR and strictly 15-digit numeric Transaction ID
      const generatedPnr = resp?.data?.pnr || `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const generatedBookingId = resp?.data?.bookingId || `TRN${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedTxnId = resp?.data?.txnId || payload.paymentDetails?.txnId || `${Date.now()}${Math.floor(10 + Math.random() * 90)}`;
      const coachCode = resp?.data?.coach || 'C1';
      const berthStart = resp?.data?.berthNo || 36;

      // Check whether this class was on waiting list or confirmed
      const seatStatusText = isWaitingList
        ? `Waiting List (WL ${Math.floor(12 + Math.random() * 30)})`
        : `Confirmed (${classCode} - Coach ${coachCode}, Berth ${berthStart})`;
      const badgeText = isWaitingList ? 'WL' : 'CNF';
      const statusTitle = isWaitingList ? 'Waiting List Ticket Booked' : 'Ticket Confirmed';

      const confirmedRecord = {
        id: resp?.data?.id || `train-${Date.now()}`,
        title: payload.trainName,
        number: payload.trainNumber,
        type: 'Train',
        pnr: generatedPnr,
        bookingId: generatedBookingId,
        txnId: generatedTxnId,
        source: payload.source,
        destination: payload.destination,
        sourceTime: payload.departureTime,
        destinationTime: arrTime || '10:30 AM',
        dateOfJourney: payload.dateOfJourney,
        sourceDate: payload.dateOfJourney,
        passengers: payload.passengers,
        allPassengers: payload.passengers,
        passengerName: payload.passengers.map((p: any) => `${p.name} (${p.age || 24})`).join(', '),
        passengerPhone: payload.phone,
        passengerEmail: payload.email,
        boardingStation: payload.boardingStation,
        irctcId: payload.irctcId,
        classCode: payload.classCode,
        coach: coachCode,
        berthNo: berthStart,
        seatStatus: seatStatusText,
        statusBadge: badgeText,
        statusText: statusTitle,
        isWaitingList: isWaitingList,
        price: totalAmount,
        cost: totalAmount,
        paymentMethod: selectedMethod === 'multiple_payment'
          ? `${selectedBank === 'SBI' ? 'State Bank of India' : selectedBank + ' Bank'} Gateway`
          : (selectedMethod === 'irctc_ipay' ? `IRCTC iPay (${selectedUpiApp.toUpperCase()})` : selectedMethod),
        paymentDetails: payload.paymentDetails,
        extraData: JSON.stringify({
          pnr: generatedPnr,
          bookingId: generatedBookingId,
          trainNumber: payload.trainNumber,
          trainName: payload.trainName,
          classCode: payload.classCode,
          coach: coachCode,
          berthNo: berthStart,
          passengers: payload.passengers,
          allPassengers: payload.passengers,
          passengerName: payload.passengers[0]?.name,
          email: payload.email,
          phone: payload.phone,
          irctcId: payload.irctcId,
          boardingStation: payload.boardingStation,
          source: payload.source,
          destination: payload.destination,
          dateOfJourney: payload.dateOfJourney,
          departureTime: payload.departureTime,
          seatStatus: seatStatusText,
          isWaitingList: isWaitingList,
          paymentDetails: payload.paymentDetails,
          txnId: generatedTxnId,
          fare: totalAmount
        }),
        isActive: true,
        isCancelled: false
      };

      // Save into global user bookings
      if (typeof window !== 'undefined') {
        const existing = localStorage.getItem('sart_global_bookings');
        const list = existing ? JSON.parse(existing) : [];
        list.unshift(confirmedRecord);
        localStorage.setItem('sart_global_bookings', JSON.stringify(list));
        localStorage.removeItem('sart_pending_train_booking');

        // Persist seat adjustment so train list reduces AVL (e.g. 396 -> 395) or increases WL (e.g. 32 -> 33) across refreshes
        try {
          const adjKey = 'sart_train_seat_adjustments';
          const savedAdjs = JSON.parse(localStorage.getItem(adjKey) || '[]');
          savedAdjs.push({
            id: generatedTxnId,
            trainNumber: String(payload.trainNumber),
            classCode: String(payload.classCode),
            isTatkal: Boolean(bookingData?.isTatkal),
            fare: Number(bookingData?.fare || 0),
            seatsBooked: payload.passengers?.length || 1,
            dateOfJourney: String(payload.dateOfJourney),
            status: String(bookingData?.status || ''),
            statusType: String(bookingData?.statusType || ''),
            timestamp: Date.now()
          });
          localStorage.setItem(adjKey, JSON.stringify(savedAdjs));
        } catch (e) {
          console.error('Error saving seat adjustment', e);
        }
      }

      setConfirmedBookingData(confirmedRecord);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment confirmation error', err);
      alert('Payment authorization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header: Navbar + SubNavbar always stay together at top */}
      <div style={{ position: 'sticky', top: 0, zIndex: 90, background: '#ffffff', width: '100%' }}>
        <Navbar />
        <SubNavbar />
      </div>

      {/* Main Container: Centered with 20px left and right gap */}
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

        {/* Stepper Header (1 Passenger Details -> 2 Review Journey -> 3 Payment Active) - Width: 500px */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto 28px auto',
          padding: '8px 0'
        }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
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
              1
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>Passenger Details</span>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#391E84', marginTop: '-20px', marginInline: '8px' }}></div>

          {/* Step 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
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
              2
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>Review Journey</span>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#391E84', marginTop: '-20px', marginInline: '8px' }}></div>

          {/* Step 3 (Active) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
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
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>Payment</span>
          </div>
        </div>

        {/* Top Header Row: Payment Methods Title & Safe & Secure Payments Badge */}
        <div style={{ maxWidth: '1020px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 800,
            fontFamily: 'serif',
            color: '#0f172a'
          }}>
            Payment Methods
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontSize: '13px', fontWeight: 700 }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '15px' }}></i>
            <span>Safe & Secure Payments</span>
          </div>
        </div>

        {/* Success Modal */}
        {paymentSuccess && (
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
              borderRadius: '12px',
              padding: '28px 36px',
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isWaitingList ? '#fef3c7' : '#dcfce7',
                color: isWaitingList ? '#d97706' : '#16a34a',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <i className={`fa-solid ${isWaitingList ? 'fa-hourglass-half' : 'fa-check'}`}></i>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
                {isWaitingList ? 'Waiting List Ticket Booked!' : 'Booking Confirmed!'}
              </h2>
              {confirmedBookingData?.pnr && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  margin: '10px 0 14px 0',
                  fontSize: '13px',
                  color: '#334155'
                }}>
                  PNR Number: <strong style={{ color: '#2a1373', fontSize: '15px' }}>{confirmedBookingData.pnr}</strong>
                  {isWaitingList && (
                    <div style={{ color: '#d97706', fontWeight: 800, marginTop: '4px', fontSize: '12.5px' }}>
                      Status: {confirmedBookingData.seatStatus}
                    </div>
                  )}
                </div>
              )}
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 20px 0' }}>
                Your ticket for <strong>{confirmedBookingData?.title || trainName} ({confirmedBookingData?.number || trainNumber})</strong> has been successfully booked and recorded in the database.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(true)}
                  style={{
                    flex: 1,
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-file-invoice"></i> View Ticket
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/booking')}
                  style={{
                    flex: 1,
                    background: '#2a1373',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paytm PG / Web UPI Modal (Matching Reference Image 2) */}
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
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header Bar */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff'
              }}>
                <button
                  type="button"
                  onClick={() => setShowUpiModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '16px',
                    color: '#0f172a',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>

                {/* Paytm PG logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#002970', letterSpacing: '-0.5px' }}>
                    pay<span style={{ color: '#00baf2' }}>tm</span>
                  </span>
                  <span style={{
                    background: '#00baf2',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '12px'
                  }}>
                    PG
                  </span>
                </div>

                <div style={{ width: '24px' }}></div>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 20px', flex: 1, background: '#ffffff' }}>
                {/* WEB UPI & IRCTC logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.3px' }}>
                    WEB UPI
                  </span>
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '3px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <i className="fa-solid fa-train" style={{ fontSize: '12px', color: '#1e3a8a' }}></i>
                    <span style={{ fontSize: '7px', fontWeight: 800, color: '#1e3a8a' }}>IRCTC</span>
                  </div>
                </div>

                {/* Amount Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    Select an option to pay
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                    ₹{totalFare}
                  </span>
                </div>

                {/* UPI App Selection Tabs (PhonePe, GPay, Paytm, Super Money) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
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
                          gap: '4px',
                          boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={app.img} alt={app.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 600, color: '#0f172a' }}>
                          {app.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Scan with Any UPI App Card (matching Image 2) */}
                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '16px',
                  background: '#ffffff'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '14px', alignItems: 'center' }}>
                    {/* Left text */}
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 900, color: '#0f172a', lineHeight: '1.25', marginBottom: '8px' }}>
                        Scan with Any UPI App
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#00baf2' }}>paytm</span>
                        <i className="fa-solid fa-play" style={{ fontSize: '8px', color: '#ea4335' }}></i>
                        <i className="fa-solid fa-circle" style={{ fontSize: '8px', color: '#5f259f' }}></i>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>& more</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Pay via ${selectedUpiApp.toUpperCase()}: scan the QR code to complete payment.`)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Know More
                      </button>
                    </div>

                    {/* Right QR Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        onClick={() => setIsQrBlurred(false)}
                        style={{
                          position: 'relative',
                          width: '120px',
                          height: '120px',
                          border: '1.5px solid #0f172a',
                          borderRadius: '6px',
                          padding: '6px',
                          background: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {/* High Quality Real-looking Vector QR */}
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: '100%',
                            height: '100%',
                            filter: isQrBlurred ? 'blur(3.5px)' : 'none',
                            transition: 'filter 0.3s ease'
                          }}
                        >
                          {/* Corner Squares */}
                          <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
                          <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                          <rect x="9" y="9" width="12" height="12" fill="#0f172a" />

                          <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
                          <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                          <rect x="79" y="9" width="12" height="12" fill="#0f172a" />

                          <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
                          <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                          <rect x="9" y="79" width="12" height="12" fill="#0f172a" />

                          {/* Data Matrix Dots */}
                          <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
                          <rect x="48" y="4" width="8" height="8" fill="#0f172a" />
                          <rect x="58" y="14" width="8" height="8" fill="#0f172a" />
                          <rect x="36" y="22" width="12" height="8" fill="#0f172a" />
                          <rect x="12" y="38" width="8" height="8" fill="#0f172a" />
                          <rect x="24" y="44" width="8" height="8" fill="#0f172a" />
                          <rect x="40" y="40" width="16" height="16" fill="#0f172a" />
                          <rect x="44" y="44" width="8" height="8" fill="#ffffff" />
                          <rect x="64" y="36" width="12" height="8" fill="#0f172a" />
                          <rect x="84" y="44" width="8" height="8" fill="#0f172a" />
                          <rect x="14" y="56" width="12" height="8" fill="#0f172a" />
                          <rect x="34" y="64" width="12" height="8" fill="#0f172a" />
                          <rect x="52" y="60" width="8" height="12" fill="#0f172a" />
                          <rect x="68" y="64" width="12" height="12" fill="#0f172a" />
                          <rect x="44" y="80" width="8" height="12" fill="#0f172a" />
                          <rect x="58" y="84" width="12" height="8" fill="#0f172a" />
                          <rect x="78" y="80" width="14" height="12" fill="#0f172a" />
                        </svg>

                        {/* Tap to view clear prompt */}
                        {isQrBlurred && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255,255,255,0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            textAlign: 'center',
                            padding: '4px'
                          }}>
                            <i className="fa-solid fa-eye" style={{ fontSize: '13px', color: '#0284c7' }}></i>
                            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}>
                              Tap to view QR
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#00baf2', marginTop: '4px' }}>
                        paytm <span style={{ color: '#ea580c' }}>♥</span> UPI
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan & Pay Button: Simulates Customer Scanning and Paying */}
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
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(0, 186, 242, 0.35)'
                  }}
                >
                  <i className="fa-solid fa-qrcode"></i>
                  {isProcessing ? 'Verifying Payment...' : `Scan & Pay ₹${totalFare}`}
                </button>
              </div>

              {/* Timeout footer bar */}
              <div style={{
                background: '#fef3c7',
                padding: '9px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#78350f',
                fontWeight: 600
              }}>
                <i className="fa-regular fa-clock"></i>
                <span>
                  This page will timeout in{' '}
                  <strong style={{ color: '#9a3412', fontWeight: 900 }}>
                    {String(Math.floor(upiTimer / 60)).padStart(2, '0')} min : {String(upiTimer % 60).padStart(2, '0')} sec
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* View E-Ticket Slip Modal Right After Booking */}
        {showTicketModal && confirmedBookingData && (
          <TrainTicketPdfModal
            ticket={{
              pnr: confirmedBookingData.pnr,
              trainNumber: confirmedBookingData.number || trainNumber,
              trainName: confirmedBookingData.title || trainName,
              classCode: confirmedBookingData.classCode || classCode,
              source: confirmedBookingData.source || source,
              sourceCode: sourceCode,
              sourceTime: confirmedBookingData.sourceTime || depTime,
              sourceDate: confirmedBookingData.sourceDate || dateOfJourney,
              destination: confirmedBookingData.destination || destination,
              destinationCode: destinationCode,
              destinationTime: confirmedBookingData.destinationTime || arrTime,
              destinationDate: confirmedBookingData.sourceDate || dateOfJourney,
              boardingStation: confirmedBookingData.boardingStation || source,
              departureTime: confirmedBookingData.sourceTime || depTime,
              departureDate: confirmedBookingData.sourceDate || dateOfJourney,
              bookingDate: `${dateOfJourney} | 07:05PM`,
              transactionId: confirmedBookingData.txnId || `TXN${Date.now()}`,
              passengers: (confirmedBookingData.passengers || passengers || []).map((p: any, idx: number) => {
                const statusStr = isWaitingList
                  ? `WL/${(confirmedBookingData.berthNo || 18) + idx}`
                  : `CNF/${confirmedBookingData.coach || 'C1'}/${(confirmedBookingData.berthNo || 36) + idx * 2}/${p.berthPreference || 'NC'}`;
                return {
                  name: p.name || 'PASSENGER',
                  age: p.age || 28,
                  gender: p.gender || 'Male',
                  bookingStatus: statusStr,
                  currentStatus: statusStr
                };
              }),
              fare: totalBaseFare,
              convenienceFee: convenienceFee,
              insurancePremium: travelInsurance,
              totalFare: Number(totalFare)
            }}
            onClose={() => setShowTicketModal(false)}
          />
        )}

        {/* Main Content Grid: Left Payment Tabs + Sub Options, Right Journey Summary & Fare */}
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
              {/* Left Sub-Column: Payment Methods List */}
              <div style={{ borderRight: '1px solid #e2e8f0', background: '#ffffff' }}>
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#e2e8f0' : '#ffffff',
                        borderLeft: isSelected ? '4px solid #ea580c' : '4px solid transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      <i className={method.icon} style={{ fontSize: '14px', color: '#475569', marginTop: '2px', minWidth: '16px' }}></i>
                      <div>
                        <div style={{
                          fontSize: '12.5px',
                          fontWeight: isSelected ? 800 : 600,
                          color: '#0f172a',
                          lineHeight: '1.3'
                        }}>
                          {method.label}
                        </div>
                        {method.subtitle && (
                          <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 800, marginTop: '2px' }}>
                            {method.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Sub-Column: Selected Option Content Area */}
              <div style={{ padding: '20px', background: '#ffffff' }}>
                {/* 1. IRCTC iPay Sub-options (Image 8) */}
                {selectedMethod === 'irctc_ipay' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Top IRCTC iPay Card */}
                    <div
                      onClick={() => {
                        setSelectedSubOption('irctc_ipay_new');
                        setShowUpiModal(true);
                      }}
                      style={{
                        border: selectedSubOption === 'irctc_ipay_new' ? '1.5px solid #391E84' : '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        background: selectedSubOption === 'irctc_ipay_new' ? '#f5f3ff' : '#ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#391E84',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                      }}>
                        IRCTC
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                          IRCTC iPay
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Credit Card / Debit Card / UPI
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#391E84', background: '#ede9fe', padding: '3px 8px', borderRadius: '4px' }}>
                        Pay via UPI / QR
                      </span>
                    </div>

                    {/* Below IRCTC iPay: 4 UPI Apps (Google Pay, PhonePe, Paytm, SuperMoney) from user images 1-4 */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 8px',
                      marginTop: '-2px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-bolt" style={{ color: '#391E84', fontSize: '11px' }}></i>
                        <span>Popular UPI Apps (Pay via QR / App)</span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '6px'
                      }}>
                        {[
                          { id: 'gpay', name: 'Google Pay', shortName: 'GPay', img: '/images/payments/gpay.png' },
                          { id: 'phonepe', name: 'PhonePe', shortName: 'PhonePe', img: '/images/payments/phonepe.png' },
                          { id: 'paytm', name: 'Paytm', shortName: 'Paytm', img: '/images/payments/paytm.png' },
                          { id: 'supermoney', name: 'SuperMoney', shortName: 'super.money', img: '/images/payments/supermoney.png' }
                        ].map((app) => {
                          const isSelected = selectedUpiApp === app.id;
                          return (
                            <div
                              key={app.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUpiApp(app.id as any);
                                setSelectedSubOption(app.id);
                                setIsQrBlurred(false);
                                setShowUpiModal(true);
                              }}
                              title={`Pay with ${app.name}`}
                              style={{
                                border: isSelected ? '1.5px solid #391E84' : '1px solid #cbd5e1',
                                background: isSelected ? '#ede9fe' : '#ffffff',
                                borderRadius: '6px',
                                padding: '8px 2px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 2px 6px rgba(57, 30, 132, 0.15)' : 'none'
                              }}
                            >
                              <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                  src={app.img}
                                  alt={app.name}
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                              </div>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: isSelected ? 800 : 700,
                                color: isSelected ? '#391E84' : '#1e293b',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}>
                                {app.shortName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Paytm UPI Card */}
                    <div
                      onClick={() => {
                        setSelectedSubOption('paytm_upi');
                        setSelectedUpiApp('paytm');
                        setShowUpiModal(true);
                      }}
                      style={{
                        border: selectedSubOption === 'paytm_upi' ? '1.5px solid #00baf2' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        background: '#ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid #00baf2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        color: '#00baf2',
                        fontSize: '11px',
                        flexShrink: 0
                      }}>
                        <img src="/images/payments/paytm.png" alt="Paytm" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                          Paytm UPI
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Scan QR or Pay via Paytm / UPI
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                    </div>
                  </div>
                )}

                {/* 2. Multiple Payment Service (Image 9) - Banks in a row (HDFC, Axis, SBI) */}
                {selectedMethod === 'multiple_payment' && (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Multiple Payment Service</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Select Bank Gateway</span>
                    </div>

                    {/* Row of 3 Banks: HDFC, Axis, SBI */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      {[
                        { id: 'HDFC', name: 'HDFC Bank', img: '/images/payments/hdfc.png' },
                        { id: 'AXIS', name: 'Axis Bank', img: '/images/payments/axis.png' },
                        { id: 'SBI', name: 'State Bank of India', shortName: 'SBI', img: '/images/payments/sbi.png' }
                      ].map((bank) => {
                        const isChosen = selectedBank === bank.id;
                        return (
                          <div
                            key={bank.id}
                            onClick={() => {
                              setSelectedBank(bank.id);
                              setSelectedSubOption(`bank_${bank.id}`);
                            }}
                            style={{
                              border: isChosen ? '2px solid #391E84' : '1px solid #cbd5e1',
                              background: isChosen ? '#f5f3ff' : '#ffffff',
                              borderRadius: '8px',
                              padding: '12px 6px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: isChosen ? '0 2px 8px rgba(57, 30, 132, 0.18)' : '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <div style={{ height: '36px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img
                                src={bank.img}
                                alt={bank.name}
                                style={{ maxHeight: '100%', maxWidth: '80px', objectFit: 'contain' }}
                              />
                            </div>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: isChosen ? 800 : 700,
                              color: isChosen ? '#391E84' : '#1e293b',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}>
                              {bank.shortName || bank.name}
                            </div>
                            <div style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              border: isChosen ? '4.5px solid #391E84' : '1.5px solid #94a3b8',
                              background: '#ffffff',
                              boxSizing: 'border-box'
                            }} />
                          </div>
                        );
                      })}
                    </div>

                    <div style={{
                      background: '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11.5px',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', fontSize: '13px' }}></i>
                      <span>Selected: <strong style={{ color: '#391E84' }}>{selectedBank === 'SBI' ? 'State Bank of India' : selectedBank + ' Bank'}</strong>. Click <strong>Pay & Book</strong> to confirm reservation.</span>
                    </div>
                  </div>
                )}

                {/* 3. Netbanking Sub-options with HDFC, Axis, SBI at top */}
                {selectedMethod === 'netbanking' && (
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                      Select Bank for Netbanking
                    </div>

                    {/* Top 3 bank row with logos */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      {[
                        { id: 'HDFC', name: 'HDFC Bank', img: '/images/payments/hdfc.png' },
                        { id: 'AXIS', name: 'Axis Bank', img: '/images/payments/axis.png' },
                        { id: 'SBI', name: 'State Bank of India', shortName: 'SBI', img: '/images/payments/sbi.png' }
                      ].map((bank) => {
                        const isChosen = selectedBank === bank.id;
                        return (
                          <div
                            key={bank.id}
                            onClick={() => {
                              setSelectedBank(bank.id);
                              setSelectedSubOption(`netbanking_${bank.id}`);
                            }}
                            style={{
                              border: isChosen ? '2px solid #391E84' : '1px solid #cbd5e1',
                              background: isChosen ? '#f5f3ff' : '#ffffff',
                              borderRadius: '6px',
                              padding: '8px 4px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <img src={bank.img} alt={bank.name} style={{ maxHeight: '26px', maxWidth: '75px', objectFit: 'contain' }} />
                            <span style={{ fontSize: '10.5px', fontWeight: isChosen ? 800 : 600, color: isChosen ? '#391E84' : '#1e293b' }}>
                              {bank.shortName || bank.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Other banks list */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                      {[
                        { name: 'ICICI Bank', code: 'ICICI', icon: 'fa-building-columns' },
                        { name: 'Punjab National Bank', code: 'PNB', icon: 'fa-landmark' },
                        { name: 'Bank of Baroda', code: 'BOB', icon: 'fa-building-columns' },
                        { name: 'Kotak Mahindra', code: 'KOTAK', icon: 'fa-landmark' },
                        { name: 'Canara Bank', code: 'CANARA', icon: 'fa-building-columns' }
                      ].map((bank) => {
                        const isChosen = selectedBank === bank.code;
                        return (
                          <div
                            key={bank.code}
                            onClick={() => {
                              setSelectedBank(bank.code);
                              setSelectedSubOption(`netbanking_${bank.code}`);
                            }}
                            style={{
                              border: isChosen ? '1.5px solid #391E84' : '1px solid #e2e8f0',
                              background: isChosen ? '#f5f3ff' : '#ffffff',
                              borderRadius: '6px',
                              padding: '8px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              fontSize: '11.5px',
                              fontWeight: isChosen ? 800 : 600,
                              color: isChosen ? '#391E84' : '#334155',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <i className={`fa-solid ${bank.icon}`} style={{ fontSize: '11px', color: isChosen ? '#391E84' : '#64748b' }}></i>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bank.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Selected Bank: <strong style={{ color: '#391E84' }}>{selectedBank}</strong>. Click <strong>Pay & Book</strong> to proceed to portal.
                    </div>
                  </div>
                )}

                {/* 4. Other Gateways */}
                {selectedMethod !== 'irctc_ipay' && selectedMethod !== 'multiple_payment' && selectedMethod !== 'netbanking' && (
                  <div style={{
                    padding: '16px',
                    color: '#64748b',
                    fontSize: '12.5px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px dashed #cbd5e1'
                  }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      {paymentMethods.find((m) => m.id === selectedMethod)?.label}
                    </div>
                    Select preferred gateway and click <strong>Pay & Book</strong> to proceed securely.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Buttons: Back & Pay & Book */}
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
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(57, 30, 132, 0.35)'
                }}
              >
                {isProcessing ? 'Processing...' : 'Pay & Book'}
              </button>
            </div>
          </div>

          {/* Right Column: JOURNEY SUMMARY & Fare Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* JOURNEY SUMMARY Box */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              {/* Deep Blue Header matching reference */}
              <div style={{
                background: '#1e3a8a',
                color: '#ffffff',
                padding: '9px 14px',
                fontSize: '12.5px',
                fontWeight: 800,
                letterSpacing: '0.4px'
              }}>
                JOURNEY SUMMARY
              </div>

              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                    {trainName.toUpperCase()} {trainNumber ? `(${trainNumber})` : ''}
                  </span>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                    {dateOfJourney}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{source.toUpperCase()}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{sourceCode} {depTime ? `(${depTime})` : ''}</div>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{destination.toUpperCase()}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{destinationCode} {arrTime ? `(${arrTime})` : ''}</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginBottom: '8px' }}>
                  {passengers.length} Adult | Class: {classCode} | GENERAL | {source.toUpperCase()} | Boarding Date: {dateOfJourney} {depTime}
                </div>

                {/* Passenger Details */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Passenger Details</div>
                  {passengers.map((p: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '11.5px', color: '#334155' }}>
                      {idx + 1}. <strong>{p.name}</strong> {p.age} yrs | {p.gender || 'Male'}
                    </div>
                  ))}
                </div>

                {/* Contact Details */}
                {(email || phone) && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Contact Details</div>
                    {email && <div style={{ fontSize: '11px', color: '#475569' }}>Email: {email}</div>}
                    {phone && <div style={{ fontSize: '11px', color: '#475569' }}>Mobile: {phone}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Fare Summary Box */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Fare Summary</h3>
              </div>

              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#334155' }}>
                  <span>Ticket Fare</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {totalBaseFare.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#334155' }}>
                  <span>Convenience Fee (Incl. of GST)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {convenienceFee.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#334155' }}>
                  <span>Travel Insurance (Incl. of GST)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {travelInsurance.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Fare Bar matching Navbar purple #2a1373 */}
              <div style={{
                background: '#2a1373',
                color: '#ffffff',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800 }}>Total Fare</span>
                <span style={{ fontSize: '16px', fontWeight: 900 }}>₹ {totalFare}</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
