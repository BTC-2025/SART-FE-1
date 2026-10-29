'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CaptainRegisterPage from './CaptainRegisterPage';

function CaptainLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetCategory = searchParams?.get('category') || 'bike';

  const handleLoginSuccess = (captainUser: any) => {
    // If captain has an assigned or preferred service type, route them into their vehicle duty portal!
    const serviceType = captainUser?.serviceType || targetCategory || 'bike';
    router.push(`/ride/captain/${serviceType}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a101d' }}>
      <CaptainRegisterPage onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default function CaptainLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a101d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading SART Captain Portal...</div>}>
      <CaptainLoginContent />
    </Suspense>
  );
}
