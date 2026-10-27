'use client';

import React from 'react';
import RideBookingView from '../RideBookingView';
import { VehicleConfig } from '../rideData';

export const BIKE_VEHICLES: VehicleConfig[] = [
  {
    id: 'scooty',
    title: 'Scooty',
    minFare: 25,
    baseFare: 20,
    perKm: 5.5,
    perMinute: 0.8,
    waitingChargePerStop: 15,
    badge: 'Eco Friendly & Smooth',
    badgeClass: '',
    image: '/images/red_scooty.png',
    desc: 'Comfortable footboard for bag, smooth city cruise, top safety rating'
  },
  {
    id: 'bike',
    title: 'Bike',
    minFare: 30,
    baseFare: 25,
    perKm: 6.5,
    perMinute: 0.9,
    waitingChargePerStop: 15,
    badge: 'Fastest Ride',
    badgeClass: 'popular',
    image: '/images/blue_bike.png',
    desc: 'Quickest travel through signals, verified rider captain, disposable hairnet'
  }
];

export interface BikeRideProps {
  sourceLocation?: string;
  destinationLocation?: string;
  onSourceChange?: (val: string) => void;
  onDestinationChange?: (val: string) => void;
  onBackToHome?: () => void;
}

export default function BikeRide(props: BikeRideProps) {
  return <RideBookingView mode="bike" {...props} />;
}
