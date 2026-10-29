import React, { useState } from 'react';

export default function CaptainSidebar({
  partnerDetails,
  activeRide,
  onAcceptRide,
  onPassRide,
  onOpenDrawer,
  onOpenProfile
}) {
  const [earningsExpanded, setEarningsExpanded] = useState(false);

  return (
    <aside className="c-laptop-sidebar">
      {/* Blue Captain Hero / Earnings Card (Screenshot 1 & 2) */}
      <div
        className="c-earnings-hero"
        style={{
          background: 'linear-gradient(135deg, #0b50c0 0%, #0d3b8e 100%)',
          color: '#ffffff',
          padding: '18px 20px',
          borderRadius: '0px',
          boxShadow: '0 4px 12px rgba(11, 80, 192, 0.25)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            className="c-star-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.6)',
              color: '#fbbf24',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 800
            }}
          >
            <i className="fa-solid fa-star"></i>
            <span>Star Captain</span>
          </div>
          <span style={{ fontSize: '12px', color: '#bfdbfe', fontWeight: 700 }}>
            {partnerDetails.vehiclePlate} ({partnerDetails.model})
          </span>
        </div>

        <div className="c-earnings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span className="c-earnings-title" style={{ fontSize: '16px', fontWeight: 700, color: '#e0e7ff' }}>Today's Earnings</span>
          <div
            className="c-earnings-amount"
            onClick={() => setEarningsExpanded(!earningsExpanded)}
            style={{ cursor: 'pointer', fontSize: '28px', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}
            title="Click to toggle breakdown"
          >
            <span>₹0</span>
            <i className={`fa-solid fa-chevron-${earningsExpanded ? 'up' : 'down'}`} style={{ fontSize: '14px', opacity: 0.85 }}></i>
          </div>
        </div>

        {earningsExpanded && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '12.5px', color: '#e0e7ff', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div>Trip Fares: <strong>₹0.00</strong></div>
            <div>Incentives: <strong>₹0.00</strong></div>
            <div>Tips Earned: <strong>₹0.00</strong></div>
            <div>Payout: <strong>Auto to Bank</strong></div>
          </div>
        )}
      </div>

      {/* Average Performance Banner with Silver Medal (Screenshot 1) */}
      <div className="c-performance-card">
        <div className="c-perf-header">
          <div>
            <div className="c-perf-subtitle">Average Performance</div>
            <div className="c-perf-title">4 Order Cancelled</div>
            <div className="c-streak-dots">
              <span className="c-streak-dot check">✓</span>
              <span className="c-streak-dot check">✓</span>
              <span className="c-streak-dot cancel">✕</span>
              <span className="c-streak-dot check">✓</span>
              <span className="c-streak-dot check">✓</span>
              <span className="c-streak-dot check">✓</span>
              <span className="c-streak-dot cancel">✕</span>
              <span className="c-streak-dot check">✓</span>
              <span className="c-streak-dot cancel">✕</span>
              <span className="c-streak-dot cancel">✕</span>
            </div>
          </div>

          <div className="c-medal-badge" title="Rank 2 Medal">
            <span>2</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics for Laptop View */}
      <div className="c-laptop-metrics">
        <div className="c-metric-item">
          <div className="c-metric-val">-- ★</div>
          <div className="c-metric-lbl">RATING</div>
        </div>
        <div className="c-metric-item">
          <div className="c-metric-val">495</div>
          <div className="c-metric-lbl">ORDERS</div>
        </div>
        <div className="c-metric-item">
          <div className="c-metric-val">3.0</div>
          <div className="c-metric-lbl">YEARS</div>
        </div>
      </div>

      {/* Active Orders Section */}
      <div className="c-sidebar-orders-section">
        <div className="c-section-heading">
          <span>Current Ride Opportunity</span>
          <span style={{ fontSize: '11px', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
            ● LIVE MATCH
          </span>
        </div>

        {activeRide ? (
          <div className="c-incoming-ride-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="c-incoming-badge">
                <i className="fa-solid fa-bolt"></i> HIGH DEMAND TRIP
              </span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#16a34a' }}>
                {activeRide.fare}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {activeRide.passengerName[0]}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{activeRide.passengerName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{activeRide.rating} • {activeRide.phone}</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '14px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                <strong>Pickup:</strong> {activeRide.pickup}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                <strong>Drop:</strong> {activeRide.dropoff}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                <span><i className="fa-solid fa-route"></i> {activeRide.distance}</span>
                <span><i className="fa-solid fa-clock"></i> {activeRide.duration}</span>
                <span><i className="fa-solid fa-key"></i> OTP: <strong>{activeRide.otp}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '13.5px'
                }}
                onClick={onAcceptRide}
              >
                Accept Trip ({activeRide.fare})
              </button>
              <button
                type="button"
                style={{
                  padding: '10px 16px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13.5px'
                }}
                onClick={onPassRide}
              >
                Pass
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            <i className="fa-solid fa-radar" style={{ fontSize: '24px', color: '#0284c7', marginBottom: '8px', display: 'block' }}></i>
            Searching for nearby passenger requests in your zone...
          </div>
        )}

        {/* Action Button */}
        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={onOpenProfile}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #0284c7', background: '#f0f9ff', color: '#0284c7', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
          >
            <i className="fa-solid fa-user-circle" style={{ fontSize: '16px' }}></i>
            <span>Open My Profile & Documents</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
