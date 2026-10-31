'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CaptainRegisterPage from '@/components/captain/CaptainRegisterPage';

function CaptainRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetCategory = searchParams?.get('category') || 'bike';

  const handleLoginSuccess = (captainUser: any) => {
    const serviceType = captainUser?.serviceType || targetCategory || 'bike';
    router.push(`/ride/captain/${serviceType}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a101d' }}>
      <CaptainRegisterPage onLoginSuccess={handleLoginSuccess} initialTab="register" />
    </div>
  );
}

export default function CaptainRegisterPageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a101d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading SART Captain Registration...</div>}>
      <CaptainRegisterContent />
    </Suspense>
  );
}

