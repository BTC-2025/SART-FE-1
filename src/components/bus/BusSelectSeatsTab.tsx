'use client';

import React, { useState } from 'react';
import { BusItem, BusSeat, BUS_GALLERY_IMAGES, CANCELLATION_POLICY_ROWS } from './busData';
import './BusSeatImage2.css';

export interface BusSelectSeatsTabProps {
  selectedBus: BusItem;
  currentSeatLayout: any;
  selectedSeats: string[];
  handleToggleSeat: (seat: any) => void;
  dateOfJourney?: string;
  setPreviewPhoto?: (url: string | null) => void;
  modalSubTab?: string;
  setModalSubTab?: (tab: string) => void;
  activeRouteData?: any;
  activeFullRoute?: any[];
  selectedBoardingPoint?: string;
  selectedDroppingPoint?: string;
  activeBoardingPoints?: any[];
  activeDroppingPoints?: any[];
  setSelectedBoardingPoint?: (name: string) => void;
  setSelectedDroppingPoint?: (name: string) => void;
  calculateTotalFare: () => number;
  setModalTopTab: (tab: any) => void;
}

export const BusSelectSeatsTab: React.FC<BusSelectSeatsTabProps> = ({
  selectedBus,
  currentSeatLayout,
  selectedSeats,
  handleToggleSeat,
  dateOfJourney,
  setPreviewPhoto,
  activeRouteData,
  activeBoardingPoints,
  activeDroppingPoints,
  selectedBoardingPoint,
  selectedDroppingPoint,
  setSelectedBoardingPoint,
  setSelectedDroppingPoint,
  calculateTotalFare,
  setModalTopTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('highlights');

  if (!selectedBus || !currentSeatLayout) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        Loading seat layout...
      </div>
    );
  }

  const {
    lowerSleepers = [],
    lowerSeaters = [],
    upperSleepersLeft = [],
    upperSleepersRight = [],
    hasToilet = false,
  } = currentSeatLayout;

  const showToilet = hasToilet || selectedBus?.hasToilet === true || selectedBus?.layoutVariant === 'toilet_sleeper_24_24';

  // Flatten all seats to quickly lookup seat objects by id
  const allSeatList: BusSeat[] = [
    ...lowerSleepers,
    ...lowerSeaters.flat(),
    ...upperSleepersLeft,
    ...upperSleepersRight.flat()
  ];

  const getSeatById = (id: string): BusSeat => {
    return (
      allSeatList.find(s => s.id === id) || {
        id,
        code: id,
        price: selectedBus.fare,
        type: 'seater',
        deck: 'lower',
        isBooked: false
      }
    );
  };

  // Render Seater Armchair SVG Icon matching Image 1
  const renderSeaterSvg = (status: 'available' | 'selected' | 'sold', gender?: 'female' | 'male') => {
    if (status === 'sold') {
      const isPink = gender === 'female';
      const strokeColor = isPink ? '#fbcfe8' : '#cbd5e1';
      const fillColor = isPink ? '#fdf2f8' : '#edf2f7';
      const crossColor = isPink ? '#f472b6' : '#93c5fd';

      return (
        <svg width="34" height="36" viewBox="0 0 34 36" fill="none">
          <rect x="2" y="3" width="30" height="30" rx="6" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 6 8 C 6 6 8 4 10 4 L 24 4 C 26 4 28 6 28 8 L 28 20 C 28 22 26 24 24 24 L 10 24 C 8 24 6 22 6 20 Z" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="12" y1="12" x2="22" y2="22" stroke={crossColor} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="22" y1="12" x2="12" y2="22" stroke={crossColor} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    if (status === 'selected') {
      // Selected State with Green Checkmark (Image 1)
      return (
        <svg width="34" height="36" viewBox="0 0 34 36" fill="none">
          <rect x="2" y="3" width="30" height="30" rx="6" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
          <path d="M 6 8 C 6 6 8 4 10 4 L 24 4 C 26 4 28 6 28 8 L 28 20 C 28 22 26 24 24 24 L 10 24 C 8 24 6 22 6 20 Z" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
          <path d="M 12 17 L 15 20 L 22 13" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // Available
    let strokeColor = '#16a34a'; // Green general
    if (gender === 'female') strokeColor = '#ec4899';
    if (gender === 'male') strokeColor = '#2563eb';

    return (
      <svg width="34" height="36" viewBox="0 0 34 36" fill="none">
        <rect x="2" y="3" width="30" height="30" rx="6" fill="#ffffff" stroke={strokeColor} strokeWidth="1.8" />
        <path d="M 6 7 C 6 5.5 7.5 4 9 4 L 25 4 C 26.5 4 28 5.5 28 7 L 28 21 C 28 23 26.5 24 25 24 L 9 24 C 7.5 24 6 23 6 21 Z" stroke={strokeColor} strokeWidth="1.4" />
        {gender === 'female' && (
          <g fill={strokeColor}>
            <circle cx="17" cy="10" r="2.2" />
            <path d="M 14.5 14 L 19.5 14 L 21 21 L 13 21 Z" />
          </g>
        )}
        {gender === 'male' && (
          <g fill={strokeColor}>
            <circle cx="17" cy="10" r="2.2" />
            <rect x="14.5" y="13.5" width="5" height="5" rx="1" />
            <rect x="14.5" y="18.5" width="2.2" height="3" rx="0.5" />
            <rect x="17.3" y="18.5" width="2.2" height="3" rx="0.5" />
          </g>
        )}
      </svg>
    );
  };

  // Render individual seat berth
  const renderSeat = (seat: BusSeat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const status = seat.isBooked ? 'sold' : isSelected ? 'selected' : 'available';

    if (seat.type === 'sleeper') {
      const isWomenSold = seat.isBooked && seat.bookedGender === 'female';
      return (
        <div key={seat.id} className="bb-seat-unit">
          <div
            className={`bb-sleeper-box ${status} ${isWomenSold ? 'women-sold' : ''}`}
            onClick={() => !seat.isBooked && handleToggleSeat(seat)}
            title={seat.isBooked ? `Seat ${seat.code} (Sold)` : `Seat ${seat.code} • ₹${seat.price}`}
          >
            {status === 'sold' ? (
              <span className="bb-cross-glyph">✕</span>
            ) : status === 'selected' ? (
              <span className="bb-check-glyph">✓</span>
            ) : (
              <div className="bb-sleeper-pillow" />
            )}
          </div>
          {status === 'sold' ? (
            <span className={`bb-seat-sold-sub ${isWomenSold ? 'women-sold' : ''}`}>Sold</span>
          ) : (
            <span className={`bb-seat-price-sub ${status === 'selected' ? 'selected' : ''}`}>
              ₹{seat.price || selectedBus.fare}
            </span>
          )}
        </div>
      );
    }

    // Seater Chair
    return (
      <div key={seat.id} className="bb-seat-unit">
        <div
          className={`bb-seater-box ${status}`}
          onClick={() => !seat.isBooked && handleToggleSeat(seat)}
          title={seat.isBooked ? `Seat ${seat.code} (Sold)` : `Seat ${seat.code} • ₹${seat.price}`}
        >
          {renderSeaterSvg(status, seat.bookedGender)}
        </div>
        {status === 'sold' ? (
          <span className={`bb-seat-sold-sub ${seat.bookedGender === 'female' ? 'women-sold' : ''}`}>Sold</span>
        ) : (
          <span className={`bb-seat-price-sub ${status === 'selected' ? 'selected' : ''}`}>
            ₹{seat.price || selectedBus.fare}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bb-modal-two-col-layout">
      {/* ===================== LEFT COLUMN: The Two Decks ===================== */}
      <div className="bb-deck-container-exact">
        {/* Lower Deck */}
        <div className="bb-deck-card-exact">
          <div className="bb-deck-header-exact">
            <span className="bb-deck-title-exact">Lower deck</span>
            <span className="bb-steering-wheel-exact" title="Driver Cabin">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="22" />
                <line x1="2" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="22" y2="12" />
              </svg>
            </span>
          </div>

          <div className="bb-bus-body-frame">
            {/* Left Column: Sleepers (With Toilet Cubicle at top if toilet bus - Image 3) */}
            <div className="bb-sleeper-column">
              {showToilet && (
                <div className="bb-seat-unit bb-toilet-unit" title="Restroom / Toilet Available Onboard">
                  <div className="bb-toilet-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 12h10M7 8h10M5 4h14a2 2 0 0 1 2 2v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7V6a2 2 0 0 1 2-2z" />
                      <path d="M10 19v2M14 19v2" />
                    </svg>
                    <span className="bb-toilet-text">Toilet</span>
                  </div>
                  <span className="bb-seat-price-sub" style={{ color: '#2563eb', fontWeight: 600 }}>WC</span>
                </div>
              )}
              {lowerSleepers.map((seat: BusSeat) => renderSeat(seat))}
            </div>

            {/* Right Column: Pairs */}
            <div className="bb-pairs-column">
              {lowerSeaters.map((pair: BusSeat[], rIdx: number) => (
                <div key={rIdx} className="bb-seat-pair-row">
                  {pair.map((seat: BusSeat) => renderSeat(seat))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upper Deck */}
        <div className="bb-deck-card-exact">
          <div className="bb-deck-header-exact">
            <span className="bb-deck-title-exact">Upper deck</span>
            <div style={{ width: '22px' }} />
          </div>

          <div className="bb-bus-body-frame">
            {/* Left Column: Single Sleepers */}
            <div className="bb-sleeper-column">
              {upperSleepersLeft.map((seat: BusSeat) => renderSeat(seat))}
            </div>

            {/* Right Column: Double Sleepers */}
            <div className="bb-pairs-column">
              {upperSleepersRight.map((pair: BusSeat[], rIdx: number) => (
                <div key={rIdx} className="bb-seat-pair-row">
                  {pair.map((seat: BusSeat) => renderSeat(seat))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== RIGHT COLUMN: Bus Details, Photos, Subtabs & Checkout (Image 3) ===================== */}
      <div className="bb-modal-right-col">
        {/* Operator Title & Rating Row */}
        <div className="bb-right-header-row">
          <div>
            <div className="bb-right-operator-title">
              {selectedBus.isPrimo && <span className="bb-primo-badge">Primo</span>}
              <span>{selectedBus.operator}</span>
            </div>
            <div className="bb-right-route-time">
              {selectedBus.depTime} - {selectedBus.arrTime} • {dateOfJourney || 'Sat 14 Nov'}
            </div>
            <div className="bb-right-bus-type">
              {selectedBus.busType}
            </div>
          </div>

          <div>
            <div className="bb-right-rating-badge">
              ★ {selectedBus.rating || 4.9}
            </div>
            <div className="bb-right-reviews-count">
              {selectedBus.totalRatings || 1103} reviews
            </div>
          </div>
        </div>

        {/* Bus Photos Carousel (Image 3) */}
        <div className="bb-bus-photos-row">
          {BUS_GALLERY_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="bb-bus-photo-card"
              onClick={() => setPreviewPhoto && setPreviewPhoto(img.url)}
              title={img.title}
            >
              <img src={img.url} alt={img.title} />
            </div>
          ))}
        </div>

        {/* Subtabs Bar (Image 3) */}
        <div className="bb-right-subtabs-bar">
          <button
            type="button"
            className={`bb-right-subtab-btn ${activeSubTab === 'highlights' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('highlights')}
          >
            Highlights
          </button>
          <button
            type="button"
            className={`bb-right-subtab-btn ${activeSubTab === 'cancellation' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('cancellation')}
          >
            Cancellation policy
          </button>
          <button
            type="button"
            className={`bb-right-subtab-btn ${activeSubTab === 'reschedule' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('reschedule')}
          >
            Reschedule Policy
          </button>
          <button
            type="button"
            className={`bb-right-subtab-btn ${activeSubTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('route')}
          >
            Bus route
          </button>
          <button
            type="button"
            className={`bb-right-subtab-btn ${activeSubTab === 'boarding' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('boarding')}
          >
            Boarding point
          </button>
          <button
            type="button"
            className={`bb-right-subtab-btn ${activeSubTab === 'dropping' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('dropping')}
          >
            Dropping point
          </button>
        </div>

        {/* Subtab Contents (Image 3) */}
        {activeSubTab === 'highlights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="bb-highlights-cards-grid">
              <div className="bb-hl-card">
                <div>
                  <div className="bb-hl-title">80% on time</div>
                  <div className="bb-hl-sub">Based on live tracking</div>
                </div>
                <span>›</span>
              </div>
              <div className="bb-hl-card">
                <div>
                  <div className="bb-hl-title">New bus</div>
                  <div className="bb-hl-sub">8 months old</div>
                </div>
                <span>🏅</span>
              </div>
              <div className="bb-hl-card">
                <div>
                  <div className="bb-hl-title">9.6/10 on comfort</div>
                  <div className="bb-hl-sub">Based on reviews</div>
                </div>
                <span>›</span>
              </div>
              <div className="bb-hl-card">
                <div>
                  <div className="bb-hl-title">Women's choice</div>
                  <div className="bb-hl-sub">Highly rated by women</div>
                </div>
                <span>👩</span>
              </div>
            </div>

            {/* Exclusive Discount Banner */}
            <div className="bb-exclusive-discount-banner">
              <span className="bb-discount-badge">Exclusive ₹100 OFF</span>
              <span className="bb-discount-text">Special fare, just for you</span>
            </div>
          </div>
        )}

        {activeSubTab === 'cancellation' && (
          <div style={{ fontSize: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                  <th style={{ padding: '6px', textAlign: 'left' }}>Time of Cancellation</th>
                  <th style={{ padding: '6px', textAlign: 'right' }}>Refund</th>
                </tr>
              </thead>
              <tbody>
                {CANCELLATION_POLICY_ROWS.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px' }}>{row.time}</td>
                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>
                      {row.refund}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'reschedule' && (
          <div style={{ fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
            📅 <strong>Free Rescheduling:</strong> Change journey date or time up to 4 hours prior to departure without cancellation fees.
          </div>
        )}

        {activeSubTab === 'route' && (
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeRouteData?.fullRoute?.map((stop: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>{stop.name}</span>
                <span style={{ color: '#64748b' }}>{stop.time}</span>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'boarding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
            {activeBoardingPoints?.map((bp: any, i: number) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="modal_bp"
                  checked={selectedBoardingPoint === bp.name}
                  onChange={() => setSelectedBoardingPoint && setSelectedBoardingPoint(bp.name)}
                />
                <div>
                  <strong>{bp.name}</strong> • <span style={{ color: '#64748b' }}>{bp.time}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {activeSubTab === 'dropping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
            {activeDroppingPoints?.map((dp: any, i: number) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="modal_dp"
                  checked={selectedDroppingPoint === dp.name}
                  onChange={() => setSelectedDroppingPoint && setSelectedDroppingPoint(dp.name)}
                />
                <div>
                  <strong>{dp.name}</strong> • <span style={{ color: '#64748b' }}>{dp.time}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* ===================== CHECKOUT FOOTER (Image 2) ===================== */}
        <div className="bb-exact-checkout-bar">
          {/* Only show selected chips row when seats are selected (Image 2) */}
          {selectedSeats.length > 0 ? (
            <div className="bb-exact-chips-col">
              <span className="bb-exact-seats-title">
                Selected Seats ({selectedSeats.length}):
              </span>
              <div className="bb-exact-chips-list">
                {selectedSeats.map(seatId => {
                  const s = getSeatById(seatId);
                  return (
                    <div key={seatId} className="bb-exact-chip">
                      <span>{seatId} • ₹{s?.price || selectedBus.fare}</span>
                      <button
                        type="button"
                        className="bb-exact-chip-remove"
                        onClick={() => handleToggleSeat(s)}
                        title="Remove seat"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Select available seats on the left to proceed
            </span>
          )}

          <div className="bb-exact-fare-cta-row">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Total Fare</span>
              <span className="bb-exact-total-fare">
                ₹{calculateTotalFare()}
              </span>
            </div>

            <button
              type="button"
              className="bb-exact-continue-btn"
              disabled={selectedSeats.length === 0}
              onClick={() => setModalTopTab('boarding_dropping')}
            >
              Continue to Board/Drop point →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
