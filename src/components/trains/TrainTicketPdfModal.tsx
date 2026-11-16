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
  duration?: string;
  autoPrint?: boolean;
  passengers: {
    name: string;
    age: string | number;
    gender: string;
    bookingStatus?: string;
    currentStatus?: string;
    berth?: string;
    policyNo?: string;
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

  // If user clicked "Download Ticket", auto trigger print / save dialog after render
  React.useEffect(() => {
    if (ticket?.autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  const pnr = ticket.pnr || `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const trainNo = ticket.trainNumber || '12007';
  const trainName = ticket.trainName || 'Mas Mys Shatabdi';
  const classCode = ticket.classCode || 'CC';
  const originStation = ticket.source || 'Mgr Chennai Ctl (MAS)';
  const originCode = ticket.sourceCode || (originStation.match(/\(([^)]+)\)/)?.[1] || 'MAS');
  const boardStation = ticket.boardingStation || originStation;
  const destStation = ticket.destination || 'Ksr Bengaluru (SBC)';
  const destCode = ticket.destinationCode || (destStation.match(/\(([^)]+)\)/)?.[1] || 'SBC');
  const depTime = ticket.departureTime || ticket.sourceTime || '06:00 AM';
  const depDate = ticket.departureDate || ticket.sourceDate || '16 Nov, 2026';
  const arrTime = ticket.destinationTime || '10:30 AM';
  const arrDate = ticket.destinationDate || depDate;
  const duration = ticket.duration || '04h 30m';
  const quota = ticket.quota || 'General';
  const bookingDate = ticket.bookingDate || `${depDate} | 07:05PM`;
  const txnId = ticket.transactionId || `${Date.now()}${Math.floor(10 + Math.random() * 90)}`;

  const ticketFare = ticket.fare || 1055;
  const convenienceFee = ticket.convenienceFee ?? 11.80;
  const insurance = ticket.insurancePremium ?? 0.90;
  const totalAmount = ticket.totalFare ?? (ticketFare + convenienceFee + insurance);

  const rawPaxList = ticket.passengers && ticket.passengers.length > 0
    ? ticket.passengers
    : [{ name: 'PASSENGER', age: 28, gender: 'Male', bookingStatus: 'CNF/C1/36/NC', currentStatus: 'CNF/C1/36/NC' }];

  const adultCount = rawPaxList.length;

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
          maxWidth: '780px',
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '96vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-ticket" style={{ color: '#38bdf8' }}></i>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>
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
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
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
                width: '30px',
                height: '30px',
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

        {/* ERS Ticket Slip Content matching Image 2 */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', background: '#ffffff', color: '#1e293b', fontFamily: 'Arial, sans-serif' }}>

          {/* Top Navy Blue Booking Transaction ID Header */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              background: '#1e3a8a',
              color: '#ffffff',
              borderRadius: '4px',
              overflow: 'hidden',
              minWidth: '280px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', background: '#1e3a8a', padding: '5px 12px', fontSize: '10px', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <span style={{ flex: 1.4 }}>Booking transaction ID</span>
                <span style={{ flex: 1 }}>Transaction Status</span>
              </div>
              <div style={{ display: 'flex', background: '#ffffff', color: '#0f172a', padding: '6px 12px', fontSize: '12px', fontWeight: 800, textAlign: 'center' }}>
                <span style={{ flex: 1.4 }}>{txnId}</span>
                <span style={{ flex: 1 }}>Booked</span>
              </div>
            </div>
          </div>

          {/* Bordered Ticket Container */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>

            {/* Train Name and PNR Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.2px' }}>
                {trainName.toUpperCase()} ({trainNo})
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#ea580c' }}>
                PNR: {pnr}
              </div>
            </div>

            {/* Stations and Time Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                  {depTime} | {originStation.toUpperCase()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {depDate}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>—</span>
                <span>{duration}</span>
                <span>—</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                  {arrTime} | {destStation.toUpperCase()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {arrDate}
                </div>
              </div>
            </div>

            {/* STATUS & Meta Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #e2e8f0', fontSize: '11.5px', fontWeight: 700 }}>
              <div>
                <span style={{ color: '#0f172a' }}>STATUS: </span>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>BOOKED</span>
              </div>
              <div style={{ color: '#334155', textAlign: 'center' }}>
                {adultCount} Adult{adultCount > 1 ? 's' : ''} | 0 Children | {classCode} | {quota}
              </div>
              <div style={{ color: '#334155', textAlign: 'right' }}>
                Boarding Station: {boardStation}
              </div>
            </div>

            {/* Passenger Information Header */}
            <div style={{ borderTop: '1px solid #94a3b8', marginTop: '10px', paddingTop: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Passenger Information
              </div>

              {/* Dynamic Passengers List */}
              {rawPaxList.map((p, idx) => {
                const parts = (p.bookingStatus || `CNF/C1/${36 + idx * 2}/NC`).split('/');
                const coachVal = parts[1] || 'C1';
                const berthVal = parts[2] || `${36 + idx * 2}`;
                const berthPref = p.berth || (parts[3] && parts[3] !== 'NC' ? parts[3] : 'No preference');
                const fullStatus = `CNF/${coachVal}/${berthVal}/NC`;
                const policyNo = p.policyNo || `${pnr}${String(idx + 1).padStart(2, '0')}21102026`;

                return (
                  <div key={idx} style={{ padding: '8px 0', borderBottom: idx < rawPaxList.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{idx + 1}</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{p.name.toUpperCase()}</span>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>{p.age} yrs | {p.gender}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1.2fr 1.2fr', fontSize: '11px', marginTop: '4px', gap: '6px' }}>
                      <div>
                        <div style={{ color: '#64748b' }}>Booking Status</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{fullStatus}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b' }}>Coach</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{coachVal}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b' }}>Berth/WL No</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{berthVal}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b' }}>Berth Type</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{berthPref}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b' }}>Current Status</div>
                        <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>{fullStatus}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                      Policy No: <span style={{ color: '#1e293b', fontWeight: 600 }}>{policyNo}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Split: Booking Details & Payment Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px', borderTop: '1px solid #94a3b8', marginTop: '14px', paddingTop: '10px' }}>
              {/* Booking Details Left Table */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textAlign: 'center', background: '#f1f5f9', padding: '4px', marginBottom: '8px' }}>
                  Booking Details
                </div>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>PNR Number</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{pnr}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Ticket Type</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>E-ticket</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Booked On</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{bookingDate}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Date of Boarding</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{depDate} | {depTime}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Vikalp Status</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>No</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Booked From</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '10.5px' }}>IRCTC Rail Connect 2.0(Android)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Charting Status</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>Chart Prepared</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Details Right Table */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textAlign: 'center', background: '#f1f5f9', padding: '4px', marginBottom: '8px' }}>
                  Payment Details
                </div>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Payment Mode</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '10px' }}>
                        Credit & Debit cards / Net Banking / UPI (Powered by PhonePe)
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Convenience Fee (Incl. of GST)</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>₹ {convenienceFee.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#475569' }}>Ticket Fare:</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>₹ {ticketFare.toFixed(0)}</td>
                    </tr>
                    <tr style={{ borderTop: '1px dashed #cbd5e1' }}>
                      <td style={{ padding: '6px 0', fontWeight: 900, fontSize: '12px' }}>Total Amount</td>
                      <td style={{ textAlign: 'right', fontWeight: 900, fontSize: '13px', color: '#0f172a' }}>
                        ₹ {totalAmount.toFixed(1)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Travel Insurance Section */}
            <div style={{ marginTop: '14px', borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', textAlign: 'center', background: '#f1f5f9', padding: '4px', marginBottom: '8px' }}>
                Travel Insurance (Incl. of GST)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', fontSize: '10.5px', rowGap: '4px' }}>
                <div><span style={{ color: '#475569' }}>Insurance Opted:</span> <strong>Yes</strong></div>
                <div style={{ textAlign: 'right' }}><span style={{ color: '#475569' }}>Insurance Company:</span> <strong>M/s United India Insurance Co. Ltd.</strong></div>
                <div><span style={{ color: '#475569' }}>Policy Issue date:</span> <strong>{bookingDate}</strong></div>
                <div style={{ textAlign: 'right' }}><span style={{ color: '#475569' }}>Travel Insurance Premium (Incl. of GST):</span> <strong>{insurance.toFixed(1)}</strong></div>
                <div><span style={{ color: '#475569' }}>Insurance (No of Psgn):</span> <strong>{adultCount}</strong></div>
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', lineHeight: 1.3 }}>
                Click Insurance Company name to submit nomination details. Link will be highlighted once Policy is issued by respective Insurance Company.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
