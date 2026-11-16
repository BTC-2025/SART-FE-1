'use client';

import React from 'react';
import { Booking } from '../../data/mockBookings';

interface TrainPnrStatusEnquiryProps {
  booking: Booking;
  onBack: () => void;
  onDownloadTicket?: () => void;
  onViewSchedule?: () => void;
}

export const TrainPnrStatusEnquiry: React.FC<TrainPnrStatusEnquiryProps> = ({
  booking,
  onBack,
  onDownloadTicket,
  onViewSchedule
}) => {
  let extra: any = {};
  try {
    if (booking.extraData) {
      extra = typeof booking.extraData === 'string' ? JSON.parse(booking.extraData) : booking.extraData;
    }
  } catch (e) {}

  const pnr = booking.pnr || extra.pnr || booking.bookingId || '4863831884';
  const trainNumber = extra.trainNumber || (booking.number && booking.number.match(/\d{4,5}/)?.[0]) || booking.title?.match(/\d{4,5}/)?.[0] || '12007';
  const trainName = extra.trainName || booking.title?.replace(/\(\d+\)/g, '').replace(/\b\d{4,5}\b/g, '').trim() || 'Express Train';
  const boardingDate = extra.dateOfJourney || booking.sourceDate || new Date().toISOString().split('T')[0];
  const fromCode = booking.sourceCode || extra.sourceCode || (booking.source ? booking.source.slice(0, 4).toUpperCase() : 'MAS');
  const toCode = booking.destinationCode || extra.destinationCode || (booking.destination ? booking.destination.slice(0, 4).toUpperCase() : 'SBC');
  const reservedUpto = toCode;
  const boardingPoint = fromCode;
  const classCode = booking.classCode || extra.classCode || booking.subType || 'CC';

  const rawPaxList = (booking.passengers && booking.passengers.length > 0)
    ? booking.passengers
    : (extra.passengers && extra.passengers.length > 0)
      ? extra.passengers
      : (extra.allPassengers && extra.allPassengers.length > 0)
        ? extra.allPassengers
        : [
          { name: booking.passengerName || extra.passengerName || 'Passenger 1', age: 28, gender: 'Male', berthPreference: 'GN' }
        ];

  const coach = booking.coach || extra.coach || 'C1';
  const startBerth = Number(booking.berthNo || extra.berthNo || 36);

  const totalFare = Number(booking.transactionAmount || extra.fare || booking.price || 1067);
  const chartingStatus = booking.statusText?.includes('Chart') ? booking.statusText : 'Chart Prepared';
  const trainStatus = booking.isCancelled
    ? 'The Train Is Cancelled'
    : (booking.statusText || 'Running On Time');

  const nowFormatted = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', boxSizing: 'border-box' }}>
      {/* Header bar styled in #391E84 */}
      <div
        style={{
          background: '#391E84',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
            title="Back to search"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.4px' }}>
            Passenger Current Status Enquiry
          </span>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 500 }}>
          {nowFormatted} IST
        </div>
      </div>

      {/* Main Container */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '24px 28px',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        {/* Subheader: You Queried For */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
            You Queried For : PNR Number: <span style={{ color: '#391E84', fontWeight: 900, fontSize: '16px' }}>{pnr}</span>
          </span>
        </div>

        {/* Table 1: Train & Journey Details */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: '#391E84', color: '#ffffff' }}>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Train Number</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Train Name</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Boarding Date (DD-MM-YYYY)</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>From</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>To</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Reserved Upto</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Boarding Point</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Class</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#ffffff', color: '#0f172a' }}>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{trainNumber}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{trainName.toUpperCase()}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1' }}>{boardingDate}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{fromCode}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{toCode}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{reservedUpto}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{boardingPoint}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{classCode}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 2: Passenger Information */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: '#391E84', color: '#ffffff' }}>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '14%' }}>S. No.</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '38%' }}>Booking Status (Coach No , Berth No., Quota)</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '32%' }}>*Current Status (Coach No , Berth No.)</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '16%' }}>Coach Position</th>
              </tr>
            </thead>
            <tbody>
              {rawPaxList.map((p: any, idx: number) => {
                const berth = startBerth + idx * 2;
                const quota = p.berthPreference || 'GN';
                const bookingStatusStr = p.bookingStatus || `CNF / ${coach} / ${berth} / ${quota}`;
                const currentStatusStr = p.currentStatus || (booking.isCancelled ? 'CAN' : `CNF / ${coach} / ${berth}`);

                return (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', color: '#0f172a' }}>
                    <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                      Passenger {idx + 1}
                      {p.name && p.name !== 'Passenger' && (
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>({p.name})</div>
                      )}
                    </td>
                    <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{bookingStatusStr}</td>
                    <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 800, color: booking.isCancelled ? '#ef4444' : '#16a34a' }}>
                      {currentStatusStr}
                    </td>
                    <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{coach}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table 3: Fare, Charting & Train Status */}
        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: '#391E84', color: '#ffffff' }}>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '16%' }}>Total Fare</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '28%' }}>Charting Status</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '26%' }}>Remarks if any</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '30%' }}>Train Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#ffffff', color: '#0f172a' }}>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 800 }}>₹ {totalFare}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#16a34a' }}>{chartingStatus}</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', color: '#64748b' }}>-</td>
                <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: booking.isCancelled ? '#ef4444' : '#0f172a' }}>
                  {trainStatus}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons Row matching reference */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onViewSchedule}
            style={{
              background: '#391E84',
              color: '#ffffff',
              border: 'none',
              padding: '9px 24px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(57, 30, 132, 0.25)'
            }}
          >
            <i className="fa-solid fa-calendar-days"></i> Get Schedule
          </button>

          <button
            type="button"
            onClick={onDownloadTicket}
            style={{
              background: '#391E84',
              color: '#ffffff',
              border: 'none',
              padding: '9px 24px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(57, 30, 132, 0.25)'
            }}
          >
            <i className="fa-solid fa-file-invoice"></i> Train Running Status / Ticket
          </button>
        </div>

        {/* Note disclaimer text matching image 2 */}
        <div style={{ fontSize: '11px', color: '#391E84', fontWeight: 700, textAlign: 'left', marginBottom: '16px' }}>
          *Please Note that in case the Final Charts have not been prepared, the Current Status might upgrade/downgrade at a later stage.
        </div>

        {/* Legends Box matching bottom of Image 2 */}
        <div style={{ marginTop: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ background: '#391E84', color: '#ffffff', textAlign: 'center', padding: '6px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>
            LEGENDS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '11px', padding: '8px 12px', background: '#f8fafc', gap: '8px' }}>
            <div><strong>CNF:</strong> Confirmed</div>
            <div><strong>RAC:</strong> Reservation Against Cancellation</div>
            <div><strong>WL:</strong> Waiting List</div>
            <div><strong>CAN:</strong> Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

