'use client';

import React from 'react';

interface FlightDetailedModalProps {
  detailedFlightModal: any;
  setDetailedFlightModal: (val: any) => void;
  cabinClass: string;
}

export default function FlightDetailedModal({
  detailedFlightModal,
  setDetailedFlightModal,
  cabinClass
}: FlightDetailedModalProps) {
  if (!detailedFlightModal) return null;

  return (
    <div className="fb-modal-overlay" onClick={() => setDetailedFlightModal(null)}>
      <div className="fb-itinerary-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header with Close (X) button */}
        <div className="fb-itinerary-header">
          <h3 className="fb-itinerary-title">Flight Details</h3>
          <button
            type="button"
            className="fb-modal-close-btn"
            onClick={() => setDetailedFlightModal(null)}
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="fb-itinerary-body">
          {/* Segment 1 */}
          <div className="fb-segment-card">
            <div className="fb-segment-meta-row">
              <div className="fb-segment-meta-left">
                <div className="fb-seg-airline-icon" style={{ background: detailedFlightModal.airlineLogoColor }}>
                  <i className="fa-solid fa-plane"></i>
                </div>
                <span className="fb-seg-airline-name">{detailedFlightModal.airline}</span>
                <span className="fb-seg-flight-no">
                  {detailedFlightModal.flightNo.split('|')[0]?.trim()}
                </span>
                <span className="fb-aircraft-pill">{detailedFlightModal.aircraftType}</span>
              </div>
              <div className="fb-segment-meta-right">
                <span className="fb-class-spec">
                  {cabinClass} &gt; <strong>SAVER</strong>
                </span>
              </div>
            </div>

            {/* Segment 1 Detailed Timings Timeline */}
            <div className="fb-timeline-tree">
              {/* Departure Node */}
              <div className="fb-timeline-node">
                <div className="fb-timeline-time">{detailedFlightModal.depTime}</div>
                <div className="fb-timeline-bullet"></div>
                <div className="fb-timeline-place">
                  <span className="fb-place-city">{detailedFlightModal.depCity}</span>
                  <span className="fb-place-airport">
                    {detailedFlightModal.depCity} International Airport, Terminal T1
                  </span>
                </div>
                <div className="fb-timeline-amenity-icons">
                  <i className="fa-solid fa-wifi" title="In-flight Wi-Fi"></i>
                  <i className="fa-solid fa-mug-saucer" title="Refreshment Service"></i>
                </div>
              </div>

              {/* Mid-route duration connector */}
              <div className="fb-timeline-connector">
                <span className="fb-connector-duration">
                  {detailedFlightModal.stopsCount === 0 ? detailedFlightModal.duration : '1h 05m'}
                </span>
              </div>

              {/* Arrival Node (or Layover Node if 1 stop) */}
              <div className="fb-timeline-node">
                <div className="fb-timeline-time">
                  {detailedFlightModal.stopsCount === 0 ? detailedFlightModal.arrTime : '12:00'}
                </div>
                <div className="fb-timeline-bullet"></div>
                <div className="fb-timeline-place">
                  <span className="fb-place-city">
                    {detailedFlightModal.stopsCount === 0 ? detailedFlightModal.arrCity : (detailedFlightModal.layoverAirport || 'Bengaluru')}
                  </span>
                  <span className="fb-place-airport">
                    {detailedFlightModal.stopsCount === 0
                      ? `${detailedFlightModal.arrCity} Airport`
                      : `Kempegowda International Airport ${detailedFlightModal.layoverAirport || 'Bengaluru'}, Terminal T1`}
                  </span>
                </div>
              </div>
            </div>

            {/* Baggage allowance strip */}
            <div className="fb-baggage-strip">
              <div className="fb-baggage-item">
                <i className="fa-solid fa-briefcase"></i>
                <span>
                  <strong>Cabin Baggage:</strong> {cabinClass === 'Business' ? '12 Kgs' : (cabinClass === 'Premium Economy' ? '10 Kgs' : '7 Kgs')} / Adult
                </span>
              </div>
              <div className="fb-baggage-item">
                <i className="fa-solid fa-suitcase-rolling"></i>
                <span>
                  <strong>Check-In Baggage:</strong> {cabinClass === 'Business' ? '40 Kgs' : (cabinClass === 'Premium Economy' ? '25 Kgs' : '15 Kgs')} / Adult
                </span>
              </div>
            </div>
          </div>

          {/* If 1 Stop: Show Change of Planes & Second Flight Segment */}
          {detailedFlightModal.stopsCount > 0 && (
            <>
              {/* Change of Planes Bar */}
              <div className="fb-layover-divider-bar">
                <div className="fb-layover-connector-line"></div>
                <div className="fb-layover-info-pill">
                  <span className="fb-layover-title">Change of planes</span>
                  <span className="fb-layover-time">
                    <strong>2h 15m</strong> Layover in {detailedFlightModal.layoverAirport || 'Bengaluru'}
                  </span>
                </div>
              </div>

              {/* Segment 2 */}
              <div className="fb-segment-card">
                <div className="fb-segment-meta-row">
                  <div className="fb-segment-meta-left">
                    <div className="fb-seg-airline-icon" style={{ background: detailedFlightModal.airlineLogoColor }}>
                      <i className="fa-solid fa-plane"></i>
                    </div>
                    <span className="fb-seg-airline-name">{detailedFlightModal.airline}</span>
                    <span className="fb-seg-flight-no">
                      {detailedFlightModal.flightNo.split('|')[1]?.trim() || '6E-5306'}
                    </span>
                    <span className="fb-aircraft-pill">Airbus A321</span>
                  </div>
                  <div className="fb-segment-meta-right">
                    <span className="fb-class-spec">
                      {cabinClass} &gt; <strong>GO SPECIAL</strong>
                    </span>
                  </div>
                </div>

                <div className="fb-timeline-tree">
                  <div className="fb-timeline-node">
                    <div className="fb-timeline-time">14:15</div>
                    <div className="fb-timeline-bullet"></div>
                    <div className="fb-timeline-place">
                      <span className="fb-place-city">{detailedFlightModal.layoverAirport || 'Bengaluru'}</span>
                      <span className="fb-place-airport">
                        Kempegowda International Airport {detailedFlightModal.layoverAirport || 'Bengaluru'}, Terminal T1
                      </span>
                    </div>
                    <div className="fb-timeline-amenity-icons">
                      <i className="fa-solid fa-wifi" title="In-flight Wi-Fi"></i>
                      <i className="fa-solid fa-mug-saucer" title="Refreshment Service"></i>
                    </div>
                  </div>

                  <div className="fb-timeline-connector">
                    <span className="fb-connector-duration">1h 05m</span>
                  </div>

                  <div className="fb-timeline-node">
                    <div className="fb-timeline-time">{detailedFlightModal.arrTime}</div>
                    <div className="fb-timeline-bullet"></div>
                    <div className="fb-timeline-place">
                      <span className="fb-place-city">{detailedFlightModal.arrCity}</span>
                      <span className="fb-place-airport">{detailedFlightModal.arrCity} International Airport</span>
                    </div>
                  </div>
                </div>

                <div className="fb-baggage-strip">
                  <div className="fb-baggage-item">
                    <i className="fa-solid fa-briefcase"></i>
                    <span>
                      <strong>Cabin Baggage:</strong> {cabinClass === 'Business' ? '12 Kgs' : (cabinClass === 'Premium Economy' ? '10 Kgs' : '7 Kgs')} / Adult
                    </span>
                  </div>
                  <div className="fb-baggage-item">
                    <i className="fa-solid fa-suitcase-rolling"></i>
                    <span>
                      <strong>Check-In Baggage:</strong> {cabinClass === 'Business' ? '40 Kgs' : (cabinClass === 'Premium Economy' ? '25 Kgs' : '15 Kgs')} / Adult
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
