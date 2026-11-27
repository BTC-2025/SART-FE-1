import React from 'react';

export interface FlightPassengerSummarySidebarProps {
  flightData: any;
  summaryPill: string;
}

export default function FlightPassengerSummarySidebar({
  flightData,
  summaryPill
}: FlightPassengerSummarySidebarProps) {
  return (
    <aside className="fp-right-col">
      {/* Trip Summary Card */}
      <div className="fp-summary-card">
        <div className="fp-summary-top-row">
          <h4 className="fp-summary-title">Trip Summary</h4>
        </div>
        <div className="fp-pax-summary-pill">{summaryPill}</div>

        {/* Flight Details Inside Summary */}
        <div className="fp-flight-box">
          <div className="fp-departing-badge">Departing</div>

          <div className="fp-flight-meta-row">
            <span style={{ fontWeight: 800, color: '#0369a1' }}>{flightData.fareTier}</span>
            <span>
              ✈ {flightData.flightNo}, {flightData.aircraft || 'Airbus A321'}
            </span>
          </div>

          <div className="fp-timeline">
            {/* Origin */}
            <div className="fp-timeline-node">
              <div className="fp-node-dot"></div>
              <div className="fp-node-content">
                <div className="fp-node-time">
                  {flightData.depTime} <span style={{ fontSize: '11px', color: '#64748b' }}>| {flightData.depDate}</span>
                </div>
                <div className="fp-node-city">{flightData.source}</div>
                <div className="fp-node-airport">Indira Gandhi International Airport ({flightData.sourceTerminal || 'T3'})</div>
              </div>
            </div>

            <div className="fp-travel-duration">Travel time {flightData.travelTime}</div>

            {/* Destination */}
            <div className="fp-timeline-node">
              <div className="fp-node-dot"></div>
              <div className="fp-node-content">
                <div className="fp-node-time">
                  {flightData.arrTime} <span style={{ fontSize: '11px', color: '#64748b' }}>| {flightData.arrDate}</span>
                </div>
                <div className="fp-node-city">{flightData.destination}</div>
                <div className="fp-node-airport">Chhatrapati Shivaji Maharaj International Airport ({flightData.destinationTerminal || 'T2'})</div>
              </div>
            </div>
          </div>

          {/* Baggage Row */}
          <div className="fp-baggage-row">
            <div>
              <i className="fa-solid fa-lock" style={{ marginRight: '4px', color: '#0284c7' }}></i>
              Cabin Baggage : {flightData.cabinBaggage}
            </div>
            <div>
              <i className="fa-solid fa-suitcase-rolling" style={{ marginRight: '4px', color: '#0284c7' }}></i>
              Check-in Baggage : {flightData.checkInBaggage}
            </div>
          </div>
        </div>
      </div>

      {/* Our Exclusive Benefits */}
      <div className="fp-exclusive-benefits">
        <h4 className="fp-benefits-title">Our Exclusive Benefits</h4>

        {/* Maldives Banner */}
        <div
          className="fp-benefit-banner"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0c4a6e 100%)',
            padding: '16px',
            color: 'white',
            position: 'relative'
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85 }}>
            Sart Special
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, marginTop: '2px' }}>Maldives for shore</div>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
            Enjoy 10% off on all flights from Bengaluru, Hyderabad, Kochi, Mumbai &amp; Trivandrum
          </div>
        </div>

        {/* 6E Fare Hold Banner */}
        <div className="fp-fare-hold-card">
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd' }}>Hold Fare Starting at just</div>
            <div className="fp-fare-hold-price">₹49*</div>
            <div style={{ fontSize: '10px', color: '#bae6fd' }}>Unlimited Free curve protection</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <i className="fa-solid fa-lock" style={{ fontSize: '28px', color: '#38bdf8' }}></i>
            <div style={{ fontSize: '12px', fontWeight: 800, marginTop: '4px' }}>6E Fare Hold</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
