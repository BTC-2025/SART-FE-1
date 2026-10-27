'use client';

import React from 'react';
import RideBookingView from '../RideBookingView';
import { VehicleConfig } from '../rideData';

export const CAR_VEHICLES: VehicleConfig[] = [
  {
    id: 'car_economy',
    title: 'Cab Economy',
    minFare: 80,
    baseFare: 70,
    perKm: 14,
    perMinute: 1.8,
    waitingChargePerStop: 30,
    badge: 'Best Value',
    badgeClass: 'popular',
    image: '/images/cab_economy.png',
    desc: 'Air-conditioned hatchback, affordable daily commute'
  },
  {
    id: 'car_sedan',
    title: 'Cab Premium',
    minFare: 100,
    baseFare: 90,
    perKm: 17,
    perMinute: 2.2,
    waitingChargePerStop: 35,
    badge: 'Comfort Sedan',
    badgeClass: 'premium',
    image: '/images/cab_sedan.png',
    desc: 'Spacious Dzire/Etios with top-rated driver & ample boot space'
  },
  {
    id: 'car_suv',
    title: 'Family Ride 6-Seater SUV',
    minFare: 150,
    baseFare: 130,
    perKm: 24,
    perMinute: 3.0,
    waitingChargePerStop: 45,
    badge: 'Family & Groups',
    badgeClass: '',
    image: '/images/cab_xl.png',
    desc: 'Innova/Ertiga with extra legroom and large luggage carrier'
  }
];

export interface CarRideProps {
  sourceLocation?: string;
  destinationLocation?: string;
  onSourceChange?: (val: string) => void;
  onDestinationChange?: (val: string) => void;
  onBackToHome?: () => void;
}

export default function CarRide(props: CarRideProps) {
  return <RideBookingView mode="car" {...props} />;
}
