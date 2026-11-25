'use client';

import React, { useRef } from 'react';
import { CheckCircle2, QrCode, Download, Printer, X, ShieldCheck } from 'lucide-react';

export interface TicketPassenger {
  name: string;
  gender: string;
  age: number | string;
  idProof: string;
  status: string;
}

export interface HelicopterTicketProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  bookingDateTime?: string;
  reportingTime?: string;
  passengersCount?: number;
  sourceHelipad?: string;
  destHelipad?: string;
  journeyDate?: string;
  flightWindow?: string;
  operatorName?: string;
  heliModel?: string;
  passengers?: TicketPassenger[];
  baseFare?: number;
  excessWeightCharge?: number;
  irctcConvenienceFee?: number;
  totalPaid?: number;
}

export default function HelicopterTicketModal({
  isOpen,
  onClose,
  bookingId = '1680306985',
  bookingDateTime = '20-04-2024 10:32 PM',
  reportingTime = '17-10-2024 8:00 AM (Mandatory 1 hr before flight)',
  passengersCount = 2,
  sourceHelipad = 'Phata (Pawan Hans Helipad)',
  destHelipad = 'Shri Kedarnath (Kedarnath Helipad)',
  journeyDate = '17-10-2024',
  flightWindow = '09:00 AM - 12:00 PM',
  operatorName = 'Pawan Hans Limited',
  heliModel = 'Bell 407',
  passengers = [
    { name: 'VIJAY KASHINATH KUMKAR', gender: 'Male', age: 53, idProof: 'Aadhaar (Verified)', status: 'CONFIRMED' },
    { name: 'MANISHA VIJAY KUMKAR', gender: 'Female', age: 49, idProof: 'Aadhaar (Verified)', status: 'CONFIRMED' }
  ],
  baseFare = 5774.00,
  excessWeightCharge = 0.00,
  irctcConvenienceFee = 354.00,
  totalPaid = 6128.00
}: HelicopterTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Modal Toolbar (Not printed) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            backgroundColor: '#0f172a',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700 }}>
            <span>🚁 Official Helicopter Passenger Ticket</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                backgroundColor: '#391E84',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} /> Print / Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Ticket Body matching Image 1 */}
        <div
          ref={ticketRef}
          style={{
            padding: '28px 32px',
            overflowY: 'auto',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            color: '#0f172a'
          }}
        >
          {/* 1. Header Title & Status Badges */}
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '0.3px',
                color: '#0a2540',
                margin: '0 0 10px 0',
                textTransform: 'uppercase'
              }}
            >
              HELICOPTER BOARDING TICKET &amp; BOOKING CONFIRMATION
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}
              >
                STATUS: CONFIRMED
              </span>
              <span
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}
              >
                BOOKING TYPE: GENERAL
              </span>
              <span
                style={{
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}
              >
                JOURNEY TYPE: ONE-WAY
              </span>
            </div>
          </div>

          {/* 2. Top Metadata Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.6fr 1.2fr 2fr',
              gap: '12px',
              padding: '12px 14px',
              borderTop: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0',
              fontSize: '11.5px',
              marginBottom: '20px'
            }}
          >
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>🏷️ Booking ID:</span>
              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{bookingId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>📅 Booking Date &amp; Time:</span>
              <strong style={{ fontSize: '12px', color: '#0f172a' }}>{bookingDateTime}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>👥 Passengers:</span>
              <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{passengersCount} Adult{passengersCount > 1 ? 's' : ''}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>⏰ Reporting Time:</span>
              <strong style={{ fontSize: '12px', color: '#0f172a' }}>{reportingTime}</strong>
            </div>
          </div>

          {/* 3. Onward Journey Box + Helipad QR Code Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1.2fr', gap: '16px', marginBottom: '22px' }}>
            {/* Journey Box */}
            <div
              style={{
                border: '1.5px solid #0f172a',
                borderRadius: '12px',
                position: 'relative',
                padding: '20px 16px 16px'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '14px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px'
                }}
              >
                ONWARD JOURNEY
              </span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                {/* Source */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {sourceHelipad.split('(')[0].trim()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {sourceHelipad.includes('(') ? sourceHelipad.split('(')[1].replace(')', '') : 'Departure Helipad'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 700, marginTop: '4px' }}>
                    {journeyDate}
                  </div>
                  <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 700 }}>
                    {flightWindow}
                  </div>
                </div>

                {/* Track */}
                <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1, height: '1.5px', backgroundColor: '#0f172a' }} />
                    <span style={{ fontSize: '16px', margin: '0 6px' }}>🚁</span>
                    <div style={{ flex: 1, height: '1.5px', backgroundColor: '#0f172a' }} />
                    <span style={{ fontSize: '14px', marginLeft: '-3px' }}>→</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', marginTop: '4px' }}>
                    {operatorName} • {heliModel}
                  </span>
                </div>

                {/* Destination */}
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {destHelipad.split('(')[0].trim()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {destHelipad.includes('(') ? destHelipad.split('(')[1].replace(')', '') : 'Arrival Helipad'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 700, marginTop: '4px' }}>
                    {journeyDate}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Verification Box */}
            <div
              style={{
                border: '1.5px solid #0f172a',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                SCAN AT HELIPAD TO BOARD / VERIFY TICKET
              </div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=SART-DGCA-${bookingId}`}
                alt="Ticket QR Code"
                style={{ width: '95px', height: '95px', display: 'block', margin: '0 auto' }}
              />
              <span style={{ fontSize: '9px', color: '#64748b', marginTop: '6px' }}>
                Scan this QR code or show on official white paper.
              </span>
            </div>
          </div>

          {/* 4. Passenger Details Table */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
              PASSENGER DETAILS ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '11.5px',
                border: '1px solid #cbd5e1'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '8px', textAlign: 'center', width: '45px', borderRight: '1px solid #cbd5e1' }}>S No.</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #cbd5e1' }}>Passenger Name</th>
                  <th style={{ padding: '8px', textAlign: 'center', width: '70px', borderRight: '1px solid #cbd5e1' }}>Gender</th>
                  <th style={{ padding: '8px', textAlign: 'center', width: '55px', borderRight: '1px solid #cbd5e1' }}>Age</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #cbd5e1' }}>ID Proof</th>
                  <th style={{ padding: '8px', textAlign: 'center', width: '95px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                      {p.gender}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                      {p.age}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#475569' }}>
                      {p.idProof}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 900 }}>
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. GST & Service Provider Details */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
              GST &amp; SERVICE PROVIDER DETAILS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px', fontSize: '11px', lineHeight: '1.6' }}>
                <div>Operator: <strong>{operatorName.toUpperCase()}</strong></div>
                <div>GSTIN: <strong>07AAACP1561A1Z1</strong></div>
                <div>Place of Supply: <strong>Uttarakhand</strong></div>
                <div>Booker State: <strong>Delhi</strong></div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px', fontSize: '11px', lineHeight: '1.6' }}>
                <div>Service Provider Name: <strong>SART / IRCTC PARTNER</strong></div>
                <div>GSTIN: <strong>07AAACI7074F1ZM</strong></div>
                <div>State Code: <strong>Delhi</strong></div>
                <div>Booker Name / GST: <strong>-</strong></div>
              </div>
            </div>
          </div>

          {/* 6. Fare & Transaction Summary */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.6fr',
              gap: '20px',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            {/* Fare Breakdown */}
            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '12.5px', marginBottom: '4px' }}>
                FARE &amp; TRANSACTION SUMMARY
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Helicopter Base Fare</span>
                <strong style={{ color: '#0f172a' }}>₹ {baseFare.toLocaleString('en-IN')}.00</strong>
              </div>
              {excessWeightCharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>Excess Weight Surcharge</span>
                  <strong style={{ color: '#ea580c' }}>₹ {excessWeightCharge.toLocaleString('en-IN')}.00</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Convenience &amp; DGCA Fee</span>
                <strong style={{ color: '#0f172a' }}>₹ {irctcConvenienceFee.toLocaleString('en-IN')}.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '4px', fontWeight: 800 }}>
                <span>Total (Including GST)</span>
                <span>₹ {totalPaid.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            {/* Total Paid Badge */}
            <div
              style={{
                backgroundColor: '#0a2540',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '14px 18px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.5px' }}>
                TOTAL PAID
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, margin: '2px 0 6px 0' }}>
                ₹ {totalPaid.toLocaleString('en-IN')}.00
              </div>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '4px'
                }}
              >
                Payment Status: PAID • Transaction Successful
              </div>
            </div>
          </div>

          {/* 7. Important Travel Info & Barcode footer */}
          <div style={{ fontSize: '10.5px', color: '#475569', lineHeight: '1.4', marginBottom: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <strong>Important Travel Info:</strong> Please report at least 60 minutes before Reporting Time ({reportingTime.split('(')[0].trim()}). Government photo ID (Aadhaar/Passport) and Yatra registration are mandatory at check-in. Max body weight 80kg base limit applies.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '10px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '20px', letterSpacing: '3px', fontWeight: 900 }}>
              ||| | ||||| || |||| | ||| || |||
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
              <div>Authorized Stamp : UCADA &amp; IRCTC</div>
              <div>Helpline Contact: 1800 180 0000 (24x7 Helipad Support)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
