'use client';

import React, { useState } from 'react';

export interface PaymentOptionDetails {
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  upiApp?: 'gpay' | 'phonepe' | 'paytm' | 'other';
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  bankName?: string;
}

interface TrainPaymentModalProps {
  amount: number;
  trainName: string;
  trainNumber: string;
  classCode: string;
  passengersCount: number;
  onPaymentSuccess: (details: PaymentOptionDetails) => void;
  onClose: () => void;
}

export default function TrainPaymentModal({
  amount,
  trainName,
  trainNumber,
  classCode,
  passengersCount,
  onPaymentSuccess,
  onClose
}: TrainPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        method: selectedMethod,
        upiApp: selectedMethod === 'upi' ? selectedUpiApp : undefined,
        upiId: selectedMethod === 'upi' ? upiId : undefined,
        cardNumber: selectedMethod === 'card' ? cardNumber : undefined,
        cardName: selectedMethod === 'card' ? cardName : undefined,
        bankName: selectedMethod === 'netbanking' ? selectedBank : undefined
      });
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        zIndex: 100001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              Secure Payment Gateway
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>
              {trainName} ({trainNumber}) • {classCode}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#334155',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Fare Summary Strip */}
        <div style={{
          background: '#f8fafc',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Amount to Pay ({passengersCount} Passenger{passengersCount > 1 ? 's' : ''}):</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
            ₹{amount.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
            Choose Payment Option
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { id: 'upi', label: 'UPI / QR', icon: 'fa-qrcode' },
              { id: 'card', label: 'Cards', icon: 'fa-credit-card' },
              { id: 'netbanking', label: 'Net Banking', icon: 'fa-building-columns' },
              { id: 'wallet', label: 'Wallets', icon: 'fa-wallet' }
            ].map(m => {
              const isSelected = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethod(m.id as any)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    color: isSelected ? '#0284c7' : '#475569',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className={`fa-solid ${m.icon}`} style={{ fontSize: '18px' }}></i>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* UPI Method View */}
          {selectedMethod === 'upi' && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                Select UPI App
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                {[
                  { id: 'gpay', name: 'Google Pay' },
                  { id: 'phonepe', name: 'PhonePe' },
                  { id: 'paytm', name: 'Paytm' }
                ].map(app => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id as any)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1.5px solid ${selectedUpiApp === app.id ? '#16a34a' : '#cbd5e1'}`,
                      background: selectedUpiApp === app.id ? '#f0fdf4' : '#ffffff',
                      color: selectedUpiApp === app.id ? '#16a34a' : '#0f172a',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {app.name}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                  Or enter Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okaxis or 9876543210@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Card Method View */}
          {selectedMethod === 'card' && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Card Number (16 digits)"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <input
                type="text"
                placeholder="Name on Card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>
          )}

          {/* Netbanking Method View */}
          {selectedMethod === 'netbanking' && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {/* Wallet Method View */}
          {selectedMethod === 'wallet' && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
              <i className="fa-solid fa-wallet" style={{ fontSize: '24px', color: '#0284c7', marginBottom: '8px' }}></i>
              <div>Pay via Amazon Pay, Mobikwik or Airtel Money</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '13px',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isProcessing}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '8px',
              background: isProcessing ? '#94a3b8' : '#16a34a',
              border: 'none',
              fontWeight: 800,
              fontSize: '14px',
              color: '#ffffff',
              cursor: isProcessing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)'
            }}
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Processing Payment...
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock"></i> Pay ₹{amount.toLocaleString('en-IN')} & Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

