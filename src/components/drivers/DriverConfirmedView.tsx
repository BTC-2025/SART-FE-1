'use client';

import React, { useState } from 'react';
import { DriverVehicleOption, DriverProfile } from './driverData';

interface DriverConfirmedProps {
  currentCategory: DriverVehicleOption;
  selectedVehicleModel: string;
  selectedDriverProfile?: DriverProfile | null;
  pickupLocation: string;
  dropLocation: string;
  serviceType: string;
  tripDate: string;
  tripTime: string;
  requiredHours: string;
  bookingRefId: string;
  driverOtp: string;
  enteredOtp: string;
  setEnteredOtp: (v: string) => void;
  isOtpVerified: boolean;
  otpError: string;
  handleVerifyDriverOtp: (e: React.FormEvent) => void;
  activeProofTab: 'license' | 'badge' | 'aadhaar' | 'police';
  setActiveProofTab: (t: 'license' | 'badge' | 'aadhaar' | 'police') => void;
  handleClose: () => void;
  handleCancelBooking: (reason: string) => void;
  driverStatus: 'searching' | 'driver_found' | 'driver_accepted' | 'both_accepted' | 'trip_started' | 'cancelled';
  setDriverStatus: React.Dispatch<React.SetStateAction<'searching' | 'driver_found' | 'driver_accepted' | 'both_accepted' | 'trip_started' | 'cancelled'>>;
  customerAccepted: boolean;
  setCustomerAccepted: (v: boolean) => void;
  driverAccepted: boolean;
  setDriverAccepted: (v: boolean) => void;
}

