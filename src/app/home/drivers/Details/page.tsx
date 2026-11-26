'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import GoogleMapPickerModal from '@/components/rental/GoogleMapPickerModal';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Phone,
  User,
  Star,
  Car,
  Truck,
  Bike
} from 'lucide-react';

export default function DriverBookingDetailsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading driver details...</div>}>
      <DriverBookingDetailsContent />
    </Suspense>
  );
}

function DriverBookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected Driver Object
  const [driver, setDriver] = useState<any>(null);

  // Stepper Stage: 1 = Passenger / Customer Details & Trip Form, 2 = Review Journey, 3 = Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields (Matching User's Image 2 & Image 3)
  const [serviceType, setServiceType] = useState<string>('One Way In-city'); // 'One Way In-city' | 'One Way Outstation' | 'Round Trip In-city' | 'Round Trip Outstation'
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('Car / Sedan / SUV'); // Bike / 2-Wheeler, Car / Sedan / SUV, Commercial / LCV, 6-Wheeler Truck, 8-10W Heavy Truck

  const [requiredHours, setRequiredHours] = useState<string>('8 Hours (Full Day)');
  const [foodProvided, setFoodProvided] = useState<string>('Yes');
  const [reportingDate, setReportingDate] = useState<string>('2026-11-25');
  const [reportingTime, setReportingTime] = useState<string>('10:00 AM');
  const [distanceEstimate, setDistanceEstimate] = useState<string>('15 km (In-city estimate)');

  // Locations
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropLocation, setDropLocation] = useState<string>('Cyber City, Phase 2, Gurugram - 122002');
  const [activeMapTarget, setActiveMapTarget] = useState<'pickup' | 'drop' | null>(null);

  // Customer Contact Details
  const [fullName, setFullName] = useState<string>('Rajesh Kumar');
  const [mobilePhone, setMobilePhone] = useState<string>('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState<string>('rajesh.kumar@example.com');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(true);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cash'>('upi');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // Load selected driver from localStorage or search params
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sart_selected_driver');
      if (stored) {
        setDriver(JSON.parse(stored));
      }
    } catch (e) { }

    if (searchParams) {
      const p = searchParams.get('pickup');
      if (p) setPickupLocation(p);
      const d = searchParams.get('date');
      if (d) setReportingDate(d);
      const cat = searchParams.get('category');
      if (cat) {
        if (cat === 'bike') setSelectedVehicleType('Bike / 2-Wheeler');
        if (cat === 'car') setSelectedVehicleType('Car / Sedan / SUV');
        if (cat === 'commercial') setSelectedVehicleType('Commercial / LCV');
        if (cat === 'truck6') setSelectedVehicleType('6-Wheeler Truck');
        if (cat === 'truck8' || cat === 'truck10' || cat === 'heavy_trailer') setSelectedVehicleType('8-10W Heavy Truck');
      }
    }
  }, [searchParams]);

  // Pricing calculations
  const isOutstation = serviceType.includes('Outstation');
  const isRoundTrip = serviceType.includes('Round Trip');

  const baseTariff = isOutstation
    ? (driver?.outstationRate || 1800) * (isRoundTrip ? 1.8 : 1)
    : (driver?.dailyRate || 1000) * (isRoundTrip ? 1.5 : 1);

  const convenienceFee = 11.80;
  const travelInsurance = 0.45;
  const totalFare = baseTariff + convenienceFee + travelInsurance;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflowX: 'hidden' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: '1 0 auto', padding: '28px 20px 60px 20px', width: '100%' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          {/* ================= STEPPER HEADER (MATCHING USER IMAGE 1 EXACT COLORS #391E84) ================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '520px',
              margin: '0 auto 32px auto',
              padding: '6px 0'
            }}
          >
            {/* Step 1: Customer & Trip Details */}
            <div
              onClick={() => setCurrentStep(1)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: currentStep >= 1 ? '#391E84' : '#f1f5f9',
                  color: currentStep >= 1 ? '#ffffff' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentStep === 1 ? '0 0 0 4px rgba(57, 30, 132, 0.22)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {currentStep > 1 ? <i className="fa-solid fa-check" style={{ fontSize: '12px' }}></i> : 1}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 1 ? 800 : 600, color: currentStep === 1 ? '#0f172a' : '#475569', whiteSpace: 'nowrap' }}>
                Driver & Trip Details
              </span>
            </div>

            <div
              style={{
                flex: 1,
                height: '2.5px',
                background: currentStep >= 2 ? '#391E84' : '#e2e8f0',
                marginTop: '-22px',
                marginInline: '10px',
                transition: 'background 0.3s'
              }}
            ></div>

            {/* Step 2: Review Journey */}
            <div
              onClick={() => {
                if (currentStep >= 2) setCurrentStep(2);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '110px', cursor: currentStep >= 2 ? 'pointer' : 'default' }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: currentStep >= 2 ? '#391E84' : '#f1f5f9',
                  color: currentStep >= 2 ? '#ffffff' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentStep === 2 ? '0 0 0 4px rgba(57, 30, 132, 0.22)' : 'none',
                  border: currentStep < 2 ? '1.5px solid #cbd5e1' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {currentStep > 2 ? <i className="fa-solid fa-check" style={{ fontSize: '12px' }}></i> : 2}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 2 ? 800 : 600, color: currentStep === 2 ? '#0f172a' : '#475569', whiteSpace: 'nowrap' }}>
                Review Journey
              </span>
            </div>

            <div
              style={{
                flex: 1,
                height: '2.5px',
                background: currentStep >= 3 ? '#391E84' : '#e2e8f0',
                marginTop: '-22px',
                marginInline: '10px',
                transition: 'background 0.3s'
              }}
            ></div>

            {/* Step 3: Payment */}
            <div
              onClick={() => {
                if (currentStep >= 3) setCurrentStep(3);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '100px', cursor: currentStep >= 3 ? 'pointer' : 'default' }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: currentStep === 3 ? '#391E84' : '#f1f5f9',
                  color: currentStep === 3 ? '#ffffff' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentStep === 3 ? '0 0 0 4px rgba(57, 30, 132, 0.22)' : 'none',
                  border: currentStep < 3 ? '1.5px solid #cbd5e1' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                3
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 3 ? 800 : 600, color: currentStep === 3 ? '#0f172a' : '#64748b', whiteSpace: 'nowrap' }}>
                Payment
              </span>
            </div>
          </div>

          {/* ================= STEP 1: FORM DETAILS (MATCHING USER IMAGES 2 & 3) ================= */}
          {currentStep === 1 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                padding: '28px',
                marginBottom: '28px'
              }}
            >
              {/* Service Type Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                  Service Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    'One Way In-city',
                    'One Way Outstation',
                    'Round Trip In-city',
                    'Round Trip Outstation'
                  ].map((type) => {
                    const isSelected = serviceType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setServiceType(type)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                          backgroundColor: isSelected ? '#059669' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#1e293b',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.2)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* If "One Way In-city": Show Distance, Date, and Time in ONE row */}
              {serviceType === 'One Way In-city' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Distance <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={distanceEstimate}
                        onChange={(e) => setDistanceEstimate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          paddingRight: '32px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="5 km (In-city estimate)">5 km  </option>
                        <option value="10 km (In-city estimate)">10 km</option>
                        <option value="15 km (In-city estimate)">15 km </option>
                        <option value="20 km (In-city estimate)">20 km </option>
                        <option value="25 km (In-city estimate)">25 km </option>
                        <option value="30 km (In-city estimate)">30 km </option>
                        <option value="40 km (In-city estimate)">40 km </option>
                        <option value="50 km+ (In-city estimate)">50 km+ </option>
                      </select>
                      <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Date <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <input
                        type="date"
                        value={reportingDate}
                        onChange={(e) => setReportingDate(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          background: 'transparent'
                        }}
                      />
                      <Calendar size={16} color="#64748b" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Time <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <input
                        type="text"
                        value={reportingTime}
                        onChange={(e) => setReportingTime(e.target.value)}
                        placeholder="10:00 AM"
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          background: 'transparent'
                        }}
                      />
                      <Clock size={16} color="#64748b" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Required Hours & Food Provided Rows */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Required Hours <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={requiredHours}
                          onChange={(e) => setRequiredHours(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            paddingRight: '32px',
                            borderRadius: '10px',
                            border: '1.5px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                        >
                          <option value="4 Hours (Half Day)">4 Hours (Half Day)</option>
                          <option value="8 Hours (Full Day)">8 Hours (Full Day)</option>
                          <option value="12 Hours (Extended)">12 Hours (Extended)</option>
                          <option value="24 Hours (Multi-Day)">24 Hours (Multi-Day)</option>
                        </select>
                        <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Food Provided By Customer <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={foodProvided}
                          onChange={(e) => setFoodProvided(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            paddingRight: '32px',
                            borderRadius: '10px',
                            border: '1.5px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                        >
                          <option value="Yes">Yes (Food Provided)</option>
                          <option value="No (+₹150 Allowance)">No (+₹150 Allowance)</option>
                        </select>
                        <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Reporting Date & Reporting Time */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Reporting Date <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <input
                          type="date"
                          value={reportingDate}
                          onChange={(e) => setReportingDate(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            color: '#0f172a',
                            background: 'transparent'
                          }}
                        />
                        <Calendar size={16} color="#64748b" />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Reporting Time <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <input
                          type="text"
                          value={reportingTime}
                          onChange={(e) => setReportingTime(e.target.value)}
                          placeholder="10:00 AM"
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            color: '#0f172a',
                            background: 'transparent'
                          }}
                        />
                        <Clock size={16} color="#64748b" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Location Details */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                  {serviceType.includes('Round Trip') ? 'Location Details (Pickup)' : 'Location Details (Pickup & Drop)'}
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: serviceType.includes('Round Trip') ? '1fr' : '1fr 1fr',
                    gap: '20px'
                  }}
                >
                  {/* Pickup Location */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Pickup Location / Address <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveMapTarget('pickup')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <i className="fa-solid fa-map-pin" style={{ color: '#2563eb' }}></i> Select on Map
                      </button>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <MapPin size={16} color="#64748b" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Plot No. 14-B, Sector 44, Gurugram"
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          background: 'transparent'
                        }}
                      />
                    </div>
                  </div>

                  {/* Drop Location: ONLY shown for One Way In-city & One Way Outstation */}
                  {!serviceType.includes('Round Trip') && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                          {serviceType === 'One Way Outstation' ? 'Destination Address (Outstation)' : 'Drop Location'} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveMapTarget('drop')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa-solid fa-map-pin" style={{ color: '#2563eb' }}></i> Select on Map
                        </button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <MapPin size={16} color="#64748b" />
                        <input
                          type="text"
                          value={dropLocation}
                          onChange={(e) => setDropLocation(e.target.value)}
                          placeholder={serviceType === 'One Way Outstation' ? 'Sector 18, Noida, Uttar Pradesh - 201301' : 'Cyber City, Phase 2, Gurugram - 122002'}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#0f172a',
                            background: 'transparent'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                  Customer Contact Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Mobile Phone Number (For 4-Digit OTP) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        ✓ OTP Verified
                      </span>
                    </div>
                    <input
                      type="text"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Fare Bar (Image 3 bottom strip) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  marginBottom: '20px'
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                    Estimated Fare: ₹{baseTariff.toLocaleString('en-IN')} ({isOutstation ? 'Outstation Base' : 'In-city Base'})
                  </span>
                  <span style={{ fontSize: '12px', color: '#15803d', marginLeft: '8px' }}>
                    Tolls & Taxes Extra
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                  Driver Assigned within 15 mins • OTP Protected Entry
                </span>
              </div>

              {/* Form Action Buttons: Cancel/Back & Continue to Review Journey */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => router.push('/home/drivers')}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel / Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 26px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <Lock size={15} />
                  <span>Continue &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: REVIEW JOURNEY (EXACT COLOR & CARDS MATCHING USER IMAGE 1) ================= */}
          {currentStep === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'flex-start' }}>

              {/* Left Column: Driver Journey Card & Customer Details Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* 1. Main Driver Schedule Card (Matching Image 1 Train/Journey Card style) */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    padding: '24px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                    position: 'relative'
                  }}
                >
                  {/* Driver Name & Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={driver?.image || '/images/driver_sai_captain.jpg'}
                        alt={driver?.name || 'Driver'}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                        onError={(e) => { e.currentTarget.src = '/images/driver_sai_captain.jpg'; }}
                      />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                          {driver?.name || 'Sai (Captain)'}
                        </h3>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                          ID / Reg: {driver?.dlNumber || driver?.regId || 'DRV-3728HSH32938'} • 8 Yrs Exp
                        </span>
                      </div>
                    </div>
                    <MapPin size={18} color="#0f172a" />
                  </div>

                  {/* Journey Time & Locations Line (Matching Image 1) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                        {reportingTime} | {pickupLocation.split(',')[0]}
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{reportingDate}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
                      <span>&mdash;</span>
                      <span>{requiredHours}</span>
                      <span>&mdash;</span>
                    </div>

                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                        {dropLocation.split(',')[0]}
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{reportingDate}</span>
                    </div>

                    <span
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.5px'
                      }}
                    >
                      AVAILABLE
                    </span>
                  </div>

                  {/* Subline specs */}
                  <div style={{ fontSize: '12.5px', color: '#475569', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <span>1 Driver • </span>
                    <span>Service: {serviceType} • </span>
                    <span>Vehicle: {selectedVehicleType} • </span>
                    <span>Reporting: {reportingDate} {reportingTime}</span>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '8px' }}>
                    Please verify your reporting address and contact details before payment.
                  </div>
                </div>

                {/* 2. Customer Details Accordion Card (Matching Image 1) */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    padding: '20px 24px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                      Customer Details
                    </h4>
                    <ChevronDown size={18} color="#64748b" />
                  </div>

                  <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600, marginBottom: '14px' }}>
                    <span>1 &nbsp;&nbsp;</span>
                    <strong>{fullName.toUpperCase()}</strong> &nbsp;|&nbsp; 32 yrs &nbsp;|&nbsp; Male &nbsp;|&nbsp; India
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    Your booking OTP will be sent to <strong>{mobilePhone}</strong> / <strong>{customerEmail}</strong>
                  </div>
                </div>

                {/* Back button */}
                <div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    &larr; Back to Edit Details
                  </button>
                </div>
              </div>

              {/* Right Column: Fare Summary Card (Matching User Image 1 Right Box) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '20px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    Fare Summary
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Driver Service Fee</span>
                      <strong style={{ color: '#0f172a' }}>₹ {baseTariff.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Convenience Fee (Incl. of GST)</span>
                      <strong style={{ color: '#0f172a' }}>₹ {convenienceFee.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Travel Protection & Insurance</span>
                      <strong style={{ color: '#0f172a' }}>₹ {travelInsurance.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Total Fare Dark Purple / Navy Bar (Matching User Image 1 #391E84) */}
                <div
                  style={{
                    backgroundColor: '#391E84',
                    color: '#ffffff',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800 }}>Total Fare</span>
                  <span style={{ fontSize: '18px', fontWeight: 900 }}>₹ {totalFare.toFixed(2)}</span>
                </div>

                <div style={{ padding: '16px 20px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                    }}
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 3: PAYMENT SCREEN ================= */}
          {currentStep === 3 && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)',
                  padding: '28px'
                }}
              >
                {!isBookingConfirmed ? (
                  <>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                      Choose Payment Method
                    </h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '12.5px', color: '#64748b' }}>
                      Total amount payable: <strong style={{ color: '#391E84' }}>₹ {totalFare.toFixed(2)}</strong>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      {[
                        { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: 'fa-qrcode' },
                        { id: 'card', label: 'Credit / Debit Card', icon: 'fa-credit-card' },
                        { id: 'netbanking', label: 'Net Banking', icon: 'fa-building-columns' },
                        { id: 'cash', label: 'Pay Cash to Driver after Trip', icon: 'fa-money-bill-wave' }
                      ].map((pm) => (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id as any)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            border: paymentMethod === pm.id ? '2px solid #391E84' : '1.5px solid #e2e8f0',
                            backgroundColor: paymentMethod === pm.id ? '#fdf4ff' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="radio"
                            checked={paymentMethod === pm.id}
                            onChange={() => setPaymentMethod(pm.id as any)}
                            style={{ accentColor: '#391E84' }}
                          />
                          <i className={`fa-solid ${pm.icon}`} style={{ color: '#391E84', fontSize: '16px' }}></i>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{pm.label}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          setIsBookingConfirmed(true);

                          // Prepare booking payload for the driver
                          const bookingInfo = {
                            bookingId: `BK-DRV-${Date.now().toString().slice(-6)}`,
                            bookingRef: `DRV-REF-${Date.now().toString().slice(-6)}`,
                            otp: '4829',
                            bookedAt: new Date().toISOString(),
                            reportingDate: reportingDate,
                            reportingTime: reportingTime,
                            serviceType: serviceType,
                            vehicleType: selectedVehicleType,
                            requiredHours: requiredHours,
                            foodProvided: foodProvided,
                            distanceEstimate: distanceEstimate,
                            pickupLocation: pickupLocation,
                            dropLocation: dropLocation,
                            customerName: fullName,
                            customerPhone: mobilePhone,
                            customerEmail: customerEmail,
                            paymentMethod: paymentMethod,
                            totalFare: totalFare,
                            status: 'Actively Booked'
                          };

                          const driverId = driver?.id || searchParams?.get('driverId') || 'DRV-1795524256075';

                          // Update driver availability to false (On Trip) and persist booking details
                          try {
                            // Update localStorage
                            const stored = localStorage.getItem('sart_fleet_drivers');
                            if (stored) {
                              const list = JSON.parse(stored);
                              const updated = list.map((d: any) =>
                                d.id === driverId
                                  ? { ...d, isAvailable: false, status: 'On Trip', bookingDetails: bookingInfo }
                                  : d
                              );
                              localStorage.setItem('sart_fleet_drivers', JSON.stringify(updated));
                            }

                            // Save driver booking in local driver bookings map
                            localStorage.setItem(`driver_booking_${driverId}`, JSON.stringify(bookingInfo));

                            // Add to business bookings for notification
                            const notifPayload = {
                              id: bookingInfo.bookingId,
                              type: 'driver_booking',
                              badge: 'New Driver Booking',
                              title: `${fullName} booked Captain: ${driver?.name || 'Driver'}`,
                              customerName: fullName,
                              customerPhone: mobilePhone,
                              category: 'Chauffeur / Driver',
                              vehicleName: driver?.name ? `Captain: ${driver.name}` : 'Fleet Captain',
                              vehiclePlate: driver?.dlNumber || driver?.plate || '',
                              reportingDate: reportingDate,
                              reportingTime: reportingTime,
                              date: reportingDate,
                              time: reportingTime,
                              pickupLocation: pickupLocation,
                              dropLocation: dropLocation,
                              serviceType: serviceType,
                              vehicleType: selectedVehicleType,
                              totalFare: totalFare,
                              read: false,
                              createdAt: new Date().toISOString()
                            };

                            try {
                              const existingBiz = JSON.parse(localStorage.getItem('sart_business_bookings') || '[]');
                              localStorage.setItem('sart_business_bookings', JSON.stringify([notifPayload, ...existingBiz]));
                              window.dispatchEvent(new Event('storage'));
                            } catch (e) { }

                            // Call Driver Backend API and Business Notification API on port 3005 and 5000
                            await Promise.allSettled([
                              fetch(`http://localhost:3005/api/drivers/${encodeURIComponent(driverId)}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  isAvailable: false,
                                  status: 'On Trip',
                                  bookingDetails: bookingInfo
                                })
                              }),
                              fetch(`http://localhost:5000/api/drivers/${encodeURIComponent(driverId)}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  isAvailable: false,
                                  status: 'On Trip',
                                  bookingDetails: bookingInfo
                                })
                              }),
                              fetch('http://localhost:3005/api/business/notifications', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(notifPayload)
                              }),
                              fetch('http://localhost:5000/api/business/notifications', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(notifPayload)
                              })
                            ]);
                          } catch (err) {
                            console.error('Error syncing driver booking:', err);
                          }
                        }}
                        style={{
                          flex: 2,
                          padding: '12px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: '#391E84',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(57, 30, 132, 0.35)'
                        }}
                      >
                        Pay ₹ {totalFare.toFixed(2)} & Confirm
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        fontSize: '32px'
                      }}
                    >
                      <CheckCircle2 size={36} color="#059669" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                      Driver Booking Confirmed!
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
                      Driver {driver?.name || 'Sai'} is assigned and will report to your location at <strong>{reportingTime}</strong> on <strong>{reportingDate}</strong>.
                    </p>

                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                      <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Start Trip OTP:</strong> <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: 800 }}>4829</span></div>
                      <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Vehicle Type:</strong> {selectedVehicleType}</div>
                      <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Pickup:</strong> {pickupLocation}</div>
                      <div style={{ fontSize: '13px' }}><strong>Destination:</strong> {dropLocation}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push('/home/drivers')}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#09090b',
                        color: '#ffffff',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Back to Drivers
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Google Map Modal for picking addresses */}
          {activeMapTarget && (
            <GoogleMapPickerModal
              isOpen={Boolean(activeMapTarget)}
              onClose={() => setActiveMapTarget(null)}
              targetLabel={activeMapTarget === 'pickup' ? 'Pickup' : 'Drop / Destination'}
              initialAddress={activeMapTarget === 'pickup' ? pickupLocation : dropLocation}
              onConfirm={(addr) => {
                if (activeMapTarget === 'pickup') setPickupLocation(addr);
                if (activeMapTarget === 'drop') setDropLocation(addr);
                setActiveMapTarget(null);
              }}
            />
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
