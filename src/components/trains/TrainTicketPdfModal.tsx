'use client';

import React from 'react';

export interface TrainTicketModalData {
  pnr?: string;
  trainNumber: string;
  trainName: string;
  classCode: string;
  source: string;
  sourceCode?: string;
  sourceTime?: string;
  sourceDate?: string;
  destination: string;
  destinationCode?: string;
  destinationTime?: string;
  destinationDate?: string;
  boardingStation?: string;
  departureTime?: string;
  departureDate?: string;
  quota?: string;
  distance?: string;
  bookingDate?: string;
  transactionId?: string;
  passengers: {
    name: string;
    age: string | number;
    gender: string;
    bookingStatus?: string;
    currentStatus?: string;
    berth?: string;
  }[];
  fare: number;
  convenienceFee?: number;
  insurancePremium?: number;
  totalFare?: number;
}

interface TrainTicketPdfModalProps {
  ticket: TrainTicketModalData | null;
  onClose: () => void;
}

export default function TrainTicketPdfModal({ ticket, onClose }: TrainTicketPdfModalProps) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const pnr = ticket.pnr || '2917590674';
  const trainNo = ticket.trainNumber || '12992';
  const trainName = ticket.trainName || 'JP UDZ EXP';
  const classCode = ticket.classCode || 'SECOND SITTING (2S)';
  const originStation = ticket.source || 'JAIPUR';
  const originCode = ticket.sourceCode || (originStation.match(/\(([^)]+)\)/)?.[1] || 'JP');
  const boardStation = ticket.boardingStation || originStation;
  const boardCode = originCode;
  const destStation = ticket.destination || 'FATEHNAGAR';
  const destCode = ticket.destinationCode || (destStation.match(/\(([^)]+)\)/)?.[1] || 'FAN');
  const depTime = ticket.departureTime || ticket.sourceTime || '14:10';
  const depDate = ticket.departureDate || ticket.sourceDate || '12-Sep-2026';
  const arrTime = ticket.destinationTime || '20:09';
  const arrDate = ticket.destinationDate || depDate;
  const quota = ticket.quota || 'GENERAL (GN)';
  const distance = ticket.distance || '379 KM';
  const bookingDate = ticket.bookingDate || `${depDate} 20:21:44 HRS`;
  const txnId = ticket.transactionId || `100005${Math.floor(100000 + Math.random() * 900000)}`;

  const ticketFare = ticket.fare || 320;
  const convenienceFee = ticket.convenienceFee ?? 11.80;
  const insurance = ticket.insurancePremium ?? 0.90;
  const totalAmount = ticket.totalFare ?? (ticketFare + convenienceFee + insurance);

  const paxList = ticket.passengers && ticket.passengers.length > 0
    ? ticket.passengers
    : [{ name: 'PASSENGER', age: 24, gender: 'M', bookingStatus: 'CNF/D8/61/WINDOW SIDE', currentStatus: 'CNF/D8/61/WINDOW SIDE' }];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-ticket" style={{ color: '#38bdf8' }}></i>
            <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.3px' }}>
              IRCTC Electronic Reservation Slip (ERS)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-download"></i> Download / Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#334155',
                color: '#ffffff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* ERS Ticket Body (Replicating exact uploaded image) */}
        <div style={{ padding: '24px 32px', overflowY: 'auto', background: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
          {/* Header Title */}
          <div style={{ textAlign: 'center', borderBottom: '1.5px solid #000000', paddingBottom: '6px', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 900, letterSpacing: '0.5px' }}>
              Electronic Reservation Slip (ERS) - Normal User
            </h2>
          </div>

          {/* Logo Row: Indian Railways (Left) & IRCTC (Right) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: '2px solid #1e3a8a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1e40af',
                color: '#ffffff'
              }}>
                <i className="fa-solid fa-train" style={{ fontSize: '20px' }}></i>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1e3a8a', lineHeight: 1.2 }}>
                INDIAN<br />RAILWAYS
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '-1px' }}>IRCTC</span>
                <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, marginTop: '-2px' }}>CRIS / IT</span>
              </div>
            </div>
          </div>

          {/* Journey Stations Flow */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', alignItems: 'center', textAlign: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>Booked from</div>
              <div style={{ fontSize: '13px', fontWeight: 900, margin: '2px 0' }}>{originStation} ({originCode})</div>
              <div style={{ fontSize: '11px', color: '#334155' }}>Start Date* {depDate}</div>
            </div>

            <div style={{ position: 'relative', padding: '0 8px' }}>
              <div style={{
                background: '#38bdf8',
                color: '#ffffff',
                padding: '4px 12px',
                fontWeight: 900,
                fontSize: '11px',
                borderRadius: '3px',
                marginBottom: '4px',
                clipPath: 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)'
              }}>
                Boarding At ➜
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 900 }}>{boardStation} ({boardCode})</div>
              <div style={{ fontSize: '11px', color: '#334155' }}>Departure* {depTime} {depDate}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>To</div>
              <div style={{ fontSize: '13px', fontWeight: 900, margin: '2px 0' }}>{destStation} ({destCode})</div>
              <div style={{ fontSize: '11px', color: '#334155' }}>Arrival* {arrTime} {arrDate}</div>
            </div>
          </div>

          {/* PNR & Train Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
            borderTop: '1px solid #000000',
            borderBottom: '1px solid #000000',
            padding: '8px 0',
            textAlign: 'center',
            marginBottom: '14px',
            rowGap: '6px'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>PNR</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0284c7' }}>{pnr}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>Train No./Name</div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#0284c7' }}>{trainNo}/{trainName}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>Class</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#0284c7' }}>{classCode}</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>Quota</div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{quota}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>Distance</div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{distance}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>Booking Date</div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{bookingDate}</div>
            </div>
          </div>

          {/* Passenger Details Table */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 900, borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px' }}>
              Passenger Details
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #94a3b8' }}>
                  <th style={{ padding: '4px 6px' }}>#</th>
                  <th style={{ padding: '4px 6px' }}>Name</th>
                  <th style={{ padding: '4px 6px', textAlign: 'center' }}>Age</th>
                  <th style={{ padding: '4px 6px', textAlign: 'center' }}>Gender</th>
                  <th style={{ padding: '4px 6px' }}>Booking Status</th>
                  <th style={{ padding: '4px 6px' }}>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {paxList.map((p, pIdx) => {
                  const bStatus = p.bookingStatus || `CNF/Coach S3/Berth ${24 + pIdx}/SL`;
                  const cStatus = p.currentStatus || bStatus;
                  return (
                    <tr key={pIdx} style={{ borderBottom: '1px dashed #e2e8f0' }}>
                      <td style={{ padding: '5px 6px' }}>{pIdx + 1}.</td>
                      <td style={{ padding: '5px 6px', fontWeight: 700 }}>{p.name.toUpperCase()}</td>
                      <td style={{ padding: '5px 6px', textAlign: 'center' }}>{p.age}</td>
                      <td style={{ padding: '5px 6px', textAlign: 'center' }}>{p.gender ? p.gender.charAt(0).toUpperCase() : 'M'}</td>
                      <td style={{ padding: '5px 6px' }}>{bStatus}</td>
                      <td style={{ padding: '5px 6px', fontWeight: 700, color: '#16a34a' }}>{cStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Transaction & Payment Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', borderTop: '1px solid #000000', paddingTop: '10px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '2px' }}>
                Transaction ID: {txnId}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', marginBottom: '10px' }}>
                IR recovers only 57% of cost of travel on an average.
              </div>

              <div style={{ fontSize: '12px', fontWeight: 900, marginBottom: '4px' }}>Payment Details</div>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '2px 0' }}>Ticket Fare</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹ {ticketFare.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0' }}>IRCTC Convenience Fee (Incl. of GST)</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹ {convenienceFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0' }}>Travel Insurance Premium (Incl. of GST)</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹ {insurance.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderTop: '1px dashed #cbd5e1' }}>
                    <td style={{ padding: '4px 0', fontWeight: 900 }}>Total Fare (all inclusive)</td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#0f172a' }}>₹ {totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>PG Charges as applicable (Additional)</div>
            </div>

            {/* QR Code Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                border: '1px solid #000000',
                padding: '4px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`IRCTC:PNR=${pnr};TRAIN=${trainNo};PAX=${paxList.length};FARE=${totalAmount}`)}`}
                  alt="IRCTC Ticket QR Code"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <span style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>Scan for ERS verification</span>
            </div>
          </div>

          {/* Legal and Terms Bullet Points */}
          <div style={{
            fontSize: '9.5px',
            color: '#1e293b',
            lineHeight: 1.4,
            borderTop: '1px solid #000000',
            paddingTop: '8px',
            marginBottom: '10px'
          }}>
            <div>• Beware of fraudulent customer care number. For any assistance, use only the IRCTC e-ticketing Customer care number: <strong>14646</strong>.</div>
            <div>• <strong>IRCTC Convenience Fee is charged per e-ticket irrespective of number of passengers on the ticket.</strong></div>
            <div>• *The printed Departure and Arrival Times are liable to change. Please Check correct departure, arrival from Railway Station Enquiry or Dial 139 or SMS RAIL to 139.</div>
            <div>• This ticket is booked on a personal User ID, its sale/purchase is an offence u/s 143 of the Railways Act, 1989.</div>
            <div>• Prescribed original ID proof is required while travelling along with SMS/ VRM/ ERS otherwise will be treated as without ticket and penalized as per Railway Rules.</div>
          </div>

          {/* Footer Signature Box */}
          <div style={{ border: '1.5px solid #000000', height: '48px', padding: '4px 8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Passenger Verification / TTE Stamp & Remarks</span>
          </div>

          {/* GST Details Bottom Row */}
          <div style={{ fontSize: '9px', color: '#475569', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            <div><strong>Invoice Number:</strong> PS{pnr.slice(0, 8)}</div>
            <div><strong>Supplier:</strong> Indian Railways</div>
            <div><strong>GSTIN:</strong> 07AAAGM0289C1ZL</div>
            <div><strong>SAC Code:</strong> 996421</div>
          </div>
        </div>
      </div>
    </div>
  );
}

