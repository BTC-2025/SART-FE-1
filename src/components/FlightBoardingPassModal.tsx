'use client';

import React, { useRef } from 'react';
import './FlightBoardingPassModal.css';

export interface FlightBoardingPassData {
  airline?: string;
  flightNo?: string;
  sourceCity?: string;
  sourceAirport?: string;
  destinationCity?: string;
  destinationAirport?: string;
  passengerName?: string;
  passengerTitle?: string;
  seatCode?: string;
  gate?: string;
  boardingZone?: string;
  boardingTime?: string;
  departureTime?: string;
  departureDate?: string;
  pnr?: string;
  sequenceNo?: string;
  services?: string;
  autoPrint?: boolean;
}

interface FlightBoardingPassModalProps {
  data: FlightBoardingPassData;
  onClose: () => void;
}

export const FlightBoardingPassModal: React.FC<FlightBoardingPassModalProps> = ({
  data,
  onClose
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  // Extract / Default Values matching user uploaded IndiGo photo
  const airline = data.airline || 'IndiGo';
  const flightNumber = (data.flightNo || '6E6031').replace(/\s+/g, '');
  const sourceCity = (data.sourceCity || 'SRINAGAR').toUpperCase();
  const sourceCode = (data.sourceAirport || 'SXR').toUpperCase();
  const destinationCity = (data.destinationCity || 'DELHI').toUpperCase();
  const destinationCode = (data.destinationAirport || 'DEL').toUpperCase();

  // Format name in airline format: LASTNAME/FIRSTNAME/TITLE or FIRSTNAME/LASTNAME/TITLE
  const rawName = data.passengerName || 'FAYAZ AHMAD KAKROO';
  const title = (data.passengerTitle || 'MR').toUpperCase();
  const formattedName = rawName.includes('/')
    ? rawName.toUpperCase()
    : `${rawName.replace(/\s+/g, '/').toUpperCase()}/${title}`;

  const seat = data.seatCode || '4E';
  const gate = data.gate || '06';
  const zone = data.boardingZone || 'Zone 3';
  const boardingTime = data.boardingTime || '1820 Hrs';
  const departureTime = data.departureTime || '1905 hrs';
  const departureDate = data.departureDate || '25 JUL 2026';
  const pnr = (data.pnr || 'GRPHTJ').toUpperCase();
  const sequenceNo = data.sequenceNo || '0004';
  const services = data.services || 'NIL';

  // Handle Download (Generates printable ticket / native print dialog / save as PDF)
  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // If user clicked "Download Ticket", auto trigger print / save dialog after render
  React.useEffect(() => {
    if (data?.autoPrint) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [data]);

  return (
    <div className="fl-bp-overlay" onClick={onClose}>
      <div className="fl-bp-modal-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Actions Bar */}
        <div className="fl-bp-actions-bar">
          <div className="fl-bp-actions-title">
            <i className="fa-solid fa-plane-departure"></i>
            <span>Official Boarding Pass — {airline}</span>
          </div>

          <div className="fl-bp-actions-btns">
            <button
              type="button"
              className="fl-bp-btn download"
              onClick={handleDownload}
            >
              <i className="fa-solid fa-download"></i> Download / Print
            </button>
            <button
              type="button"
              className="fl-bp-btn print"
              onClick={handleDownload}
            >
              <i className="fa-solid fa-print"></i> Print
            </button>
            <button
              type="button"
              className="fl-bp-btn close"
              onClick={onClose}
              title="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Boarding Pass Ticket Card (Exact match to uploaded image) */}
        <div className="fl-bp-ticket-card" ref={ticketRef}>
          {/* ==============================================================
              LEFT MAIN SECTION
              ============================================================== */}
          <div className="fl-bp-main-section">
            {/* Top Row: Brand & Destination */}
            <div className="fl-bp-top-row">
              <div className="fl-bp-brand-header">
                {airline.toLowerCase().includes('indigo') ? (
                  <span className="fl-bp-indigo-logo">
                    Indi<span>Go</span>
                  </span>
                ) : (
                  <span className="fl-bp-indigo-logo" style={{ fontSize: '22px', letterSpacing: '-0.5px' }}>
                    {airline}
                  </span>
                )}
              </div>
              <div className="fl-bp-route-heading">
                TO <span className="to-city">{destinationCity}</span>
              </div>
            </div>

            {/* Passenger Name & Origin Header */}
            <div className="fl-bp-pax-name-row">
              <span className="fl-bp-pax-name">{formattedName}</span>
              <span className="fl-bp-from-city">{sourceCity}</span>
            </div>

            {/* Boxed Grid Attributes */}
            <div className="fl-bp-boxed-grid">
              {/* Box 1: Flight */}
              <div className="fl-bp-box-cell">
                <span className="fl-bp-box-label">Flight</span>
                <span className="fl-bp-box-value">{flightNumber}</span>
              </div>

              {/* Box 2: Gate */}
              <div className="fl-bp-box-cell">
                <span className="fl-bp-box-label">Gate</span>
                <span className="fl-bp-box-value">{gate}</span>
              </div>

              {/* Box 3: Boarding Zone */}
              <div className="fl-bp-box-cell">
                <span className="fl-bp-box-label">Boarding</span>
                <span className="fl-bp-box-value" style={{ fontSize: '13px' }}>
                  {zone}
                </span>
              </div>

              {/* Box 4: Seat */}
              <div className="fl-bp-box-cell seat-cell">
                <span className="fl-bp-box-label">Seat</span>
                <span className="fl-bp-box-value">{seat}</span>
              </div>

              {/* Box 5: Boarding Time */}
              <div className="fl-bp-box-cell">
                <span className="fl-bp-box-label">Boarding Time</span>
                <span className="fl-bp-box-value" style={{ fontSize: '13.5px' }}>
                  {boardingTime}
                </span>
              </div>
            </div>

            {/* Metadata Text Row */}
            <div className="fl-bp-meta-row">
              <div className="fl-bp-meta-item">
                <span className="fl-bp-meta-label">Date:</span>
                <span className="fl-bp-meta-val">{departureDate}</span>
              </div>
              <div className="fl-bp-meta-item">
                <span className="fl-bp-meta-label">departure:</span>
                <span className="fl-bp-meta-val">{departureTime}</span>
              </div>
              <div className="fl-bp-meta-item">
                <span className="fl-bp-meta-label">services:</span>
                <span className="fl-bp-meta-val">{services}</span>
              </div>
              <div className="fl-bp-meta-item">
                <span className="fl-bp-meta-label">Seq:</span>
                <span className="fl-bp-meta-val">{sequenceNo}</span>
              </div>
            </div>

            {/* Bottom Row: Barcode & Gate Closure Notice */}
            <div className="fl-bp-bottom-row">
              <svg
                className="fl-bp-barcode-graphic"
                viewBox="0 0 240 38"
                preserveAspectRatio="none"
              >
                {/* Authentic 2D DataMatrix cluster & Vertical Barcode lines */}
                <rect x="0" y="0" width="6" height="38" fill="#111827" />
                <rect x="8" y="0" width="2" height="38" fill="#111827" />
                <rect x="12" y="0" width="4" height="38" fill="#111827" />
                <rect x="18" y="0" width="2" height="38" fill="#111827" />
                <rect x="22" y="0" width="5" height="38" fill="#111827" />
                {/* 2D QR cluster */}
                <rect x="32" y="2" width="6" height="6" fill="#111827" />
                <rect x="40" y="2" width="6" height="6" fill="#111827" />
                <rect x="48" y="2" width="6" height="6" fill="#111827" />
                <rect x="56" y="2" width="6" height="6" fill="#111827" />
                <rect x="32" y="10" width="6" height="6" fill="#111827" />
                <rect x="44" y="10" width="6" height="6" fill="#111827" />
                <rect x="56" y="10" width="6" height="6" fill="#111827" />
                <rect x="32" y="18" width="6" height="6" fill="#111827" />
                <rect x="44" y="18" width="6" height="6" fill="#111827" />
                <rect x="52" y="18" width="6" height="6" fill="#111827" />
                <rect x="36" y="26" width="6" height="6" fill="#111827" />
                <rect x="48" y="26" width="6" height="6" fill="#111827" />
                <rect x="56" y="26" width="6" height="6" fill="#111827" />
                {/* Continuing bars */}
                <rect x="68" y="0" width="3" height="38" fill="#111827" />
                <rect x="74" y="0" width="6" height="38" fill="#111827" />
                <rect x="83" y="0" width="2" height="38" fill="#111827" />
                <rect x="88" y="0" width="5" height="38" fill="#111827" />
                <rect x="96" y="0" width="3" height="38" fill="#111827" />
                <rect x="102" y="0" width="7" height="38" fill="#111827" />
                <rect x="112" y="0" width="2" height="38" fill="#111827" />
                <rect x="117" y="0" width="4" height="38" fill="#111827" />
                <rect x="124" y="0" width="6" height="38" fill="#111827" />
                <rect x="133" y="0" width="3" height="38" fill="#111827" />
                <rect x="139" y="0" width="5" height="38" fill="#111827" />
                <rect x="147" y="0" width="2" height="38" fill="#111827" />
                <rect x="152" y="0" width="7" height="38" fill="#111827" />
                <rect x="162" y="0" width="3" height="38" fill="#111827" />
                <rect x="168" y="0" width="4" height="38" fill="#111827" />
                <rect x="175" y="0" width="6" height="38" fill="#111827" />
                <rect x="184" y="0" width="2" height="38" fill="#111827" />
                <rect x="189" y="0" width="5" height="38" fill="#111827" />
                <rect x="197" y="0" width="7" height="38" fill="#111827" />
                <rect x="207" y="0" width="3" height="38" fill="#111827" />
                <rect x="213" y="0" width="4" height="38" fill="#111827" />
                <rect x="220" y="0" width="8" height="38" fill="#111827" />
                <rect x="231" y="0" width="3" height="38" fill="#111827" />
                <rect x="236" y="0" width="4" height="38" fill="#111827" />
              </svg>

              <div className="fl-bp-gate-notice">
                Gate is subject to change and will close 25 minutes prior to
                departure.
              </div>
            </div>
          </div>

          {/* ==============================================================
              RIGHT TEAR-OFF STUB SECTION
              ============================================================== */}
          <div className="fl-bp-stub-section">
            <div className="fl-bp-stub-top-stripe"></div>

            <div className="fl-bp-stub-route-header">
              <span className="fl-bp-stub-airports">
                {sourceCode} → {destinationCode}
              </span>
              <i className="fa-solid fa-plane fl-bp-stub-icon"></i>
            </div>

            <div className="fl-bp-stub-pax-name">{formattedName}</div>

            <div className="fl-bp-stub-details">
              <div className="fl-bp-stub-row">
                <span className="fl-bp-stub-lbl">Flight:</span>
                <span className="fl-bp-stub-val">{flightNumber}</span>
              </div>
              <div className="fl-bp-stub-row">
                <span className="fl-bp-stub-lbl">Date:</span>
                <span className="fl-bp-stub-val">{departureDate}</span>
              </div>
              <div className="fl-bp-stub-row">
                <span className="fl-bp-stub-lbl">PNR:</span>
                <span className="fl-bp-stub-val">{pnr}</span>
              </div>
              <div className="fl-bp-stub-row">
                <span className="fl-bp-stub-lbl">Services:</span>
                <span className="fl-bp-stub-val">{services}</span>
              </div>
            </div>

            <div className="fl-bp-stub-bottom">
              <svg
                className="fl-bp-stub-barcode"
                viewBox="0 0 160 28"
                preserveAspectRatio="none"
              >
                <rect x="0" y="0" width="5" height="28" fill="#111827" />
                <rect x="8" y="0" width="2" height="28" fill="#111827" />
                <rect x="12" y="0" width="4" height="28" fill="#111827" />
                <rect x="18" y="0" width="3" height="28" fill="#111827" />
                <rect x="24" y="0" width="6" height="28" fill="#111827" />
                <rect x="33" y="0" width="2" height="28" fill="#111827" />
                <rect x="38" y="0" width="4" height="28" fill="#111827" />
                <rect x="45" y="0" width="7" height="28" fill="#111827" />
                <rect x="55" y="0" width="2" height="28" fill="#111827" />
                <rect x="60" y="0" width="5" height="28" fill="#111827" />
                <rect x="68" y="0" width="3" height="28" fill="#111827" />
                <rect x="74" y="0" width="6" height="28" fill="#111827" />
                <rect x="83" y="0" width="2" height="28" fill="#111827" />
                <rect x="88" y="0" width="4" height="28" fill="#111827" />
                <rect x="95" y="0" width="7" height="28" fill="#111827" />
                <rect x="105" y="0" width="2" height="28" fill="#111827" />
                <rect x="110" y="0" width="5" height="28" fill="#111827" />
                <rect x="118" y="0" width="3" height="28" fill="#111827" />
                <rect x="124" y="0" width="6" height="28" fill="#111827" />
                <rect x="133" y="0" width="2" height="28" fill="#111827" />
                <rect x="138" y="0" width="5" height="28" fill="#111827" />
                <rect x="146" y="0" width="7" height="28" fill="#111827" />
                <rect x="156" y="0" width="4" height="28" fill="#111827" />
              </svg>

              <div className="fl-bp-stub-seat-seq">
                <span>Seat: {seat}</span>
                <span>Seq: {sequenceNo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
