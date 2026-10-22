'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RentalMasterCategory, RentalVehicle } from './rentalData';

const LiveTrackerMap = dynamic(() => import('@/components/LeafletMapClient'), { ssr: false });

interface RentalStepThreeProps {
  activeMaster: RentalMasterCategory;
  activeVehicle: RentalVehicle | undefined;
  pickup: string;
  dropoff: string;
  returnToSameLocation: boolean;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  durationPlan: '1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom';
  customDays: number;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerAge: string;
  setCustomerAge: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  docType: 'dl' | 'aadhaar' | 'pan';
  setDocType: (v: 'dl' | 'aadhaar' | 'pan') => void;
  docNumber: string;
  setDocNumber: (v: string) => void;
  uploadedDocName: string;
  setUploadedDocName: (v: string) => void;
  isDocVerified: boolean;
  setIsDocVerified: (v: boolean) => void;
  isProcessing: boolean;
  isConfirmed: boolean;
  setIsConfirmed: (v: boolean) => void;
  setStep: (step: 1 | 2 | 3) => void;
  handleBook: () => void;
  handleFinalConfirm: () => void;
}

export default function RentalStepThree({
  activeMaster,
  activeVehicle,
  pickup,
  dropoff,
  returnToSameLocation,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  durationPlan,
  customDays,
  customerName,
  setCustomerName,
  customerAge,
  setCustomerAge,
  customerPhone,
  setCustomerPhone,
  docType,
  setDocType,
  docNumber,
  setDocNumber,
  uploadedDocName,
  setUploadedDocName,
  isDocVerified,
  setIsDocVerified,
  isProcessing,
  isConfirmed,
  setIsConfirmed,
  setStep,
  handleBook,
  handleFinalConfirm
}: RentalStepThreeProps) {
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpError, setOtpError] = React.useState('');

  const chosenDays = durationPlan === '1day' ? 1
    : durationPlan === '3days' ? 3
      : durationPlan === '1week' ? 7
        : durationPlan === '2weeks' ? 14
          : durationPlan === '1month' ? 30
            : (customDays || 1);

  const chosenLabel = durationPlan === '1day' ? '1 Day'
    : durationPlan === '3days' ? '3 Days'
      : durationPlan === '1week' ? '1 Week (7 Days)'
        : durationPlan === '2weeks' ? '2 Weeks (14 Days)'
          : durationPlan === '1month' ? '1 Month (30 Days)'
            : `${chosenDays} Days`;

  const baseAmount = (activeVehicle?.price || 1500) * chosenDays;
  const taxAmount = Math.round(baseAmount * 0.18);
  const totalPayable = baseAmount + taxAmount;

  const handleInitiateVerification = () => {
    if (!customerPhone || customerPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile phone number');
      return;
    }
    setOtpSent(true);
    setShowOtpModal(true);
    setOtpCode('');
    setOtpError('');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 4 || otpCode === '1234') {
      setShowOtpModal(false);
      handleBook();
    } else {
      setOtpError('Please enter the 4-digit code sent to your phone (demo: 1234)');
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: '80vh', overflow: 'hidden' }}>
      {/* Left Sidebar (Booking Form) */}
      <div style={{ flex: 1, minWidth: 0, background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 20 }}>
          <button onClick={() => setStep(2)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>Booking Summary</h2>
        </div>

        {!isProcessing && !isConfirmed ? (
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '18px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
              <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                <img
                  src={activeVehicle?.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'}
                  alt={activeVehicle?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>{activeVehicle?.name}</div>
              <div style={{ fontSize: '12.5px', color: '#6b7280', marginBottom: '14px' }}>
                {activeVehicle?.seats} • {activeVehicle?.transmission} • {activeVehicle?.fuel}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 0', borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Pickup Location</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{pickup || 'Truro'}</span>
                </div>
                {!returnToSameLocation && dropoff && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Return Location</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{dropoff}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Pick-up Time</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{pickupDate} • {pickupTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Return Time</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{dropoffDate} • {dropoffTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Vehicle Distance</span>
                  <span style={{ fontWeight: '700', color: '#0284c7' }}>{activeVehicle?.distance || '1.2 km'}</span>
                </div>
              </div>

              {/* Fare breakdown */}
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Rental Duration</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{chosenLabel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Base Rate (₹{activeVehicle?.price || 1500}/day × {chosenDays})</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{baseAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Taxes & Insurance (18%)</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{taxAmount}</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '6px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total Payable</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7' }}>
                    ₹{totalPayable}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Details & KYC Document Verification Form */}
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    <i className="fa-solid fa-id-card"></i>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Driver & Document Verification</span>
                </div>
                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  Required for Handover
                </span>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Full Name (As per Govt ID)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={85}
                    value={customerAge}
                    onChange={(e) => setCustomerAge(e.target.value)}
                    placeholder="Enter age (18+)"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Select Document for Verification
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'dl' as const, label: 'Driving License', icon: 'fa-id-card' },
                    { id: 'aadhaar' as const, label: 'Aadhaar Card', icon: 'fa-fingerprint' },
                    { id: 'pan' as const, label: 'PAN Card', icon: 'fa-address-card' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setDocType(d.id);
                        if (d.id === 'dl') setDocNumber('DL-04-2023-0091823');
                        else if (d.id === 'aadhaar') setDocNumber('XXXX-XXXX-4819');
                        else if (d.id === 'pan') setDocNumber('ABCDE1234F');
                      }}
                      style={{
                        padding: '8px 6px',
                        borderRadius: '8px',
                        border: docType === d.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        background: docType === d.id ? '#f0f9ff' : '#ffffff',
                        color: docType === d.id ? '#0369a1' : '#334155',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <i className={`fa-solid ${d.icon}`}></i>
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  {docType === 'dl' ? 'Driving License Number' : docType === 'aadhaar' ? 'Aadhaar Card Number' : 'PAN Card Number'}
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Enter document number"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Upload Document Copy (Front & Back)
                </label>
                <label style={{
                  border: '2px dashed #93c5fd',
                  borderRadius: '10px',
                  padding: '14px',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedDocName(e.target.files[0].name);
                        setIsDocVerified(true);
                      }
                    }}
                  />
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: '#0284c7', marginBottom: '6px' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                    {uploadedDocName ? `Uploaded: ${uploadedDocName}` : 'Click to Upload Document (Photo / PDF)'}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                    JPG, PNG, PDF up to 10MB
                  </span>
                </label>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#b45309', fontSize: '13px', marginTop: '2px' }}></i>
                <div style={{ fontSize: '11px', color: '#92400e', lineHeight: 1.4 }}>
                  <strong>Mandatory Original Copy Notice:</strong> When taking delivery of the vehicle, you must submit and physically verify the <strong>original physical copy</strong> of your Driving License / Aadhaar / PAN card to the vehicle owner or hub representative.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleInitiateVerification}
                style={{ flex: 2, padding: '14px', borderRadius: '10px', border: 'none', background: '#f25a1b', color: '#ffffff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(242, 90, 27, 0.3)' }}
              >
                Verify & Confirm Booking
              </button>
            </div>
          </div>
        ) : isConfirmed ? (
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#f9fafb', overflowY: 'auto' }}>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <i className="fa-solid fa-circle-check"></i> You booked this vehicle successfully!
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '18px', background: '#fff', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{activeVehicle?.name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#0ea5e9' }}></i> Pickup: {pickup || 'Truro'} ({activeVehicle?.distance || '1.2 km'})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '17px', fontWeight: '900', color: '#111827', letterSpacing: '1px' }}>KA 04 R 9081</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>License Plate</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>Booking PIN</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#0ea5e9', letterSpacing: '4px' }}>8420</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>Ready for Pickup</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#166534', fontWeight: 600 }}>Booked By:</span>
                  <span style={{ fontWeight: 800, color: '#14532d' }}>{customerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#166534', fontWeight: 600 }}>Verified Document:</span>
                  <span style={{ fontWeight: 800, color: '#14532d' }}>
                    {docType === 'dl' ? 'Driving License' : docType === 'aadhaar' ? 'Aadhaar' : 'PAN'} ({docNumber})
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '15px' }}>
                <i className="fa-solid fa-file-shield"></i>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 800, color: '#991b1b' }}>
                  Mandatory Original Document Submission to Owner
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#7f1d1d', lineHeight: 1.45 }}>
                  When giving you the vehicle key, you <strong>must submit the original physical copy</strong> of your Driving License / Aadhaar / PAN card to the owner / hub partner for physical security check before keys are released.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                Message Hub
              </button>
              <button style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                Call Hub
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => { setIsConfirmed(false); setStep(2); }}
                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel Booking
              </button>
              <button
                onClick={handleFinalConfirm}
                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#111827', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
              >
                Finish
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
            {isProcessing && (
              <>
                <div style={{ width: '48px', height: '48px', border: `4px solid #0284c720`, borderTop: `4px solid #0284c7`, borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Securing Booking...</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Please wait while we process your request.</p>
                <style>{`
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Vehicle Diagnostics, Working Condition & 100px x 200px Mini Map */}
      <div style={{ width: '380px', minWidth: '380px', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px', gap: '16px' }}>

        {/* Map & Live Hub Location Banner */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '14px', display: 'flex', gap: '14px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {/* Map box: EXACT width 100px, height 200px */}
          <div style={{ width: '300px', minWidth: '300px', height: '200px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1.5px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            <LiveTrackerMap
              key="rental-map"
              vehicleIconClass={activeVehicle?.icon || 'fa-car'}
              pickup={pickup || 'Truro'}
              dropoff=""
              isSearching={false}
            />
            <div style={{ position: 'absolute', bottom: '6px', left: '4px', right: '4px', zIndex: 1000, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '3px 4px', borderRadius: '6px', fontSize: '9px', fontWeight: 800, textAlign: 'center' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginRight: '4px' }}></span>
              Live GPS
            </div>
          </div>


        </div>

        {/* Working Condition & Health Diagnostics */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                <i className="fa-solid fa-stethoscope"></i>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>Vehicle Working Condition</span>
            </div>
            <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '10px', fontWeight: 800 }}>
              100% Certified
            </span>
          </div>

          {/* Condition Progress Meters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                <span>Engine Health</span>
                <span style={{ color: '#16a34a', fontWeight: 900 }}>98% Excellent</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: '#16a34a', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                <span>Tyre Tread Depth</span>
                <span style={{ color: '#16a34a', fontWeight: 900 }}>95% Good</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: '#16a34a', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                <span>Brake System</span>
                <span style={{ color: '#0284c7', fontWeight: 900 }}>Tested / Serviced</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', background: '#0284c7', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                <span>Air Conditioning</span>
                <span style={{ color: '#16a34a', fontWeight: 900 }}>Ice Cold</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#16a34a', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          {/* Detailed Condition Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {[
              { icon: 'fa-shield-halved', label: '54-Point Safety Inspection Passed', sub: 'Last serviced 4 days ago by certified technicians' },
              { icon: 'fa-soap', label: 'Deep Cleaned & Sanitized', sub: 'Odorless interior, vacuumed carpets, sanitized touchpoints' },
              { icon: 'fa-gauge-high', label: 'Odometer Certified & Valid RC', sub: 'Non-tampered digital odometer with valid pollution & insurance' },
              { icon: 'fa-gas-pump', label: 'Full Tank To Full Tank Handover', sub: 'Delivered at full fuel mark; return at same fuel level' },
              { icon: 'fa-kit-medical', label: 'First Aid Kit & Emergency Tool Kit', sub: 'Equipped with spare wheel, jack & puncture repair kit' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                <i className={`fa-solid ${item.icon}`} style={{ color: '#0284c7', marginTop: '2px' }}></i>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Technical Specifications */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            Technical Specifications
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div style={{ color: '#64748b' }}>Model Year: <strong style={{ color: '#0f172a' }}>{activeVehicle?.year || 2023}</strong></div>
            <div style={{ color: '#64748b' }}>Transmission: <strong style={{ color: '#0f172a' }}>{activeVehicle?.transmission || 'Manual'}</strong></div>
            <div style={{ color: '#64748b' }}>Fuel Type: <strong style={{ color: '#0f172a' }}>{activeVehicle?.fuel || 'Petrol'}</strong></div>
            <div style={{ color: '#64748b' }}>Capacity: <strong style={{ color: '#0f172a' }}>{activeVehicle?.seats || '5 Seats'}</strong></div>
            <div style={{ color: '#64748b' }}>Engine: <strong style={{ color: '#0f172a' }}>{activeVehicle?.engine || '1.2L K-Series DualJet'}</strong></div>
            <div style={{ color: '#64748b' }}>Included Kms: <strong style={{ color: '#0f172a' }}>{activeVehicle?.kms || '500 Kms/day'}</strong></div>
          </div>
        </div>
      </div>

      {/* OTP Mobile Verification Modal */}
      {showOtpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowOtpModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              animation: 'fbFadeInDown 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Mobile Verification</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>OTP sent to +91 {customerPhone}</span>
                </div>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> We sent a 4-digit security code to your mobile phone.
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Enter 4-Digit OTP
              </label>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError('');
                }}
                placeholder="• • • •"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: otpError ? '2px solid #ef4444' : '1.5px solid #cbd5e1',
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '8px',
                  textAlign: 'center',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
              {otpError && (
                <span style={{ fontSize: '11.5px', color: '#ef4444', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                  {otpError}
                </span>
              )}
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'block', textAlign: 'center' }}>
                Tip: Enter code <strong>1234</strong> or any 4 digits to proceed.
              </span>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              <span>Verify & Complete Booking</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
