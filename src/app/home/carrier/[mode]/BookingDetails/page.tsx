'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import GoogleMapPickerModal from '@/components/rental/GoogleMapPickerModal';
import { Calendar, Clock } from 'lucide-react';

function CarrierBookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Mode from route params: 'Bike', 'Truck', 'Ship', 'Train', 'Flight'
  const routeMode = (typeof params?.mode === 'string' ? params.mode : 'Truck');
  const normalizedMode = routeMode.toUpperCase();

  const vehicleId = searchParams.get('id') || 'CRG-1002';
  const paramName = searchParams.get('name') || (normalizedMode === 'BIKE' ? 'Hero Hero Electric Cargo Scooter' : 'Tata Motors Tata Ace Gold');
  const paramBrand = searchParams.get('brand') || (normalizedMode === 'BIKE' ? 'Hero' : 'Tata Motors');
  const paramReg = searchParams.get('regId') || (normalizedMode === 'BIKE' ? 'TN 01 NJ 1234' : 'MH 12 MH 6789');
  const paramHub = searchParams.get('hub') || (normalizedMode === 'BIKE' ? 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India' : 'Mumbai Port Logistics Hub');
  const paramImage = searchParams.get('image') || (normalizedMode === 'BIKE' ? '/images/hero_cargo_bike.png' : '/images/tata_ace_fleet.jpg');

  const baseRateKm = Number(searchParams.get('ratePerKm') || (normalizedMode === 'BIKE' ? 14 : 48));
  const baseTripFee = Number(searchParams.get('baseCharge') || (normalizedMode === 'BIKE' ? 120 : 1800));
  const advPct = Number(searchParams.get('advancePercent') || (normalizedMode === 'BIKE' ? 25 : 30));
  const secDeposit = Number(searchParams.get('deposit') || (normalizedMode === 'BIKE' ? 1000 : 3000));

  // Form State
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [goodsType, setGoodsType] = useState(searchParams.get('goodsType') || 'Industrial Machinery / Freight Cargo');
  const [cargoWeight, setCargoWeight] = useState(searchParams.get('weight') || (normalizedMode === 'BIKE' ? '150' : '28'));
  const [weightUnit, setWeightUnit] = useState(searchParams.get('weightUnit') || (normalizedMode === 'BIKE' ? 'kg' : 'Tonnes'));

  const [deliveryType, setDeliveryType] = useState<'hub' | 'doorstep'>('hub');
  const [pickupAddress, setPickupAddress] = useState(searchParams.get('pickupAddress') || paramHub);
  const [deliveryAddress, setDeliveryAddress] = useState(searchParams.get('deliveryAddress') || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081');

  // Dates & Times State
  const formatYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res;
  };

  const [dispatchType, setDispatchType] = useState<'standard' | 'express' | 'dedicated'>('standard');
  const [dispatchDate, setDispatchDate] = useState(() => formatYMD(new Date()));
  const [dispatchTime, setDispatchTime] = useState('10:00');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(() => formatYMD(addDays(new Date(), normalizedMode === 'BIKE' ? 0 : 2)));
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('18:00');

  // Booking Confirmation Modal
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');

  // Map Modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<'pickup' | 'delivery'>('pickup');

  // Dynamic Fare Calculation
  const estDistanceKm = normalizedMode === 'BIKE' ? 25 : 345;
  const transitFare = estDistanceKm * baseRateKm;
  const deliveryExtra = deliveryType === 'doorstep' ? 1000 : 0;
  const subtotal = baseTripFee + transitFare + deliveryExtra;
  const gstAmount = Number((subtotal * 0.05).toFixed(2));
  const totalFreight = subtotal + gstAmount + secDeposit;
  const advancePayable = Number(((totalFreight * advPct) / 100).toFixed(2));
  const balanceOnDelivery = Number((totalFreight - advancePayable).toFixed(2));

  const handleSendOtp = () => {
    if (!whatsappNumber) {
      alert('Please enter your WhatsApp mobile number');
      return;
    }
    setOtpSent(true);
    alert(`OTP verification code sent to +91 ${whatsappNumber}`);
  };

  const handleConfirmBooking = () => {
    if (!fullName || !whatsappNumber) {
      alert('Please enter your Full Name and WhatsApp Number to proceed with booking.');
      return;
    }
    const ref = `SART-FRT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(ref);
    setIsConfirmedModalOpen(true);
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '28px auto',
      padding: '0 20px 80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box'
    }}>

      {/* TOP PROGRESS BREADCRUMB */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ea580c',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '15px',
            boxShadow: '0 0 0 5px rgba(234, 88, 12, 0.22)'
          }}>
            1
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
            Consignment & Details
          </span>
        </div>

        <div style={{ width: '80px', height: '2px', background: '#e2e8f0', marginTop: '-24px' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#f8fafc',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '15px',
            border: '1.5px solid #cbd5e1'
          }}>
            2
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Carrier Dispatch</span>
        </div>

        <div style={{ width: '80px', height: '2px', background: '#e2e8f0', marginTop: '-24px' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#f8fafc',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '15px',
            border: '1.5px solid #cbd5e1'
          }}>
            3
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Confirm & pay</span>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.7fr 1fr',
        gap: '28px',
        alignItems: 'start'
      }}>

        {/* LEFT COLUMN: CARGO CONSIGNMENT & BOOKING DETAILS */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
            <i className="fa-solid fa-truck-ramp-box" style={{ color: '#2563eb', fontSize: '18px' }}></i>
            <span>Carrier Booking & Consignment Details</span>
          </div>

          {/* 1. DISPATCH TYPE TABS */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px',
            borderRadius: '12px',
            background: '#F8F6F1',
            border: '1px solid #EBE7DF'
          }}>
            {(['standard', 'express', 'dedicated'] as const).map((t) => {
              const isActive = dispatchType === t;
              const label = t === 'standard' ? 'Standard Transit' : t === 'express' ? 'Express Priority' : 'Dedicated Rake / Fleet';
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDispatchType(t)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isActive ? '#181A20' : 'transparent',
                    color: isActive ? '#ffffff' : '#1E293B',
                    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 2. DATES & TIMES (DISPATCH & ESTIMATED DELIVERY) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', color: '#5A6478', textTransform: 'uppercase', marginBottom: '6px' }}>
                Dispatch Date & Time
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FAF8F5',
                      border: '1px solid #E4E0D6',
                      borderRadius: '10px',
                      padding: '10px 36px 10px 12px',
                      fontSize: '13px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Calendar style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#1E293B', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="time"
                    value={dispatchTime}
                    onChange={(e) => setDispatchTime(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FAF8F5',
                      border: '1px solid #E4E0D6',
                      borderRadius: '10px',
                      padding: '10px 36px 10px 12px',
                      fontSize: '13px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Clock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#1E293B', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', color: '#5A6478', textTransform: 'uppercase', marginBottom: '6px' }}>
                Estimated Delivery
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FAF8F5',
                      border: '1px solid #E4E0D6',
                      borderRadius: '10px',
                      padding: '10px 36px 10px 12px',
                      fontSize: '13px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Calendar style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#1E293B', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="time"
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FAF8F5',
                      border: '1px solid #E4E0D6',
                      borderRadius: '10px',
                      padding: '10px 36px 10px 12px',
                      fontSize: '13px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Clock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#1E293B', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. CONSIGNMENT CARGO SPECS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.4px', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                NATURE OF CONSIGNMENT / GOODS
              </label>
              <input
                type="text"
                value={goodsType}
                onChange={(e) => setGoodsType(e.target.value)}
                placeholder="e.g. Industrial Machinery, Steel, Perishables"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#fafaf9',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.4px', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                CARGO WEIGHT ({weightUnit.toUpperCase()})
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  placeholder="Weight"
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    background: '#fafaf9',
                    fontSize: '13.5px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  style={{
                    padding: '11px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="Tonnes">Tonnes</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. SENDER / CONSIGNOR DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.4px', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                CONSIGNOR / SENDER NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full sender name"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#fafaf9',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.4px', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                WHATSAPP / MOBILE NUMBER
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  height: '44px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#fafaf9'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>IN</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569' }}>+91</span>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Mobile number"
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13.5px', color: '#0f172a', width: '100%' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0 16px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>
          </div>

          {/* 5. ROUTE: PICKUP & DELIVERY HUBS */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                FREIGHT ROUTE & DEPOT HUBS
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                Estimated Transit: {estDistanceKm} km
              </span>
            </div>

            {/* Delivery Option Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeliveryType('hub')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: deliveryType === 'hub' ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                  background: deliveryType === 'hub' ? '#eff6ff' : '#ffffff',
                  color: deliveryType === 'hub' ? '#1d4ed8' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Hub-to-Hub Transit</span>
                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>
                    INCLUDED (₹0)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                  Consignor dispatches from hub & consignee collects from delivery terminal.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('doorstep')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: deliveryType === 'doorstep' ? '2px solid #ea580c' : '1.5px solid #cbd5e1',
                  background: deliveryType === 'doorstep' ? '#fff7ed' : '#ffffff',
                  color: deliveryType === 'doorstep' ? '#c2410c' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Doorstep Dedicated Fleet</span>
                  <span style={{ fontSize: '11px', background: '#ffedd5', color: '#9a3412', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>
                    +₹1,000 Extra
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                  Dedicated fleet vehicle will pick up directly at factory/warehouse doorstep.
                </p>
              </button>
            </div>

            {/* Pickup Address Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 12px' }}>
              <div style={{ color: '#16a34a', fontSize: '16px' }}><i className="fa-solid fa-circle-dot"></i></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b' }}>ORIGIN / PICKUP HUB</div>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                />
              </div>
            </div>

            {/* Delivery Address Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 12px' }}>
              <div style={{ color: '#ef4444', fontSize: '16px' }}><i className="fa-solid fa-location-dot"></i></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b' }}>DESTINATION / DELIVERY TERMINAL</div>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VEHICLE CARD (MATCHING IMAGE 2 EXACTLY) + CHARGES SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* CARD 1: VEHICLE CARD (MATCHING IMAGE 2 EXACTLY) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {/* 1. Vehicle Photo at Top */}
            <div style={{
              width: '100%',
              height: '180px',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#f8fafc',
              position: 'relative'
            }}>
              <img
                src={paramImage}
                alt={paramName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e: any) => { e.target.src = '/images/tata_ace_fleet.jpg'; }}
              />
            </div>

            {/* 2. Header Row: Name & Mode Badge + Rating */}
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, fontFamily: 'serif, Georgia' }}>
                  {paramName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {normalizedMode}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    ⭐ <span style={{ color: '#0f172a' }}>4.9</span>
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginTop: '3px' }}>
                {paramBrand}
              </div>
            </div>

            {/* 3. Specs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12.5px', color: '#475569' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Max Load:</strong> {cargoWeight} {weightUnit} • {normalizedMode === 'BIKE' ? 'Petrol' : 'Diesel'} • {normalizedMode === 'BIKE' ? 'Insulated Last-Mile Top Box (65L)' : '20ft Closed Container / Flatbed'}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>ID / Reg:</strong> {paramReg}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Hub:</strong> {paramHub}
              </div>
            </div>

            {/* 4. Badges (GPS Telematics, Cold Chain, HAZMAT) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📡 GPS Telematics
              </span>
              {normalizedMode !== 'BIKE' && (
                <span style={{
                  background: '#eff6ff',
                  color: '#1e40af',
                  border: '1px solid #bfdbfe',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ❄️ Cold Chain
                </span>
              )}
              {normalizedMode !== 'BIKE' && (
                <span style={{
                  background: '#fefce8',
                  color: '#854d0e',
                  border: '1px solid #fef08a',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ⚠️ HAZMAT
                </span>
              )}
            </div>

            {/* 5. Rate Card Box */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Rate Card:</span>
              <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                ₹{baseTripFee.toLocaleString('en-IN')}/trip | ₹{baseRateKm}/km | Adv: {advPct}%
              </span>
            </div>

            {/* Status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#16a34a'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                Allocated Available
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb' }}>
                ✓ Selected Carrier
              </span>
            </div>
          </div>

          {/* CARD 2: FREIGHT TARIFF & CHARGES SUMMARY */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px 24px',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              Freight Tariff & Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Base Handling & Trip Fee</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {baseTripFee.toLocaleString('en-IN')}.00</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>
                <div style={{ color: '#475569', fontWeight: 600 }}>Distance Freight ({estDistanceKm} km)</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>₹{baseRateKm}/km standard commercial rate</div>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {transitFare.toLocaleString('en-IN')}.00</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Goods & Service Tax (GST 5%)</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Refundable Security Deposit</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>₹ {secDeposit.toLocaleString('en-IN')}.00</span>
            </div>

            {deliveryType === 'doorstep' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#ea580c', fontWeight: 600 }}>Doorstep Fleet Pickup</span>
                <span style={{ fontWeight: 700, color: '#ea580c' }}>₹ 1,000.00</span>
              </div>
            )}

            {/* Dark Total Fare Bar */}
            <div style={{
              background: '#0f172a',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              marginTop: '6px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>Total Estimated Freight</span>
              <span style={{ fontSize: '17px', fontWeight: 900 }}>₹ {totalFreight.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Advance & Balance Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>ADVANCE PAYABLE ({advPct}%)</div>
                <div style={{ fontSize: '15px', color: '#15803d', fontWeight: 900, marginTop: '2px' }}>₹ {advancePayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700 }}>DUE ON DELIVERY</div>
                <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 900, marginTop: '2px' }}>₹ {balanceOnDelivery.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          {/* SART Freight Guarantee Callout */}
          <div style={{
            background: '#fffdf0',
            border: '1px solid #fef08a',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <span style={{ color: '#d97706', fontSize: '14px', marginTop: '1px' }}>⚠️</span>
            <span style={{ fontSize: '11.5px', color: '#854d0e', lineHeight: 1.45 }}>
              Advance booking locks in guaranteed vehicle dispatch. Telematics link, e-Way bill and live GPS tracking will be shared immediately via WhatsApp.
            </span>
          </div>

          {/* Action Buttons: Back | Confirm Booking */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                width: '100px',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleConfirmBooking}
              style={{
                flex: 1,
                padding: '13px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#ea580c',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Confirm Carrier Booking →</span>
            </button>
          </div>

        </div>

      </div>

      {/* CONFIRMED BOOKING POPUP MODAL */}
      {isConfirmedModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(5px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '36px 32px',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              <i className="fa-solid fa-check"></i>
            </div>

            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
              Carrier Booking Initiated!
            </h3>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>BOOKING REFERENCE</div>
              <div style={{ fontSize: '17px', color: '#2563eb', fontWeight: 900, letterSpacing: '0.5px' }}>{bookingRefId}</div>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              Vehicle <strong>{paramName}</strong> has been provisionally reserved for your shipment. Our logistics dispatch desk will call you at <strong>+91 {whatsappNumber}</strong> to verify the consignment and dispatch time.
            </p>

            <button
              type="button"
              onClick={() => router.push('/home/carrier')}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Return to Carrier Fleet
            </button>
          </div>
        </div>
      )}

      {/* MAP MODAL */}
      <GoogleMapPickerModal
        isOpen={isMapModalOpen}
        initialAddress={mapTarget === 'pickup' ? pickupAddress : deliveryAddress}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={(address: string) => {
          if (mapTarget === 'pickup') {
            setPickupAddress(address);
          } else {
            setDeliveryAddress(address);
          }
          setIsMapModalOpen(false);
        }}
      />

    </div>
  );
}

export default function CarrierBookingDetailsPage() {
  return (
    <>
      <Navbar />
      <SubNavbar />
      <Suspense fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Loading Carrier Booking Details...</p>
        </div>
      }>
        <CarrierBookingDetailsContent />
      </Suspense>
      <Footer />
    </>
  );
}
