'use client';

import React from 'react';
import { ParkingSpot, VehicleTypeOption, DurationPack } from './parkingData';

interface ParkingStepFourProps {
  selectedSpot: ParkingSpot;
  selectedVehicleObj: VehicleTypeOption;
  selectedDurationObj: DurationPack;
  vehicleModelName: string;
  vehicleNumber: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  exceededMinutes: number;
  setExceededMinutes: React.Dispatch<React.SetStateAction<number>>;
  parkingTotal: number;
  overtimeAddon: number;
  taxesAndFees: number;
  finalPayable: number;
  isProcessingCheckout: boolean;
  setIsProcessingCheckout: (v: boolean) => void;
  checkoutSuccess: boolean;
  setCheckoutSuccess: (v: boolean) => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  handleClose: () => void;
}

export default function ParkingStepFour({
  selectedSpot,
  selectedVehicleObj,
  selectedDurationObj,
  vehicleModelName,
  vehicleNumber,
  checkInDate,
  checkInTime,
  checkOutDate,
  checkOutTime,
  exceededMinutes,
  setExceededMinutes,
  parkingTotal,
  overtimeAddon,
  taxesAndFees,
  finalPayable,
  isProcessingCheckout,
  setIsProcessingCheckout,
  checkoutSuccess,
  setCheckoutSuccess,
  setStep,
  handleClose
}: ParkingStepFourProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Top Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => setStep(3)}
            style={{
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#334155',
              fontSize: '14px',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Duration
          </button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
              Checkout &amp; Exit Clearance
            </h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Automated gate barrier opens immediately upon payment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', padding: '6px 14px', borderRadius: '20px', color: '#dc2626', fontSize: '12px', fontWeight: 800 }}>
            <i className="fa-solid fa-clock"></i> Live Overtime Billing
          </div>
        </div>

        {/* Red Exceeded Time Banner */}
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1.5px solid #fecaca',
            borderRadius: '16px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#dc2626'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#dc2626' }}>
              <i className="fa-regular fa-clock"></i>
            </div>
            <div>
              <span style={{ fontSize: '16px', fontWeight: 900 }}>
                Your time exceeded by {exceededMinutes} min!
              </span>
              <div style={{ fontSize: '13px', color: '#b91c1c', marginTop: '2px' }}>
                Additional overstay rate has been calculated and added to your exit clearance ticket.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#7f1d1d' }}>Simulate Exit Time:</span>
            <button
              type="button"
              onClick={() => setExceededMinutes((m: number) => Math.max(0, m - 10))}
              style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', color: '#dc2626' }}
            >
              -10m
            </button>
            <button
              type="button"
              onClick={() => setExceededMinutes((m: number) => m + 15)}
              style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', color: '#dc2626' }}
            >
              +15m
            </button>
          </div>
        </div>

        {/* Laptop Split Grid for Checkout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '28px',
            alignItems: 'start'
          }}
        >
          {/* Left Laptop Panel: Spot overview, Checkin/out times, Vehicle */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={selectedSpot.image}
                alt={selectedSpot.name}
                style={{ width: '90px', height: '80px', borderRadius: '14px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  {selectedSpot.name}
                </h4>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {selectedSpot.address}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '13px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>★ {selectedSpot.rating}</span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span style={{ color: '#64748b' }}>{selectedSpot.distance}</span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Bay A-14</span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, color: '#64748b', fontSize: '13px' }}>CHECK-IN :</span>
                  <span style={{ textDecoration: 'underline', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                    {checkInDate}, {checkInTime}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800, background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>Entry Logged</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, color: '#64748b', fontSize: '13px' }}>CHECK-OUT :</span>
                  <span style={{ textDecoration: 'underline', fontWeight: 800, color: '#dc2626', fontSize: '14px' }}>
                    {checkOutDate}, {checkOutTime}
                  </span>
                </div>
                <i className="fa-regular fa-pen-to-square" style={{ color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}></i>
              </div>
            </div>

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '18px' }}>
                  <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                </div>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>Vehicle details</span>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    {vehicleModelName} • <strong>{vehicleNumber || '7869'}</strong>
                  </div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-down" style={{ color: '#94a3b8', fontSize: '14px' }}></i>
            </div>
          </div>

          {/* Right Laptop Panel: Detailed Invoice, Payment Gateway & Checkout Button */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
              Payment Breakdown &amp; Clearance
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#475569' }}>
                <span>Base reserved parking ({selectedDurationObj.label})</span>
                <span style={{ fontWeight: 700 }}>₹{parkingTotal}.00</span>
              </div>

              {exceededMinutes > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#dc2626', fontWeight: 800 }}>
                  <span>{exceededMinutes} min overstay add-on</span>
                  <span>₹{overtimeAddon}.00</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#64748b' }}>
                <span>Taxes &amp; GST fees</span>
                <span style={{ fontWeight: 600 }}>₹{taxesAndFees.toFixed(2)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid #e2e8f0',
                  paddingTop: '16px',
                  marginTop: '6px'
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Total amount</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>₹{finalPayable.toFixed(2)}</span>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
                borderRadius: '14px',
                padding: '14px 18px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block' }}>Payment Method</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>PhonePe UPI Auto-Clear</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#5f259f',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '16px'
                  }}
                >
                  पे
                </div>
                <i className="fa-solid fa-chevron-down" style={{ color: '#94a3b8', fontSize: '14px' }}></i>
              </div>
            </div>

            {checkoutSuccess ? (
              <div
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #10b981',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  color: '#065f46'
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ fontSize: '32px', color: '#10b981', marginBottom: '8px' }}></i>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>Exit Barrier Opened!</div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>
                  Payment of ₹{finalPayable.toFixed(2)} received via PhonePe. Thank you for parking with SART.
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    marginTop: '16px',
                    padding: '10px 24px',
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Done (Return Home)
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsProcessingCheckout(true);
                  setTimeout(() => {
                    setIsProcessingCheckout(false);
                    setCheckoutSuccess(true);
                    if ((window as any).executeGenericBooking) {
                      (window as any).executeGenericBooking(
                        'parking',
                        `Parking Exit: ${selectedSpot.name}`,
                        `${selectedVehicleObj.label} (${vehicleNumber || '7869'}) • Duration ${selectedDurationObj.hours}h + ${exceededMinutes}m`,
                        finalPayable,
                        { spot: selectedSpot.name, vehicle: selectedVehicleObj.label, number: vehicleNumber || '7869' }
                      );
                    }
                  }, 1200);
                }}
                disabled={isProcessingCheckout}
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: '#facc15',
                  color: '#0f172a',
                  fontSize: '18px',
                  fontWeight: 900,
                  cursor: isProcessingCheckout ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(250, 204, 21, 0.45)',
                  transition: 'all 0.15s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#facc15'}
              >
                {isProcessingCheckout ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Processing Exit Barrier...</span>
                ) : (
                  'Checkout & Clear Barrier'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
