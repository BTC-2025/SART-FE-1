import React from 'react';

export default function CaptainProfileModal({
  isOpen,
  onClose,
  partnerDetails
}) {
  if (!isOpen) return null;

  return (
    <div className="c-modal-overlay" onClick={onClose}>
      <div className="c-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar (Screenshots 3 & 4) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#0f172a' }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>My Profile</h3>
          </div>

          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1.5px solid #cbd5e1',
              background: '#ffffff',
              padding: '4px 14px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              color: '#0f172a'
            }}
          >
            <i className="fa-solid fa-headset"></i>
            <span>Help</span>
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Blue Star Captain Banner with Gold Star (Screenshot 3) */}
          <div style={{
            background: 'linear-gradient(135deg, #0b50c0 0%, #0d3b8e 100%)',
            padding: '20px 22px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '65%' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: '#fef08a' }}>Star Captain</h4>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#e0e7ff', lineHeight: '1.4' }}>
                Trusted and top rated by customers
              </p>
            </div>
            <div style={{ position: 'absolute', right: '16px', top: '10px', fontSize: '80px', color: '#f59e0b' }}>
              ★
            </div>
          </div>

          {/* User Details & Stats (Screenshots 3 & 4) */}
          <div style={{ textAlign: 'center', marginTop: '-32px', position: 'relative', zIndex: 5, padding: '0 20px 20px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#e2e8f0',
              border: '3px solid #ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#64748b',
              margin: '0 auto 8px'
            }}>
              <i className="fa-solid fa-user"></i>
            </div>

            <h3 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {partnerDetails.name}
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '12px 0',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  -- <span style={{ color: '#f59e0b' }}>★</span>
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>RATING &gt;</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>495</div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>ORDERS</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>3.0</div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>YEARS</div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '13.5px' }}>
                  <i className="fa-solid fa-gauge" style={{ color: '#64748b' }}></i>
                  <span>Average</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '13.5px' }}>
                  <i className="fa-solid fa-user-circle" style={{ color: '#64748b' }}></i>
                  <span>Profile Info</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '13.5px' }}>
                  <i className="fa-solid fa-id-badge" style={{ color: '#64748b' }}></i>
                  <span>SART Captain ID Card</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '13.5px' }}>
                  <i className="fa-solid fa-certificate" style={{ color: '#64748b' }}></i>
                  <span>Documents (RC, DL, PAN)</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '13.5px' }}>
                  <i className="fa-solid fa-language" style={{ color: '#64748b' }}></i>
                  <span>Language Settings</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
              </div>
            </div>

            {/* Logout & Delete Account Actions (Screenshots 4 & 5) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => {
                  alert('Logged out successfully.');
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '24px',
                  border: '1.5px solid #0f172a',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-power-off"></i>
                <span>Logout</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete your captain account?')) {
                    alert('Account deleted.');
                    onClose();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '24px',
                  border: 'none',
                  background: '#881337',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>Delete Account</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
