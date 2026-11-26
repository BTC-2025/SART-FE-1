'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import '@/app/home/rental/Car/CarDetails/DriverDetails/ReviewDetails/page.css';
import { ALL_RENTAL_VEHICLES, RentalVehicle } from '@/components/rental/rentalData';

function ReviewJourneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = searchParams.get('id') || searchParams.get('vehicleId') || 'r-activa';

  // Dynamic User Parameters passed from prior steps or localStorage
  const pickup = searchParams.get('pickup') || searchParams.get('origin') || 'Katpadi';
  const ownerLocationParam = searchParams.get('ownerLocation') || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India';
  const distanceParam = searchParams.get('distance') || '1.2 km from your location';
  const deliveryTypeParam = searchParams.get('deliveryType') || 'hub';
  const [pickupMode, setPickupMode] = useState<'hub' | 'delivery'>(deliveryTypeParam === 'delivery' ? 'delivery' : 'hub');

  const pickupDateRaw = searchParams.get('pickupDate');
  const pickupTimeRaw = searchParams.get('pickupTime');
  const returnDateRaw = searchParams.get('returnDate');
  const returnTimeRaw = searchParams.get('returnTime');

  const pickupTimeParam = pickupDateRaw && pickupTimeRaw
    ? `${pickupDateRaw} • ${pickupTimeRaw}`
    : searchParams.get('pickupTime') || 'Thu, 19 Nov • 10:00 AM';

  const returnTimeParam = returnDateRaw && returnTimeRaw
    ? `${returnDateRaw} • ${returnTimeRaw}`
    : searchParams.get('returnTime') || 'Fri, 20 Nov • 10:00 AM';

  const rentalDuration = searchParams.get('duration') || '1 Day (24 hrs)';

  const customerName = searchParams.get('name') || '';
  const customerAge = searchParams.get('age') || '';
  const customerPhone = searchParams.get('phone') || '+91 ';
  const customerEmail = searchParams.get('email') || '';

  const [vehicle, setVehicle] = useState<RentalVehicle | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // GPS State for Mini Map
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => { },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      let found: any = ALL_RENTAL_VEHICLES.find(
        (v) => v.id.toLowerCase() === vehicleId.toLowerCase() || v.name.toLowerCase().includes(vehicleId.toLowerCase())
      );

      if (!found || vehicleId.startsWith('VH-')) {
        try {
          let res = await fetch(`http://localhost:5000/api/rental/vehicles/${vehicleId}`).catch(() => null);
          if (!res || !res.ok) {
            res = await fetch(`http://localhost:5000/api/business/vehicles/${vehicleId}`).catch(() => null);
          }
          if (res && res.ok) {
            const json = await res.json();
            if (json && json.success && json.data) {
              const apiV = json.data;
              found = {
                id: apiV.id,
                name: apiV.name,
                icon: 'fa-motorcycle',
                color: '#1e293b',
                price: Number(apiV.dailyRate || apiV.price || 1800),
                hourlyRate: Number(apiV.hourlyRate || 150),
                category: apiV.category || 'Cruiser (350cc+)',
                seats: apiV.seats || '2-Seater',
                transmission: apiV.transmission || 'Automatic',
                fuel: apiV.fuel || 'Petrol',
                year: Number(apiV.year || 2024),
                kms: apiV.kms || '500 Kms Included',
                distance: apiV.distance || '1.2 km from your location',
                image: (apiV.images && apiV.images[0]) || apiV.image || '/images/red_bike_3d.png',
                images: apiV.images && apiV.images.length > 0 ? apiV.images : [apiV.image || '/images/red_bike_3d.png'],
                badge: apiV.badge || 'AVAILABLE',
                city: apiV.city || 'Katpadi',
                location: apiV.location || 'Katpadi, Vellore',
                ownerLocation: apiV.ownerLocation || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India',
                plate: apiV.plate || 'TN 23 VW 8415',
                ownerName: apiV.ownerName || 'Official SART Business',
                ownerPhone: apiV.ownerPhone || '+91 98765 43210',
                isAvailable: true
              };
            }
          }
        } catch (e) { }
      }

      if (!found) {
        try {
          const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
          const localV = storedFleet.find((v: any) => v.id.toLowerCase() === vehicleId.toLowerCase() || v.plate?.toLowerCase() === vehicleId.toLowerCase());
          if (localV) {
            found = {
              id: localV.id,
              name: localV.name,
              icon: 'fa-motorcycle',
              color: '#1e293b',
              price: Number(localV.dailyRate || localV.price || 1800),
              hourlyRate: Number(localV.hourlyRate || 150),
              category: localV.category || 'Cruiser (350cc+)',
              seats: localV.seats || '2-Seater',
              transmission: localV.transmission || 'Automatic',
              fuel: localV.fuel || 'Petrol',
              year: Number(localV.year || 2024),
              kms: localV.kms || '500 Kms Included',
              distance: localV.distance || '1.2 km from your location',
              image: (localV.images && localV.images[0]) || localV.image || '/images/red_bike_3d.png',
              images: localV.images && localV.images.length > 0 ? localV.images : [localV.image || '/images/red_bike_3d.png'],
              badge: localV.badge || 'AVAILABLE',
              city: localV.city || 'Katpadi',
              location: localV.location || 'Katpadi, Vellore',
              ownerLocation: localV.ownerLocation || 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India',
              plate: localV.plate || 'TN 23 VW 8415',
              ownerName: localV.ownerName || 'Official SART Business',
              ownerPhone: localV.ownerPhone || '+91 98765 43210',
              isAvailable: true
            };
          }
        } catch (e) { }
      }

      if (!found) {
        found = {
          id: vehicleId,
          name: 'TVS APACHE RTR 160/200 XZ+',
          price: 1800,
          dailyRate: 1800,
          hourlyRate: 150,
          year: 2024,
          transmission: 'Automatic',
          fuel: 'Petrol',
          seats: '2-Seater',
          plate: 'TN 23 VW 8415',
          distance: '1.2 km from your location',
          location: 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India',
          ownerLocation: 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India',
          image: '/images/red_bike_3d.png',
          images: ['/images/red_bike_3d.png'],
          isAvailable: true
        };
      }
      setVehicle(found);
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  // Calculate dynamic duration, days count, and base rental price based on dates/times & rentalBase passed from step 1
  const calculateDurationAndPrice = () => {
    // If rentalBase was explicitly passed from step 1, use it
    const passedRentalBase = searchParams.get('rentalBase') ? Number(searchParams.get('rentalBase')) : null;
    const passedDuration = searchParams.get('duration');

    const pt = pickupTimeRaw || (pickupTimeParam.includes('•') ? pickupTimeParam.split('•')[1]?.trim() : '10:00');
    const rt = returnTimeRaw || (returnTimeParam.includes('•') ? returnTimeParam.split('•')[1]?.trim() : '10:00');
    const pDate = pickupDateRaw || (pickupTimeParam.includes('•') ? pickupTimeParam.split('•')[0]?.trim() : '');
    const rDate = returnDateRaw || (returnTimeParam.includes('•') ? returnTimeParam.split('•')[0]?.trim() : '');

    const dailyRate = Number(vehicle?.dailyRate || vehicle?.price || 1800);
    const hourlyRate = Number(vehicle?.hourlyRate || 150);

    let days = 1;
    let durationLabel = passedDuration || '1 Day (24 hrs)';
    let computedBase = passedRentalBase || dailyRate;

    if (pDate && rDate) {
      const start = new Date(`${pDate}T${pt.length === 5 ? pt : '10:00'}`);
      const end = new Date(`${rDate}T${rt.length === 5 ? rt : '10:00'}`);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        const diffMs = end.getTime() - start.getTime();
        const totalHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
        days = Math.max(1, Math.ceil(totalHours / 24));
        const extraHours = totalHours % 24;

        if (days === 7 && extraHours === 0) {
          durationLabel = '7 Days (1 Week)';
          computedBase = passedRentalBase || Math.round(dailyRate * 7 * 0.85);
        } else if (days >= 28) {
          durationLabel = `${days} Days (~1 Month)`;
          computedBase = passedRentalBase || (vehicle as any)?.monthlyRate || Math.round(dailyRate * days * 0.65);
        } else if (days === 1) {
          durationLabel = '1 Day (24 hrs)';
          computedBase = passedRentalBase || dailyRate;
        } else {
          durationLabel = `${days} Days`;
          computedBase = passedRentalBase || (days * dailyRate);
        }
      }
    }

    return { days, durationLabel, rentalBase: computedBase };
  };

  const { days: rentalDays, durationLabel: dynamicDuration, rentalBase: dynamicBaseRate } = calculateDurationAndPrice();

  // Pricing matching requirements
  const baseRate = dynamicBaseRate;
  const taxes = Math.round(baseRate * 0.18);
  const securityDeposit = 5000;
  const deliveryCharge = pickupMode === 'delivery' ? 1000 : 0;
  const totalPayable = baseRate + taxes + securityDeposit + deliveryCharge;

  const vehicleImage = (vehicle?.images && vehicle.images[0]) || vehicle?.image || '/images/red_bike_3d.png';
  const ownerHubAddress = (vehicle as any)?.ownerLocation || vehicle?.location || ownerLocationParam;

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);

    const generatedId = `BK-${Date.now().toString().slice(-6)}`;
    setBookingId(generatedId);

    const bookingPayload = {
      bookingId: generatedId,
      vehicleId: vehicle?.id || 'r-activa',
      vehicleName: vehicle?.name || 'TVS APACHE RTR 160/200 XZ+',
      vehicleImage,
      customerName,
      customerPhone,
      customerAge,
      customerEmail,
      pickupLocation: pickup,
      returnLocation: pickup,
      pickupMode,
      ownerLocation: ownerHubAddress,
      pickupDate: pickupTimeParam.split('•')[0]?.trim() || 'Thu, 19 Nov',
      pickupTime: pickupTimeParam.split('•')[1]?.trim() || '10:00 AM',
      returnDate: returnTimeParam.split('•')[0]?.trim() || 'Fri, 20 Nov',
      returnTime: returnTimeParam.split('•')[1]?.trim() || '10:00 AM',
      durationPlan: rentalDuration,
      baseRate,
      taxAmount: taxes,
      securityDeposit,
      deliveryCharge,
      totalAmount: totalPayable,
      status: 'Confirmed'
    };

    try {
      // 1. Post to User Backend BE-1 (Port 5000)
      await fetch('http://localhost:5000/api/rental/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      }).catch(() => null);

      // Save booking in sart_business_bookings
      try {
        const existingBookings = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
        const newBookingRecord = {
          ...bookingPayload,
          id: generatedId,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('sart_business_bookings', JSON.stringify([newBookingRecord, ...existingBookings]));
        window.dispatchEvent(new CustomEvent('new_booking_created', { detail: newBookingRecord }));
      } catch (e) { }

      // 2. Mark vehicle as booked & on trip in local storage
      const targetId = vehicle?.id || 'r-activa';
      const targetPlate = vehicle?.plate;
      const targetName = vehicle?.name;

      const bookedIds = JSON.parse(localStorage.getItem('sart_booked_vehicle_ids') || '[]');
      if (!bookedIds.includes(targetId)) bookedIds.push(targetId);
      if (targetPlate && !bookedIds.includes(targetPlate)) bookedIds.push(targetPlate);
      if (targetName && !bookedIds.includes(targetName)) bookedIds.push(targetName);
      localStorage.setItem('sart_booked_vehicle_ids', JSON.stringify(bookedIds));

      const onTripIds = JSON.parse(localStorage.getItem('sart_ontrip_vehicle_ids') || '[]');
      if (!onTripIds.includes(targetId)) onTripIds.push(targetId);
      if (targetPlate && !onTripIds.includes(targetPlate)) onTripIds.push(targetPlate);
      if (targetName && !onTripIds.includes(targetName)) onTripIds.push(targetName);
      localStorage.setItem('sart_ontrip_vehicle_ids', JSON.stringify(onTripIds));

      const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
      const updatedFleet = storedFleet.map((v: any) => (v.id === targetId || v.plate === targetPlate) ? {
        ...v,
        isAvailable: false,
        status: 'On Trip',
        bookingStatus: 'ALREADY_BOOKED'
      } : v);
      localStorage.setItem('sart_business_fleet', JSON.stringify(updatedFleet));

      window.dispatchEvent(new CustomEvent('rental_vehicle_booked', {
        detail: { id: targetId, plate: targetPlate, name: targetName }
      }));
    } catch (e) { }

    setTimeout(() => {
      setIsProcessing(false);
      // Store full payment context in sessionStorage to avoid HTTP 431 URL header overflow
      const paymentContext = {
        bookingId: generatedId,
        vehicleId: vehicle?.id || 'r-activa',
        vehicleName: vehicle?.name || 'TVS APACHE RTR 160/200 XZ+',
        vehicleImage: vehicleImage.startsWith('data:') ? '/images/red_bike_3d.png' : vehicleImage,
        pickup,
        ownerLocation: ownerHubAddress,
        pickupDate: pickupDateRaw || pickupTimeParam.split('•')[0]?.trim() || '26-11-2026',
        pickupTime: pickupTimeRaw || pickupTimeParam.split('•')[1]?.trim() || '10:00 AM',
        returnDate: returnDateRaw || returnTimeParam.split('•')[0]?.trim() || '27-11-2026',
        returnTime: returnTimeRaw || returnTimeParam.split('•')[1]?.trim() || '10:00 AM',
        customerName,
        customerPhone,
        customerEmail,
        customerAge,
        duration: dynamicDuration,
        baseRate,
        taxAmount: taxes,
        securityDeposit,
        deliveryCharge,
        totalAmount: totalPayable
      };

      try {
        sessionStorage.setItem('sart_rental_payment_data', JSON.stringify(paymentContext));
      } catch (e) { }

      // Navigate to Payment page
      window.location.href = '/home/rental/Bike/BookingDeliveryDetails/ReviewJourney/Payment';
    }, 400);
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '30px auto', padding: '0 20px 80px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

      {/* 3-STEP BREADCRUMBS PROGRESS HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '36px'
      }}>
        {/* Step 1: Booking Details */}
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

        {/* Step 2: Review Journey (ACTIVE with glow/ring) */}
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
            boxShadow: '0 0 0 5px rgba(57, 30, 138, 0.25)'
          }}>
            2
          </div>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Review Journey</span>
        </div>

        {/* Divider 2 */}
        <div style={{ width: '70px', height: '2px', background: '#e2e8f0', marginTop: '-24px' }}></div>

        {/* Step 3: Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f1f5f9',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            3
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>Payment</span>
        </div>
      </div>

      {!isConfirmed ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* ================= LEFT COLUMN ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Card 1: Vehicle & Trip Summary */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Vehicle & Trip Summary
              </div>

              {/* Title, Badge & Total Price Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px' }}>
                    {vehicle?.name || 'TVS APACHE RTR 160/200 XZ+'}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#16a34a',
                    background: '#ecfdf5',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{ fontSize: '8px' }}>●</span> AVAILABLE
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  ₹{baseRate.toLocaleString()} total ({dynamicDuration})
                </div>
              </div>

              {/* Middle Section: Vehicle Thumbnail + From / Return dates */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '4px 0' }}>
                {/* Vehicle Thumbnail Box */}
                <div style={{
                  width: '90px',
                  height: '68px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  flexShrink: 0
                }}>
                  <img
                    src={vehicleImage}
                    alt={vehicle?.name || 'Vehicle'}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e: any) => { e.target.src = '/images/red_bike_3d.png'; }}
                  />
                </div>

                {/* Journey Timeline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.4px', marginBottom: '3px' }}>
                      FROM (PICKUP)
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      {pickupTimeParam}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '0 4px'
                  }}>
                    <span>—</span>
                    <span>{dynamicDuration}</span>
                    <span>—</span>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.4px', marginBottom: '3px' }}>
                      TO (RETURN)
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      {returnTimeParam}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9' }} />

              {/* Pickup Mode & Hub Location Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Pickup Mode:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    {pickupMode === 'hub' ? "Collect at Owner's Hub (FREE ₹0)" : "Deliver to My Location (+₹1,000)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickupMode(pickupMode === 'hub' ? 'delivery' : 'hub')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      marginLeft: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    Change
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.45 }}>
                  <span style={{ color: '#475569', fontWeight: 500, flexShrink: 0 }}>Owner Hub Location:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {ownerHubAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: User & Verification Details */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  User & Verification Details
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ fontSize: '8px' }}>●</span> Required for Handover
                </span>
              </div>

              {/* 3-Column Inputs: Full Name | Age | Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.4fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Full Name (As per Govt ID)
                  </label>
                  <input
                    type="text"
                    defaultValue={customerName}
                    placeholder="Enter full name"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    defaultValue={customerAge}
                    placeholder="Age"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={customerEmail}
                    placeholder="fullname@email.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* WhatsApp / Mobile Number */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  WhatsApp / Mobile Number
                </label>
                <div style={{ display: 'flex', gap: '10px', maxWidth: '420px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      borderRight: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155'
                    }}>
                      <span>🇮🇳</span>
                      <span>IN</span>
                      <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#94a3b8' }}></i>
                    </div>
                    <input
                      type="text"
                      defaultValue={customerPhone || "+91 "}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        padding: '10px 12px',
                        fontSize: '13.5px',
                        color: '#0f172a',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    style={{
                      background: '#1e1b4b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {/* Warning Notice Banner */}
              <div style={{
                background: '#fffdf0',
                border: '1px solid #fef08a',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '11.5px',
                color: '#854d0e',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                lineHeight: 1.45
              }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '2px', fontSize: '13px', color: '#d97706' }}></i>
                <span>
                  <strong>Mandatory Original Copy Notice:</strong> When taking delivery of the vehicle, you must submit and physically verify the original physical copy of your Driving License / Aadhaar / PAN card to the vehicle owner or hub representative.
                </span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Card 1: Interactive Mini Map */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{
                width: '100%',
                height: '180px',
                position: 'relative'
              }}>
                <iframe
                  title="Live GPS Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${currentLocation
                    ? `${currentLocation.lat},${currentLocation.lng}`
                    : encodeURIComponent(ownerHubAddress)
                    }&z=16&output=embed`}
                />

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ownerHubAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ffffff',
                    color: '#2563eb',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                  }}
                >
                  Open in Google Maps ↗
                </a>

                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  color: '#ffffff',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }} />
                  <span>GPS CONNECTED</span>
                </div>
              </div>
            </div>

            {/* Card 2: Technical Specifications */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Technical Specifications
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '14px', columnGap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Model Year</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.year || '2024'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Transmission</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.transmission || 'Automatic'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Fuel Type</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.fuel || 'Petrol'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Capacity</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.seats || '2-Seater'}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Charges Summary */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                Charges Summary
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Base Rate ({dynamicDuration})</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {baseRate.toLocaleString()}.00</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Taxes & Insurance (18%)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {taxes.toLocaleString()}.00</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Security Deposit (Refundable)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {securityDeposit.toLocaleString()}.00</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>
                  {pickupMode === 'hub' ? 'Self-Pickup at Owner Hub' : 'Doorstep Delivery'}
                </span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {pickupMode === 'hub' ? 'FREE (₹0.00)' : `₹ ${deliveryCharge.toLocaleString()}.00`}
                </span>
              </div>

              {/* Total Payable Dark Bar */}
              <div style={{
                background: '#111827',
                borderRadius: '8px',
                padding: '14px 18px',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff'
              }}>
                <span style={{ fontSize: '14.5px', fontWeight: 700 }}>Total Payable</span>
                <span style={{ fontSize: '18px', fontWeight: 900 }}>₹ {totalPayable.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Bottom Actions Row: Back & Confirm & Pay */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  width: '100px',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
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
                onClick={handleConfirmAndPay}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#391e8a',
                  color: '#ffffff',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(57, 30, 138, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing Payment...
                  </>
                ) : (
                  <>Confirm & Pay →</>
                )}
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* Confirmation State */
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '48px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 40px rgba(15, 23, 42, 0.06)'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            <i className="fa-solid fa-check"></i>
          </div>

          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
            Booking Confirmed Successfully!
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b', maxWidth: '440px' }}>
            Your self-drive bike rental reservation has been dispatched to the business owner and hub manager.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 28px',
            display: 'flex',
            gap: '24px',
            margin: '12px 0'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>BOOKING ID</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{bookingId}</div>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>LOCATION</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{pickup}</div>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>TOTAL PAID</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>₹{totalPayable.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BikeReviewJourneyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading review details...</div>}>
          <ReviewJourneyContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
