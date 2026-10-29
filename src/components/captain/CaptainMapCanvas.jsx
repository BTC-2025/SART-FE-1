import React from 'react';

export default function CaptainMapCanvas({ city = 'Delhi' }) {
  return (
    <main className="c-laptop-map-column">
      {/* Real-time OpenStreetMap Layer */}
      <iframe
        title="Captain Laptop Map"
        src="https://www.openstreetmap.org/export/embed.html?bbox=77.1500,28.5800,77.3500,28.7500&layer=mapnik&marker=28.6800,77.2600"
        style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0 }}
      />

      {/* High Demand Surge Badges (Matches Screenshot 1) */}
      <div style={{
        position: 'absolute',
        top: '38%',
        left: '46%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(34, 197, 94, 0.95)',
        color: '#ffffff',
        padding: '6px 14px',
        borderRadius: '8px',
        fontWeight: 900,
        fontSize: '14px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        <i className="fa-solid fa-bolt"></i>
        <span>1.14x Surge Area</span>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '120px',
        left: '52%',
        background: 'rgba(22, 163, 74, 0.95)',
        color: '#ffffff',
        padding: '5px 12px',
        borderRadius: '8px',
        fontWeight: 900,
        fontSize: '13px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        pointerEvents: 'none'
      }}>
        <span>1.26x • 1.18x Peak Zone</span>
      </div>

      {/* Top Right Floating Map Controls */}
      <div className="c-laptop-map-controls-topright">
        <button type="button" className="c-map-btn-circle" title="Full Screen View">
          <i className="fa-solid fa-expand"></i>
        </button>
        <button type="button" className="c-map-btn-circle" style={{ color: '#0284c7' }} title="Recenter to My Location">
          <i className="fa-solid fa-location-crosshairs"></i>
        </button>
        <button type="button" className="c-map-btn-circle" style={{ color: '#ef4444' }} title="Traffic / Accident Alerts">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </button>
      </div>

      {/* Bottom Floating Filters (Matches Screenshot 1) */}
      <div className="c-laptop-map-overlay-bottom">
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="c-pill-btn surge">
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}>↑</span>
            <span>Surge</span>
          </button>
          <button type="button" className="c-pill-btn">
            <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i>
            <span>High Demand</span>
          </button>
          <button type="button" className="c-pill-btn">
            <i className="fa-solid fa-bullseye" style={{ color: '#0d9488' }}></i>
            <span>Work Zone</span>
          </button>
          <button type="button" className="c-pill-btn">
            <i className="fa-solid fa-location-dot" style={{ color: '#ef4444' }}></i>
            <span>Go to</span>
          </button>
        </div>
      </div>
    </main>
  );
}
