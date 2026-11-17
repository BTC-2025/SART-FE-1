'use client';

import React from 'react';
import './FlightPnrStatusEnquiry.css';

interface FlightPnrStatusEnquiryProps {
  booking: any;
  onBack: () => void;
  onCheckIn?: () => void;
  onFlightStatus?: () => void;
}

export const FlightPnrStatusEnquiry: React.FC<FlightPnrStatusEnquiryProps> = ({
  booking,
  onBack,
  onCheckIn,
  onFlightStatus
}) => {
  let extra: any = {};
  try {
    if (booking.extraData) {
      extra = typeof booking.extraData === 'string' ? JSON.parse(booking.extraData) : booking.extraData;
    }
  } catch (e) { }

  // PNR / Booking Reference
  const pnr = (
    booking.pnr ||
    extra.pnr ||
    booking.bookingId ||
    extra.bookingId ||
    'HU8E5X'
  ).toUpperCase();

  // Contact / Account reference (matches deepthi99752096s in image)
  const accountRef =
    booking.passengerEmail?.split('@')[0] ||
    extra.email?.split('@')[0] ||
    booking.accountRef ||
    extra.accountRef ||
    'deepthi99752096s';

  // Status values
  const bookingStatus = booking.isCancelled
    ? 'CANCELLED'
    : (booking.status || extra.status || 'CONFIRMED').toUpperCase();

  const bookingDate =
    extra.bookingDateUtc ||
    booking.bookingDateUtc ||
    '17 Nov 2026  (UTC)';
  // '03 Mar 23 16:00:14 (UTC)';

  const paymentStatus = (
    booking.paymentStatus ||
    extra.paymentStatus ||
    extra.paymentDetails?.status ||
    'Approved'
  );

  // Passenger Details
  const rawPaxList =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
      : extra.passengers && extra.passengers.length > 0
        ? extra.passengers
        : extra.allPassengers && extra.allPassengers.length > 0
          ? extra.allPassengers
          : [
            {
              name:
                booking.passengerName ||
                extra.passengerName ||
                'Mrs. Nerugondula Ramana'
            }
          ];

  const primaryPassengerName =
    rawPaxList[0]?.name ||
    booking.passengerName ||
    extra.passengerName ||
    'Mrs. Nerugondula Ramana';

  // Flights / Legs details
  const flightsList = extra.flightsList ||
    booking.flightsList || [
      {
        date: extra.flight1Date || booking.sourceDate || '06 Mar 23',
        from: extra.flight1From || `${booking.source || 'Kuwait'} (T1)`,
        departs: extra.flight1Departs || booking.sourceTime || '01:50',
        flightNumber: extra.flight1Number || booking.number || '6E1752',
        aircraftType: extra.flight1Aircraft || '(A320)',
        bagDropCloses: extra.flight1BagDrop || '00:35',
        to: extra.flight1To || 'Chennai (T3)',
        arrives: extra.flight1Arrives || '09:20',

      },
      {
        date: extra.flight2Date || '06 Mar 23',
        from: 'Chennai (T1)',
        departs: '12:00',
        flightNumber: '6E7477',
        aircraftType: '(ATR)',
        bagDropCloses: '11:00',
        to: extra.flight2To || `${booking.destination || 'Vijayawada'}`,
        arrives: extra.flight2Arrives || booking.destinationTime || '14:35',

      }
    ];

  return (
    <div className="fl-pnr-container">
      {/* Top Back Navigation Bar */}
      <div className="fl-pnr-top-nav">
        <button type="button" className="fl-pnr-back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="fl-pnr-nav-title">Flight PNR Status Enquiry</span>
      </div>

      {/* Main Ticket Document Card */}
      <div className="fl-pnr-card">
        {/* Brand Top Header */}
        <div className="fl-pnr-header-row">
          <div className="fl-pnr-brand-wrap">
            <span className="fl-pnr-brand-logo">
              Indi<span className="fl-pnr-brand-go">Go</span>
            </span>
          </div>

          <div className="fl-pnr-ref-wrap">
            <span className="fl-pnr-ref-label">PNR/Booking Ref.:</span>
            <span className="fl-pnr-ref-code">{pnr}</span>
          </div>

          <div className="fl-pnr-account-wrap">
            <span className="fl-pnr-account-text">{accountRef}</span>
          </div>
        </div>

        {/* Status Bar Table */}
        <div className="fl-pnr-table-wrap">
          <table className="fl-pnr-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Status</th>
                <th style={{ width: '44%' }}>Date of Booking*</th>
                <th style={{ width: '28%' }}>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fl-pnr-status-confirmed">{bookingStatus}</td>
                <td>{bookingDate}</td>
                <td className="fl-pnr-status-approved">{paymentStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Disclaimer Note */}
        <p className="fl-pnr-disclaimer">
          *Booking Date reflects in UTC (Universal Time Coordinated), all other
          timings mentioned are as per Local Time.
        </p>

        {/* Passenger Bar & Action Buttons */}
        <div className="fl-pnr-pax-bar">
          <span className="fl-pnr-pax-count-label">
            IndiGo Passenger - 1/{rawPaxList.length}
          </span>
          <div className="fl-pnr-pax-actions">
            <button
              type="button"
              className="fl-pnr-action-btn check-in"
              onClick={onCheckIn}
            >
              Check-in now
            </button>
            <button
              type="button"
              className="fl-pnr-action-btn flight-status"
              onClick={onFlightStatus}
            >
              Flight Status
            </button>
          </div>
        </div>

        {/* Passenger Identification & Barcode Area */}
        <div className="fl-pnr-id-row">
          <div className="fl-pnr-barcode-box">
            {/* Realistic SVG Barcode with QR pattern */}
            <svg
              className="fl-pnr-barcode-svg"
              viewBox="0 0 240 40"
              preserveAspectRatio="none"
            >
              {/* Left Solid Bar */}
              <rect x="0" y="0" width="8" height="40" fill="#111827" />
              <rect x="12" y="0" width="4" height="40" fill="#111827" />
              <rect x="18" y="0" width="2" height="40" fill="#111827" />
              <rect x="23" y="0" width="5" height="40" fill="#111827" />

              {/* QR pixel cluster matrix */}
              <rect x="32" y="4" width="6" height="6" fill="#111827" />
              <rect x="42" y="4" width="6" height="6" fill="#111827" />
              <rect x="52" y="4" width="6" height="6" fill="#111827" />
              <rect x="62" y="4" width="6" height="6" fill="#111827" />
              <rect x="32" y="14" width="6" height="6" fill="#111827" />
              <rect x="46" y="14" width="6" height="6" fill="#111827" />
              <rect x="60" y="14" width="6" height="6" fill="#111827" />
              <rect x="36" y="24" width="6" height="6" fill="#111827" />
              <rect x="50" y="24" width="6" height="6" fill="#111827" />
              <rect x="64" y="24" width="6" height="6" fill="#111827" />
              <rect x="42" y="32" width="6" height="6" fill="#111827" />
              <rect x="56" y="32" width="6" height="6" fill="#111827" />

              {/* Right Vertical Barcode Lines */}
              <rect x="76" y="0" width="3" height="40" fill="#111827" />
              <rect x="83" y="0" width="6" height="40" fill="#111827" />
              <rect x="92" y="0" width="2" height="40" fill="#111827" />
              <rect x="97" y="0" width="5" height="40" fill="#111827" />
              <rect x="105" y="0" width="8" height="40" fill="#111827" />
              <rect x="116" y="0" width="3" height="40" fill="#111827" />
              <rect x="122" y="0" width="4" height="40" fill="#111827" />
            </svg>
          </div>

          <div className="fl-pnr-passenger-name">{primaryPassengerName}</div>
        </div>

        {/* Flight(s) Heading Section */}
        <div className="fl-pnr-flights-bar">
          <span>IndiGo Flight(s)</span>
        </div>

        {/* Flights Schedule Table */}
        <div className="fl-pnr-flights-table-wrap">
          <table className="fl-pnr-flights-table">
            <thead>
              <tr>
                <th style={{ width: '11%' }}>Date</th>
                <th style={{ width: '18%' }}>From (Terminal)</th>
                <th style={{ width: '11%' }}>Departs</th>
                <th style={{ width: '17%' }}>
                  Flight Number
                  <br />
                  <span className="fl-pnr-sub-th">(Aircraft type)</span>
                </th>
                <th style={{ width: '15%' }}>
                  Check-in/Bag
                  <br />
                  <span className="fl-pnr-sub-th">drop closes</span>
                </th>
                <th style={{ width: '16%' }}>To (Terminal)</th>
                <th style={{ width: '10%' }}>Arrives</th>
                <th style={{ width: '10%' }}>Via</th>
              </tr>
            </thead>
            <tbody>
              {flightsList.map((f: any, idx: number) => (
                <tr key={idx}>
                  <td className="fl-pnr-cell-date">{f.date}</td>
                  <td>{f.from}</td>
                  <td className="fl-pnr-cell-time">{f.departs}</td>
                  <td>
                    <span className="fl-pnr-flight-num">{f.flightNumber}</span>
                    <br />
                    <span className="fl-pnr-aircraft-type">
                      {f.aircraftType}
                    </span>
                  </td>
                  <td className="fl-pnr-cell-time">{f.bagDropCloses}</td>
                  <td>{f.to}</td>
                  <td className="fl-pnr-cell-time">{f.arrives}</td>
                  <td>{f.via || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