export default function DriverConfirmedView({
  currentCategory,
  selectedVehicleModel,
  selectedDriverProfile,
  pickupLocation,
  serviceType,
  tripDate,
  tripTime,
  bookingRefId,
  driverOtp,
  enteredOtp,
  setEnteredOtp,
  isOtpVerified,
  otpError,
  handleVerifyDriverOtp,
  activeProofTab,
  setActiveProofTab,
  handleClose,
  handleCancelBooking,
  driverStatus,
  setDriverStatus,
  customerAccepted,
  setCustomerAccepted,
  driverAccepted,
  setDriverAccepted
}: DriverConfirmedProps) {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Driver communicating harshly or improperly');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);

  const driverHomeCity = pickupLocation ? pickupLocation.split(',')[0].trim() : 'Local City';

  const sampleDriver = {
    name: selectedDriverProfile?.name || 'Ramesh Krishnan',
    phone: selectedDriverProfile?.mobileNumber || '+91 98402 11984',
    avatar: selectedDriverProfile?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: selectedDriverProfile?.rating || 4.92,
    trips: selectedDriverProfile?.completedTrips || 3420,
    licenseNo: selectedDriverProfile?.licenseNumber || 'DL-072016-LMV-55104',
    badgeNo: selectedDriverProfile?.badgeNumber || 'PSV-CHAUFFEUR-8841',
    experience: selectedDriverProfile ? `${selectedDriverProfile.experienceYears}+ years verified driving` : '9+ years highway & city drive',
    nativeCity: selectedDriverProfile?.isLocalResident ? driverHomeCity : (selectedDriverProfile?.locationArea || driverHomeCity),
    isLocalResident: selectedDriverProfile ? selectedDriverProfile.isLocalResident : true,
    localArea: selectedDriverProfile?.locationArea || `Native resident of ${driverHomeCity} (Local verified within 3.5 km)`,
    policeStation: `${driverHomeCity} Central Police Division`,
    language: 'English, Tamil, Hindi & Local Dialect'
  };

  const startPhoneCall = () => {
    setShowCallModal(true);
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1500);
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#f8fafc', overflowY: 'auto', padding: '20px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Header Progress Banner */}
      <div
        style={{
          background: driverStatus === 'trip_started'
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            : '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
            Mutual Acceptance Confirmed
          </span>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
            Assigned Pilot: {sampleDriver.name}
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            Ref: <strong>#{bookingRefId}</strong> • Vehicle: {currentCategory.name} ({selectedVehicleModel}) • Reporting: {tripDate} at {tripTime}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={startPhoneCall}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-phone"></i>
            <span>Call Driver ({sampleDriver.phone})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #ef4444',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Cancel Order
          </button>
        </div>
      </div>

      {/* 2. Main Verified Driver Info & OTP Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px' }}>
        
        {/* Left: Driver Credentials & Verification Proofs */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Driver Identity Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
            <img
              src={sampleDriver.avatar}
              alt={sampleDriver.name}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #059669' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  {sampleDriver.name}
                </h3>
                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                  ★ {sampleDriver.rating} Verified Local
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
                Driving License: <strong style={{ color: '#0f172a' }}>{sampleDriver.licenseNo}</strong> • Badge: <strong>{sampleDriver.badgeNo}</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {sampleDriver.localArea} • {sampleDriver.experience}
              </div>
            </div>
          </div>

          {/* Verification Badges */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
              Police & Background Verification Details:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ color: '#15803d', fontWeight: 800 }}><i className="fa-solid fa-circle-check"></i> Police Clearance</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>Clean record, zero criminal history</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ color: '#15803d', fontWeight: 800 }}><i className="fa-solid fa-circle-check"></i> Commercial Endorsement</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>Govt badge endorsed for {currentCategory.name}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ color: '#15803d', fontWeight: 800 }}><i className="fa-solid fa-circle-check"></i> Aadhaar KYC Complete</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>Biometric verified native resident</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ color: '#15803d', fontWeight: 800 }}><i className="fa-solid fa-circle-check"></i> Zero-Penalty Guarantee</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>Safe driving score 99.4%</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: 4-Digit OTP Trip Authorization Box */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #059669', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(5, 150, 105, 0.08)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
              <i className="fa-solid fa-shield-check" style={{ fontSize: '18px' }}></i>
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }}>Trip Start Authorization</span>
            </div>
            
            <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
              4-Digit Start OTP
            </h4>
            
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              Share this code with {sampleDriver.name} upon physical arrival. The trip meter starts only when verified.
            </p>

            <div style={{ background: '#f0fdf4', border: '2px dashed #059669', borderRadius: '14px', padding: '16px', textAlign: 'center', margin: '16px 0' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Start Code</span>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#059669', letterSpacing: '6px', marginTop: '4px' }}>
                {driverOtp}
              </div>
            </div>

            {/* OTP Verification Form */}
            <form onSubmit={handleVerifyDriverOtp} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                Simulate Driver OTP Input:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 800, textAlign: 'center', letterSpacing: '2px', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: '#ffffff', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Verify & Start
                </button>
              </div>
              {otpError && <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>{otpError}</div>}
              {isOtpVerified && <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 800 }}>✓ OTP Verified! Trip Active.</div>}
            </form>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: '#64748b' }}>Emergency / Zero Penalty Cancel:</span>
            <button
              type="button"
              onClick={handleClose}
              style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
            >
              Done & Close
            </button>
          </div>
        </div>

      </div>

      {/* Call Driver Modal */}
      {showCallModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '24px', width: '320px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <i className="fa-solid fa-phone-volume"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900 }}>Calling {sampleDriver.name}...</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>{sampleDriver.phone}</p>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 800, marginTop: '6px' }}>Status: {callStatus}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowCallModal(false)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#ef4444', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '24px', width: '380px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>Cancel Driver Booking</h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
              If driver is speaking harshly or not reachable, cancel with zero penalty fee.
            </p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', outline: 'none' }}
            >
              <option value="Driver communicating harshly or improperly">Driver communicating harshly or improperly</option>
              <option value="Driver delayed / not reachable">Driver delayed / not reachable</option>
              <option value="Change of travel plans">Change of travel plans</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, cursor: 'pointer' }}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  handleCancelBooking(cancelReason);
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
