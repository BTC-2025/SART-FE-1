'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CaptainHubView from '@/components/captain/CaptainHubView';

export default function CaptainModePage() {
  const params = useParams();
  const rawMode = params?.mode;
  const modeStr = Array.isArray(rawMode) ? rawMode[0] : (rawMode || 'bike');
  
  const normalizedCategory = ['bike', 'auto', 'car'].includes(modeStr?.toLowerCase())
    ? (modeStr.toLowerCase() as 'bike' | 'auto' | 'car')
    : 'bike';

  return <CaptainHubView initialCategory={normalizedCategory} />;
}
