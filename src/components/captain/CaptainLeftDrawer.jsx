import React from 'react';

export default function CaptainLeftDrawer({
  partnerDetails,
  onOpenProfile
}) {
  return (
    <aside className="c-left-permanent-drawer">
      {/* Drawer Blue Top Banner (Screenshot 1) */}
      <div className="c-drawer-header">
        <div className="c-star-badge">
          <i className="fa-solid fa-star"></i>
          <span>You are a Star Captain</span>
        </div>

        <div className="c-drawer-user-row">
          <div className="c-drawer-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {partnerDetails?.avatarUrl ? (
              <img
                src={partnerDetails.avatarUrl}
                alt={partnerDetails.name || 'Captain'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff' }}>
              {partnerDetails.name}
            </div>
            <div style={{ fontSize: '12px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>--</span>
              <i className="fa-solid fa-star" style={{ fontSize: '11px' }}></i>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfile}
            style={{
              background: '#1d4ed8',
              color: '#ffffff',
              border: '1.5px solid #60a5fa',
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Average</span>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i>
          </button>
        </div>
      </div>

      {/* Drawer Menu Items (Screenshot 1) */}
      <div className="c-drawer-menu-list">
        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-wallet"></i>
          <div>
            <div>Earnings</div>
            <div className="sub">Transfer Money to Bank, History</div>
          </div>
        </div>

        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-money-bill-wave"></i>
          <div>
            <div>Incentives and More</div>
            <div className="sub">Know how you get paid</div>
          </div>
        </div>

        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-gift"></i>
          <div>
            <div>Rewards</div>
            <div className="sub">Insurance and Discounts</div>
          </div>
        </div>

        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-cubes"></i>
          <div>
            <div>Service Manager</div>
            <div className="sub">Food Delivery & more</div>
          </div>
        </div>

        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-chart-pie"></i>
          <div>
            <div>Demand Planner</div>
            <div className="sub">Past High Demand Areas & More</div>
          </div>
        </div>

        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-headset"></i>
          <div>
            <div>Help</div>
            <div className="sub">Get support, Accident Insurance</div>
          </div>
        </div>

        <div className="c-drawer-menu-item">
          <i className="fa-solid fa-user-group"></i>
          <div>
            <div>Refer friends</div>
            <div className="sub">Earn up to ₹800</div>
          </div>
        </div>
      </div>

      {/* Promo Card (Screenshot 1 Bottom) */}
      <div style={{ background: '#f1f5f9', padding: '16px', margin: '14px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>
          Get New Vehicle Numbers
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
          Add to SART Captain Fleet & Earn Daily
        </div>
        <button
          type="button"
          style={{
            width: '100%',
            background: '#1d4ed8',
            color: '#ffffff',
            fontWeight: 800,
            padding: '9px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Tap to Earn
        </button>
      </div>
    </aside>
  );
}
