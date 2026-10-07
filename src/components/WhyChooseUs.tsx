import React from 'react';

export default function WhyChooseUs() {
  const valueProps = [
    {
      icon: 'fa-shield-halved',
      title: '100% Verified Partners',
      desc: 'All drivers and service stations undergo strict background checks and quality assurance tests.'
    },
    {
      icon: 'fa-handshake',
      title: 'Direct Integration',
      desc: 'Seamlessly integrated with local auto and driver unions to ensure fair pay and reliable service.'
    },
    {
      icon: 'fa-wallet',
      title: 'Transparent Pricing',
      desc: 'No hidden fees or massive surge pricing. What you see is exactly what you pay.'
    },
    {
      icon: 'fa-clock-rotate-left',
      title: '24/7 Live Support',
      desc: 'Active live tracking and a dedicated customer support emergency helpline available round the clock.'
    }
  ];

  return (
    <div style={{
      width: '100%',
      marginBottom: '40px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: '#fff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '0.5px' }}>Our Promise</h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Experience the most reliable and transparent transit ecosystem built on trust, safety, and community integration.
        </p>
      </div>

      <div className="why-choose-us-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px'
      }}>
        {valueProps.map((prop, idx) => (
          <div key={idx} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'transform 0.3s, background 0.3s',
            cursor: 'default'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(59, 130, 246, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <i className={`fa-solid ${prop.icon}`} style={{ fontSize: '20px', color: '#60a5fa' }}></i>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>{prop.title}</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{prop.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Mobile responsive styles can be added here or in globals.css if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .why-choose-us-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .why-choose-us-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  );
}
