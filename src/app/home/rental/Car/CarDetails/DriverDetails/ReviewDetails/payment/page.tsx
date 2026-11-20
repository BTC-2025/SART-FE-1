'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';

function RentalPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load from sessionStorage if available to avoid URL length issues
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sart_rental_payment_data');
      if (saved) {
        setSessionData(JSON.parse(saved));
      }
    } catch (e) { }
  }, []);

  const bookingId = searchParams.get('bookingId') || sessionData?.bookingId || `BK-${Date.now().toString().slice(-6)}`;
  const vehicleName = sessionData?.vehicleName || searchParams.get('vehicleName') || 'TVS APACHE RTR 160/200 XZ+';
  const vehicleImage = sessionData?.vehicleImage || searchParams.get('vehicleImage') || '/images/cab_sedan.png';
  const pickup = sessionData?.pickup || searchParams.get('pickup') || 'Katpadi';
  const pickupDate = sessionData?.pickupDate || searchParams.get('pickupDate') || '20 Nov, 2026';
  const pickupTime = sessionData?.pickupTime || searchParams.get('pickupTime') || '10:00 AM';
  const returnDate = sessionData?.returnDate || searchParams.get('returnDate') || '21 Nov, 2026';
  const returnTime = sessionData?.returnTime || searchParams.get('returnTime') || '10:00 AM';
  const customerName = sessionData?.customerName || searchParams.get('customerName') || 'sai';
  const customerPhone = sessionData?.customerPhone || searchParams.get('customerPhone') || '+91 ';
  const customerEmail = sessionData?.customerEmail || searchParams.get('customerEmail') || '';
  const customerAge = sessionData?.customerAge || searchParams.get('customerAge') || '26';
  const ownerLocation = sessionData?.ownerLocation || searchParams.get('ownerLocation') || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632100';

  const baseRate = Number(sessionData?.baseRate || searchParams.get('baseRate') || 1800);
  const taxes = Number(sessionData?.taxAmount || searchParams.get('taxAmount') || 324);
  const securityDeposit = Number(sessionData?.securityDeposit || searchParams.get('securityDeposit') || 5000);
  const deliveryCharge = Number(sessionData?.deliveryCharge || searchParams.get('deliveryCharge') || 1000);
  const totalAmount = Number(sessionData?.totalAmount || searchParams.get('totalAmount') || (baseRate + taxes + securityDeposit + deliveryCharge));

  // Sidebar selected tab matching Image 2
  const [selectedTab, setSelectedTab] = useState<string>('ipay');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'paytm' | 'gpay' | 'phonepe' | 'supermoney'>('paytm');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const handlePayAndBook = async () => {
    setIsProcessing(true);

    try {
      // 1. Post payment confirmation to backend
      await fetch('http://localhost:5000/api/rental/bookings/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          paymentStatus: 'PAID',
          paymentMethod: selectedTab,
          totalAmount
        })
      }).catch(() => null);

      // 2. Update local storage booking record
      try {
        const stored = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
        const updated = stored.map((b: any) => b.id === bookingId ? { ...b, paymentStatus: 'PAID', status: 'Confirmed' } : b);
        localStorage.setItem('sart_business_bookings', JSON.stringify(updated));
      } catch (e) { }

    } catch (e) { }

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '24px auto', padding: '0 20px 80px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

      {/* 3-STEP BREADCRUMBS PROGRESS HEADER (Matching Image 1: Step 3 is Payment) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Step 1: Booking Details (Completed) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#391e8a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            1
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Booking Details</span>
        </div>

        {/* Divider 1 */}
        <div style={{ width: '70px', height: '2px', background: '#391e8a', marginTop: '-24px' }}></div>

        {/* Step 2: Review & Verify (Completed) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#391e8a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            2
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Review & Verify</span>
        </div>

        {/* Divider 2 */}
        <div style={{ width: '70px', height: '2px', background: '#391e8a', marginTop: '-24px' }}></div>

        {/* Step 3: Payment (ACTIVE with #391e8a glow ring) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#391e8a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 0 0 5px rgba(57, 30, 138, 0.22)'
          }}>
            3
          </div>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Payment</span>
        </div>
      </div>

      {!paymentDone ? (
        <>
          {/* Top Header Row Matching Image 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a', fontFamily: 'Georgia, serif' }}>
              Payment Methods
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '13px', fontWeight: 600 }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '15px' }}></i>
              <span>Safe & Secure Payments</span>
            </div>
          </div>

          {/* Main 2-Column Grid Matching Image 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.1fr', gap: '24px', alignItems: 'start' }}>

            {/* ================= LEFT COLUMN: PAYMENT GATEWAY (IMAGE 2) ================= */}
            <div style={{
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'grid',
              gridTemplateColumns: '260px 1fr'
            }}>
              {/* Left Sidebar Menu */}
              <div style={{ borderRight: '1px solid #e2e8f0', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                {[

                  {
                    id: 'ewallet',
                    title: 'E-Wallet (Instant Payment)',
                    subtitle: 'Balance: ₹8.40',
                    icon: 'fa-wallet'
                  },
                  {
                    id: 'multiple',
                    title: 'Multiple Payment Service',
                    icon: 'fa-layer-group'
                  },
                  {
                    id: 'netbanking',
                    title: 'Netbanking',
                    icon: 'fa-building-columns'
                  },
                  {
                    id: 'cards',
                    title: 'Payment Gateway / Credit Card / Debit Card',
                    icon: 'fa-credit-card'
                  },
                  {
                    id: 'wallets',
                    title: 'Wallets / Cash Card',
                    icon: 'fa-money-bill-wave'
                  },
                  {
                    id: 'emi',
                    title: 'EMI',
                    icon: 'fa-percent'
                  },
                  {
                    id: 'loyalty',
                    title: 'Loyalty Redemption Booking',
                    icon: 'fa-medal'
                  }
                ].map((item) => {
                  const isActive = selectedTab === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTab(item.id)}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        borderLeft: isActive ? '4px solid #ea580c' : '4px solid transparent',
                        background: isActive ? '#f8fafc' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`} style={{ color: isActive ? '#0f172a' : '#64748b', fontSize: '14px', width: '16px' }}></i>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#0f172a' : '#334155', lineHeight: 1.3 }}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 600, marginTop: '2px' }}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Content Area for Selected Payment Method */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>



                {/* Popular UPI Apps Box */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                    <i className="fa-solid fa-bolt" style={{ color: '#4338ca', fontSize: '12px' }}></i>
                    <span>Popular UPI Apps (Pay via QR / App)</span>
                  </div>

                  {/* 4 App Buttons Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'gpay' as const, name: 'GPay', icon: 'fa-google-pay', color: '#ea4335' },
                      { id: 'phonepe' as const, name: 'PhonePe', icon: 'fa-p', color: '#6739b6' },
                      { id: 'paytm' as const, name: 'Paytm', icon: 'fa-shield', color: '#00baf2' },
                      { id: 'supermoney' as const, name: 'super.money', icon: 'fa-square-check', color: '#2563eb' }
                    ].map((app) => {
                      const isSelected = selectedUpiApp === app.id;
                      return (
                        <div
                          key={app.id}
                          onClick={() => setSelectedUpiApp(app.id)}
                          style={{
                            border: isSelected ? '2px solid #312e81' : '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '10px 6px',
                            background: isSelected ? '#f5f3ff' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            color: app.color,
                            fontWeight: 800
                          }}>
                            {app.id === 'gpay' ? 'G' : app.id === 'phonepe' ? 'पे' : app.id === 'paytm' ? 'Paytm' : '✦'}
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                            {app.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected App Row (e.g. Paytm UPI) */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>


                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                        {selectedUpiApp === 'paytm' ? 'Paytm UPI' : selectedUpiApp === 'gpay' ? 'Google Pay UPI' : selectedUpiApp === 'phonepe' ? 'PhonePe UPI' : 'UPI Instant Pay'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>Scan QR or Pay via {selectedUpiApp} / UPI</div>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
                </div>

              </div>
            </div>

            {/* ================= RIGHT COLUMN: JOURNEY & FARE SUMMARY (IMAGE 2) ================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Card 1: JOURNEY SUMMARY with Dark Blue Header */}
              <div style={{
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                {/* Dark Blue Header */}
                <div style={{
                  background: '#1e3a8a',
                  color: '#ffffff',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}>
                  JOURNEY SUMMARY
                </div>

                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Vehicle Name & Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                      {vehicleName}
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                      {pickupDate}
                    </span>
                  </div>

                  {/* User Selected Delivery / Pickup Address */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fa-solid fa-location-dot"></i> Delivery / Pickup Address
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                        {pickupTime}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.4, marginTop: '2px' }}>
                      {pickup}
                    </div>
                  </div>

                  {/* Trip Details Line */}
                  {/* <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
                    1 Vehicle • Self-Drive Rental • Delivery Included • Handover: {pickupDate} {pickupTime}
                  </div> */}

                  <div style={{ height: '1px', background: '#f1f5f9' }} />

                  {/* Customer Details */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      Customer Details
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                      1. {customerName} {customerAge ? `${customerAge} yrs` : '26 yrs'}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      Contact Details
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                      Email: {customerEmail || 'sai@gmail.com'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                      Mobile: {customerPhone || '+91 9867346373'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Fare Summary with Dark Blue Total Bar */}
              <div style={{
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Fare Summary
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#475569' }}>Base Rental Fare</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {baseRate.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#475569' }}>Taxes & Insurance (18%)</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {taxes.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#475569' }}>Security Deposit (Refundable)</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {securityDeposit.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#475569' }}>Delivery Charges</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {deliveryCharge.toFixed(2)}</span>
                  </div>
                </div>

                {/* Dark Blue Total Fare Bottom Bar */}
                <div style={{
                  background: '#1e1b4b',
                  color: '#ffffff',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '14.5px', fontWeight: 800 }}>Total Fare</span>
                  <span style={{ fontSize: '18px', fontWeight: 900 }}>₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Actions: Back | Pay & Book Button (Matching Image 2) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '28px' }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                width: '120px',
                padding: '12px 20px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Back
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayAndBook}
              style={{
                width: '200px',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                background: '#312e81',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: 800,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(49, 46, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                <>Pay & Book</>
              )}
            </button>
          </div>
        </>
      ) : (
        /* ================= IMAGE 1: BOOKING CONFIRMED SUCCESSFUL CARD ================= */
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '44px 32px 56px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.05)',
          maxWidth: '860px',
          margin: '0 auto'
        }}>
          {/* Green Check Circle */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px'
          }}>
            <i className="fa-solid fa-check"></i>
          </div>

          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
            Booking Confirmed Successfully!
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', maxWidth: '440px', lineHeight: 1.4 }}>
            Your self-drive vehicle reservation has been dispatched to the business owner and hub manager.
          </p>

          {/* 3 Box Metrics: BOOKING ID | LOCATION | TOTAL PAID */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 28px',
            display: 'flex',
            gap: '28px',
            margin: '8px 0'
          }}>
            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.4px' }}>BOOKING ID</div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>{bookingId}</div>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.4px' }}>LOCATION</div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>{pickup}</div>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.4px' }}>TOTAL PAID</div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#16a34a' }}>₹{totalAmount.toLocaleString()}</div>
            </div>
          </div>

          {/* Dedicated Owner Location & Contact Details Card (Exact Image 1 layout) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #fed7aa',
            borderRadius: '16px',
            padding: '20px 24px',
            maxWidth: '520px',
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #fff7ed', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#ffedd5',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                    Vehicle Owner & Pickup Station Details
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Connect directly with your vehicle owner</span>
                </div>
              </div>
              <span style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                <i className="fa-solid fa-circle-check"></i> Verified Owner
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Vehicle:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{vehicleName}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', lineHeight: 1.4 }}>
                <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Hub Address:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{ownerLocation}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Owner Contact:</span>
                <span style={{ fontWeight: 700, color: '#ea580c' }}>+91 98765 43210</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ownerLocation)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  background: '#ea580c',
                  color: '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <i className="fa-solid fa-location-dot" style={{ marginRight: '6px' }}></i> Navigate to Hub
              </a>
              <button
                type="button"
                onClick={() => router.push('/home/rental')}
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Back to Fleet
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function RentalPaymentPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1, paddingTop: '10px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading payment...</div>}>
          <RentalPaymentContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
