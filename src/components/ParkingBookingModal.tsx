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
