import React from 'react';

const routes = [
  { id: 1, origin: 'Bengaluru', destination: 'Hyderabad', count: '170 Options', icon: 'fa-tree-city', color: '#3b82f6' },
  { id: 2, origin: 'Indore', destination: 'Bhopal', count: '215 Options', icon: 'fa-mountain-city', color: '#10b981' },
  { id: 3, origin: 'Hyderabad', destination: 'Bengaluru', count: '170 Options', icon: 'fa-monument', color: '#f59e0b' },
  { id: 4, origin: 'Bhopal', destination: 'Indore', count: '180 Options', icon: 'fa-vihara', color: '#ec4899' },
  { id: 5, origin: 'Chennai', destination: 'Coimbatore', count: '145 Options', icon: 'fa-gopuram', color: '#8b5cf6' },
  { id: 6, origin: 'Mumbai', destination: 'Pune', count: '300 Options', icon: 'fa-bridge-water', color: '#0ea5e9' }
];

export default function TopRoutes() {
  return (
    <div style={{ padding: '0px 20px 60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>Top Routes</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: `${route.color}20`, color: route.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                <i className={`fa-solid ${route.icon}`}></i>
              </div>
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
