'use client';

import React from 'react';

interface FlightCardRowProps {
  flight: any;
  isExpanded: boolean;
  setExpandedFlightId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFareMap: Record<string, string>;
  setSelectedFareMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  cardPrice: number;
  fareOptions: any[];
  currentTierId: string;
  selectedTier: any;
  totalTravelers: number;
  passengerSummaryText: string;
  handleProceedToPassengerDetails: (flight: any, selectedTier: any) => void;
  setDetailedFlightModal: (flight: any) => void;
}

export default function FlightCardRow({
  flight,
  isExpanded,
  setExpandedFlightId,
  selectedFareMap,
  setSelectedFareMap,
  cardPrice,
  fareOptions,
  currentTierId,
  selectedTier,
  totalTravelers,
  passengerSummaryText,
  handleProceedToPassengerDetails,
  setDetailedFlightModal
}: FlightCardRowProps) {
  return (
    <div
      key={flight.id}
      className={`fb-flight-card ${isExpanded ? 'fb-flight-card-selected' : ''}`}
      style={{
        border: isExpanded ? '2px solid #0084ff' : '1px solid #e2e8f0',
        boxShadow: isExpanded ? '0 6px 24px rgba(0, 132, 255, 0.16)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        borderRadius: '14px',
        transition: 'all 0.2s ease',
        overflow: 'hidden'
      }}
    >
      <div
        className="fb-flight-main-row"
        onClick={() => {
          setExpandedFlightId((prev) => (prev === flight.id ? null : flight.id));
        }}
        style={{ cursor: 'pointer' }}
      >
        {/* Airline Col */}
        <div className="fb-airline-col">
          <div className="fb-airline-logo-box" style={{ color: flight.airlineLogoColor }}>
            <i className="fa-solid fa-plane"></i>
          </div>
          <div>
            <div className="fb-airline-name">{flight.airline}</div>
            <div className="fb-flight-number">{flight.flightNo}</div>
          </div>
        </div>

        {/* Schedule Col */}
        <div className="fb-schedule-col">
          <div className="fb-time-node">
            <span className="fb-node-time">{flight.depTime}</span>
            <span className="fb-node-airport">{flight.depAirportCode}</span>
          </div>

          <div className="fb-duration-track">
            <span className="fb-track-duration">{flight.duration}</span>
            <div className="fb-track-line"></div>
            <span className={`fb-track-stops ${flight.stopsCount === 0 ? 'non-stop' : ''}`}>
              {flight.stopsText}
            </span>
          </div>

          <div className="fb-time-node">
            <span className="fb-node-time">{flight.arrTime}</span>
            <span className="fb-node-airport">{flight.arrAirportCode}</span>
          </div>
        </div>

        {/* Fare and CTA Col */}
        <div className="fb-fare-col">
          <div className="fb-fare-price">₹ {cardPrice.toLocaleString('en-IN')}</div>
          <div className="fb-fare-promo-tag">Get Flat 12% OFF using GOPNB</div>
          {totalTravelers > 1 && (
            <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px', textAlign: 'right' }}>
              Total for {totalTravelers} Pax ({passengerSummaryText})
            </div>
          )}
          <button
            type="button"
            className="fb-view-fares-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedFlightId((prev) => (prev === flight.id ? null : flight.id));
            }}
          >
            {isExpanded ? (
              <>
                <span>HIDE FARES</span>
                <i className="fa-solid fa-chevron-up" style={{ marginLeft: '6px', fontSize: '10px' }}></i>
              </>
            ) : (
              <>
                <span>VIEW FARES</span>
                <i className="fa-solid fa-chevron-down" style={{ marginLeft: '6px', fontSize: '10px' }}></i>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Fare Options Breakdown */}
      {isExpanded && (
        <div style={{
          background: '#eef6ff',
          borderRadius: '14px',
          border: '1.5px solid #bce1fe',
          padding: '16px',
          margin: '0 14px 14px 14px'
        }}>
          {/* Fare Cards Horizontal Scroll Grid */}
          <div
            className="fb-fare-cards-scroll-grid"
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'calc((100% - 28px) / 3)',
              gap: '14px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '8px'
            }}
          >
            {fareOptions.map((opt) => {
              const isChosen = currentTierId === opt.id;
              return (
                <div
                  key={opt.id}
                  className="fb-fare-card-item"
                  onClick={() => setSelectedFareMap((prev) => ({ ...prev, [flight.id]: opt.id }))}
                  style={{
                    border: isChosen ? '2.5px solid #00baf2' : '1px solid #cbd5e1',
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative',
                    scrollSnapAlign: 'start',
                    boxShadow: isChosen ? '0 4px 16px rgba(0, 186, 242, 0.18)' : '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    {/* Card Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', minHeight: '22px' }}>
                      <span style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 700 }}>
                        {opt.exclusiveBadge || (opt.isNew ? `↗ ${flight.airline} UpFront` : '')}
                      </span>

                      <span style={{
                        background: opt.isNew ? '#000080' : (isChosen ? '#e0f2fe' : '#f1f5f9'),
                        color: opt.isNew ? '#ffffff' : (isChosen ? '#0369a1' : '#475569'),
                        fontSize: '10.5px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}>
                        {opt.isNew ? 'New' : opt.tag}
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', lineHeight: '1.2' }}>
                      ₹{opt.price.toLocaleString('en-IN')}
                    </div>
                    {totalTravelers > 1 && (
                      <div style={{ fontSize: '9.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                        Total for {totalTravelers} Pax
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, marginTop: '2px', marginBottom: '12px' }}>
                      + Earn {opt.bluChips} {flight.airline} BluChips
                    </div>

                    <div style={{ height: '1px', background: '#e2e8f0', borderStyle: 'dashed', marginBottom: '10px' }}></div>

                    {/* Benefits list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#334155' }}>
                      {opt.features.map((feat: any, fIdx: number) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <i className={`fa-solid ${feat.icon}`} style={{ fontSize: '10px', color: feat.isAlert ? '#e11d48' : '#0284c7', marginTop: '2px' }}></i>
                          <div>
                            {feat.isAlert ? (
                              <span style={{
                                background: '#ffe4e6',
                                color: '#e11d48',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                fontSize: '10px'
                              }}>
                                {feat.text}
                              </span>
                            ) : (
                              <span style={{ fontWeight: feat.isHighlight ? 700 : 500, color: feat.isHighlight ? '#047857' : '#334155' }}>
                                {feat.text}
                              </span>
                            )}
                            {feat.sub && (
                              <div style={{ fontSize: '9.5px', color: '#64748b' }}>{feat.sub}</div>
                            )}
                            {feat.link && (
                              <span style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline', marginLeft: '4px', cursor: 'pointer' }}>
                                {feat.link}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Offer Box */}
                      {opt.offer && (
                        <div style={{
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          borderRadius: '6px',
                          padding: '8px',
                          marginTop: '4px',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '10px', color: '#0369a1', lineHeight: '1.3' }}>
                            {opt.offer.text}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFareMap((prev) => ({ ...prev, [flight.id]: 'flexi' }));
                            }}
                            style={{
                              background: '#000080',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '3px 10px',
                              fontSize: '10px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              marginTop: '6px'
                            }}
                          >
                            {opt.offer.action}
                          </button>
                        </div>
                      )}

                      {/* Inclusions */}
                      {opt.inclusions && opt.inclusions.map((inc: any, iIdx: number) => (
                        <div key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fa-solid ${inc.icon}`} style={{ fontSize: '10px', color: '#16a34a' }}></i>
                          <span style={{
                            fontWeight: inc.isLink ? 700 : 500,
                            color: inc.isMuted ? '#94a3b8' : (inc.isLink ? '#0284c7' : '#334155'),
                            textDecoration: inc.isLink ? 'underline' : 'none'
                          }}>
                            {inc.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Check Circle */}
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isChosen ? '5px solid #00baf2' : '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar of Expanded Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              <span>Compare fare types </span>
              <span style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Know more</span>
              <span> | </span>
              <span style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Click here to know more about flight</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 600 }}>
                  Book Return trip now & Save Big! Modify Booking
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800 }}>TOTAL FARE</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                    ₹{selectedTier.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '11px', color: '#0284c7', textDecoration: 'underline', cursor: 'pointer' }}>
                    View Details
                  </span>
                </div>
                {totalTravelers > 1 && (
                  <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                    For {totalTravelers} Pax ({passengerSummaryText})
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleProceedToPassengerDetails(flight, selectedTier)}
                style={{
                  background: '#000080',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '9px 32px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0, 0, 128, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer amenities */}
      <div className="fb-card-footer">
        <div className="fb-amenities-pills">
          <button type="button" className="fb-amenity-link">
            <i className="fa-solid fa-mug-saucer"></i> Amenities
          </button>
          <button
            type="button"
            className="fb-amenity-link"
            onClick={() => setDetailedFlightModal(flight)}
          >
            <i className="fa-solid fa-circle-info"></i> More flight details
          </button>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
          {flight.baggageInfo}
        </span>
      </div>
    </div>
  );
}
