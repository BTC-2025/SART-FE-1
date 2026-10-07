import React from 'react';

const routes = [
  { id: 1, origin: 'Bengaluru', destination: 'Hyderabad', count: '170 Options', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=150&q=80' },
  { id: 2, origin: 'Indore', destination: 'Bhopal', count: '215 Options', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=150&q=80' },
  { id: 3, origin: 'Hyderabad', destination: 'Bengaluru', count: '170 Options', img: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=150&q=80' },
  { id: 4, origin: 'Bhopal', destination: 'Indore', count: '180 Options', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=150&q=80' },
  { id: 5, origin: 'Chennai', destination: 'Coimbatore', count: '145 Options', img: 'https://images.unsplash.com/photo-1623062335439-d34ba0a09e1d?auto=format&fit=crop&w=150&q=80' },
  { id: 6, origin: 'Mumbai', destination: 'Pune', count: '300 Options', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=150&q=80' }
];

export default function TopRoutes() {
  return (
    <div style={{ marginBottom: '60px', width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>Top Routes</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {routes.map(route => (
          <div 
            key={route.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '16px', 
              background: '#ffffff',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={route.img} alt={route.origin} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {route.origin} <i className="fa-solid fa-arrow-right" style={{ color: '#9ca3af', fontSize: '12px' }}></i> {route.destination}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{route.count}</div>
              </div>
            </div>
            
            <button style={{ 
              background: 'transparent', 
              border: '1px solid #d1d5db', 
              borderRadius: '20px', 
              padding: '8px 16px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#111827',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              View all
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
