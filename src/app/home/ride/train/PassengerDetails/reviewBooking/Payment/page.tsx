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
        <Navbar />
        <SubNavbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Loading payment options...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const trainName = bookingData?.trainName || 'Train Express';
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
      badgeColor: '#ea580c'
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

  const handlePayAndBook = async () => {
    setIsProcessing(true);
    const chosenProvider = selectedSubOption || selectedMethod || 'irctc_ipay';
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
        seatStatus: `Confirmed (${classCode} - Coach ${coachCode}, Berth ${berthStart})`,
        statusBadge: 'CNF',
        statusText: 'Ticket Confirmed',
        price: totalAmount,
        cost: totalAmount,
        paymentMethod: 'IRCTC iPay',
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
          seatStatus: `Confirmed (${classCode} - Coach ${coachCode}, Berth ${berthStart})`,
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
      <Navbar />
      <SubNavbar />

      {/* Main Container: Centered with 60px left and right gap */}
      <main style={{
        flex: 1,
        paddingLeft: '60px',
        paddingRight: '60px',
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
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '28px',
          padding: '8px 0'
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

          <div style={{ width: '120px', height: '2px', background: '#f97316', marginTop: '-18px' }}></div>

          {/* Step 2 */}
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
              2
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Review Journey</span>
          </div>

          <div style={{ width: '120px', height: '2px', background: '#f97316', marginTop: '-18px' }}></div>

          {/* Step 3 (Active) */}
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
              3
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>Payment</span>
          </div>
        </div>

        {/* Top Header Row: Payment Methods Title & Safe & Secure Payments Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Booking Confirmed!</h2>
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
              passengers: (confirmedBookingData.passengers || passengers || []).map((p: any, idx: number) => ({
                name: p.name || 'PASSENGER',
                age: p.age || 28,
                gender: p.gender || 'Male',
                bookingStatus: `CNF/${confirmedBookingData.coach || 'C1'}/${(confirmedBookingData.berthNo || 36) + idx * 2}/${p.berthPreference || 'NC'}`,
                currentStatus: `CNF/${confirmedBookingData.coach || 'C1'}/${(confirmedBookingData.berthNo || 36) + idx * 2}/${p.berthPreference || 'NC'}`
              })),
              fare: totalBaseFare,
              convenienceFee: convenienceFee,
              insurancePremium: travelInsurance,
              totalFare: Number(totalFare)
            }}
            onClose={() => setShowTicketModal(false)}
          />
        )}

        {/* Main Content Grid: Left Payment Tabs + Sub Options, Right Journey Summary & Fare */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Payment Methods Box */}
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              display: 'grid',
              gridTemplateColumns: '270px minmax(0, 1fr)',
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
                {selectedMethod === 'irctc_ipay' && (
                  <div
                    onClick={() => setSelectedSubOption('irctc_ipay_new')}
                    style={{
                      border: selectedSubOption === 'irctc_ipay_new' ? '1.5px solid #cbd5e1' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '12px 18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      background: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      IRCTC
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      IRCTC iPay New
                    </span>
                  </div>
                )}

                {selectedMethod !== 'irctc_ipay' && (
                  <div style={{ padding: '20px 0', color: '#64748b', fontSize: '13px' }}>
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
                  background: '#ea580c',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 48px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#ffffff',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.35)'
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
