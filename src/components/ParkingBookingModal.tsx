// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import {
  ParkingSpot,
  VEHICLE_TYPES,
  DURATION_PACKS,
  MOCK_SPOTS_DATA
} from './parking/parkingData';
import ParkingStepOne from './parking/ParkingStepOne';
import ParkingStepTwo from './parking/ParkingStepTwo';
import ParkingStepThree from './parking/ParkingStepThree';
import ParkingStepFour from './parking/ParkingStepFour';

interface ParkingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ParkingBookingModal({ isOpen, onClose }: ParkingBookingModalProps) {
  // Navigation / Stepper State:
  // step 1: Search Form
  // step 2: Discovery Screen & Map
  // step 3: Duration / Details Screen
  // step 4: Checkout & Overstay Summary
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Inputs
  const [city, setCity] = useState('Gurugram');
  const [vehicleType, setVehicleType] = useState('car');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModelName, setVehicleModelName] = useState('Grazia');
  const [isLiveLocationOn, setIsLiveLocationOn] = useState(false);
  const [liveLocationStatus, setLiveLocationStatus] = useState<string>('Live location off');
  const [userCoords, setUserCoords] = useState<[number, number]>([28.4595, 77.0266]);

  // Discovery State
  const [filterTab, setFilterTab] = useState<'recommended' | 'cheapest' | 'closest'>('recommended');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot>(MOCK_SPOTS_DATA.default[0]);

  // Duration / Booking Details State
  const [selectedDuration, setSelectedDuration] = useState('1hr');
  const [checkInTime, setCheckInTime] = useState('10:42 AM');
  const [checkInDate, setCheckInDate] = useState(() => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  });
  const [checkOutTime, setCheckOutTime] = useState('12:53 AM');
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  });

  // Checkout / Leaving Time Tracker
  const [exceededMinutes, setExceededMinutes] = useState(20);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Toggle Live Location
  const toggleLiveLocation = () => {
    if (!isLiveLocationOn) {
      setLiveLocationStatus('Acquiring GPS...');
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setUserCoords([lat, lng]);
            setIsLiveLocationOn(true);
            setLiveLocationStatus('Live GPS Active • Showing Available Slots Near You');
          },
          () => {
            setIsLiveLocationOn(true);
            setLiveLocationStatus('Live GPS Active (Approximate Area)');
          },
          { timeout: 8000 }
        );
      } else {
        setIsLiveLocationOn(true);
        setLiveLocationStatus('Live GPS Active');
      }
    } else {
      setIsLiveLocationOn(false);
      setLiveLocationStatus('Live location off');
    }
  };

  // Adjust coordinates when city changes
  useEffect(() => {
    if (city === 'Gurugram') setUserCoords([28.4595, 77.0266]);
    else if (city === 'Trivandrum') setUserCoords([8.4908, 76.9246]);
    else if (city === 'Bengaluru') setUserCoords([12.9716, 77.5946]);
    else if (city === 'Chennai') setUserCoords([13.0827, 80.2707]);
    else if (city === 'Mumbai') setUserCoords([19.0760, 72.8777]);
    else if (city === 'Hyderabad') setUserCoords([17.3850, 78.4867]);
  }, [city]);

  const handleClose = () => {
    setStep(1);
    setCheckoutSuccess(false);
    setIsProcessingCheckout(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedVehicleObj = VEHICLE_TYPES.find(v => v.id === vehicleType) || VEHICLE_TYPES[1];
  const selectedDurationObj = DURATION_PACKS.find(d => d.id === selectedDuration) || DURATION_PACKS[0];

  const baseRate = selectedVehicleObj.baseRate;
  const rawSubtotal = baseRate * selectedDurationObj.hours;
  const discount = selectedDurationObj.discount;
  const parkingTotal = Math.max(10, rawSubtotal - discount);

  const hourlyRate = baseRate;
  const overtimeAddon = exceededMinutes > 0 ? Math.ceil((exceededMinutes / 60) * hourlyRate) + 50 : 0;
  const taxesAndFees = Math.round((parkingTotal + overtimeAddon) * 0.18 * 100) / 100;
  const finalPayable = Math.round((parkingTotal + overtimeAddon + taxesAndFees) * 100) / 100;

  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleType) {
      alert('Please select your vehicle type');
      return;
    }
    setStep(2);
  };

  const spotsList = MOCK_SPOTS_DATA.default.map((spot) => {
    const scaledPerHour = Math.round(spot.pricePerHour * (baseRate / 50));
    return {
      ...spot,
      pricePerHour: scaledPerHour,
      priceDisplay: `₹${scaledPerHour}/hr`
    };
  });

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
        className="modal-sheet centered-modal parking-booking-modal-sheet"
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

        {/* Global Modal Header Bar */}
        <div
          style={{
            padding: '12px 24px',
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
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
              }}
            >
              <i className="fa-solid fa-square-parking"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  Smart Parking & Spot Reservations
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    background: isLiveLocationOn ? '#ecfdf5' : '#fef3c7',
                    color: isLiveLocationOn ? '#059669' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: isLiveLocationOn ? '#10b981' : '#f59e0b',
                      display: 'inline-block'
                    }}
                  ></span>
                  {isLiveLocationOn ? 'LIVE RADAR ON' : 'GPS STANDBY'}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Real-time parking spot discovery • Instant reservation • Automated exit timing billing
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 1 ? 800 : 600,
                  color: step === 1 ? '#059669' : '#94a3b8',
                  background: step === 1 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                1. Vehicle & Location
              </span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#cbd5e1' }}></i>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 2 ? 800 : 600,
                  color: step === 2 ? '#059669' : '#94a3b8',
                  background: step === 2 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                2. Live Spots & Map
              </span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#cbd5e1' }}></i>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 3 ? 800 : 600,
                  color: step === 3 ? '#059669' : '#94a3b8',
                  background: step === 3 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                3. Timing & Pass
              </span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#cbd5e1' }}></i>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 4 ? 800 : 600,
                  color: step === 4 ? '#059669' : '#94a3b8',
                  background: step === 4 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                4. Leaving Checkout
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* STEP 1: Search Form */}
        {step === 1 && (
          <ParkingStepOne
            city={city}
            setCity={setCity}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            vehicleNumber={vehicleNumber}
            setVehicleNumber={setVehicleNumber}
            isLiveLocationOn={isLiveLocationOn}
            liveLocationStatus={liveLocationStatus}
            toggleLiveLocation={toggleLiveLocation}
            handleStartSearch={handleStartSearch}
          />
        )}

        {/* STEP 2: Discovery Screen & Map */}
        {step === 2 && (
          <ParkingStepTwo
            city={city}
            selectedVehicleObj={selectedVehicleObj}
            vehicleNumber={vehicleNumber}
            filterTab={filterTab}
            setFilterTab={setFilterTab}
            selectedSpot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
            spotsList={spotsList}
            userCoords={userCoords}
            setStep={setStep}
          />
        )}

        {/* STEP 3: Duration & Spot Details */}
        {step === 3 && (
          <ParkingStepThree
            selectedSpot={selectedSpot}
            selectedVehicleObj={selectedVehicleObj}
            vehicleModelName={vehicleModelName}
            vehicleNumber={vehicleNumber}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            checkInTime={checkInTime}
            checkInDate={checkInDate}
            checkOutTime={checkOutTime}
            checkOutDate={checkOutDate}
            parkingTotal={parkingTotal}
            setStep={setStep}
          />
        )}

        {/* STEP 4: Checkout & Overstay Exit Billing */}
        {step === 4 && (
          <ParkingStepFour
            selectedSpot={selectedSpot}
            selectedVehicleObj={selectedVehicleObj}
            selectedDurationObj={selectedDurationObj}
            vehicleModelName={vehicleModelName}
            vehicleNumber={vehicleNumber}
            checkInDate={checkInDate}
            checkInTime={checkInTime}
            checkOutDate={checkOutDate}
            checkOutTime={checkOutTime}
            exceededMinutes={exceededMinutes}
            setExceededMinutes={setExceededMinutes}
            parkingTotal={parkingTotal}
            overtimeAddon={overtimeAddon}
            taxesAndFees={taxesAndFees}
            finalPayable={finalPayable}
            isProcessingCheckout={isProcessingCheckout}
            setIsProcessingCheckout={setIsProcessingCheckout}
            checkoutSuccess={checkoutSuccess}
            setCheckoutSuccess={setCheckoutSuccess}
            setStep={setStep}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}
