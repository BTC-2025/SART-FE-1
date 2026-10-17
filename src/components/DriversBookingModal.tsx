// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useSartStore } from '@/store/useSartStore';
import { DRIVER_VEHICLE_OPTIONS, SERVICE_TYPE_OPTIONS, HOURS_OPTIONS, DriverVehicleOption, DriverProfile, DEFAULT_DRIVERS } from './drivers/driverData';
import DriverSelectionList from './drivers/DriverSelectionList';
import DriverConfirmedView from './drivers/DriverConfirmedView';

interface DriversBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriversBookingModal({ isOpen, onClose }: DriversBookingModalProps) {
  const { setActiveTab } = useSartStore();

  // Selected vehicle type from the list: Bike, Auto, Car, Bus, Truck, JCB, Tractor, Ship, Helicopter
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('car');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>('Maruti Suzuki Swift / Dzire');
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);

  // Service Type
  const [serviceType, setServiceType] = useState<typeof SERVICE_TYPE_OPTIONS[number]['id']>('round_trip_outstation');

  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [requiredHours, setRequiredHours] = useState('Select hours');
  const [foodProvided, setFoodProvided] = useState<'Yes' | 'No'>('Yes');
  const [tripDate, setTripDate] = useState('2026-10-17');
  const [tripTime, setTripTime] = useState('10:00');

  // 4-Digit OTP Verification Workflow
  const [driverOtp, setDriverOtp] = useState('4821');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Booking Flow Steps: 'form' -> user fills trip details, 'drivers_list' -> choose from verified drivers in rows, 'confirmed' -> mutual acceptance & OTP start
  const [bookingStage, setBookingStage] = useState<'form' | 'drivers_list' | 'confirmed'>('form');
  const [selectedDriverProfile, setSelectedDriverProfile] = useState<DriverProfile | null>(null);
  const [pricingPlan, setPricingPlan] = useState<'km' | 'day' | 'week' | 'month'>('day');
  const [bookingRefId, setBookingRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProofTab, setActiveProofTab] = useState<'license' | 'badge' | 'aadhaar' | 'police'>('license');

  // Multi-step Driver Acceptance & Safety Workflow
  const [driverStatus, setDriverStatus] = useState<'searching' | 'driver_found' | 'driver_accepted' | 'both_accepted' | 'trip_started' | 'cancelled'>('driver_found');
  const [customerAccepted, setCustomerAccepted] = useState(false);
  const [driverAccepted, setDriverAccepted] = useState(false);

  const currentCategory: DriverVehicleOption =
    DRIVER_VEHICLE_OPTIONS.find((c) => c.id === selectedVehicleType) || DRIVER_VEHICLE_OPTIONS[2];

  const availableDrivers: DriverProfile[] = DEFAULT_DRIVERS[selectedVehicleType] || DEFAULT_DRIVERS['car'] || [];

  // Update default vehicle model when category changes
  useEffect(() => {
    if (currentCategory && currentCategory.models.length > 0) {
      setSelectedVehicleModel(currentCategory.models[0]);
    }
  }, [selectedVehicleType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setBookingStage('form');
    setSelectedDriverProfile(null);
    setDriverStatus('driver_found');
    setCustomerAccepted(false);
    setDriverAccepted(false);
    setIsOtpVerified(false);
    setEnteredOtp('');
    setOtpError('');
    setActiveTab('home');
    onClose();
  };

  const handleCancelBooking = (reason: string) => {
    alert(`Order #${bookingRefId || 'SART-DRV'} has been cancelled successfully.\nReason: ${reason}\n\nZero cancellation charge applied.`);
    handleClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation.trim()) {
      alert('Please enter your pickup location.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to drivers_list stage so user can view drivers in rows
      setBookingStage('drivers_list');
    }, 400);
  };

  const handleSelectAndBookDriver = (driver: DriverProfile) => {
    setSelectedDriverProfile(driver);
    const newRef = `SART-DRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRefId(newRef);
    setDriverOtp(randomOtp);
    setBookingStage('confirmed');
    setDriverStatus('driver_found');
    setCustomerAccepted(false);
    setDriverAccepted(false);
  };

  const handleVerifyDriverOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === driverOtp.trim()) {
      setIsOtpVerified(true);
      setDriverStatus('trip_started');
      setOtpError('');
    } else {
      setOtpError('Invalid OTP! Please check the 4-digit code shown on customer screen.');
    }
  };

  return (
    <div
      className="sart-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        overflow: 'hidden'
      }}
      onClick={handleClose}
    >
      <div
        className="modal-sheet centered-modal drivers-booking-modal-sheet"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: 'calc(100vh - 70px)',
          maxHeight: 'calc(100vh - 70px)',
          backgroundColor: '#f8fafc',
          borderRadius: '0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: 'none',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'none' }}></div>

        {/* Global Top Navbar */}
        <div
          style={{
            padding: '14px 28px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}
            >
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  Driver Hire
                </h2>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <i className="fa-solid fa-circle-check"></i> Verified Professionals
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Book licensed drivers across
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 800, background: '#f0fdf4', padding: '6px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <i className="fa-solid fa-shield-check"></i> 4-Digit OTP Start Code Protected
            </div>
            <button
              onClick={handleClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* STAGE 1: FORM VIEW vs STAGE 2: CONFIRMED */}
        {bookingStage === 'form' ? (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* LEFT SIDE: 2 to 3 lines of explanatory content */}
            <div
              style={{
                flex: '0 0 35%',
                maxWidth: '420px',
                borderRight: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                overflowY: 'auto',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '20px'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                <i className="fa-solid fa-user-shield"></i>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  On-Demand Driver Hire
                </span>
                <h3 style={{ margin: '8px 0 10px 0', fontSize: '24px', fontWeight: 900, color: '#0f172a', lineHeight: 1.3 }}>
                  Hire Verified Drivers &amp; Certified Pilots
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                  Professional, police-verified chauffeurs and licensed commercial pilots ready on-demand. Choose your vehicle type and model on the right to book your chauffeur with instant 4-digit OTP security.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check"></i> 100% Background & Police Verified
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check"></i> Commercial DL & Endorsement Checked
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check"></i> Secure 4-Digit OTP Trip Authorization
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: VEHICLE TYPE SELECTOR + VEHICLE MODEL DROPDOWN + BOOKING FORM */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#f8fafc',
                overflowY: 'auto',
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                  padding: '26px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                {/* 1. VEHICLE TYPE BUTTON SELECTOR: Bike, Auto, Car, Bus, Truck, JCB, Tractor, Ship, Helicopter */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                    Select Vehicle Type
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {DRIVER_VEHICLE_OPTIONS.map((v) => {
                      const isSelected = selectedVehicleType === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVehicleType(v.id);
                            setShowModelDropdown(false);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                            color: isSelected ? '#047857' : '#475569',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <i className={`fa-solid ${v.icon}`} style={{ color: isSelected ? '#059669' : v.color }}></i>
                          <span>{v.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* 2. Service Type Section */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                      Service Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {SERVICE_TYPE_OPTIONS.map((opt) => {
                        const isSelected = serviceType === opt.id;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => setServiceType(opt.id)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                              backgroundColor: isSelected ? '#059669' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#334155',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. VEHICLE MODEL DROPDOWN */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                      Vehicle Model
                    </label>
                    <div
                      onClick={() => setShowModelDropdown((prev) => !prev)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #059669',
                        backgroundColor: '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className={`fa-solid ${currentCategory.icon}`} style={{ color: '#059669', fontSize: '16px' }}></i>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                            {selectedVehicleModel}
                          </div>
                          <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                            Category: {currentCategory.name}
                          </span>
                        </div>
                      </div>
                      <i className={`fa-solid fa-chevron-${showModelDropdown ? 'up' : 'down'}`} style={{ color: '#059669', fontSize: '12px' }}></i>
                    </div>

                    {showModelDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: 0,
                          right: 0,
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
                          zIndex: 50,
                          overflow: 'hidden',
                          maxHeight: '220px',
                          overflowY: 'auto'
                        }}
                      >
                        {currentCategory.models.map((mod) => (
                          <div
                            key={mod}
                            onClick={() => {
                              setSelectedVehicleModel(mod);
                              setShowModelDropdown(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '13px',
                              fontWeight: selectedVehicleModel === mod ? 800 : 600,
                              color: selectedVehicleModel === mod ? '#059669' : '#1e293b',
                              background: selectedVehicleModel === mod ? '#ecfdf5' : '#ffffff',
                              borderBottom: '1px solid #f1f5f9'
                            }}
                          >
                            <span>{mod}</span>
                            {selectedVehicleModel === mod && (
                              <i className="fa-solid fa-check" style={{ color: '#059669', fontSize: '12px' }}></i>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Pickup Location */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                      Pickup Location
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-regular fa-compass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}></i>
                      <input
                        type="text"
                        placeholder="Enter pickup address or city landmark"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 42px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* 5. Drop Location (If Outstation) */}
                  {serviceType.includes('outstation') && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Destination City / Outstation Drop
                      </label>
                      <div style={{ position: 'relative' }}>
                        <i className="fa-solid fa-location-dot" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}></i>
                        <input
                          type="text"
                          placeholder="Destination city or outstation landmark"
                          value={dropLocation}
                          onChange={(e) => setDropLocation(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '13.5px',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. Required Hours & Food Provided */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Required Hours
                      </label>
                      <select
                        value={requiredHours}
                        onChange={(e) => setRequiredHours(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                      >
                        {HOURS_OPTIONS.map((h, i) => (
                          <option key={i} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Food Provided By Customer
                      </label>
                      <select
                        value={foodProvided}
                        onChange={(e) => setFoodProvided(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No (Driver Allowance Added)</option>
                      </select>
                    </div>
                  </div>

                  {/* 7. Date & Time */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Reporting Date
                      </label>
                      <input
                        type="date"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Reporting Time
                      </label>
                      <input
                        type="time"
                        value={tripTime}
                        onChange={(e) => setTripTime(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* 8. Contact Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Mobile Phone Number (For 4-Digit OTP)
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 900,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                      transition: 'background 0.2s ease',
                      marginTop: '4px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Matching Verified Driver...</span>
                      </>
                    ) : (
                      <>
                        <span>Book Verified Driver for {currentCategory.name}</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : bookingStage === 'drivers_list' ? (
          <DriverSelectionList
            vehicleCategoryName={currentCategory.name}
            drivers={availableDrivers}
            selectedDriver={selectedDriverProfile}
            onSelectDriver={(driver) => setSelectedDriverProfile(driver)}
            pricingPlan={pricingPlan}
            setPricingPlan={setPricingPlan}
            pickupLocation={pickupLocation}
            onConfirmAndBook={handleSelectAndBookDriver}
            onBackToForm={() => setBookingStage('form')}
          />
        ) : (
          <DriverConfirmedView
            currentCategory={currentCategory}
            selectedVehicleModel={selectedVehicleModel}
            selectedDriverProfile={selectedDriverProfile}
            pickupLocation={pickupLocation}
            dropLocation={dropLocation}
            serviceType={serviceType}
            tripDate={tripDate}
            tripTime={tripTime}
            requiredHours={requiredHours}
            bookingRefId={bookingRefId}
            driverOtp={driverOtp}
            enteredOtp={enteredOtp}
            setEnteredOtp={setEnteredOtp}
            isOtpVerified={isOtpVerified}
            otpError={otpError}
            handleVerifyDriverOtp={handleVerifyDriverOtp}
            activeProofTab={activeProofTab}
            setActiveProofTab={setActiveProofTab}
            handleClose={handleClose}
            handleCancelBooking={handleCancelBooking}
            driverStatus={driverStatus}
            setDriverStatus={setDriverStatus}
            customerAccepted={customerAccepted}
            setCustomerAccepted={setCustomerAccepted}
            driverAccepted={driverAccepted}
            setDriverAccepted={setDriverAccepted}
          />
        )}
      </div>
    </div>
  );
}
