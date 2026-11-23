'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import '@/app/home/rental/Car/CarDetails/page.css';
import { ALL_RENTAL_VEHICLES, RentalVehicle } from '@/components/rental/rentalData';
import GoogleMapPickerModal from '@/components/rental/GoogleMapPickerModal';
import { Calendar, Clock } from 'lucide-react';

// Popular landmarks for quick selection in the Map Picker Popup
const POPULAR_LOCATIONS = [
];

function BookingDeliveryDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = searchParams.get('id') || searchParams.get('vehicleId') || 'r-activa';
  const pickupParam = searchParams.get('pickup') || searchParams.get('origin') || 'Katpadi';

  const [vehicle, setVehicle] = useState<RentalVehicle | null>(null);

  // Form State
  const [deliveryAddress, setDeliveryAddress] = useState(pickupParam || 'Katpadi');
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Delivery options: 'hub' (Collect at Owner's Hub FREE) vs 'delivery' (Deliver to My Location +₹1,000 Extra)
  const [deliveryType, setDeliveryType] = useState<'hub' | 'delivery'>('hub');
  const [userCustomLocation, setUserCustomLocation] = useState('Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tami...');

  // Duration Tabs & Date/Time State
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

  const [rentalType, setRentalTypeState] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const rentalPlan = rentalType;
  const setRentalPlan = setRentalTypeState;
  const [pickupDate, setPickupDate] = useState(() => formatYMD(new Date()));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(() => formatYMD(addDays(new Date(), 1)));
  const [returnTime, setReturnTime] = useState('10:00');

  const setRentalType = (plan: 'daily' | 'weekly' | 'monthly') => {
    setRentalTypeState(plan);
    const pDate = new Date(pickupDate || formatYMD(new Date()));
    if (plan === 'daily') {
      setReturnDate(formatYMD(addDays(pDate, 1)));
    } else if (plan === 'weekly') {
      setReturnDate(formatYMD(addDays(pDate, 7)));
    } else if (plan === 'monthly') {
      setReturnDate(formatYMD(addDays(pDate, 30)));
    }
  };
  const handlePlanChange = setRentalType;
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [searchMapQuery, setSearchMapQuery] = useState('');
  const [selectedPinLocation, setSelectedPinLocation] = useState({
    name: pickupParam || 'Katpadi',
    address: 'Katpadi, Vellore, Tamil Nadu',
    lat: 12.9798,
    lng: 79.1375
  });

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      let found: any = null;

      // 1. Query Next.js internal API proxy / Express API
      try {
        let res = await fetch(`/api/rental/vehicles/${vehicleId}`).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`http://localhost:5000/api/rental/vehicles/${vehicleId}`).catch(() => null);
        }
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            const apiV = json.data;
            found = {
              id: apiV.id,
              name: apiV.name,
              brand: apiV.brand || apiV.name.split(' ')[0],
              model: apiV.model || apiV.name,
              category: apiV.category || 'Cruiser (350cc+)',
              price: Number(apiV.dailyRate || apiV.price || 1800),
              dailyRate: Number(apiV.dailyRate || apiV.price || 1800),
              hourlyRate: Number(apiV.hourlyRate || 150),
              monthlyRate: Number(apiV.monthlyRate || 32000),
              plate: apiV.plate || 'TN 23 VW 8415',
              fuel: apiV.fuel || 'Petrol',
              transmission: apiV.transmission || 'Automatic',
              seats: apiV.seats || '2-Seater',
              city: apiV.city || 'Katpadi',
              location: apiV.location || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India',
              image: (apiV.images && apiV.images[0]) || apiV.image || '/images/red_bike_3d.png',
              images: apiV.images && apiV.images.length > 0 ? apiV.images : [apiV.image || '/images/red_bike_3d.png'],
              badge: apiV.badge || 'AVAILABLE',
              isAvailable: true
            };
          }
        }
      } catch (e) { }

      // 2. Check local storage sart_business_fleet
      if (!found) {
        try {
          const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
          const localV = storedFleet.find((v: any) => v.id?.toLowerCase() === vehicleId.toLowerCase() || v.plate?.toLowerCase() === vehicleId.toLowerCase());
          if (localV) {
            found = {
              ...localV,
              price: Number(localV.dailyRate || localV.price || 1800),
              dailyRate: Number(localV.dailyRate || localV.price || 1800),
              badge: 'AVAILABLE'
            };
          }
        } catch (e) { }
      }

      // 3. Fallback to ALL_RENTAL_VEHICLES
      if (!found) {
        found = ALL_RENTAL_VEHICLES.find(
          (v) => v.id.toLowerCase() === vehicleId.toLowerCase() || v.name.toLowerCase().includes(vehicleId.toLowerCase())
        );
      }

      // 4. Default fallback matching Bike Fleet (HONDA 2-WHEELERS SHINE 125 XZ+)
      if (!found) {
        found = {
          id: vehicleId,
          name: 'HONDA 2-WHEELERS SHINE 125 XZ+',
          category: 'Commuter (125cc)',
          price: 1800,
          dailyRate: 1800,
          hourlyRate: 150,
          monthlyRate: 32000,
          badge: 'Verified Owner',
          fuel: 'Petrol',
          transmission: 'Manual',
          seats: '2-Seater',
          plate: 'TN 23 VW 8415',
          city: 'Katpadi',
          location: 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India',
          image: '/images/red_bike_3d.png',
          images: [
            '/images/red_bike_3d.png'
          ],
          isAvailable: true
        };
      }

      setVehicle(found);
    };

    fetchVehicleDetails();
  }, [vehicleId, pickupParam]);

  if (!vehicle) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Loading vehicle details...</p>
      </div>
    );
  }

  // Dynamic Price & Duration calculation based on days and hours
  const calculateDurationAndPrice = () => {
    const dailyRate = vehicle?.dailyRate || vehicle?.price || 1800;
    const hourlyRate = vehicle?.hourlyRate || Math.round(dailyRate / 10) || 150;

    let pt = pickupTime || '10:00';
    if (pt.length === 5) pt += ':00';
    let rt = returnTime || '10:00';
    if (rt.length === 5) rt += ':00';

    const start = new Date(`${pickupDate}T${pt}`);
    const end = new Date(`${returnDate}T${rt}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return {
        totalHours: 24,
        days: 1,
        extraHours: 0,
        durationLabel: '1 day',
        rentalBase: dailyRate
      };
    }

    const diffMs = end.getTime() - start.getTime();
    const totalHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
    const days = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;

    let durationLabel = '';
    let rentalBase = 0;

    if (rentalType === 'weekly' && days === 7 && extraHours === 0) {
      durationLabel = '7 days';
      rentalBase = Math.round(dailyRate * 7 * 0.85); // 15% weekly discount
    } else if (rentalType === 'monthly' && days >= 28) {
      durationLabel = `${days} days`;
      rentalBase = (vehicle as any)?.monthlyRate || Math.round(dailyRate * 30 * 0.65);
    } else if (days === 0) {
      durationLabel = `${extraHours} ${extraHours === 1 ? 'hour' : 'hours'}`;
      rentalBase = Math.max(extraHours * hourlyRate, Math.round(dailyRate * 0.4));
    } else if (extraHours === 0) {
      durationLabel = `${days} ${days === 1 ? 'day' : 'days'}`;
      rentalBase = days * dailyRate;
    } else {
      durationLabel = `${days} ${days === 1 ? 'day' : 'days'} ${extraHours} ${extraHours === 1 ? 'hr' : 'hrs'}`;
      rentalBase = days * dailyRate + extraHours * hourlyRate;
    }

    return { totalHours, days, extraHours, durationLabel, rentalBase };
  };

  const { durationLabel, rentalBase } = calculateDurationAndPrice();
  const securityDeposit = 5000;
  const fastagToll = 500;
  const deliveryCharges = deliveryType === 'delivery' ? 1000 : 0;
  const totalFare = rentalBase + securityDeposit + fastagToll + deliveryCharges;
  const cgst = Number(((rentalBase * 0.0528888) / 2).toFixed(2));
  const sgst = cgst;

  const ownerHubLocation = vehicle.location || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India';

  const handleSendOtp = () => {
    setOtpSent(true);
    alert(`OTP sent to WhatsApp: +91 ${whatsappNumber}`);
  };

  const handleContinueToReview = () => {
    const finalPickupLocation = deliveryType === 'delivery'
      ? (userCustomLocation.trim() || deliveryAddress.trim() || 'User Selected Address')
      : ownerHubLocation;

    const q = new URLSearchParams({
      id: vehicle.id,
      pickup: finalPickupLocation,
      origin: finalPickupLocation,
      ownerLocation: ownerHubLocation,
      distance: (vehicle as any)?.distance || '1.2 km from your location',
      deliveryType,
      deliveryFee: String(deliveryCharges),
      name: fullName,
      phone: whatsappNumber,
      email,
      duration: durationLabel,
      totalFare: String(totalFare),
      rentalBase: String(rentalBase),
      pickupDate,
      pickupTime,
      returnDate,
      returnTime
    });

    router.push(`/home/rental/Bike/BookingDeliveryDetails/ReviewJourney?${q.toString()}`);
  };

  const handleConfirmLocationFromMap = (loc: { name: string; address: string; lat?: number; lng?: number }) => {
    const locText = loc.address || loc.name;
    setUserCustomLocation(locText);
    setDeliveryAddress(locText);
    setDeliveryType('delivery');
    setIsMapModalOpen(false);
  };

  return (
    <div style={{
      maxWidth: '1440px',
      width: '100%',
      margin: '20px auto',
      padding: '0 12px 60px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box'
    }}>

      {/* TOP BREADCRUMBS PROGRESS HEADER (MATCHING EXACT 1 IMAGE) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* Step 1: Details (Active Orange) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#2A1373',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '15px',
            boxShadow: '0 0 0 5px rgba(12, 23, 234, 0.22)'
          }}>
            1
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Details</span>
        </div>

        {/* Divider 1 */}
        <div style={{ width: '80px', height: '2px', background: '#e2e8f0', marginTop: '-24px' }}></div>

        {/* Step 2: Review Journey */}
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
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Review Journey</span>
        </div>

        {/* Divider 2 */}
        <div style={{ width: '80px', height: '2px', background: '#e2e8f0', marginTop: '-24px' }}></div>

        {/* Step 3: Confirm & pay */}
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
        gridTemplateColumns: '1.85fr 1fr',
        gap: '16px',
        alignItems: 'start'
      }}>

        {/* LEFT COLUMN: BOOKING & DELIVERY DETAILS FORM CARD */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}>

          {/* Section Title with Truck Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16.5px', fontWeight: 800, color: '#0f172a' }}>
            <i className="fa-solid fa-truck" style={{ color: '#0f172a', fontSize: '16px' }}></i>
            <span>Booking & Delivery Details</span>
          </div>

          {/* 1. RENTAL DURATION & DATES */}
          <div>
            <div className="w-full max-w-4xl font-sans p-4 bg-white">
              {/* Segmented Rental Type Tabs */}
              <div className="flex items-center justify-between p-1 rounded-xl bg-[#F8F6F1] border border-[#EBE7DF] mb-5">
                <button
                  type="button"
                  onClick={() => setRentalType('daily')}
                  className={`flex-1 text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${rentalType === 'daily'
                    ? 'bg-[#181A20] text-white shadow-sm'
                    : 'text-[#1E293B] hover:text-black'
                    }`}
                >
                  Daily rental
                </button>
                <button
                  type="button"
                  onClick={() => setRentalType('weekly')}
                  className={`flex-1 text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${rentalType === 'weekly'
                    ? 'bg-[#181A20] text-white shadow-sm'
                    : 'text-[#1E293B] hover:text-black'
                    }`}
                >
                  Weekly rental
                </button>
                <button
                  type="button"
                  onClick={() => setRentalType('monthly')}
                  className={`flex-1 text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${rentalType === 'monthly'
                    ? 'bg-[#181A20] text-white shadow-sm'
                    : 'text-[#1E293B] hover:text-black'
                    }`}
                >
                  Monthly
                </button>
              </div>

              {/* Date & Time Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Date & Time */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#5A6478] uppercase mb-1.5">
                    Pickup Date & Time
                  </label>
                  <div className="flex gap-2">
                    {/* Date Input */}
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        onClick={(e) => (e.target as any).showPicker?.()}
                        placeholder="dd-mm-yyyy"
                        className="w-full bg-[#FAF8F5] border border-[#E4E0D6] rounded-xl py-3 pl-4 pr-10 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none cursor-pointer"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B] pointer-events-none" />
                    </div>
                    {/* Time Input */}
                    <div className="relative flex-1">
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        onClick={(e) => (e.target as any).showPicker?.()}
                        step="1"
                        placeholder="-- : -- : --"
                        className="w-full bg-[#FAF8F5] border border-[#E4E0D6] rounded-xl py-3 pl-4 pr-10 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none cursor-pointer"
                      />
                      <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Return Date & Time */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#5A6478] uppercase mb-1.5">
                    Return Date & Time
                  </label>
                  <div className="flex gap-2">
                    {/* Date Input */}
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        onClick={(e) => (e.target as any).showPicker?.()}
                        placeholder="dd-mm-yyyy"
                        className="w-full bg-[#FAF8F5] border border-[#E4E0D6] rounded-xl py-3 pl-4 pr-10 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none cursor-pointer"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B] pointer-events-none" />
                    </div>
                    {/* Time Input */}
                    <div className="relative flex-1">
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        onClick={(e) => (e.target as any).showPicker?.()}
                        step="1"
                        placeholder="-- : -- : --"
                        className="w-full bg-[#FAF8F5] border border-[#E4E0D6] rounded-xl py-3 pl-4 pr-10 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none cursor-pointer"
                      />
                      <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* 2. FULL NAME & WHATSAPP NUMBER */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
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
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                WHATSAPP NUMBER
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  height: '46px',
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
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '13.5px',
                      color: '#0f172a',
                      width: '100%'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0 18px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                Can't receive WhatsApp? <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Verify by email instead</span>
              </div>
            </div>
          </div>

          {/* 3. EMAIL */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="fullname@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
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

          {/* 4. LOCATION & PICKUP ADDRESS SELECTOR */}
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
                LOCATION & PICKUP ADDRESS *
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                Choose where to collect the vehicle
              </span>
            </div>

            {/* 2 Choice Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeliveryType('hub')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: deliveryType === 'hub' ? '2px solid #3b82f6' : '1.5px solid #cbd5e1',
                  background: deliveryType === 'hub' ? '#eff6ff' : '#ffffff',
                  color: deliveryType === 'hub' ? '#1d4ed8' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Collect at Owner's Hub</span>
                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>
                    FREE (₹0)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                  Go directly to the owner's hub to pick up the vehicle yourself.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: deliveryType === 'delivery' ? '2px solid #ea580c' : '1.5px solid #cbd5e1',
                  background: deliveryType === 'delivery' ? '#fff7ed' : '#ffffff',
                  color: deliveryType === 'delivery' ? '#c2410c' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Deliver to My Location</span>
                  <span style={{ fontSize: '11px', background: '#ffedd5', color: '#9a3412', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>
                    +₹1,000 Extra
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                  Owner will drive the vehicle from hub to your specified address.
                </p>
              </button>
            </div>

            {/* Input Row with Blue Pin & Select on Map button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              padding: '6px 8px 6px 14px'
            }}>
              <div style={{ color: '#2563eb', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                <i className="fa-solid fa-location-dot"></i>
              </div>

              <input
                type="text"
                value={deliveryType === 'hub' ? ownerHubLocation : (userCustomLocation || deliveryAddress || pickupParam)}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserCustomLocation(val);
                  setDeliveryAddress(val);
                }}
                readOnly={deliveryType === 'hub'}
                placeholder={deliveryType === 'hub' ? ownerHubLocation : 'Enter delivery address or select on map...'}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  flex: 1,
                  textOverflow: 'ellipsis'
                }}
              />

              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="fa-solid fa-location-crosshairs" style={{ color: '#ef4444' }}></i>
                <span>Select on Map</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: VEHICLE HEADER CARD + CHARGES SUMMARY + PROCEED ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* CARD 1: Vehicle Preview Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '90px',
              height: '68px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              flexShrink: 0
            }}>
              <img
                src={vehicle.image || (vehicle.images && vehicle.images[0]) || '/images/red_bike_3d.png'}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e: any) => { e.target.src = '/images/red_bike_3d.png'; }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                {vehicle.name}
              </h3>
              <div style={{ marginTop: '4px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#16a34a',
                  background: '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }}></span>
                  Verified Owner
                </span>
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                ₹{rentalBase.toLocaleString()} total ({durationLabel})
              </div>
            </div>
          </div>

          {/* CARD 2: Charges Summary Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px 24px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 800, color: '#0f172a' }}>
              Charges Summary
            </h3>

            {/* Base Rental */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Rental ({durationLabel})</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Incl. GST: ₹{cgst.toFixed(2)} CGST + ₹{sgst.toFixed(2)} SGST
                </div>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                ₹ {rentalBase.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Security Deposit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                Security deposit (refundable)
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                ₹ {securityDeposit.toLocaleString()}.00
              </span>
            </div>

            {/* Fastag / Toll */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Fastag / toll</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Estimate — unused balance refunded after your trip
                </div>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                ₹ {fastagToll.toLocaleString()}.00
              </span>
            </div>

            {/* Delivery Charges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                  Delivery ({deliveryType === 'delivery' ? 'Doorstep to Address' : 'Self-Pickup at Hub'})
                </div>
                <div style={{ fontSize: '11px', color: deliveryType === 'delivery' ? '#ea580c' : '#16a34a', fontWeight: 600 }}>
                  {deliveryType === 'delivery' ? 'Two-way hub transit' : 'FREE pickup from owner location'}
                </div>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: deliveryType === 'delivery' ? '#0f172a' : '#16a34a' }}>
                {deliveryType === 'delivery' ? `₹ ${deliveryCharges.toLocaleString()}.00` : '₹ 0.00'}
              </span>
            </div>

            {/* Dark Total Fare Bar */}
            <div style={{
              background: '#1e1b4b',
              borderRadius: '8px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              marginTop: '4px'
            }}>
              <span style={{ fontSize: '14.5px', fontWeight: 700 }}>Total Fare</span>
              <span style={{ fontSize: '17px', fontWeight: 900 }}>
                ₹ {totalFare.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment Notice Callout */}
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
              No payment is collected here — our team will call you shortly to confirm your booking, collect a partial advance to confirm, and the rest at delivery.
            </span>
          </div>

          {/* Bottom Actions: Back | Continue Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                width: '100px',
                padding: '12px 18px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleContinueToReview}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#2A1373',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(58, 53, 162, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Continue →
            </button>
          </div>

        </div>

      </div>

      {/* GOOGLE MAPS PICKER MODAL (MATCHING IMAGE 1) */}
      <GoogleMapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={(address) => {
          setUserCustomLocation(address);
          setDeliveryAddress(address);
          setDeliveryType('delivery');
        }}
        initialAddress={deliveryAddress || pickupParam || 'Velachery, Chennai, Tamil Nadu'}
      />

    </div>
  );
}

export default function BikeBookingDeliveryDetailsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1, paddingTop: '10px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading...</div>}>
          <BookingDeliveryDetailsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
