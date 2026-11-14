'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrainApi } from '@/apis/trainApi';

interface PaymentProvider {
  id: string;
  name: string;
  logoText?: string;
  badge?: string;
  badgeColor?: string;
  chargeText?: string;
  discountText?: string;
  isPopular?: boolean;
}

interface PaymentCategory {
  id: string;
  title: string;
  subtitle?: string;
  offerBadge?: string;
  iconClass: string;
  providers: PaymentProvider[];
}

export default function TrainPaymentPage() {
  const router = useRouter();

  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = useState(380); // ~ 6m 20s
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Load pending booking details from storage
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
    }
  }, []);

  // Timer countdown matching screenshot "Remaining Time: 06:21"
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalAmount = bookingData?.totalAmount || bookingData?.fare || 600.4;
  const trainName = bookingData?.trainName || 'Train Express';
  const trainNumber = bookingData?.trainNumber || '12007';
  const classCode = bookingData?.classCode || 'CC';

  const categories: PaymentCategory[] = [
    {
      id: 'autopay',
      title: 'Autopay',
      iconClass: 'fa-solid fa-arrows-rotate',
      providers: [
        {
          id: 'irctc_autopay',
          name: 'IRCTC iPay (UPI Autopay)',
          chargeText: 'Zero mandate fee. Instant auto-refunds on failure.',
          isPopular: true
        },
        { id: 'phonepe_autopay', name: 'PhonePe Autopay', chargeText: 'Supported with UPI PIN' },
        { id: 'gpay_autopay', name: 'Google Pay Autopay', chargeText: 'Fast one-click authorization' }
      ]
    },
    {
      id: 'wallet',
      title: 'Wallet (Instant Payment)',
      offerBadge: 'Offers available',
      iconClass: 'fa-solid fa-wallet',
      providers: [
        {
          id: 'irctc_ewallet',
          name: 'IRCTC eWallet',
          chargeText: 'Insufficient eWallet balance. Your current balance is ₹ 0.0/-'
        },
        {
          id: 'amazon_pay',
          name: 'Amazon Pay Balance',
          discountText: 'Upto ₹25 cashback* on booking of ₹300+',
          badge: 'OFFER'
        },
        { id: 'mobikwik', name: 'Mobikwik Wallet', discountText: 'Flat ₹50 SuperCash with code TICKET50' },
        { id: 'paytm_wallet', name: 'Paytm Wallet', chargeText: 'Zero transaction charges' }
      ]
    },
    {
      id: 'emi',
      title: 'EMI on Cards',
      iconClass: 'fa-solid fa-percent',
      providers: [
        { id: 'hdfc_emi', name: 'HDFC Bank Credit Card EMI', chargeText: 'From ₹210/month at 14% p.a.' },
        { id: 'icici_emi', name: 'ICICI Bank Credit Card EMI', chargeText: 'From ₹215/month at 15% p.a.' },
        { id: 'sbi_emi', name: 'SBI Card EMI', chargeText: '3, 6, 9 or 12 months options' }
      ]
    },
    {
      id: 'upi_credit',
      title: 'UPI (Credit Card/ Credit Line)',
      iconClass: 'fa-brands fa-google-pay',
      providers: [
        { id: 'rupay_upi', name: 'RuPay Credit Card on UPI', isPopular: true, chargeText: 'Pay via GPay / PhonePe using RuPay CC' },
        { id: 'icici_creditline', name: 'ICICI UPI Credit Line', chargeText: 'Zero interest for 30 days' }
      ]
    },
    {
      id: 'credit_card',
      title: 'Credit Card',
      iconClass: 'fa-regular fa-credit-card',
      providers: [
        {
          id: 'irctc_ipay_cc',
          name: 'IRCTC iPay',
          chargeText: 'PG Charges (Upto): CC: 1.8% + GST@18% | Fast checkout',
          isPopular: true
        },
        { id: 'phonepe_cc', name: 'PhonePe PG (Visa / Mastercard)' },
        { id: 'razorpay_cc', name: 'Razorpay Payment Gateway' },
        { id: 'payu_cc', name: 'PayU Secure Gateway' }
      ]
    },
    {
      id: 'debit_card',
      title: 'Debit Card',
      iconClass: 'fa-solid fa-credit-card',
      providers: [
        {
          id: 'irctc_ipay_dc',
          name: 'IRCTC iPay',
          chargeText: 'PG Charges: DC: 0.4% <= ₹2000 & 0.9% > ₹2000 | RUPAY: NIL',
          isPopular: true
        },
        { id: 'phonepe_dc', name: 'PhonePe' },
        { id: 'razorpay_dc', name: 'Razorpay' },
        { id: 'airpay_dc', name: 'Airpay' },
        { id: 'cashfree_dc', name: 'Cashfree' },
        { id: 'mobikwik_dc', name: 'Mobikwik' },
        { id: 'pay10_dc', name: 'Pay 10' }
      ]
    },
    {
      id: 'international_card',
      title: 'International Card',
      iconClass: 'fa-regular fa-credit-card',
      providers: [
        { id: 'razorpay_intl', name: 'Razorpay', isPopular: true },
        { id: 'airpay_intl', name: 'Airpay' },
        { id: 'cashfree_intl', name: 'Cashfree' },
        { id: 'easebuzz_intl', name: 'Easebuzz' },
        { id: 'payu_intl', name: 'PayU' },
        { id: 'paytm_intl', name: 'Paytm' }
      ]
    },
    {
      id: 'netbanking',
      title: 'NetBanking',
      iconClass: 'fa-solid fa-building-columns',
      providers: [
        { id: 'irctc_nb', name: 'IRCTC iPay NetBanking (All Major Banks)', isPopular: true },
        { id: 'sbi_nb', name: 'State Bank of India' },
        { id: 'hdfc_nb', name: 'HDFC Bank' },
        { id: 'icici_nb', name: 'ICICI Bank' },
        { id: 'axis_nb', name: 'Axis Bank' }
      ]
    },
    {
      id: 'upi',
      title: 'UPI',
      iconClass: 'fa-solid fa-qrcode',
      providers: [
        { id: 'upi_qr', name: 'Scan UPI QR Code (Google Pay / PhonePe / Paytm / BHIM)', isPopular: true, chargeText: 'PG Charges: NIL' },
        { id: 'gpay_app', name: 'Google Pay UPI' },
        { id: 'phonepe_app', name: 'PhonePe UPI' },
        { id: 'paytm_app', name: 'Paytm UPI' }
      ]
    }
  ];

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);

  const handleExecutePayment = async () => {
    setIsProcessing(true);

    const chosenProvider = selectedProvider || (currentCategoryObj ? currentCategoryObj.providers[0].id : 'irctc_ipay');
    const paymentMethodName = currentCategoryObj ? currentCategoryObj.title : 'Payment Gateway';

    // 1. Call Backend API to confirm booking and persist in database
    try {
      const payload: any = {
        trainNumber: bookingData?.trainNumber || '12007',
        trainName: bookingData?.trainName || 'Train Express',
        classCode: bookingData?.classCode || 'CC',
        source: bookingData?.source || 'Chennai',
        destination: bookingData?.destination || 'Bengaluru',
        dateOfJourney: bookingData?.dateOfJourney || new Date().toLocaleDateString('en-GB'),
        departureTime: bookingData?.depTime || '06:00 AM',
        passengerName: bookingData?.passengers?.[0]?.name || 'Passenger',
        passengers: bookingData?.passengers || [{ name: 'Passenger', age: '25', gender: 'Male', berthPreference: 'No Preference' }],
        email: bookingData?.email,
        phone: bookingData?.phone,
        irctcId: bookingData?.irctcId,
        boardingStation: bookingData?.boardingStation || bookingData?.source,
        paymentDetails: {
          method: selectedCategory || 'debit_card',
          provider: chosenProvider,
          status: 'SUCCESS',
          amount: totalAmount,
          txnId: `TXN${Date.now()}`
        },
        fare: totalAmount
      };

      const resp = await TrainApi.confirmBooking(payload);

      const generatedPnr = resp?.data?.pnr || `${Math.floor(2000000000 + Math.random() * 8000000000)}`;

      const confirmedRecord = {
        id: `train-${Date.now()}`,
        title: payload.trainName,
        number: payload.trainNumber,
        type: 'Train',
        pnr: generatedPnr,
        bookingId: resp?.data?.bookingId || `TRN${Math.floor(100000 + Math.random() * 900000)}`,
        source: payload.source,
        destination: payload.destination,
        sourceTime: payload.departureTime,
        destinationTime: '10:30 AM',
        dateOfJourney: payload.dateOfJourney,
        sourceDate: payload.dateOfJourney,
        allPassengers: payload.passengers,
        passengerName: payload.passengers.map((p: any) => `${p.name} (${p.age || 25})`).join(', '),
        passengerPhone: payload.phone,
        passengerEmail: payload.email,
        boardingStation: payload.boardingStation,
        irctcId: payload.irctcId,
        seatStatus: `Confirmed (${classCode} - Coach D8, Berth 24)`,
        statusBadge: 'CNF',
        statusText: 'Ticket Confirmed',
        price: totalAmount,
        paymentMethod: paymentMethodName,
        isActive: true,
        isCancelled: false
      };

      // Save to localStorage for instant Bookings tab retrieval
      if (typeof window !== 'undefined') {
        const existing = localStorage.getItem('sart_global_bookings');
        const list = existing ? JSON.parse(existing) : [];
        list.unshift(confirmedRecord);
        localStorage.setItem('sart_global_bookings', JSON.stringify(list));
        localStorage.removeItem('sart_pending_train_booking');
      }

      setConfirmedBooking(confirmedRecord);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment confirmation error', err);
      alert('Payment authorization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ height: 'auto', background: '#ffffff', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Top Countdown Header bar */}
      <div
        style={{
          background: '#1e1b4b',
          color: '#ffffff',
          padding: '6px 16px',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.3px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}
      >
        Remaining Time : <span style={{ color: '#fbbf24', fontWeight: 800 }}>{formatTimer(remainingSeconds)}</span>
      </div>

      {/* Main Container - Compact height, balanced fonts, scrollable to the end */}
      <div
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 'calc(100vh - 28px)',
          overflowY: 'auto',
          background: '#ffffff',
          boxShadow: 'none',
          paddingBottom: '60px'
        }}
      >
        {/* Navigation Bar in requested Deep Purple #2a1373 - Compact height */}
        <div
          style={{
            background: '#2a1373',
            color: '#ffffff',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(42, 19, 115, 0.25)',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                if (selectedCategory) {
                  setSelectedCategory(null);
                  setSelectedProvider('');
                } else {
                  router.push('/home/ride/train');
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h1 style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              {selectedCategory && currentCategoryObj ? currentCategoryObj.title : 'MAKE PAYMENT'}
            </h1>
          </div>
          <div style={{ fontSize: '11px', background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: '10px', fontWeight: 700 }}>
            <i className="fa-solid fa-shield-halved" style={{ marginRight: '5px' }}></i> 100% SECURE
          </div>
        </div>

        {/* Total Amount Header - Compact font & height */}
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            background: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Amount</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{trainName} ({trainNumber}) • {classCode}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
              ₹{Number(totalAmount).toFixed(1)}
            </span>
            <i className="fa-regular fa-circle-question" style={{ color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}></i>
          </div>
        </div>

        {/* Cashback Banner matching Screenshot - Compact */}
        <div style={{ padding: '10px 20px', background: '#f8fafc' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fee2e2 100%)',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '1px' }}>
                SPECIAL OFFER
              </div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>
                1% PG Waiver &amp; Upto 10% Additional Cashback
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>
                On linked IRCTC Co-Branded Cards &amp; UPI
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2a1373',
                background: '#ffffff',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer'
              }}
            >
              Apply
            </span>
          </div>
        </div>

        {/* View Switch: Level 1 (All Methods) or Level 2 (Selected Provider) */}
        {!selectedCategory ? (
          <div>
            <div
              style={{
                padding: '10px 20px 6px 20px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.4px',
                textTransform: 'uppercase'
              }}
            >
              SELECT A PAYMENT METHOD
            </div>

            {/* List of Payment Method Categories - Reduced height and font sizes */}
            <div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.providers.length > 0) {
                      setSelectedProvider(cat.providers[0].id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#faf5ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#f3e8ff',
                        color: '#2a1373',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px'
                      }}
                    >
                      <i className={cat.iconClass}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        {cat.title}
                      </div>
                      {cat.offerBadge && (
                        <div
                          style={{
                            display: 'inline-block',
                            background: '#dcfce7',
                            color: '#15803d',
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '3px',
                            marginTop: '2px'
                          }}
                        >
                          {cat.offerBadge}
                        </div>
                      )}
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '11px' }}></i>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Level 2: Provider List View */
          <div>
            <div
              style={{
                padding: '10px 20px 6px 20px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.4px',
                textTransform: 'uppercase'
              }}
            >
              SELECT A PAYMENT PROVIDER
            </div>

            {/* Providers list */}
            <div>
              {currentCategoryObj?.providers.map((prov) => {
                const isSelected = selectedProvider === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov.id)}
                    style={{
                      padding: '12px 20px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      background: isSelected ? '#faf5ff' : '#ffffff',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2a1373',
                            fontWeight: 800,
                            fontSize: '11px'
                          }}
                        >
                          {prov.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                            {prov.name}
                          </div>
                          {prov.discountText && (
                            <div
                              style={{
                                display: 'inline-block',
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '3px',
                                marginTop: '2px'
                              }}
                            >
                              {prov.discountText}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Custom Radio Button */}
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #2a1373' : '2px solid #cbd5e1',
                          boxSizing: 'border-box'
                        }}
                      ></div>
                    </div>

                    {/* Breakdown text or PG charges (if present) */}
                    {prov.chargeText && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: prov.chargeText.includes('Insufficient') ? '#ef4444' : '#64748b',
                          marginTop: '4px',
                          lineHeight: '1.3',
                          paddingLeft: '42px'
                        }}
                      >
                        {prov.chargeText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Proceed to Pay Button */}
            <div style={{ padding: '18px 20px' }}>
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  background: '#2a1373',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(42, 19, 115, 0.35)'
                }}
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing Secure Payment...
                  </>
                ) : (
                  <>PROCEED TO PAY ₹{Number(totalAmount).toFixed(1)}</>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedProvider('');
                }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Choose another payment method
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Success Modal */}
      {paymentSuccess && confirmedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#dcfce7',
                color: '#15803d',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '28px'
              }}
            >
              <i className="fa-solid fa-check"></i>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Payment Successful!
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Your ticket for <strong>{confirmedBooking.title}</strong> has been booked and stored in the database.
            </p>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'left',
                fontSize: '12px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>PNR Number:</span>
                <span style={{ fontWeight: 800, color: '#2a1373' }}>{confirmedBooking.pnr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span style={{ fontWeight: 800, color: '#15803d' }}>CNF / Coach D8, Berth 24</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount Paid:</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{confirmedBooking.price}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  router.push('/home/ride/train');
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2a1373',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Back to Trains
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push('/booking');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                View in My Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

