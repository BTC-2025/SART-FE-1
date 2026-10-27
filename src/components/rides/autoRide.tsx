'use client';

import React from 'react';
import RideBookingView from '../RideBookingView';
import { VehicleConfig } from '../rideData';

export const AUTO_VEHICLES: VehicleConfig[] = [
  {
    id: 'auto_standard',
    title: 'Auto',
    minFare: 40,
    baseFare: 35,
    perKm: 11,
    perMinute: 1.2,
    waitingChargePerStop: 20,
    badge: 'Pocket Friendly',
    badgeClass: 'popular',
    image: '/images/auto_green_yellow.png',
    desc: 'Doorstep pickup, open breeze, fit for 3 passengers & luggage'
  },
  {
    id: 'auto_plus',
    title: 'Auto Plus',
    minFare: 50,
    baseFare: 45,
    perKm: 13,
    perMinute: 1.5,
    waitingChargePerStop: 25,
    badge: 'Top Rated 4.9★',
    badgeClass: 'premium',
    image: '/images/auto_yellow_black.png',
    desc: 'Experienced super drivers, cleanest auto, immediate dispatch'
  }
];

export interface AutoRideProps {
  sourceLocation?: string;
  destinationLocation?: string;
  onSourceChange?: (val: string) => void;
  onDestinationChange?: (val: string) => void;
  onBackToHome?: () => void;
}

export default function AutoRide(props: AutoRideProps) {
  return <RideBookingView mode="auto" {...props} />;
}
