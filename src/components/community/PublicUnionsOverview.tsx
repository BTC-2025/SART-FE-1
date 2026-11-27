'use client';

import React from 'react';
import { TransportUnionInfo } from './transportUnionsData';

interface PublicUnionsOverviewProps {
  unions: TransportUnionInfo[];
  categoryFilter: 'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL';
  onCategoryFilterChange: (cat: 'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL') => void;
  onSelectUnion: (union: TransportUnionInfo) => void;
}

export default function PublicUnionsOverview({
  unions,
  categoryFilter,
  onCategoryFilterChange,
  onSelectUnion
}: PublicUnionsOverviewProps) {
  const activeUnionsCount = unions.length;
  const regionalStandsCount = unions.reduce((acc, u) => acc + u.standsCount, 0);
  const verifiedDriversCount = unions.reduce((acc, u) => acc + u.membersCount, 0);

  return (
    <div className="fade-in">
      {/* Hero Green Card matching user design */}
      <div
        style={{
          background: '#2A1373',
          borderRadius: '20px',
          padding: '26px 30px',
          color: '#ffffff',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
          boxShadow: '0 10px 25px -5px rgba(15, 5, 150, 0.28)'
        }}
      >
        {/* Left text */}
        <div style={{ flex: '1 1 480px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#2A1373',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 700,
              marginBottom: '10px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <i className="fa-solid fa-shield-halved"></i> Regional Stand Communities
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.4px', lineHeight: 1.25 }}>
            Public Transport Unions &amp; Regional Stands
          </h2>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: 1.5, maxWidth: '560px' }}>
            Select your transport union below to log in or register at your local stand. Each location locks to one official Stand Name shared by all drivers at that spot.
          </p>
        </div>

        {/* Right Glass Metric Cards */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '16px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '95px'
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1 }}>{activeUnionsCount}</div>
            <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 700, marginTop: '5px' }}>Active Unions</div>
          </div>

          <div
            style={{
              background: '#2A1373',
              backdropFilter: 'blur(8px)',
              border: '1px solid #2A1373',
              borderRadius: '16px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '95px'
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1 }}>{regionalStandsCount}</div>
            <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 700, marginTop: '5px' }}>Regional Stands</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '16px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '95px'
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1 }}>{verifiedDriversCount}</div>
            <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 700, marginTop: '5px' }}>Verified Drivers</div>
          </div>
        </div>
      </div>

      {/* Section Sub-Header & Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#475569', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            CHOOSE A TRANSPORT UNION
          </span>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => onCategoryFilterChange('ROAD')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'ROAD' ? '#ffffff' : 'transparent',
                color: categoryFilter === 'ROAD' ? '#0f172a' : '#64748b',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: categoryFilter === 'ROAD' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Road Stands
            </button>
            <button
              onClick={() => onCategoryFilterChange('ALL')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'ALL' ? '#ffffff' : 'transparent',
                color: categoryFilter === 'ALL' ? '#0f172a' : '#64748b',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: categoryFilter === 'ALL' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              All
            </button>
            <button
              onClick={() => onCategoryFilterChange('SEA')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'SEA' ? '#ffffff' : 'transparent',
                color: categoryFilter === 'SEA' ? '#0f172a' : '#64748b',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: categoryFilter === 'SEA' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Marine
            </button>
            <button
              onClick={() => onCategoryFilterChange('AIR')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'AIR' ? '#ffffff' : 'transparent',
                color: categoryFilter === 'AIR' ? '#0f172a' : '#64748b',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: categoryFilter === 'AIR' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Aviation
            </button>
          </div>
        </div>

        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Click any union row to open Login & Sign Up
        </span>
      </div>

      {/* 2-Column Grid Layout: 1 row with 2 columns, 2nd row with 2 columns, etc. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px'
        }}
      >
        {unions.map((union) => (
          <div
            key={union.id}
            onClick={() => onSelectUnion(union)}
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1.5px solid #e2e8f0',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: '0 3px 8px -2px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2A1373';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 22px -4px rgba(42, 19, 115, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 3px 8px -2px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Top Row: Icon, Title & Badge, Subtitle */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: union.iconBg,
                  color: union.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0
                }}
              >
                <i className={`fa-solid ${union.icon}`}></i>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                    {union.name}
                  </h3>
                  <span
                    style={{
                      background: '#f5f3ff',
                      border: '1px solid #ddd6fe',
                      color: '#2A1373',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      letterSpacing: '0.4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {union.badge}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px', lineHeight: 1.35 }}>
                  {union.subtitle}
                </div>
              </div>
            </div>

            {/* Bottom Row: Active Stands & Verified Members Metrics + Open Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    textAlign: 'center',
                    minWidth: '72px'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{union.standsCount}</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>Active Stands</div>
                </div>

                <div
                  style={{
                    background: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    textAlign: 'center',
                    minWidth: '88px'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{union.membersCount}</div>
                  <div style={{ fontSize: '10.5px', color: '#2A1373', fontWeight: 700, marginTop: '2px' }}>Verified Members</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUnion(union);
                }}
                style={{
                  background: '#2A1373',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 10px rgba(42, 19, 115, 0.28)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1f0c59';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2A1373';
                }}
              >
                Open {union.name} <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
