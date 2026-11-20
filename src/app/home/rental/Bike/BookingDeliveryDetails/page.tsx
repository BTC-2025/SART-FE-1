'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import '@/app/home/rental/Car/CarDetails/page.css';
import { ALL_RENTAL_VEHICLES, RentalVehicle } from '@/components/rental/rentalData';

// Popular landmarks for quick selection in the Map Picker Popup
const POPULAR_LOCATIONS = [
  { name: 'Katpadi Railway Station', address: 'Railway Station Road, Katpadi, Vellore, Tamil Nadu 632007', lat: 12.9798, lng: 79.1375 },
  { name: 'VIT University Vellore (Main Gate)', address: 'VIT Campus, Tiruvalam Rd, Katpadi, Vellore, Tamil Nadu 632014', lat: 12.9692, lng: 79.1559 },
  { name: 'CMC Hospital Vellore', address: 'Ida Scudder Road, Vellore, Tamil Nadu 632004', lat: 12.9248, lng: 79.1348 },
  { name: 'Green Circle (Vellore Old Bus Stand)', address: 'National Highway 48, Thottapalayam, Vellore, Tamil Nadu 632012', lat: 12.9298, lng: 79.1412 },
  { name: 'Vellore Golden Temple (Sripuram)', address: 'Tirumalaikodi, Vellore, Tamil Nadu 632055', lat: 12.8716, lng: 79.0886 },
  { name: 'Ranipet - Chittoor Trunk Road Hub', address: 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu 632106', lat: 12.9854, lng: 79.1821 }
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

  // Interactive Map Popup State
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

      // 4. Default fallback matching Bike Fleet (TVS APACHE RTR 160/200 XZ+)
      if (!found) {
        found = {
          id: vehicleId,
          name: 'TVS APACHE RTR 160/200 XZ+',
          category: 'Cruiser (350cc+)',
          price: 1800,
          dailyRate: 1800,
          hourlyRate: 150,
          badge: 'Verified Owner',
          fuel: 'Petrol',
          transmission: 'Automatic',
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

  const rentalBase = vehicle.dailyRate || vehicle.price || 1800;
  const securityDeposit = 5000;
  const fastagToll = 500;
  const deliveryCharges = deliveryType === 'delivery' ? 1000 : 0;
  const totalFare = rentalBase + securityDeposit + fastagToll + deliveryCharges;

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
      duration: '1 Day',
      totalFare: String(totalFare)
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
      maxWidth: '1200px',
      margin: '28px auto',
      padding: '0 20px 80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box'
    }}>

      {/* TOP BREADCRUMBS PROGRESS HEADER (MATCHING EXACT 1 IMAGE) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '36px'
      }}>
        {/* Step 1: Details (Active Orange) */}
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
        gridTemplateColumns: '1.75fr 1fr',
        gap: '24px',
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

          {/* 1. DELIVERY ADDRESS with Select on Map */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                DELIVERY ADDRESS
              </label>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea580c',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '11px' }}></i> Select on Map
              </button>
            </div>

            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
                setUserCustomLocation(e.target.value);
              }}
              placeholder="Flat / street / area"
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
                ₹{rentalBase.toLocaleString()} total (1 day)
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
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Rental (1 day)</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Incl. GST: ₹47.60 CGST + ₹47.60 SGST
                </div>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                ₹ {rentalBase.toLocaleString()}.00
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
              <span style={{ fontSize: '17px', fontWeight: 900 }}>₹ {totalFare.toLocaleString()}.00</span>
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
                background: '#ea580c',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
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

      {/* MAP SELECTOR POPUP MODAL */}
      {isMapModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#fee2e2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px'
                }}>
                  <i className="fa-solid fa-location-crosshairs"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    Select Location on Map
                  </h3>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b' }}>
                    Pinpoint your vehicle delivery or pickup address
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Search Bar */}
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 14px'
              }}>
                <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
                <input
                  type="text"
                  value={searchMapQuery}
                  onChange={(e) => setSearchMapQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchMapQuery.trim()) {
                      setSelectedPinLocation({
                        name: searchMapQuery,
                        address: `${searchMapQuery}, Vellore, Tamil Nadu`,
                        lat: 12.9798,
                        lng: 79.1375
                      });
                    }
                  }}
                  placeholder="Search landmark, street, colony or area in Katpadi / Vellore..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    width: '100%',
                    color: '#0f172a'
                  }}
                />
                {searchMapQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      if (searchMapQuery.trim()) {
                        setSelectedPinLocation({
                          name: searchMapQuery,
                          address: `${searchMapQuery}, Vellore, Tamil Nadu`,
                          lat: 12.9798,
                          lng: 79.1375
                        });
                      }
                    }}
                    style={{
                      background: '#ea580c',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Locate
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Embedded Google Map */}
            <div style={{ width: '100%', height: '280px', position: 'relative', background: '#e2e8f0' }}>
              <iframe
                title="Select on Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedPinLocation.address || selectedPinLocation.name)}&z=15&output=embed`}
              />

              {/* Floating Center Pin Indicator */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  marginBottom: '2px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  📍 Selected Pickup Spot
                </div>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '3px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>

            {/* Popular Landmarks Quick-Click List */}
            <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                Or Choose Popular Landmarks Nearby
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {POPULAR_LOCATIONS.map((loc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPinLocation(loc)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: selectedPinLocation.name === loc.name ? '2px solid #ea580c' : '1px solid #e2e8f0',
                      background: selectedPinLocation.name === loc.name ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: selectedPinLocation.name === loc.name ? '#ea580c' : '#64748b', fontSize: '12px' }}></i>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{loc.name}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer with Confirmation Button */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SELECTED LOCATION:</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedPinLocation.address || selectedPinLocation.name}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmLocationFromMap(selectedPinLocation)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ea580c',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
                  }}
                >
                  Confirm & Apply Address
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
