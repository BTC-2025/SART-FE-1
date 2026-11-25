'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import {
  Calendar,
  Clock,
  Clock3,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Info,
  Car,
  CreditCard,
  Building,
  User,
  Phone,
  Check,
  Truck
} from 'lucide-react';

interface ParkingSpotData {
  id: string;
  name: string;
  spotName?: string;
  category: string;
  spaceType?: string;
  city: string;
  state: string;
  locality?: string;
  pincode?: string;
  address: string;
  hourlyRate: number;
  dailyRate?: number;
  monthlyRate?: number;
  image?: string;
  vehicleTypes?: any;
}

function ParkingUserDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const spotIdParam = searchParams.get('spotId') || '';
  const vehicleTypeParam = searchParams.get('vehicleType') || 'car';
  const dateParam = searchParams.get('date') || '2026-11-26';
  const timeParam = searchParams.get('time') || '10:00 AM';
  const durationParam = Number(searchParams.get('duration')) || 8;

  // Stepper state (1: User & Vehicle Details, 2: Review & Summary, 3: Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Spot Data
  const [spot, setSpot] = useState<ParkingSpotData | null>(null);

  // Form State: User & Driver Details
  const [fullName, setFullName] = useState<string>('Rajesh Kumar');
  const [gender, setGender] = useState<string>('Male');
  const [age, setAge] = useState<string>('34 Years');
  const [mobileNumber, setMobileNumber] = useState<string>('+91 98765 43210');

  // Form State: Vehicle & Document Details
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('6-Wheeler Commercial Truck');
  const [wheelersCategory, setWheelersCategory] = useState<string>('6-Wheeler (T-6 Category)');
  const [numberPlate, setNumberPlate] = useState<string>('DL 3C AB 2324');
  const [rcNumber, setRcNumber] = useState<string>('RC/DL3C/2021/45678');
  const [drivingLicense, setDrivingLicense] = useState<string>('DL-1320140023456');
  const [panCardNumber, setPanCardNumber] = useState<string>('ABCDE1234F');

  // Spot timing & duration
  const [bookingDate, setBookingDate] = useState<string>(dateParam);
  const [bookingTime, setBookingTime] = useState<string>(timeParam.includes(':') ? timeParam : '10:00 AM');
  const [bookingDuration, setBookingDuration] = useState<number>(durationParam || 8);
  const [selectedBayCode, setSelectedBayCode] = useState<string>('Bay C-14');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'advance' | 'full'>('advance');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Load spot information from localStorage or fetch
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sart_selected_parking_spot');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.id === spotIdParam || !spotIdParam)) {
          setSpot(parsed);
          if (parsed.vehicleTypes) {
            // Adjust bay code prefix based on vehicle type
            if (vehicleTypeParam === 'bike') setSelectedBayCode('Bay B-08');
            else if (vehicleTypeParam === 'car') setSelectedBayCode('Bay C-14');
            else setSelectedBayCode('Bay H-04');
          }
        }
      }
    } catch (e) { }

    // Sync user details if session exists
    try {
      const session = localStorage.getItem('sart_user_session');
      if (session) {
        const user = JSON.parse(session);
        if (user.name) setFullName(user.name);
        if (user.phone) setMobileNumber(user.phone);
      }
    } catch (e) { }

    // Default vehicle mapping from search
    if (vehicleTypeParam === 'bike') {
      setSelectedVehicleType('Motorcycle / Scooter');
      setWheelersCategory('2-Wheeler');
      setNumberPlate('DL 8S AX 1245');
    } else if (vehicleTypeParam === 'car') {
      setSelectedVehicleType('Car / Sedan / SUV');
      setWheelersCategory('4-Wheeler');
      setNumberPlate('DL 3C AB 2324');
    } else if (vehicleTypeParam === 'truck' || vehicleTypeParam === 'bus') {
      setSelectedVehicleType('6-Wheeler Commercial Truck');
      setWheelersCategory('6-Wheeler');
      setNumberPlate('DL 1M AA 8899');
    }
  }, [spotIdParam, vehicleTypeParam]);

  // Handle Wheelers selection sync
  const handleWheelersChange = (val: string) => {
    setWheelersCategory(val);
    if (val.includes('2-Wheeler')) {
      setSelectedVehicleType('Motorcycle / Scooter');
    } else if (val.includes('4-Wheeler')) {
      setSelectedVehicleType('Car / Sedan / SUV');
    } else if (val.includes('6-Wheeler')) {
      setSelectedVehicleType('6-Wheeler Commercial Truck');
    } else if (val.includes('8-Wheeler') || val.includes('10-Wheeler')) {
      setSelectedVehicleType('8-10W Heavy Goods Carrier');
    } else if (val.includes('12-Wheeler') || val.includes('Heavy')) {
      setSelectedVehicleType('12W+ Multi-Axle Trailer');
    }
  };

  // Pricing calculations
  const baseRatePerHour = spot?.hourlyRate || (wheelersCategory.includes('2-Wheeler') ? 20 : wheelersCategory.includes('4-Wheeler') ? 50 : 50);
  const totalBaseTariff = baseRatePerHour * bookingDuration;
  const isHeavy = wheelersCategory.includes('6-Wheeler') || wheelersCategory.includes('8-Wheeler') || wheelersCategory.includes('10-Wheeler') || wheelersCategory.includes('12');
  const multiAxleSurcharge = isHeavy ? 150 : 0;
  const serviceFee = 30;
  const subTotalBeforeTax = totalBaseTariff + multiAxleSurcharge + serviceFee;
  const gstTax = Math.round(subTotalBeforeTax * 0.18);
  const securityDeposit = 100;
  const totalEstimatedCost = subTotalBeforeTax + gstTax + securityDeposit;

  const advanceAmount = Math.round(totalEstimatedCost * 0.25);
  const dueAtExit = totalEstimatedCost - advanceAmount;

  // Format End Time
  const calculateEndTime = () => {
    try {
      const parts = bookingTime.split(' ');
      const timeParts = parts[0].split(':');
      let hours = parseInt(timeParts[0], 10);
      const mins = timeParts[1] || '00';
      const isPM = parts[1]?.toUpperCase() === 'PM';

      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      const endHoursRaw = (hours + bookingDuration) % 24;
      const endPeriod = endHoursRaw >= 12 ? 'PM' : 'AM';
      let endHours = endHoursRaw % 12;
      if (endHours === 0) endHours = 12;

      return `${String(endHours).padStart(2, '0')}:${mins} ${endPeriod}`;
    } catch (e) {
      return '06:00 PM';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: '1 0 auto', padding: '24px 20px 60px 20px', width: '100%' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          {/* Stepper Header with Exact Color #391E84 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '520px',
              margin: '0 auto 28px auto',
              padding: '6px 0'
            }}
          >
            {/* Step 1: User & Vehicle Details */}
            <div
              onClick={() => setCurrentStep(1)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '130px', cursor: 'pointer' }}
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
                {currentStep > 1 ? '✓' : 1}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 1 ? 800 : 600, color: currentStep === 1 ? '#0f172a' : '#475569', whiteSpace: 'nowrap' }}>
                User & Vehicle
              </span>
            </div>

            <div
              style={{
                flex: 1,
                height: '2.5px',
                background: currentStep >= 2 ? '#391E84' : '#e2e8f0',
                marginTop: '-22px',
                marginInline: '10px'
              }}
            ></div>

            {/* Step 2: Review Booking */}
            <div
              onClick={() => {
                if (currentStep >= 2) setCurrentStep(2);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px', cursor: currentStep >= 2 ? 'pointer' : 'default' }}
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
                  border: currentStep < 2 ? '1.5px solid #cbd5e1' : 'none'
                }}
              >
                {currentStep > 2 ? '✓' : 2}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 2 ? 800 : 600, color: currentStep === 2 ? '#0f172a' : '#64748b', whiteSpace: 'nowrap' }}>
                Review Journey
              </span>
            </div>

            <div
              style={{
                flex: 1,
                height: '2.5px',
                background: currentStep >= 3 ? '#391E84' : '#e2e8f0',
                marginTop: '-22px',
                marginInline: '10px'
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
                  border: currentStep < 3 ? '1.5px solid #cbd5e1' : 'none'
                }}
              >
                3
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 3 ? 800 : 600, color: currentStep === 3 ? '#0f172a' : '#64748b', whiteSpace: 'nowrap' }}>
                Payment
              </span>
            </div>
          </div>

          {/* ================= MAIN 2-COLUMN LAYOUT (LEFT: FORM, RIGHT: SUMMARY) ================= */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '28px', alignItems: 'flex-start' }}>

            {/* ================= LEFT COLUMN: USER & VEHICLE DETAILS FORM ================= */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                padding: '28px'
              }}
            >
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '0 0 20px 0' }}>
                User & Vehicle Details Form
              </h2>

              {/* 1. Selected Timing & Reservation Banner */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                  Selected Timing & Reservation
                </span>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px'
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>
                      Date
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                      {bookingDate}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>
                      Time
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                      {bookingTime}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>
                      Duration
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                      {bookingDuration} Hours
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>
                      Selected Spot
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#2a1373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {selectedBayCode} ({spot?.locality || 'Sector 44 Yard'})
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Driver & User Details */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                  Driver & User Details
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.5fr', gap: '14px' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Gender <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          paddingRight: '28px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Age <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="34 Years"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  {/* Mobile Number with OTP Verified Badge */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                        Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        ✓ OTP Verified
                      </span>
                    </div>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Vehicle & Document Details */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                  Vehicle & Document Details
                </span>

                {/* Top Row: Vehicle Type, Wheelers Category, Number Plate */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.4fr', gap: '14px', marginBottom: '14px' }}>
                  {/* Vehicle Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Vehicle Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedVehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          paddingRight: '28px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="Motorcycle / Scooter">Motorcycle / Scooter (2W)</option>
                        <option value="Car / Sedan / SUV">Car / Sedan / SUV (4W)</option>
                        <option value="Commercial / Delivery Van">Commercial / Delivery Van (LCV)</option>
                        <option value="6-Wheeler Commercial Truck">6-Wheeler Commercial Truck</option>
                        <option value="8-10W Heavy Goods Carrier">8-10W Heavy Goods Carrier</option>
                        <option value="12W+ Multi-Axle Trailer">12W+ Multi-Axle Trailer</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Wheelers Category */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Wheelers Category <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={wheelersCategory}
                        onChange={(e) => handleWheelersChange(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          paddingRight: '28px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="2-Wheeler">🏍️ 2-Wheeler</option>
                        <option value="4-Wheeler">🚗 4-Wheeler</option>
                        <option value="6-Wheeler">🚛 6-Wheeler</option>
                        <option value="8-Wheeler">🚛 8-Wheeler</option>
                        <option value="10-Wheeler">🚛 10-Wheeler</option>
                        <option value="12W+ Heavy Trailer">🚚 12W+ Heavy Trailer</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Number Plate */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Number Plate <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={numberPlate}
                      onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
                      placeholder="DL 3C AB 2324"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f172a',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Row: RC Number, DL Number, PAN Card Number */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {/* RC Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      RC (Registration Certificate) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={rcNumber}
                      onChange={(e) => setRcNumber(e.target.value)}
                      placeholder="RC/DL3C/2021/45678"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  {/* Driving License */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Driving License (DL) Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={drivingLicense}
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      placeholder="DL-1320140023456"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  {/* PAN Card Number with Verified Tick Badge */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      PAN Card Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={panCardNumber}
                        onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        style={{
                          width: '100%',
                          padding: '10px 34px 10px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0f172a',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          letterSpacing: '0.5px'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 900
                        }}
                      >
                        ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => router.push('/home/parking')}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ChevronLeft size={16} /> Back to Search
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1) setCurrentStep(2);
                    else if (currentStep === 2) setCurrentStep(3);
                    else setIsSuccessModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#391E84',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(57, 30, 132, 0.3)',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#291461')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#391E84')}
                >
                  <span>{currentStep === 3 ? 'Confirm & Pay' : 'Proceed to Review'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>

            {/* ================= RIGHT COLUMN: PARKING SLOT & TARIFF SUMMARY (MATCHING USER IMAGE) ================= */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                padding: '24px'
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                Parking Slot & Tariff Summary
              </h3>

              {/* Meta Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#1e293b', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600, minWidth: '95px' }}>Yard Location:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>
                    {spot?.name || 'Sector 44 Prime Multi-Vehicle Yard'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600, minWidth: '95px' }}>Address:</span>
                  <span style={{ fontWeight: 600, color: '#475569', textAlign: 'right', fontSize: '12.5px' }}>
                    {spot?.address || 'Plot 14-B, Main Commercial Road, Sector 44, Gurugram - 122003'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Vehicle Type:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedVehicleType}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Wheelers:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{wheelersCategory}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Reg No / Plate:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px' }}>{numberPlate}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Duration:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{bookingDuration} Hours ({bookingDuration >= 8 ? 'Full-day Slot' : 'Standard Slot'})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Timings:</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>
                    {bookingDate}, {bookingTime} - {calculateEndTime()}
                  </span>
                </div>
              </div>

              {/* Tariff Itemized Breakdown */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Base Hourly Tariff</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{totalBaseTariff}</span>
                </div>

                {isHeavy && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Multi-Axle Heavy Bay Surcharge</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{multiAxleSurcharge}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Service & Security Fee</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{serviceFee}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>GST (18%)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{gstTax}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Refundable Security Deposit</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{securityDeposit}</span>
                </div>
              </div>

              {/* Total Estimated Parking Cost */}
              <div
                style={{
                  borderTop: '1.5px dashed #cbd5e1',
                  paddingTop: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                  Total Estimated Parking Cost
                </span>
                <span style={{ fontSize: '21px', fontWeight: 900, color: '#0f172a' }}>
                  ₹{totalEstimatedCost}
                </span>
              </div>

              {/* Advance & Due at Exit Split Pill Buttons (Matching Image) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div
                  onClick={() => setPaymentMethod('advance')}
                  style={{
                    backgroundColor: '#ecfdf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: paymentMethod === 'advance' ? '0 0 0 2px #059669' : 'none'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                    ADVANCE (25%)
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#065f46' }}>
                    ₹{advanceAmount}
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('full')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: paymentMethod === 'full' ? '0 0 0 2px #391E84' : 'none'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                    DUE AT EXIT
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                    ₹{dueAtExit}
                  </span>
                </div>
              </div>

              {/* Gate Entry Pass Guarantee */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                  color: '#475569'
                }}
              >
                <ShieldCheck size={22} color="#10b981" style={{ flexShrink: 0 }} />
                <span>Guaranteed Bay Access. Instant digital barcode & security OTP issued upon booking.</span>
              </div>

            </div>

          </div>

          {/* Booking Confirmation Success Modal */}
          {isSuccessModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  maxWidth: '460px',
                  width: '100%',
                  padding: '28px',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: '28px'
                  }}
                >
                  ✓
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Parking Bay Reserved!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.4' }}>
                  Your spot <strong>{selectedBayCode}</strong> at <strong>{spot?.name || 'Sector 44 Prime Multi-Vehicle Yard'}</strong> has been booked for vehicle <strong>{numberPlate}</strong>.
                </p>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', marginBottom: '20px', textAlign: 'left', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Date & Time:</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{bookingDate}, {bookingTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Security Gate OTP:</span>
                    <span style={{ fontWeight: 800, color: '#2563eb', letterSpacing: '2px' }}>748921</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Amount Paid (Advance):</span>
                    <span style={{ fontWeight: 800, color: '#059669' }}>₹{advanceAmount}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/home/parking')}
                  style={{
                    width: '100%',
                    backgroundColor: '#391E84',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Back to Parking Search
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ParkingUserDetailsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading parking booking details...</p>
      </div>
    }>
      <ParkingUserDetailsContent />
    </Suspense>
  );
}
