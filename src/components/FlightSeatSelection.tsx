'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import './FlightSeatSelection.css';

interface SeatInfo {
  code: string;
  row: number;
  letter: string;
  isOccupied: boolean;
  isXL?: boolean;
  isExtraLegroom?: boolean;
  isAssignedDefault?: boolean;
  price: number;
}

interface PassengerSeatAssignment {
  id: string;
  name: string;
  typeLabel: string;
  seatCode: string | null;
  seatPrice: number;
}

export default function FlightSeatSelection() {
  const router = useRouter();
  const fuselageScrollRef = useRef<HTMLDivElement>(null);

  // Active Stage Indicator & Scroll sync
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Flight Booking Information loaded from localStorage
  const [bookingData, setBookingData] = useState<any>({
    airline: 'IndiGo',
    flightNo: '6E 6047',
    sourceAirport: 'MAA',
    destinationAirport: 'DEL',
    cabinClass: 'ECONOMY',
    checkInBaggage: '15 KG',
    handBaggage: 'Up to 7KG'
  });

  // Passengers requiring seat assignment (excluding lap infants)
  const [passengers, setPassengers] = useState<PassengerSeatAssignment[]>([
    { id: 'pax_1', name: 'Passenger 1', typeLabel: 'Adult 1', seatCode: '28E', seatPrice: 0 }
  ]);

  // Current passenger actively picking a seat
  const [activePaxIndex, setActivePaxIndex] = useState<number>(0);

  // Pre-occupied seats matching reference diagrams (Images 2 and 3)
  const occupiedSet = useMemo(() => {
    return new Set([
      '2F',
      '5D', '6F', '7C', '8F', '9A', '10C', '11D', '12F',
      '14D', '15F', '16A', '17C', '18D', '19F', '21B', '22E', '23A',
      '24F', '25D', '26A', '27C', '30F', '31D', '32F', '33D', '34F', '35D',
      '30A', '31A', '32A', '33A', '34A', '35A', '38A'
    ]);
  }, []);

  // Default assigned seats marked in Image 3
  const image3AssignedSeats = useMemo(() => {
    return new Set(['29F', '28E', '28D', '28C', '28B', '29A']);
  }, []);

  // Extra legroom green border seats in Image 3
  const image3ExtraLegroom = useMemo(() => {
    return new Set(['36B', '36E', '37B', '38B', '39B', '39E', '4C', '4B', '4A', '4D', '4E', '4F']);
  }, []);

  // 1. XL Business Seats (Rows 1 to 3, 3 columns x 3 rows = top, middle/between, bot)
  const xlSeats = useMemo(() => {
    const list: { row: number; top: SeatInfo; between?: SeatInfo; bot: SeatInfo }[] = [
      {
        row: 1,
        top: {
          code: '1F',
          row: 1,
          letter: '1F',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        },
        between: {
          code: '1B',
          row: 1,
          letter: '1B',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        },
        bot: {
          code: '1A',
          row: 1,
          letter: '1A',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        }
      },
      {
        row: 2,
        top: {
          code: '2F',
          row: 2,
          letter: '',
          isOccupied: true, // grey occupied seat in row 2 top
          isXL: true,
          isExtraLegroom: true,
          price: 450
        },
        between: {
          code: '2B',
          row: 2,
          letter: '2B',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        },
        bot: {
          code: '2A',
          row: 2,
          letter: '2A',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        }
      },
      {
        row: 3,
        top: {
          code: '3F',
          row: 3,
          letter: '3F',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        },
        between: {
          code: '3B',
          row: 3,
          letter: '3B',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        },
        bot: {
          code: '3A',
          row: 3,
          letter: '3A',
          isOccupied: false,
          isXL: true,
          isExtraLegroom: true,
          price: 450
        }
      }
    ];
    return list;
  }, []);

  // Stage 1 Economy Rows (Rows 4 to 12)
  const stage1EconomyRows = useMemo(() => {
    const list: { row: number; topSeats: SeatInfo[]; botSeats: SeatInfo[] }[] = [];
    for (let r = 4; r <= 12; r++) {
      const topLetters = ['F', 'D', 'C'];
      const botLetters = ['C', 'B', 'A'];

      const topSeats: SeatInfo[] = topLetters.map((l) => {
        const code = `${r}${l}`;
        return {
          code,
          row: r,
          letter: l,
          isOccupied: occupiedSet.has(code),
          isXL: false,
          isExtraLegroom: image3ExtraLegroom.has(code),
          price: r === 4 ? 250 : 0
        };
      });

      const botSeats: SeatInfo[] = botLetters.map((l) => {
        const code = `${r}${l}`;
        return {
          code,
          row: r,
          letter: l,
          isOccupied: occupiedSet.has(code),
          isXL: false,
          isExtraLegroom: image3ExtraLegroom.has(code),
          price: r === 4 ? 250 : 0
        };
      });

      list.push({ row: r, topSeats, botSeats });
    }
    return list;
  }, [occupiedSet, image3ExtraLegroom]);

  // Stage 2 Middle / Overwing Rows (Rows 13 to 23)
  const stage2Rows = useMemo(() => {
    const list: { row: number; topSeats: SeatInfo[]; botSeats: SeatInfo[] }[] = [];
    for (let r = 13; r <= 23; r++) {
      const topLetters = ['F', 'E', 'D'];
      const botLetters = ['C', 'B', 'A'];

      const topSeats: SeatInfo[] = topLetters.map((l) => {
        const code = `${r}${l}`;
        return {
          code,
          row: r,
          letter: l,
          isOccupied: occupiedSet.has(code),
          isXL: false,
          isExtraLegroom: r === 13 || r === 14,
          price: r === 13 || r === 14 ? 300 : 0
        };
      });

      const botSeats: SeatInfo[] = botLetters.map((l) => {
        const code = `${r}${l}`;
        return {
          code,
          row: r,
          letter: l,
          isOccupied: occupiedSet.has(code),
          isXL: false,
          isExtraLegroom: r === 13 || r === 14,
          price: r === 13 || r === 14 ? 300 : 0
        };
      });

      list.push({ row: r, topSeats, botSeats });
    }
    return list;
  }, [occupiedSet]);

  // Stage 3 Rear Rows (Rows 24 to 39) - Exactly matching Image 3
  const stage3Rows = useMemo(() => {
    const list: { row: number; topSeats: SeatInfo[]; botSeats: SeatInfo[] }[] = [];
    for (let r = 24; r <= 39; r++) {
      const topLetters = ['F', 'E', 'D'];
      const botLetters = ['C', 'B', 'A'];

      const topSeats: SeatInfo[] = topLetters.map((l) => {
        const code = `${r}${l}`;
        return {
          code,
          row: r,
          letter: l,
          isOccupied: occupiedSet.has(code),
          isXL: false,
          isAssignedDefault: image3AssignedSeats.has(code),
          isExtraLegroom: image3ExtraLegroom.has(code),
          price: image3ExtraLegroom.has(code) ? 350 : 0
        };
      });

      const botSeats: SeatInfo[] = botLetters.map((l) => {
        const code = `${r}${l}`;
        return {
          code,
          row: r,
          letter: l,
          isOccupied: occupiedSet.has(code),
          isXL: false,
          isAssignedDefault: image3AssignedSeats.has(code),
          isExtraLegroom: image3ExtraLegroom.has(code),
          price: image3ExtraLegroom.has(code) ? 350 : 0
        };
      });

      list.push({ row: r, topSeats, botSeats });
    }
    return list;
  }, [occupiedSet, image3AssignedSeats, image3ExtraLegroom]);

  // Load pending booking from localStorage on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_flight_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookingData((prev: any) => ({
            ...prev,
            airline: parsed.airline || prev.airline,
            flightNo: parsed.flightNo || prev.flightNo,
            sourceAirport: parsed.sourceAirport || parsed.depAirportCode || 'MAA',
            destinationAirport: parsed.destinationAirport || parsed.arrAirportCode || 'DEL',
            cabinClass: 'ECONOMY',
            checkInBaggage: parsed.checkInBaggage || '15 KG',
            handBaggage: parsed.cabinBaggage || 'Up to 7KG'
          }));

          // Construct passengers list (excluding lap infants)
          if (parsed.passengersList && Array.isArray(parsed.passengersList)) {
            const seatable = parsed.passengersList.filter((p: any) => p.type !== 'infant');
            if (seatable.length > 0) {
              const defaultSeats = ['28E', '28D', '28C', '28B', '29F', '29A'];
              const list: PassengerSeatAssignment[] = seatable.map((p: any, idx: number) => {
                const assigned = parsed.assignedSeats?.[p.id] || defaultSeats[idx % defaultSeats.length];
                const isXL = assigned.startsWith('1') || assigned.startsWith('2') || assigned.startsWith('3');
                return {
                  id: p.id,
                  name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || `Passenger ${idx + 1}`,
                  typeLabel: p.typeLabel || `Adult ${idx + 1}`,
                  seatCode: assigned,
                  seatPrice: isXL ? 450 : 0
                };
              });
              setPassengers(list);
              return;
            }
          }

          if (parsed.travelers) {
            const count = (parsed.travelers.adults || 1) + (parsed.travelers.seniors || 0) + (parsed.travelers.children || 0);
            const defaultSeats = ['28E', '28D', '28C', '28B', '29F', '29A'];
            const list: PassengerSeatAssignment[] = [];
            for (let i = 0; i < Math.max(1, count); i++) {
              const seat = defaultSeats[i % defaultSeats.length];
              const isXL = seat.startsWith('1') || seat.startsWith('2') || seat.startsWith('3');
              list.push({
                id: `pax_${i + 1}`,
                name: `Passenger ${i + 1}`,
                typeLabel: i === 0 ? 'Adult 1' : `Passenger ${i + 1}`,
                seatCode: seat,
                seatPrice: isXL ? 450 : 0
              });
            }
            setPassengers(list);
          }
        } catch (e) {
          console.error('Failed to load booking in SeatSelection', e);
        }
      }
    }
  }, []);

  // Synchronize Scroll Position with Mini-track Thumb & Stage buttons
  const handleViewportScroll = () => {
    if (!fuselageScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = fuselageScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;

    const progress = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
    setScrollProgress(progress);

    if (scrollLeft < 1100) {
      setActiveStage(1);
    } else if (scrollLeft < 2250) {
      setActiveStage(2);
    } else {
      setActiveStage(3);
    }
  };

  // Smooth scroll to target stage
  const scrollToStage = (stage: 1 | 2 | 3) => {
    if (!fuselageScrollRef.current) return;
    setActiveStage(stage);
    let targetLeft = 0;
    if (stage === 1) targetLeft = 0;
    else if (stage === 2) targetLeft = 1350;
    else if (stage === 3) targetLeft = 2650;

    fuselageScrollRef.current.scrollTo({
      left: targetLeft,
      behavior: 'smooth'
    });
  };

  // Scroll arrow step (left/right)
  const scrollStep = (delta: number) => {
    if (!fuselageScrollRef.current) return;
    fuselageScrollRef.current.scrollBy({
      left: delta,
      behavior: 'smooth'
    });
  };

  // Click on mini track to jump proportionally
  const handleMiniTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fuselageScrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const maxScroll = fuselageScrollRef.current.scrollWidth - fuselageScrollRef.current.clientWidth;
    fuselageScrollRef.current.scrollTo({
      left: clickRatio * maxScroll,
      behavior: 'smooth'
    });
  };

  // Handle Seat Selection
  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.isOccupied) return;

    // Check if another passenger already has this seat
    const alreadyTakenBy = passengers.find(
      (p, idx) => idx !== activePaxIndex && p.seatCode === seat.code
    );
    if (alreadyTakenBy) {
      alert(`Seat ${seat.code} is already assigned to ${alreadyTakenBy.name}. Please select another seat.`);
      return;
    }

    setPassengers((prev) =>
      prev.map((p, idx) => {
        if (idx === activePaxIndex) {
          if (p.seatCode === seat.code) {
            return { ...p, seatCode: null, seatPrice: 0 };
          }
          return { ...p, seatCode: seat.code, seatPrice: seat.price };
        }
        return p;
      })
    );

    // Auto-advance to next unassigned passenger
    if (activePaxIndex < passengers.length - 1) {
      setActivePaxIndex(activePaxIndex + 1);
    }
  };

  // Auto assign seats for all passengers
  const handleAutoAssign = () => {
    const complimentarySeats = ['28E', '28D', '28C', '28B', '29F', '29A', '1F', '1A', '4F', '4A'];
    setPassengers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        seatCode: p.seatCode || complimentarySeats[idx % complimentarySeats.length],
        seatPrice: 0
      }))
    );
  };

  // Continue to Review Journey
  const handleContinue = () => {
    const unassigned = passengers.filter((p) => !p.seatCode);
    if (unassigned.length > 0) {
      handleAutoAssign();
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_flight_booking');
      let current = saved ? JSON.parse(saved) : {};

      const seatMapObject: Record<string, string> = {};
      passengers.forEach((p) => {
        if (p.seatCode) {
          seatMapObject[p.id] = p.seatCode;
        }
      });

      const totalSeatFee = passengers.reduce((sum, p) => sum + (p.seatPrice || 0), 0);

      current = {
        ...current,
        assignedSeats: seatMapObject,
        seatSelectionList: passengers,
        seatFee: totalSeatFee,
        passenger: {
          ...current.passenger,
          seatPreference: passengers[0]?.seatCode || 'Window Seat'
        }
      };

      localStorage.setItem('sart_pending_flight_booking', JSON.stringify(current));
    }

    router.push('/home/ride/flight/PassengerDetails/reviewBooking');
  };

  const totalSeatCost = passengers.reduce((sum, p) => sum + (p.seatPrice || 0), 0);

  return (
    <div className="fss-page-container">
      {/* Sticky Navigation Header */}
      <div className="fss-sticky-header">
        <Navbar />
        <SubNavbar />
      </div>

      {/* Main Seat Selection Page Layout */}
      <main className="fss-main-wrapper">
        <div className="fss-layout-grid">
          {/* ================================================================
              LEFT COLUMN: 4000PX PANORAMIC 3-STAGE AIRCRAFT FUSELAGE
              ================================================================ */}
          <div className="fss-left-col">
            {/* Top Corridor Pill Bar (Image 2) */}
            <div className="fss-corridor-bar">
              <span className="fss-corridor-airport">{bookingData.sourceAirport}</span>
              <div className="fss-corridor-line">
                <i className="fa-solid fa-plane"></i>
                <span>{bookingData.cabinClass}</span>
              </div>
              <span className="fss-corridor-airport">{bookingData.destinationAirport}</span>
            </div>


            {/* Legend Indicators Bar (Images 2 & 3) */}
            <div className="fss-legend-row">
              <div className="fss-legend-item">
                <span className="fss-legend-dot assigned"></span>
                <span>Assigned / Selected</span>
              </div>
              <div className="fss-legend-item">
                <span className="fss-legend-dot extra-legroom"></span>
                <span>Extra Legroom (Green Outline)</span>
              </div>
              <div className="fss-legend-item">
                <span className="fss-legend-dot free"></span>
                <span>Standard Seat</span>
              </div>
              <div className="fss-legend-item">
                <span className="fss-legend-dot occupied"></span>
                <span>Occupied</span>
              </div>
            </div>

            {/* ================================================================
                4000PX PANORAMIC SCROLLABLE VIEWPORT
                ================================================================ */}
            <div
              className="fss-airplane-viewport"
              ref={fuselageScrollRef}
              onScroll={handleViewportScroll}
            >
              <div className="fss-airplane-canvas">
                {/* Outer Clipped Border Wrapper for Fuselage */}
                <div className="fss-fuselage-border-wrapper">

                  {/* Continuous Fuselage Body */}
                  <div className="fss-fuselage-body">
                    <div className="fss-cockpit-img-container">

                    </div>
                    {/* -----------------------------------------------------------
                        STAGE 1: FRONT CABIN (Nose, Windshield, XL Rows 1-3, Rows 4-12)
                        ----------------------------------------------------------- */}
                    <div className="fss-stage-front-wrap">
                      {/* Stage 1 Floating Badge */}
                      <span className="fss-stage-badge">STAGE 1: FRONT CABIN</span>

                      {/* Nose & Cockpit Windshield Graphic Image */}


                      {/* Forward Galley & Service Area (STAFF / WC) */}
                      <div className="fss-fwd-service">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span className="fss-boarding-chevrons-top">▲ ▲</span>
                          <div className="fss-staff-box">STAFF</div>
                        </div>

                        <div className="fss-boarding-chevrons">« «</div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div className="fss-wc-box">WC</div>
                          <span className="fss-boarding-chevrons-bot">▼ ▼</span>
                        </div>
                      </div>

                      {/* XL Business Class Cabin (Rows 1 to 3) */}
                      <div className="fss-xl-box">
                        <span className="fss-xl-badge-top">XL</span>
                        <span className="fss-xl-badge-bottom">XL</span>

                        <div className="fss-xl-grid">
                          {xlSeats.map((col) => {
                            const isTopAssigned = passengers.some((p) => p.seatCode === col.top.code);
                            const isTopCurrent = passengers[activePaxIndex]?.seatCode === col.top.code;
                            const isBetweenAssigned = col.between && passengers.some((p) => p.seatCode === col.between?.code);
                            const isBetweenCurrent = col.between && passengers[activePaxIndex]?.seatCode === col.between?.code;
                            const isBotAssigned = passengers.some((p) => p.seatCode === col.bot.code);
                            const isBotCurrent = passengers[activePaxIndex]?.seatCode === col.bot.code;

                            return (
                              <div key={col.row} className="fss-xl-col">
                                {/* Top XL Seat (1F, 2F, 3F) */}
                                <button
                                  type="button"
                                  disabled={col.top.isOccupied}
                                  className={`fss-xl-seat ${col.top.isOccupied
                                    ? 'occupied'
                                    : isTopCurrent || isTopAssigned
                                      ? 'assigned'
                                      : ''
                                    }`}
                                  onClick={() => handleSeatClick(col.top)}
                                  title={`${col.top.code} - XL Premium (₹450)`}
                                >
                                  {!col.top.isOccupied ? col.top.code : ''}
                                </button>

                                {/* Middle / Between XL Seat (1B, 2B, 3B) */}
                                {col.between && (
                                  <button
                                    type="button"
                                    disabled={col.between.isOccupied}
                                    className={`fss-xl-seat ${col.between.isOccupied
                                      ? 'occupied'
                                      : isBetweenCurrent || isBetweenAssigned
                                        ? 'assigned'
                                        : ''
                                      }`}
                                    onClick={() => handleSeatClick(col.between!)}
                                    title={`${col.between.code} - XL Premium (₹450)`}
                                  >
                                    {!col.between.isOccupied ? col.between.code : ''}
                                  </button>
                                )}

                                {/* Bottom XL Seat (1A, 2A, 3A) */}
                                <button
                                  type="button"
                                  disabled={col.bot.isOccupied}
                                  className={`fss-xl-seat ${col.bot.isOccupied
                                    ? 'occupied'
                                    : isBotCurrent || isBotAssigned
                                      ? 'assigned'
                                      : ''
                                    }`}
                                  onClick={() => handleSeatClick(col.bot)}
                                  title={`${col.bot.code} - XL Premium (₹450)`}
                                >
                                  {!col.bot.isOccupied ? col.bot.code : ''}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Exit Divider with Door Separator */}
                      <div className="fss-exit-divider">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                          <span className="fss-exit-tag">EXIT ▼</span>
                          <div className="fss-door-line"></div>
                        </div>

                        <span className="fss-exit-tag">EXIT</span>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                          <div className="fss-door-line"></div>
                          <span className="fss-exit-tag">EXIT ▲</span>
                        </div>
                      </div>

                      {/* Economy Rows 4 to 12 */}
                      <div className="fss-seats-block">
                        {stage1EconomyRows.map((er) => (
                          <div key={er.row} className="fss-seat-column">
                            {/* Top 3 Seats Bank (F, D, C) */}
                            <div className="fss-seat-bank-3">
                              {er.topSeats.map((seat) => {
                                const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                return (
                                  <button
                                    key={seat.code}
                                    type="button"
                                    disabled={seat.isOccupied}
                                    className={`fss-seat-btn ${seat.isOccupied
                                      ? 'occupied'
                                      : isCurrent
                                        ? 'assigned assigned-current'
                                        : isAssigned
                                          ? 'assigned'
                                          : seat.isExtraLegroom
                                            ? 'extra-legroom'
                                            : ''
                                      }`}
                                    onClick={() => handleSeatClick(seat)}
                                    title={`${seat.code} - ${seat.isOccupied ? 'Occupied' : seat.price ? `₹${seat.price}` : 'Standard'}`}
                                  >
                                    {!seat.isOccupied ? seat.letter : ''}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Center Aisle Row Number */}
                            <div className="fss-aisle-row-num">{er.row}</div>

                            {/* Bottom 3 Seats Bank (C, B, A) */}
                            <div className="fss-seat-bank-3">
                              {er.botSeats.map((seat) => {
                                const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                return (
                                  <button
                                    key={seat.code}
                                    type="button"
                                    disabled={seat.isOccupied}
                                    className={`fss-seat-btn ${seat.isOccupied
                                      ? 'occupied'
                                      : isCurrent
                                        ? 'assigned assigned-current'
                                        : isAssigned
                                          ? 'assigned'
                                          : seat.isExtraLegroom
                                            ? 'extra-legroom'
                                            : ''
                                      }`}
                                    onClick={() => handleSeatClick(seat)}
                                    title={`${seat.code} - ${seat.isOccupied ? 'Occupied' : seat.price ? `₹${seat.price}` : 'Standard'}`}
                                  >
                                    {!seat.isOccupied ? seat.letter : ''}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* -----------------------------------------------------------
                      STAGE 2: MIDDLE CABIN & WINGS (Rows 13 to 23)
                      ----------------------------------------------------------- */}
                    <div className="fss-stage-middle-wrap">
                      {/* Stage 2 Floating Badge */}
                      <span className="fss-stage-badge">STAGE 2: MIDDLE / OVERWING</span>

                      {/* Integrated Stage 2 Wings after front Exit */}
                      <div className="fss-stage2-top-wing">
                        <span>W I N G</span>
                      </div>
                      <div className="fss-stage2-bottom-wing">
                        <span>W I N G</span>
                      </div>

                      <div className="fss-seats-block">
                        {stage2Rows.map((er) => {
                          const isOverwingExit = er.row === 13 || er.row === 14;
                          return (
                            <div key={er.row} className="fss-seat-column">
                              {/* Exit Label indicator above overwing exit rows */}
                              {isOverwingExit ? (
                                <span className="fss-exit-header">EXIT</span>
                              ) : (
                                <div style={{ height: '16px' }}></div>
                              )}

                              {/* Top 3 Seats Bank (F, E, D) */}
                              <div className="fss-seat-bank-3">
                                {er.topSeats.map((seat) => {
                                  const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                  const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                  return (
                                    <button
                                      key={seat.code}
                                      type="button"
                                      disabled={seat.isOccupied}
                                      className={`fss-seat-btn ${seat.isOccupied
                                        ? 'occupied'
                                        : isCurrent
                                          ? 'assigned assigned-current'
                                          : isAssigned
                                            ? 'assigned'
                                            : seat.isExtraLegroom
                                              ? 'extra-legroom'
                                              : ''
                                        }`}
                                      onClick={() => handleSeatClick(seat)}
                                      title={`${seat.code} - ${seat.isOccupied ? 'Occupied' : seat.price ? `₹${seat.price}` : 'Standard'}`}
                                    >
                                      {!seat.isOccupied ? seat.letter : ''}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Center Aisle Row Number */}
                              <div className="fss-aisle-row-num">{er.row}</div>

                              {/* Bottom 3 Seats Bank (C, B, A) */}
                              <div className="fss-seat-bank-3">
                                {er.botSeats.map((seat) => {
                                  const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                  const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                  return (
                                    <button
                                      key={seat.code}
                                      type="button"
                                      disabled={seat.isOccupied}
                                      className={`fss-seat-btn ${seat.isOccupied
                                        ? 'occupied'
                                        : isCurrent
                                          ? 'assigned assigned-current'
                                          : isAssigned
                                            ? 'assigned'
                                            : seat.isExtraLegroom
                                              ? 'extra-legroom'
                                              : ''
                                        }`}
                                      onClick={() => handleSeatClick(seat)}
                                      title={`${seat.code} - ${seat.isOccupied ? 'Occupied' : seat.price ? `₹${seat.price}` : 'Standard'}`}
                                    >
                                      {!seat.isOccupied ? seat.letter : ''}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Exit Label indicator below overwing exit rows */}
                              {isOverwingExit ? (
                                <span className="fss-exit-header">EXIT</span>
                              ) : (
                                <div style={{ height: '16px' }}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* -----------------------------------------------------------
                      STAGE 3: REAR CABIN (Rows 24 to 39, Exactly matching Image 3)
                      ----------------------------------------------------------- */}
                    <div className="fss-stage-rear-wrap">
                      {/* Stage 3 Floating Badge */}
                      <span className="fss-stage-badge">STAGE 3: REAR CABIN</span>

                      <div className="fss-seats-block">
                        {stage3Rows.map((er) => {
                          const isPreExitDoor = er.row === 28;
                          const isExitRow = er.row === 28 || er.row === 29;

                          return (
                            <React.Fragment key={er.row}>
                              {/* Double Emergency Exit Door Divider before Row 28 (Image 3) */}
                              {isPreExitDoor && (
                                <div className="fss-exit-divider" style={{ margin: '0 6px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                    <span className="fss-exit-tag">EXIT ▼</span>
                                    <div className="fss-door-line"></div>
                                  </div>

                                  <span className="fss-exit-tag">EXIT</span>

                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                    <div className="fss-door-line"></div>
                                    <span className="fss-exit-tag">EXIT ▲</span>
                                  </div>
                                </div>
                              )}

                              <div className="fss-seat-column">
                                {/* Top Exit label for rows 28 & 29 */}
                                {isExitRow ? (
                                  <span className="fss-exit-text-simple">EXIT</span>
                                ) : (
                                  <div style={{ height: '16px' }}></div>
                                )}

                                {/* Top 3 Seats Bank */}
                                <div className="fss-seat-bank-3">
                                  {er.topSeats.map((seat) => {
                                    const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                    const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                    const isDefaultAssignedInRef = seat.isAssignedDefault;

                                    return (
                                      <button
                                        key={seat.code}
                                        type="button"
                                        disabled={seat.isOccupied}
                                        className={`fss-seat-btn ${seat.isOccupied
                                          ? 'occupied'
                                          : isCurrent
                                            ? 'assigned assigned-current'
                                            : isAssigned || isDefaultAssignedInRef
                                              ? 'assigned'
                                              : seat.isExtraLegroom
                                                ? 'extra-legroom'
                                                : ''
                                          }`}
                                        onClick={() => handleSeatClick(seat)}
                                        title={`${seat.code} - ${seat.isOccupied
                                          ? 'Occupied'
                                          : seat.price
                                            ? `₹${seat.price}`
                                            : isDefaultAssignedInRef
                                              ? 'Assigned'
                                              : 'Standard'
                                          }`}
                                      >
                                        {!seat.isOccupied ? (isExitRow ? seat.code : seat.letter) : ''}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Center Aisle with Row Number */}
                                <div className="fss-aisle-row-num">{er.row}</div>

                                {/* Bottom 3 Seats Bank */}
                                <div className="fss-seat-bank-3">
                                  {er.botSeats.map((seat) => {
                                    const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                    const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                    const isDefaultAssignedInRef = seat.isAssignedDefault;

                                    return (
                                      <button
                                        key={seat.code}
                                        type="button"
                                        disabled={seat.isOccupied}
                                        className={`fss-seat-btn ${seat.isOccupied
                                          ? 'occupied'
                                          : isCurrent
                                            ? 'assigned assigned-current'
                                            : isAssigned || isDefaultAssignedInRef
                                              ? 'assigned'
                                              : seat.isExtraLegroom
                                                ? 'extra-legroom'
                                                : ''
                                          }`}
                                        onClick={() => handleSeatClick(seat)}
                                        title={`${seat.code} - ${seat.isOccupied
                                          ? 'Occupied'
                                          : seat.price
                                            ? `₹${seat.price}`
                                            : isDefaultAssignedInRef
                                              ? 'Assigned'
                                              : 'Standard'
                                          }`}
                                      >
                                        {!seat.isOccupied ? (isExitRow ? seat.code : seat.letter) : ''}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Bottom Exit label for rows 28 & 29 */}
                                {isExitRow ? (
                                  <span className="fss-exit-text-simple">EXIT</span>
                                ) : (
                                  <div style={{ height: '16px' }}></div>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Rear Aft Galley & Tail */}
                      <div className="fss-aft-service">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span className="fss-boarding-chevrons-top">▲ ▲</span>
                          <div className="fss-wc-box">WC</div>
                        </div>

                        <div className="fss-boarding-chevrons">» »</div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div className="fss-wc-box">WC</div>
                          <span className="fss-boarding-chevrons-bot">▼ ▼</span>
                        </div>
                      </div>

                      {/* Rear Staff & Aerodynamic Tail Cone */}
                      <div style={{ display: 'flex', alignItems: 'center', height: '180px', paddingLeft: '8px' }}>
                        <div className="fss-staff-box" style={{ height: '140px', width: '42px' }}>
                          STAFF
                        </div>
                        <div className="fss-tail-cone"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Box matching IndiGo UI */}
            <div className="fss-note-box">
              <div className="fss-note-title">Note:</div>
              <div>
                Click on Continue or &apos;Auto-Assign&apos; to proceed. Sart will auto-assign a seat prior to your travel if preferred seats are not selected.
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="fss-actions-row">
              <button
                type="button"
                className="fss-back-btn"
                onClick={() => router.push('/home/ride/flight/Passenger%20Details')}
              >
                Back
              </button>

              <div className="fss-right-actions">
                <button type="button" className="fss-skip-btn" onClick={handleAutoAssign}>
                  Auto-Assign
                </button>
                <button type="button" className="fss-continue-btn" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* ================================================================
              RIGHT COLUMN: BAGGAGE, PASSENGER ASSIGNMENTS & BENEFITS
              ================================================================ */}
          <aside className="fss-right-col">
            {/* Baggage Info Badge */}
            <div className="fss-baggage-card">
              <i className="fa-solid fa-suitcase-rolling" style={{ color: '#0284c7' }}></i>
              <span>
                Check-in : {bookingData.checkInBaggage} | Hand bag: {bookingData.handBaggage}
              </span>
            </div>

            {/* Passenger Selection Card */}
            <div className="fss-pax-card">
              <div className="fss-pax-header">
                <span>{passengers.length} Passenger{passengers.length > 1 ? 's' : ''} travelling</span>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#64748b' }}></i>
              </div>

              <div className="fss-pax-list">
                {passengers.map((pax, idx) => {
                  const isActive = idx === activePaxIndex;
                  return (
                    <div
                      key={pax.id}
                      className={`fss-pax-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActivePaxIndex(idx)}
                    >
                      <div className="fss-pax-info">
                        <span className="fss-pax-name">{pax.name}</span>
                        <span className="fss-pax-type">
                          {pax.typeLabel} {isActive ? '• Selecting now' : ''}
                        </span>
                      </div>
                      <span
                        className={`fss-pax-seat-badge ${!pax.seatCode ? 'unassigned' : ''}`}
                      >
                        {pax.seatCode ? `Seat ${pax.seatCode}` : 'Select Seat'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="fss-price-summary-box">
              <span className="fss-price-title">Seats Fee:</span>
              <span className="fss-price-value">
                {totalSeatCost === 0 ? 'Complimentary' : `₹ ${totalSeatCost}`}
              </span>
            </div>

            {/* Benefits Cards */}
            <div className="fss-benefits-wrap">
              <h4 className="fss-benefits-title">Our Exclusive Benefits</h4>

              {/* 1. 6E Fare Hold */}
              <div className="fss-benefit-fare-hold">
                <div className="fss-fare-hold-left">
                  <span className="fss-fare-hold-sub">Hold fare starting at just</span>
                  <span className="fss-fare-hold-price">₹99*</span>
                  <span className="fss-fare-hold-sub">Unlimited fare surge protection</span>
                </div>
                <div className="fss-fare-hold-right">
                  <i className="fa-solid fa-lock fss-fare-hold-icon"></i>
                  <span className="fss-fare-hold-name">6E Fare Hold</span>
                  <span className="fss-fare-hold-terms">*T&amp;C apply.</span>
                </div>
              </div>

              {/* 2. Hotels on IndiGo */}
              <div className="fss-benefit-hotel">
                <h5 className="fss-hotel-title">Hotels on IndiGo</h5>
                <p className="fss-hotel-sub">
                  Earn IndiGo BluChips on hotels and redeem for flights.
                </p>
                <div className="fss-hotel-discount">Up to 30% off*</div>
              </div>

              {/* 3. 50% off on Sight Seeing */}
              <div className="fss-benefit-sightseeing">
                <h5 className="fss-sight-title">50%* off on Sight Seeing</h5>
                <p className="fss-sight-sub">
                  3 lakh+ tours and activities | Free cancellation up to 24 hours | Earn IndiGo BluChips
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
