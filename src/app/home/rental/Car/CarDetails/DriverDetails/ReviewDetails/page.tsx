'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import './page.css';
import { ALL_RENTAL_VEHICLES, RentalVehicle } from '@/components/rental/rentalData';

function ReviewDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = searchParams.get('id') || searchParams.get('vehicleId') || 'r-verna';

  // Dynamic User Parameters passed from prior steps or localStorage
  const pickup = searchParams.get('pickup') || searchParams.get('origin') || 'Truro';
  const pickupTimeParam = searchParams.get('pickupTime') || 'Thu, 19 Nov • 10:00 AM';
  const returnTimeParam = searchParams.get('returnTime') || 'Fri, 20 Nov • 10:00 AM';
  const rentalDuration = searchParams.get('duration') || '1 Day';

  const customerName = searchParams.get('name') || 'sai';
  const customerAge = searchParams.get('age') || '26';
  const customerPhone = searchParams.get('phone') || '+91 98765 43210';
  const docType = searchParams.get('docType') || 'dl';
  const docNumber = searchParams.get('docNumber') || 'DL-04-2023-0091823';
  const uploadedDocName = searchParams.get('docName') || 'driving_license_front.jpg';

  const [vehicle, setVehicle] = useState<RentalVehicle | null>(null);
  const [selectedDocTab, setSelectedDocTab] = useState<'dl' | 'aadhaar' | 'pan'>(docType as any || 'dl');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

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
            res = await fetch(`http://localhost:5000/api/rental/vehicles/${vehicleId}`).catch(() => null);
          }
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
                icon: 'fa-car-rear',
                color: '#1e293b',
                price: Number(apiV.dailyRate || apiV.price || 1500),
                hourlyRate: Number(apiV.hourlyRate || 150),
                category: apiV.category || 'Sedan',
                seats: apiV.seats || '5 Seats',
                transmission: apiV.transmission || 'Manual',
                fuel: apiV.fuel || 'Petrol',
                year: Number(apiV.year || 2023),
                kms: apiV.kms || '500 Kms/day',
                distance: apiV.distance || '1.2 km',
                image: (apiV.images && apiV.images[0]) || apiV.image || '/images/cab_sedan.png',
                images: apiV.images && apiV.images.length > 0 ? apiV.images : [apiV.image || '/images/cab_sedan.png'],
                badge: apiV.badge || 'Top Choice',
                engine: apiV.engine || '1.2L K-Series DualJet',
                city: apiV.city || 'Katpadi',
                location: apiV.location || 'Katpadi, Vellore',
                plate: apiV.plate || 'TN 23 BK 4567',
                ownerName: apiV.ownerName || 'Vasanth Fleet Ops',
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
              icon: 'fa-car-rear',
              color: '#1e293b',
              price: Number(localV.dailyRate || localV.price || 1500),
              hourlyRate: Number(localV.hourlyRate || 150),
              category: localV.category || 'Sedan',
              seats: localV.seats || '5 Seats',
              transmission: localV.transmission || 'Manual',
              fuel: localV.fuel || 'Petrol',
              year: Number(localV.year || 2023),
              kms: localV.kms || '500 Kms/day',
              distance: localV.distance || '1.2 km',
              image: (localV.images && localV.images[0]) || localV.image || '/images/cab_sedan.png',
              images: localV.images && localV.images.length > 0 ? localV.images : [localV.image || '/images/cab_sedan.png'],
              badge: localV.badge || 'Available',
              engine: localV.engine || '1.2L K-Series DualJet',
              city: localV.city || 'Katpadi',
              location: localV.location || 'Katpadi, Vellore',
              plate: localV.plate || 'TN 23 BK 4567',
              ownerName: localV.ownerName || 'Vasanth Fleet Ops',
              ownerPhone: localV.ownerPhone || '+91 98765 43210',
              isAvailable: true
            };
          }
        } catch (e) { }
      }

      if (!found) {
        found = ALL_RENTAL_VEHICLES.find((v) => v.id === 'r-verna') || {
        };
      }
      setVehicle(found);
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  // Pricing matching Image 1: Base Rate ₹1,500, Tax ₹270, Total ₹1,770
  const baseRate = vehicle?.price || 1500;
  const taxes = Math.round(baseRate * 0.18);
  const totalPayable = baseRate + taxes;
  const vehicleDist = vehicle?.distance || '1.2 km';

  const galleryImages = (vehicle?.images && vehicle.images.length >= 3)
    ? vehicle.images.slice(0, 3)
    : (vehicle?.images && vehicle.images.length > 0)
      ? [vehicle.images[0], vehicle.images[1] || vehicle.images[0], vehicle.images[2] || vehicle.images[0]]
      : [
        vehicle?.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80'
      ];

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);

    const generatedId = `BK-${Date.now().toString().slice(-6)}`;
    setBookingId(generatedId);

    const bookingPayload = {
      bookingId: generatedId,
      vehicleId: vehicle?.id || 'r-verna',
      vehicleName: vehicle?.name || 'Self-Drive Vehicle',
      vehicleImage: vehicle?.image || (vehicle?.images && vehicle.images[0]) || '/images/cab_sedan.png',
      customerName,
      customerPhone,
      customerAge,
      docType: selectedDocTab,
      docNumber,
      pickupLocation: pickup,
      returnLocation: pickup,
      pickupDate: pickupTimeParam.split('•')[0]?.trim() || 'Thu, 19 Nov',
      pickupTime: pickupTimeParam.split('•')[1]?.trim() || '10:00 AM',
      returnDate: returnTimeParam.split('•')[0]?.trim() || 'Fri, 20 Nov',
      returnTime: returnTimeParam.split('•')[1]?.trim() || '10:00 AM',
      durationPlan: rentalDuration,
      baseRate,
      taxAmount: taxes,
      totalAmount: totalPayable,
      status: 'Confirmed'
    };

    try {
      // 1. Post to User Backend BE-1 (Port 5000)
      const res = await fetch('http://localhost:5000/api/rental/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setConfirmedBooking(json.data);
        }
      }

      // 2. Post to Business Backend BE-2 (Port 5001)
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

      // 3. Mark vehicle as booked & on trip in local storage & dispatch events
      const targetId = vehicle?.id || 'r-verna';
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
    } catch (e) {
      // network fallback
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '24px auto', padding: '0 24px 60px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => router.back()}
          type="button"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
          Booking Summary
        </h1>
      </div>

      {!isConfirmed ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Vehicle Card + Schedule + Fare + Driver Verification Form (Image 1 UI) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Main Booking Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              {/* 3 Car Images Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: '140px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Car preview ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>

              {/* Dots indicator */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '-6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }}></span>
              </div>

              {/* Schedule Breakdown Row Matching Image 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Pickup Location</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{pickup}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Pick-up Time</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{pickupTimeParam}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Return Time</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{returnTimeParam}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Vehicle Distance</span>
                  <span style={{ fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-route" style={{ fontSize: '12px' }}></i> {vehicleDist}
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9' }} />

              {/* Fare Breakdown Row Matching Image 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Rental Duration</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{rentalDuration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Base Rate (₹{baseRate.toLocaleString()}/day × 1)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{baseRate.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Taxes & Insurance (18%)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{taxes.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9' }} />

              {/* Total Payable Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Total Payable</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#2563eb' }}>₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>

            {/* Driver & Document Verification Card (Image 1 UI) */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    <i className="fa-regular fa-id-card"></i>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>User Details</span>
                </div>
                <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '8px' }}>●</span> Required for Handover
                </span>
              </div>

              {/* Full Name */}
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
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Age & Mobile Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    defaultValue={customerAge}
                    placeholder="26"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
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
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={customerPhone}
                    placeholder="Enter 10-digit mobile"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
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

              {/* Select Document Tab */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Select Document for Verification
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'dl' as const, label: 'Driving License', icon: 'fa-id-card' },
                    { id: 'aadhaar' as const, label: 'Aadhaar Card', icon: 'fa-fingerprint' },
                    { id: 'pan' as const, label: 'PAN Card', icon: 'fa-address-card' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDocTab(d.id)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '8px',
                        border: selectedDocTab === d.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: selectedDocTab === d.id ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: selectedDocTab === d.id ? '#1d4ed8' : '#334155',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <i className={`fa-solid ${d.icon}`} style={{ fontSize: '13px' }}></i>
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Number Input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  {selectedDocTab === 'dl' ? 'Driving License Number' : selectedDocTab === 'aadhaar' ? 'Aadhaar Card Number' : 'PAN Card Number'}
                </label>
                <input
                  type="text"
                  defaultValue={docNumber}
                  placeholder="Enter document number"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Upload Document Copy (Front & Back) Dual Card from Image 1 */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Upload Document Copy (Front & Back)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr', gap: '14px' }}>
                  {/* Left: Upload Document Trigger */}
                  <div style={{
                    border: '1.5px dashed #93c5fd',
                    borderRadius: '10px',
                    padding: '16px',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#2563eb', fontSize: '20px' }}></i>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Upload Document</span>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>JPG, PNG, PDF up to 10MB</span>
                  </div>

                  {/* Right: Uploaded Document Card with Trash */}
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&q=80"
                        alt="Document preview"
                        style={{ width: '42px', height: '28px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                      />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{uploadedDocName}</div>
                        <div style={{ fontSize: '10.5px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <span style={{ fontSize: '7px' }}>●</span> Uploaded
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      title="Remove document"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mandatory Notice */}
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '11.5px',
                color: '#92400e',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                lineHeight: 1.45
              }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '2px', fontSize: '13px' }}></i>
                <span>
                  <strong>Mandatory Original Copy Notice:</strong> When taking delivery of the vehicle, you must submit and physically verify the original physical copy of your Driving License / Aadhaar / PAN card to the vehicle owner or hub representative.
                </span>
              </div>
            </div>

            {/* Bottom Actions Row from Image 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '4px' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '13.5px',
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
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Confirming Booking...
                  </>
                ) : (
                  <>Confirm</>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Mini Map + Technical Specifications Card (Image 1 Layout) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Mini Map Card matching Image 1 */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '14px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                width: '100%',
                height: '175px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid #cbd5e1'
              }}>
                <iframe
                  title="Live Hub Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${currentLocation
                    ? `${currentLocation.lat},${currentLocation.lng}`
                    : encodeURIComponent(pickup || 'Truro')
                    }&z=16&output=embed`}
                />

                {/* Top Google Maps Pill */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup || 'Truro')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ffffff',
                    color: '#2563eb',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  Open in Google Maps ↗
                </a>

                {/* Bottom Getting Location / GPS Bar from Image 1 */}
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '6px',
                  right: '6px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#ffffff',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: currentLocation ? '#10b981' : '#f59e0b',
                    marginRight: '6px'
                  }} />
                  {currentLocation ? 'GPS CONNECTED' : '● Getting your location...'}
                </div>
              </div>
            </div>

            {/* Technical Specifications Card matching Image 1 */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '22px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Technical Specifications
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Model Year</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.year || '2023'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Transmission</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.transmission || 'Manual'}
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
                    {vehicle?.seats || '5 Seats'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Engine</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.engine || '1.2L K-Series DualJet'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Included Kms</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {vehicle?.kms || '500 Kms/day'}
                  </div>
                </div>
              </div>
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
            Your self-drive vehicle reservation has been dispatched to the business owner and hub manager.
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

          {/* Dedicated Owner Location & Contact Details Card for User */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #bfdbfe',
            borderRadius: '16px',
            padding: '20px 24px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eff6ff', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Owner Name */}
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OWNER NAME</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {confirmedBooking?.ownerName || vehicle?.ownerName || 'Vasanth Fleet Ops'}
                </div>
              </div>

              {/* Owner Mobile */}
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OWNER MOBILE NUMBER</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-phone" style={{ fontSize: '12px' }}></i>
                  <a href={`tel:${confirmedBooking?.ownerPhone || vehicle?.ownerPhone || '+91 98765 43210'}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {confirmedBooking?.ownerPhone || vehicle?.ownerPhone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              {/* Owner Location / Hub */}
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>VEHICLE PICKUP LOCATION / STATION</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#ef4444' }}></i>
                  <span>{confirmedBooking?.ownerLocation || vehicle?.location || pickup || 'Katpadi, Vellore'}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', marginLeft: '20px' }}>
                  Please present your original Driving License / ID document at the pickup station.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => router.push('/home/rental/Car')}
              style={{
                padding: '11px 24px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Explore More Cars
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              style={{
                padding: '11px 28px',
                borderRadius: '8px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewDetailsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1, paddingTop: '20px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading...</div>}>
          <ReviewDetailsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

