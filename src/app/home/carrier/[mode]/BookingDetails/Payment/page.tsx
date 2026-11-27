'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Check, ShieldCheck, CreditCard, Smartphone, Building, Wallet, CheckCircle2, Download, Printer } from 'lucide-react';

function CarrierPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const routeMode = (typeof params?.mode === 'string' ? params.mode : 'Ship');

  const [bookingSummary, setBookingSummary] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sart_carrier_booking_summary');
      if (saved) {
        setBookingSummary(JSON.parse(saved));
      }
    } catch (e) { }
  }, []);

  const bookingId = searchParams.get('bookingId') || bookingSummary?.bookingId || `CRG-BK-${Date.now().toString().slice(-6)}`;
  const vehicleName = bookingSummary?.vehicleName || searchParams.get('name') || 'Carrier Cargo Fleet';
  const vehicleReg = bookingSummary?.vehicleReg || 'IMO 7879';
  const pickup = bookingSummary?.pickup || 'Hyderabad, Telangana (500051)';
  const delivery = bookingSummary?.delivery || 'Bengaluru, Karnataka (560058)';
  const goodsDescription = bookingSummary?.goodsDescription || 'Industrial CNC milling machine and spare tool cabinets';
  const cargoWeight = bookingSummary?.cargoWeight || '14 Tons';

  const baseCharge = Number(bookingSummary?.baseTripFee || 120000);
  const transitFare = Number(bookingSummary?.transitFare || 552500);
  const gstAmount = Number(bookingSummary?.gstAmount || 33625);
  const secDeposit = Number(bookingSummary?.secDeposit || 20000);
  const totalAmount = Number(bookingSummary?.totalFreight || searchParams.get('total') || 726125);
  const advancePayable = Number(bookingSummary?.advancePayable || searchParams.get('advance') || Math.round(totalAmount * 0.4));
  const dueOnDelivery = Math.round(totalAmount - advancePayable);

  // Payment method tab
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'corporate'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'phonepe' | 'gpay' | 'paytm'>('phonepe');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const handlePayAdvance = async () => {
    setIsProcessing(true);

    // Construct rich booking data payload for carrier owner dashboard
    const bookingPayload = {
      id: bookingId,
      bookingId,
      vehicleId: bookingSummary?.vehicleId || 'CRG-SHIP-001',
      vehicleName,
      vehicleReg,
      mode: routeMode.toLowerCase(),
      customerName: bookingSummary?.senderName || 'Valued Shipper',
      customerPhone: bookingSummary?.senderMobile || '+91 98450 12345',
      senderType: bookingSummary?.senderType || 'business',
      senderGstin: bookingSummary?.senderGstin || '',
      senderEmail: bookingSummary?.senderEmail || '',
      receiverName: bookingSummary?.receiverName || 'Consignee Hub',
      receiverPhone: bookingSummary?.receiverMobile || '+91 98765 43210',
      receiverType: bookingSummary?.receiverType || 'business',
      receiverGstin: bookingSummary?.receiverGstin || '',
      pickup,
      dropLoc: delivery,
      pickupAddress: bookingSummary?.pickupAddress || pickup,
      deliveryAddress: bookingSummary?.deliveryAddress || delivery,
      pickupPincode: bookingSummary?.pickupPincode || '',
      deliveryPincode: bookingSummary?.deliveryPincode || '',
      pickupDate: bookingSummary?.pickupDate || new Date().toISOString().split('T')[0],
      pickupTime: bookingSummary?.pickupTime || '10:00',
      goodsType: goodsDescription,
      goodsCategory: bookingSummary?.goodsCategory || 'Industrial Freight',
      cargoWeight,
      consignmentValue: bookingSummary?.consignmentValue || 500000,
      ewayBillNumber: bookingSummary?.ewayBillNumber || `EWB-${Date.now().toString().slice(-12)}`,
      distanceKm: 850,
      totalPrice: totalAmount,
      advancePaid: advancePayable,
      remainingBalance: dueOnDelivery,
      payMethod: selectedMethod.toUpperCase() + (selectedMethod === 'upi' ? ` (${selectedUpiApp})` : ''),
      status: 'Advance Paid - Ready to Dispatch',
      createdAt: new Date().toISOString()
    };

    // 1. Try persisting to backend database and notifications
    const notifPayload = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      bookingId: bookingId,
      type: 'carrier_booking',
      vertical: 'Carriers',
      badge: 'New Carrier Booking',
      title: `${bookingSummary?.senderName || 'Valued Shipper'} booked ${vehicleName}`,
      customerName: bookingSummary?.senderName || 'Valued Shipper',
      customerPhone: bookingSummary?.senderMobile || '+91 98450 12345',
      category: 'Commercial Freight',
      carrierName: vehicleName,
      vehicleName: vehicleName,
      vehicleReg: vehicleReg,
      vehiclePlate: vehicleReg,
      route: `${pickup} → ${delivery}`,
      fromLocation: pickup,
      toLocation: delivery,
      totalAmount: totalAmount,
      totalPrice: totalAmount,
      advancePaid: advancePayable,
      status: 'Advance Paid - Ready to Dispatch',
      read: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    try {
      await Promise.allSettled([
        fetch('http://localhost:5000/api/carriers/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        }),
        fetch('http://localhost:3005/api/carriers/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        }),
        fetch('http://localhost:5000/api/business/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notifPayload)
        }),
        fetch('http://localhost:3005/api/business/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notifPayload)
        }),
        ...(bookingPayload.vehicleId ? [
          fetch(`http://localhost:3005/api/carriers/${encodeURIComponent(bookingPayload.vehicleId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isAvailable: false, status: 'On Trip', bookingDetails: bookingPayload })
          }),
          fetch(`http://localhost:5000/api/carriers/${encodeURIComponent(bookingPayload.vehicleId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isAvailable: false, status: 'On Trip', bookingDetails: bookingPayload })
          })
        ] : [])
      ]);
    } catch (e) {
      console.warn('Backend offline, caching booking locally:', e);
    }

    // 2. Also persist to localStorage for cross-app instant sync (both portals on localhost)
    try {
      const existingStr = localStorage.getItem('sart_carrier_bookings');
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      const updatedList = [bookingPayload, ...existingList.filter((b: any) => b.id !== bookingId)];
      localStorage.setItem('sart_carrier_bookings', JSON.stringify(updatedList));

      // Save notification to sart_business_bookings
      const existingBiz = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
      localStorage.setItem('sart_business_bookings', JSON.stringify([notifPayload, ...existingBiz]));

      // Mark vehicle as On Trip / Unavailable in localStorage
      const bookedVehId = bookingPayload.vehicleId;
      const localFleet = JSON.parse(localStorage.getItem('logi_pulse_vehicles') || '[]');
      const updatedFleet = localFleet.map((v: any) => {
        if (v.id === bookedVehId || v.plate === vehicleReg || v.name === vehicleName) {
          return { ...v, isAvailable: false, status: 'On Trip', bookingDetails: bookingPayload };
        }
        return v;
      });
      localStorage.setItem('logi_pulse_vehicles', JSON.stringify(updatedFleet));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('carrier_vehicle_booked', { detail: bookingPayload }));
    } catch (e) { }

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
    }, 1000);
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      receiptType: 'CARRIER CONSIGNMENT & ADVANCE PAYMENT VOUCHER',
      bookingReference: bookingId,
      bookingDate: new Date().toLocaleString('en-IN'),
      carrier: {
        name: vehicleName,
        regId: vehicleReg,
        mode: routeMode
      },
      shipperSender: {
        name: bookingSummary?.senderName || 'Valued Shipper',
        mobile: bookingSummary?.senderMobile || '+91 98450 12345',
        gstin: bookingSummary?.senderGstin || 'Unregistered',
        pickupAddress: bookingSummary?.pickupAddress || pickup
      },
      consigneeReceiver: {
        name: bookingSummary?.receiverName || 'Consignee Hub',
        mobile: bookingSummary?.receiverMobile || '+91 98765 43210',
        gstin: bookingSummary?.receiverGstin || 'Unregistered',
        deliveryAddress: bookingSummary?.deliveryAddress || delivery
      },
      consignment: {
        goods: goodsDescription,
        weight: cargoWeight,
        ewayBill: bookingSummary?.ewayBillNumber || 'N/A'
      },
      paymentSummary: {
        totalFreight: `₹${totalAmount.toLocaleString('en-IN')}`,
        advancePaid: `₹${advancePayable.toLocaleString('en-IN')}`,
        balancePayableOnDelivery: `₹${dueOnDelivery.toLocaleString('en-IN')}`,
        paymentMethod: selectedMethod.toUpperCase() + (selectedMethod === 'upi' ? ` (${selectedUpiApp})` : ''),
        status: 'CONFIRMED / DISPATCH READY'
      }
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Carrier-Receipt-${bookingId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '28px 20px', flex: 1 }}>

        {/* Stepper Header */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                background: '#f1f5f9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155'
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                Price & Payment
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Booking Ref: <strong style={{ color: '#0f172a' }}>{bookingId}</strong> • Lock carrier dispatch with advance deposit
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 14px', borderRadius: '20px', color: '#065f46', fontSize: '12.5px', fontWeight: 800 }}>
            <ShieldCheck size={16} />
            <span>SART Guaranteed Dispatch</span>
          </div>
        </div>

        {paymentDone ? (
          /* Success Screen */
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '48px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
          }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={42} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Carrier Booking Confirmed!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '520px', margin: 0, lineHeight: 1.5 }}>
              Advance payment of <strong>₹{advancePayable.toLocaleString('en-IN')}</strong> has been successfully registered for <strong>{vehicleName}</strong> (ID: {vehicleReg}).
            </p>
            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155' }}>
              <div><strong>Booking Reference:</strong> {bookingId}</div>
              <div><strong>Route:</strong> {pickup} → {delivery}</div>
              <div><strong>Cargo:</strong> {goodsDescription} ({cargoWeight})</div>
              <div><strong>Balance Payable on Delivery:</strong> ₹{dueOnDelivery.toLocaleString('en-IN')}</div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              Live Telematics tracking link and driver contact details have been dispatched to your verified WhatsApp number.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleDownloadReceipt}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1.5px solid #0284c7',
                  background: '#f0f9ff',
                  color: '#0369a1',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={17} />
                <span>Download All Booking Details & Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/home/carrier')}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#1e3a8a',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Return to Carrier Fleet
              </button>
            </div>
          </div>
        ) : (
          /* Payment Layout (2-Column Grid) */
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>

            {/* Left Column: Payment Methods */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  Select Payment Method for Advance
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  Pay <strong>₹{advancePayable.toLocaleString('en-IN')}</strong> ({bookingSummary?.advPct || 40}% advance) to lock in carrier allocation.
                </p>
              </div>

              {/* Method Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building },
                  { id: 'corporate', label: 'Corporate Credit', icon: Wallet }
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = selectedMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '10px',
                        border: isActive ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                        background: isActive ? '#eff6ff' : '#ffffff',
                        color: isActive ? '#1e3a8a' : '#475569',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '12px'
                      }}
                    >
                      <Icon size={18} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Method Details */}
              {selectedMethod === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Select UPI App</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {(['phonepe', 'gpay', 'paytm'] as const).map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpiApp(app)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: selectedUpiApp === app ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: selectedUpiApp === app ? '#ffffff' : '#f1f5f9',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {app === 'phonepe' ? 'PhonePe' : app === 'gpay' ? 'Google Pay' : 'Paytm'}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Or enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="business@upi or mobile@okhdfcbank"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Card Number</label>
                    <input type="text" placeholder="4532 •••• •••• 8901" style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Expiry (MM/YY)</label>
                      <input type="text" placeholder="12/28" style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>CVV</label>
                      <input type="password" placeholder="•••" style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Select Bank</label>
                  <select style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}>
                    <option>HDFC Bank Corporate / Retail</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {selectedMethod === 'corporate' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12.5px', color: '#1e3a8a', fontWeight: 700 }}>
                    Enterprise 30-Day Credit Line (Subject to GST verification)
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    Your registered GSTIN <strong>{bookingSummary?.senderGstin || '36AAAAA1111A1Z1'}</strong> is pre-approved for deferred credit billing.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handlePayAdvance}
                disabled={isProcessing}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isProcessing ? 'Processing Advance Payment...' : `Pay Advance ₹${advancePayable.toLocaleString('en-IN')} & Confirm Dispatch`}
              </button>
            </div>

            {/* Right Column: Consignment & Tariff Summary Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Consignment & Tariff Summary
              </h3>

              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569' }}>
                <div><strong>Vehicle:</strong> {vehicleName}</div>
                <div><strong>Reg ID:</strong> {vehicleReg}</div>
                <div><strong>Sender:</strong> {bookingSummary?.senderName || ''} ({bookingSummary?.senderGstin || ''})</div>
                <div><strong>Receiver:</strong> {bookingSummary?.receiverName || ''}</div>
                <div><strong>Cargo:</strong> {goodsDescription || ''}</div>
                <div><strong>Weight:</strong> {cargoWeight}</div>
                {Boolean(bookingSummary?.pickupAddress || pickup) && (
                  <div><strong>Pickup Address:</strong> {bookingSummary?.pickupAddress || pickup}</div>
                )}
                {Boolean(bookingSummary?.deliveryAddress || delivery) && (
                  <div><strong>Delivery Address:</strong> {bookingSummary?.deliveryAddress || delivery}</div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Base Charter / Trip Fee</span>
                  <span>₹{baseCharge.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Distance Transit Fare</span>
                  <span>₹{transitFare.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>GST (18% / 5%)</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Refundable Security Transit Deposit</span>
                  <span>₹{secDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#0f172a', fontSize: '15px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  <span>Total Estimated Freight</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Advance & Balance Split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>ADVANCE ({bookingSummary?.advPct || 40}%)</div>
                  <div style={{ fontSize: '15px', color: '#15803d', fontWeight: 900, marginTop: '2px' }}>₹{advancePayable.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700 }}>DUE ON DELIVERY</div>
                  <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 900, marginTop: '2px' }}>₹{dueOnDelivery.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function CarrierPaymentPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', fontWeight: 800 }}>Loading Payment...</div>}>
      <CarrierPaymentContent />
    </Suspense>
  );
}
