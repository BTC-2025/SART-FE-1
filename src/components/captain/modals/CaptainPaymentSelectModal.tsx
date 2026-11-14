'use client';

import React, { useState } from 'react';

interface CaptainPaymentSelectModalProps {
  fare: number;
  customerName?: string;
  onConfirmPayment: (method: 'cash' | 'online') => void;
  onClose: () => void;
}

export default function CaptainPaymentSelectModal({
  fare,
  customerName = 'Customer',
  onConfirmPayment,
  onClose
}: CaptainPaymentSelectModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'online'>('online');
  const [showQrStep, setShowQrStep] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleProceed = () => {
    if (selectedMethod === 'cash') {
      // Direct Cash completion - not credited to wallet
      onConfirmPayment('cash');
    } else {
      // Show UPI/PhonePe QR code to user
      setShowQrStep(true);
    }
  };

  const handleOnlineTransferDone = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmPayment('online');
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '28px 24px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '2px solid #e2e8f0'
        }}
      >
        {!showQrStep ? (
          <>
            {/* Step 1: Captain Chooses Payment Mode */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 16px auto'
              }}
            >
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Select Payment Method
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
              Ride with <strong>{customerName}</strong> is complete. How did the customer pay?
            </p>

            {/* Total Fare Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Total Ride Fare</span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>₹{fare}</span>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {/* Cash Option */}
              <div
                onClick={() => setSelectedMethod('cash')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: selectedMethod === 'cash' ? '2px solid #16a34a' : '1.5px solid #e2e8f0',
                  background: selectedMethod === 'cash' ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#dcfce7',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}
                  >
                    <i className="fa-solid fa-money-bill-wave"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Cash Payment</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Cash collected in hand • <strong>Will NOT be added to digital wallet</strong>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: selectedMethod === 'cash' ? '6px solid #16a34a' : '2px solid #cbd5e1'
                  }}
                ></div>
              </div>

              {/* Online (PhonePe / UPI) Option */}
              <div
                onClick={() => setSelectedMethod('online')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: selectedMethod === 'online' ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                  background: selectedMethod === 'online' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#dbeafe',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}
                  >
                    <i className="fa-solid fa-qrcode"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      Online Pay (PhonePe / UPI QR)
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Show QR to user • <strong>Credited to Captain wallet instantly</strong>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: selectedMethod === 'online' ? '6px solid #2563eb' : '2px solid #cbd5e1'
                  }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceed}
                style={{
                  flex: 2,
                  padding: '12px 20px',
                  background: selectedMethod === 'cash' ? '#16a34a' : '#2563eb',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                {selectedMethod === 'cash' ? 'Confirm Cash Collected' : 'Show PhonePe / UPI QR'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Show QR to User & Transfer Completed Button */}
            <div
              style={{
                background: '#5f259f',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <i className="fa-solid fa-mobile-screen"></i> PhonePe &amp; All UPI Apps Accepted
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
              Ask Customer to Scan &amp; Pay
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
              Amount: <strong style={{ color: '#0f172a', fontSize: '15px' }}>₹{fare}</strong>
            </p>

            {/* Live QR Image Box */}
            <div
              style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 16px auto',
                background: '#ffffff',
                border: '2px solid #cbd5e1',
                borderRadius: '14px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  `upi://pay?pa=sartcaptain@ybl&pn=SART_Captain&am=${fare}&cu=INR`
                )}`}
                alt="PhonePe UPI QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginBottom: '20px' }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i> Once paid, amount automatically credits to your Captain wallet
            </div>

            <button
              type="button"
              onClick={handleOnlineTransferDone}
              disabled={isVerifying}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: isVerifying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
              }}
            >
              {isVerifying ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Verifying Transfer...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i> Transfer Completed • Credit ₹{fare}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowQrStep(false)}
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ← Back to payment methods
            </button>
          </>
        )}
      </div>
    </div>
  );
}

