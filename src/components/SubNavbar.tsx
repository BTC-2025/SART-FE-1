'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '../store/useSartStore';

export default function SubNavbar() {
  const { setActiveTab } = useSartStore();
  const router = useRouter();

  return (
    <div className="web-subnavbar">
      <div className="subnav-links">
        {/* Left side links removed per redesign request */}
      </div>
      <div className="subnav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="subnav-btn" onClick={() => alert('SART Vendor Registration Panel loading...')}>
          <i className="fa-solid fa-store" style={{ fontSize: '14px' }}></i> VENDOR
        </button>
        <button className="subnav-btn" onClick={() => { setActiveTab('wallet'); router.push('/wallet', { scroll: false }); }}>
          <i className="fa-solid fa-wallet" style={{ fontSize: '14px' }}></i> ₹15,000.00
        </button>
        <div className="subnav-btn" onClick={() => { setActiveTab('support' as any); router.push('/support', { scroll: false }); }} style={{ padding: '2px 5px' }}>
          <i className="fa-solid fa-headset" style={{ fontSize: '14px' }}></i>
        </div>
        <div className="subnav-btn" onClick={() => { setActiveTab('profile'); router.push('/profile', { scroll: false }); }} style={{ padding: '2px 5px' }}>
          <i className="fa-solid fa-gear" style={{ fontSize: '14px' }}></i>
        </div>
      </div>
    </div>
  );
}
