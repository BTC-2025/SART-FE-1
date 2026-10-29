'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CaptainRegisterPage from './CaptainRegisterPage';

export default function CaptainLoginPage() {
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

