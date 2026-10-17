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
      </div>
    </div>
  );
}
