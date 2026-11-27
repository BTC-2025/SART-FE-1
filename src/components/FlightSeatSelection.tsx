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

  // Active Stage Indicator & Scroll sync (Stage 1: Front, Stage 2: Middle, Stage 3: Rear)
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(3);
  const [scrollProgress, setScrollProgress] = useState<number>(100);

  // Flight Booking Information loaded from localStorage
  const [bookingData, setBookingData] = useState<any>({
    airline: 'IndiGo',
    flightNo: '6E 6047',
    sourceAirport: 'BLR',
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

  // Alert message banner state
  const [restrictionAlert, setRestrictionAlert] = useState<string | null>(null);

  // Pre-occupied seats matching reference diagrams (Images 1 and 2)
  const occupiedSet = useMemo(() => {
    return new Set([
      '2F',
      '5D', '6F', '7C', '8F', '9A', '10C', '11D', '12F',
      '14D', '15F', '16A', '17C', '18D', '19F', '21B', '22E', '23A',
      '24F', '25D', '26A', '27C', '30F', '31D', '32F', '33D', '34F', '35D',
      '30A', '31A', '32A', '33A', '34A', '35A', '38A'
    ]);
  }, []);

  // Extra legroom green border seats in Images 1 & 2
  const extraLegroomSet = useMemo(() => {
    return new Set(['36B', '36E', '37B', '38B', '39B', '39E', '4C', '4B', '4A', '4D', '4E', '4F']);
  }, []);

  // XL Business Seats (Rows 1 to 3)
  const xlSeats = useMemo(() => [
    { row: 1, top: { code: '1F', row: 1, letter: '1F', isOccupied: false, isXL: true, price: 0 }, between: { code: '1B', row: 1, letter: '1B', isOccupied: false, isXL: true, price: 0 }, bot: { code: '1A', row: 1, letter: '1A', isOccupied: false, isXL: true, price: 0 } },
    { row: 2, top: { code: '2F', row: 2, letter: '', isOccupied: true, isXL: true, price: 0 }, between: { code: '2B', row: 2, letter: '2B', isOccupied: false, isXL: true, price: 0 }, bot: { code: '2A', row: 2, letter: '2A', isOccupied: false, isXL: true, price: 0 } },
    { row: 3, top: { code: '3F', row: 3, letter: '3F', isOccupied: false, isXL: true, price: 0 }, between: { code: '3B', row: 3, letter: '3B', isOccupied: false, isXL: true, price: 0 }, bot: { code: '3A', row: 3, letter: '3A', isOccupied: false, isXL: true, price: 0 } }
  ], []);

  // Helper to build row banks
  const buildRowBank = (r: number, letters: string[]) => {
    return letters.map((l) => {
      const code = `${r}${l}`;
      const isOcc = occupiedSet.has(code);
      const isXL = r <= 3;
      const isEx = extraLegroomSet.has(code) || r === 13 || r === 14;
      return {
        code,
        row: r,
        letter: l,
        isOccupied: isOcc,
        isXL,
        isExtraLegroom: isEx,
        price: isEx ? 350 : 0
      };
    });
  };

  // Stage 1 Economy Rows (Rows 4 to 12)
  const stage1EconomyRows = useMemo(() => {
    const list = [];
    for (let r = 4; r <= 12; r++) {
      list.push({
        row: r,
        topSeats: buildRowBank(r, ['F', 'D', 'C']),
        botSeats: buildRowBank(r, ['C', 'B', 'A'])
      });
    }
    return list;
  }, [occupiedSet, extraLegroomSet]);

  // Stage 2 Rows (Rows 13 to 23)
  const stage2Rows = useMemo(() => {
    const list = [];
    for (let r = 13; r <= 23; r++) {
      list.push({
        row: r,
        topSeats: buildRowBank(r, ['F', 'E', 'D']),
        botSeats: buildRowBank(r, ['C', 'B', 'A'])
      });
    }
    return list;
  }, [occupiedSet, extraLegroomSet]);

  // Stage 3 Rear Rows (Rows 24 to 39)
  const stage3Rows = useMemo(() => {
    const list = [];
    for (let r = 24; r <= 39; r++) {
      list.push({
        row: r,
        topSeats: buildRowBank(r, ['F', 'E', 'D']),
        botSeats: buildRowBank(r, ['C', 'B', 'A'])
      });
    }
    return list;
  }, [occupiedSet, extraLegroomSet]);

  const isBusinessCabin = (bookingData.cabinClass || '').toUpperCase().includes('BUSINESS');

  // Load pending booking from localStorage on Mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cabin = 'ECONOMY';
    let airline = 'IndiGo';
    let flightNo = '6E 6047';
    let src = 'BLR';
    let dst = 'DEL';
    let checkIn = '15 KG';
    let hand = 'Up to 7KG';
    let seatablePax: any[] = [];
    let assignedSeatsMap: Record<string, string> = {};

    try {
      const saved = localStorage.getItem('sart_pending_flight_booking');
      if (saved) {
        const parsed = JSON.parse(saved);
        airline = parsed.airline || airline;
        flightNo = parsed.flightNo || flightNo;
        src = parsed.sourceAirport || parsed.depAirportCode || src;
        dst = parsed.destinationAirport || parsed.arrAirportCode || dst;
        checkIn = parsed.checkInBaggage || checkIn;
        hand = parsed.cabinBaggage || parsed.handBaggage || hand;

        if (parsed.cabinClass) {
          cabin = parsed.cabinClass.toUpperCase();
        } else if (parsed.fareTier) {
          const t = parsed.fareTier.toUpperCase();
          if (t.includes('BUSINESS')) cabin = 'BUSINESS';
          else if (t.includes('PREMIUM')) cabin = 'PREMIUM ECONOMY';
        }

        if (parsed.passengersList && Array.isArray(parsed.passengersList)) {
          seatablePax = parsed.passengersList.filter((p: any) => p.type !== 'infant');
        } else if (parsed.travelers) {
          const count = (parsed.travelers.adults || 1) + (parsed.travelers.seniors || 0) + (parsed.travelers.children || 0);
          for (let i = 0; i < Math.max(1, count); i++) {
            seatablePax.push({
              id: `pax_${i + 1}`,
              firstName: `Passenger`,
              lastName: `${i + 1}`,
              typeLabel: i === 0 ? 'Adult 1' : `Passenger ${i + 1}`
            });
          }
        }
        if (parsed.assignedSeats) assignedSeatsMap = parsed.assignedSeats;
      }

      // Check sart_flight_travellers as additional source for cabin class
      const savedTrav = localStorage.getItem('sart_flight_travellers');
      if (savedTrav) {
        try {
          const pTrav = JSON.parse(savedTrav);
          if (pTrav.cabinClass) {
            cabin = pTrav.cabinClass.toUpperCase();
          }
        } catch { }
      }
    } catch (e) {
      console.error('Failed to load booking in SeatSelection', e);
    }

    const isBiz = cabin.includes('BUSINESS');
    setBookingData({
      airline,
      flightNo,
      sourceAirport: src,
      destinationAirport: dst,
      cabinClass: cabin,
      checkInBaggage: isBiz ? '40 KG' : checkIn,
      handBaggage: isBiz ? '12 KG' : hand
    });

    const defaultBizSeats = ['1F', '1A', '1B', '2B', '2A', '3F', '3B', '3A'];
    const defaultEcoSeats = ['28E', '28D', '28C', '28B', '29F', '29A'];
    const defaults = isBiz ? defaultBizSeats : defaultEcoSeats;

    if (seatablePax.length > 0) {
      const list: PassengerSeatAssignment[] = seatablePax.map((p: any, idx: number) => {
        let assigned = assignedSeatsMap[p.id] || defaults[idx % defaults.length];
        const isXL = assigned.startsWith('1') || assigned.startsWith('2') || assigned.startsWith('3');
        // If passenger has an invalid seat for their cabin, fix it
        if (isBiz && !isXL) {
          assigned = defaultBizSeats[idx % defaultBizSeats.length];
        } else if (!isBiz && isXL) {
          assigned = defaultEcoSeats[idx % defaultEcoSeats.length];
        }
        return {
          id: p.id,
          name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || `Passenger ${idx + 1}`,
          typeLabel: p.typeLabel || `Adult ${idx + 1}`,
          seatCode: assigned,
          seatPrice: 0
        };
      });
      setPassengers(list);
    }

    // Set active stage: Stage 1 for Business (Front Cabin), Stage 3 for Economy (Rear Cabin)
    if (isBiz) {
      setActiveStage(1);
      setTimeout(() => scrollToStage(1), 250);
    } else {
      setActiveStage(3);
      setTimeout(() => scrollToStage(3), 250);
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

  // Scroll arrow step
  const scrollStep = (delta: number) => {
    if (!fuselageScrollRef.current) return;
    fuselageScrollRef.current.scrollBy({
      left: delta,
      behavior: 'smooth'
    });
  };

  // Handle Seat Selection with STRICT CABIN RESTRICTIONS
  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.isOccupied) return;

    const isSeatBusiness = seat.isXL || seat.row <= 3;
    const isCabinBusiness = isBusinessCabin;

    // Restriction 1: Economy / Premium Economy passengers CANNOT book Business Class (Rows 1 to 3)
    if (!isCabinBusiness && isSeatBusiness) {
      const msg = `Seat ${seat.code} is in the Business Class Cabin (Rows 1–3). Since your booking is in ${bookingData.cabinClass || 'Economy'}, you can only select seats in Economy / Premium Economy (Rows 4–39).`;
      setRestrictionAlert(msg);
      alert(msg);
      return;
    }

    // Restriction 2: Business Class passengers CANNOT book Economy seats (Rows 4 to 39)
    if (isCabinBusiness && !isSeatBusiness) {
      const msg = `Seat ${seat.code} is an Economy seat. Since you selected Business Class, please choose your seat from the dedicated Front Business Cabin (Rows 1–3).`;
      setRestrictionAlert(msg);
      alert(msg);
      return;
    }

    setRestrictionAlert(null);

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
          return { ...p, seatCode: seat.code, seatPrice: isCabinBusiness ? 0 : seat.price };
        }
        return p;
      })
    );

    // Auto-advance to next unassigned passenger
    if (activePaxIndex < passengers.length - 1) {
      setActivePaxIndex(activePaxIndex + 1);
    }
  };

  // Auto assign seats for all passengers according to active cabin
  const handleAutoAssign = () => {
    const defaultBizSeats = ['1F', '1A', '1B', '2B', '2A', '3F', '3B', '3A'];
    const defaultEcoSeats = ['28E', '28D', '28C', '28B', '29F', '29A', '4F', '4A', '5B', '6C'];
    const complimentary = isBusinessCabin ? defaultBizSeats : defaultEcoSeats;

    setPassengers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        seatCode: p.seatCode || complimentary[idx % complimentary.length],
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

      const seatMap: Record<string, string> = {};
      passengers.forEach((p) => {
        if (p.seatCode) seatMap[p.id] = p.seatCode;
      });

      current = {
        ...current,
        assignedSeats: seatMap,
        cabinClass: bookingData.cabinClass,
        seatsTotalFee: passengers.reduce((sum, p) => sum + (p.seatPrice || 0), 0)
      };

      localStorage.setItem('sart_pending_flight_booking', JSON.stringify(current));
    }

    router.push('/home/ride/flight/PassengerDetails/reviewBooking');
  };

  const totalSeatCost = passengers.reduce((sum, p) => sum + (p.seatPrice || 0), 0);

  // Helper to render a 3-seat column block (Top 3 seats, Aisle Number, Bottom 3 seats)
  const renderSeatColumn = (
    rowObj: { row: number; topSeats: SeatInfo[]; botSeats: SeatInfo[] },
    showExitHeader?: boolean,
    showExitFooter?: boolean
  ) => {
    const isRowBlockedForCurrentCabin = isBusinessCabin && rowObj.row > 3;

    return (
      <div key={rowObj.row} className="fss-seat-column">
        {showExitHeader ? (
          <span className="fss-exit-header">EXIT</span>
        ) : (
          <div style={{ height: '16px' }}></div>
        )}

        {/* Top 3 Seats Bank */}
        <div className="fss-seat-bank-3">
          {rowObj.topSeats.map((seat) => {
            const isAssigned = passengers.some((p) => p.seatCode === seat.code);
            const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
            return (
              <button
                key={seat.code}
                type="button"
                disabled={seat.isOccupied}
                style={isRowBlockedForCurrentCabin ? { cursor: 'not-allowed', opacity: 0.6 } : undefined}
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
                title={isRowBlockedForCurrentCabin ? 'Economy Seat (Restricted for Business Class)' : `${seat.code} - ${seat.isOccupied ? 'Occupied' : seat.price ? `₹${seat.price}` : 'Standard'}`}
              >
                {!seat.isOccupied ? seat.letter : ''}
              </button>
            );
          })}
        </div>

        {/* Center Aisle Row Number */}
        <div className="fss-aisle-row-num">{rowObj.row}</div>

        {/* Bottom 3 Seats Bank */}
        <div className="fss-seat-bank-3">
          {rowObj.botSeats.map((seat) => {
            const isAssigned = passengers.some((p) => p.seatCode === seat.code);
            const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
            return (
              <button
                key={seat.code}
                type="button"
                disabled={seat.isOccupied}
                style={isRowBlockedForCurrentCabin ? { cursor: 'not-allowed', opacity: 0.6 } : undefined}
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
                title={isRowBlockedForCurrentCabin ? 'Economy Seat (Restricted for Business Class)' : `${seat.code} - ${seat.isOccupied ? 'Occupied' : seat.price ? `₹${seat.price}` : 'Standard'}`}
              >
                {!seat.isOccupied ? seat.letter : ''}
              </button>
            );
          })}
        </div>

        {showExitFooter ? (
          <span className="fss-exit-text-simple">EXIT</span>
        ) : (
          <div style={{ height: '16px' }}></div>
        )}
      </div>
    );
  };

  return (
    <div className="fss-page-container">
      <div className="fss-sticky-header">
        <Navbar />
        <SubNavbar />
      </div>

      <main className="fss-main-wrapper">
        <div className="fss-layout-grid">
          {/* ================================================================
              LEFT COLUMN: 4000PX PANORAMIC 3-STAGE AIRCRAFT FUSELAGE
              ================================================================ */}
          <div className="fss-left-col">
            {/* Top Corridor Pill Bar (Exact match with Image 1: BLR ✈ ECONOMY DEL) */}
            <div className="fss-corridor-bar">
              <span className="fss-corridor-airport">{bookingData.sourceAirport}</span>
              <div className="fss-corridor-line">
                <i className="fa-solid fa-plane"></i>
                <span style={{ letterSpacing: '1px' }}>{bookingData.cabinClass}</span>
              </div>
              <span className="fss-corridor-airport">{bookingData.destinationAirport}</span>
            </div>

            {/* Active Cabin Class Rule Status Banner */}
            {isBusinessCabin ? (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1.5px solid #93c5fd',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  color: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                  <i className="fa-solid fa-crown" style={{ color: '#2563eb', fontSize: '16px' }}></i>
                  <span>
                    <strong>Business Class Cabin Active:</strong> You can choose your luxury XL seats from the Front Cabin (Rows 1–3). Economy seats (Rows 4–39) are restricted.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToStage(1)}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '5px 14px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Go to Front Cabin (Rows 1–3) →
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: '16px' }}></i>
                  <span>
                    <strong>{bookingData.cabinClass} Active:</strong> You can select any seat across Rows 4–39. Business Class XL seats (Rows 1–3) are restricted.
                  </span>
                </div>
                <span
                  style={{
                    background: '#ffffff',
                    border: '1px solid #a7f3d0',
                    color: '#059669',
                    borderRadius: '20px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Rows 4–39 Available
                </span>
              </div>
            )}

            {/* In-app Notification / Restriction Toast */}
            {restrictionAlert && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  color: '#991b1b',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: '#dc2626' }}></i>
                  <span>{restrictionAlert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRestrictionAlert(null)}
                  style={{ background: 'transparent', border: 'none', color: '#991b1b', cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Legend Indicators Bar (Matching Images 1 & 2) */}
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



            {/* Stage Quick Navigator Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '4px 0' }}>
              <button
                type="button"
                onClick={() => scrollToStage(1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: activeStage === 1 ? '1.5px solid #000080' : '1px solid #cbd5e1',
                  background: activeStage === 1 ? (isBusinessCabin ? '#eff6ff' : '#000080') : '#ffffff',
                  color: activeStage === 1 ? (isBusinessCabin ? '#1e3a8a' : '#ffffff') : '#475569',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Stage 1: Front Cabin (Rows 1–12) {isBusinessCabin ? '★ Business' : ''}
              </button>
              <button
                type="button"
                onClick={() => scrollToStage(2)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: activeStage === 2 ? '1.5px solid #000080' : '1px solid #cbd5e1',
                  background: activeStage === 2 ? '#000080' : '#ffffff',
                  color: activeStage === 2 ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Stage 2: Middle / Overwing (Rows 13–23)
              </button>
              <button
                type="button"
                onClick={() => scrollToStage(3)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: activeStage === 3 ? '1.5px solid #000080' : '1px solid #cbd5e1',
                  background: activeStage === 3 ? '#000080' : '#ffffff',
                  color: activeStage === 3 ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Stage 3: Rear Cabin (Rows 24–39) {!isBusinessCabin ? '✓ Economy' : ''}
              </button>
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
                <div className="fss-fuselage-border-wrapper">
                  <div className="fss-fuselage-body">
                    {/* ---------------- STAGE 1: FRONT CABIN ---------------- */}
                    <div className="fss-stage-front-wrap">
                      <span className="fss-stage-badge">STAGE 1: FRONT CABIN</span>

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

                      {/* XL Business Class Cabin (Rows 1 to 3, Matching Image 2) */}
                      <div
                        className="fss-xl-box"
                        style={{
                          position: 'relative',
                          border: isBusinessCabin ? '2px solid #2563eb' : '1.5px solid #22c55e',
                          boxShadow: isBusinessCabin ? '0 0 16px rgba(37, 99, 235, 0.25)' : undefined,
                          background: isBusinessCabin ? '#f8faff' : undefined
                        }}
                      >
                        <span className="fss-xl-badge-top">XL</span>
                        <span className="fss-xl-badge-bottom">XL</span>

                        {!isBusinessCabin && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-24px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#ef4444',
                              color: '#ffffff',
                              fontSize: '9.5px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              whiteSpace: 'nowrap',
                              letterSpacing: '0.3px',
                              zIndex: 10
                            }}
                          >
                            🔒 Business Class Only (Rows 1–3)
                          </div>
                        )}

                        <div className="fss-xl-grid">
                          {xlSeats.map((col) => (
                            <div key={col.row} className="fss-xl-col">
                              {[col.top, col.between, col.bot].filter(Boolean).map((seat: any) => {
                                const isAssigned = passengers.some((p) => p.seatCode === seat.code);
                                const isCurrent = passengers[activePaxIndex]?.seatCode === seat.code;
                                return (
                                  <button
                                    key={seat.code}
                                    type="button"
                                    disabled={seat.isOccupied}
                                    style={!isBusinessCabin ? { cursor: 'not-allowed', opacity: 0.75 } : undefined}
                                    className={`fss-xl-seat ${seat.isOccupied ? 'occupied' : isCurrent || isAssigned ? 'assigned' : ''}`}
                                    onClick={() => handleSeatClick(seat)}
                                    title={!isBusinessCabin ? 'Business Class Only - Not available for Economy' : `${seat.code} - XL Business Recliner`}
                                  >
                                    {!seat.isOccupied ? seat.code : ''}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exit Divider */}
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
                        {stage1EconomyRows.map((er) => renderSeatColumn(er))}
                      </div>
                    </div>

                    {/* ---------------- STAGE 2: MIDDLE / OVERWING ---------------- */}
                    <div className="fss-stage-middle-wrap">
                      <span className="fss-stage-badge">STAGE 2: MIDDLE / OVERWING</span>
                      <div className="fss-stage2-top-wing"><span>W I N G</span></div>
                      <div className="fss-stage2-bottom-wing"><span>W I N G</span></div>

                      <div className="fss-seats-block">
                        {stage2Rows.map((er) => {
                          const isOverwingExit = er.row === 13 || er.row === 14;
                          return renderSeatColumn(er, isOverwingExit, isOverwingExit);
                        })}
                      </div>
                    </div>

                    {/* ---------------- STAGE 3: REAR CABIN (Matching Image 1) ---------------- */}
                    <div className="fss-stage-rear-wrap">
                      <span className="fss-stage-badge">STAGE 3: REAR CABIN</span>

                      <div className="fss-seats-block">
                        {stage3Rows.map((er) => {
                          const isPreExitDoor = er.row === 28;
                          const isExitRow = er.row === 28 || er.row === 29;

                          return (
                            <React.Fragment key={er.row}>
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
                              {renderSeatColumn(er, isExitRow, isExitRow)}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Rear Galley & Tail */}
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

                      <div style={{ display: 'flex', alignItems: 'center', height: '180px', paddingLeft: '8px' }}>
                        <div className="fss-staff-box" style={{ height: '140px', width: '42px' }}>STAFF</div>
                        <div className="fss-tail-cone"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Box */}
            <div className="fss-note-box">
              <div className="fss-note-title">Note:</div>
              <div>
                {isBusinessCabin
                  ? 'Business Class: You can select any seat in the Front XL Cabin (Rows 1 to 3) at no additional charge. Economy seats cannot be booked.'
                  : 'Economy Cabin: You can select any seat from Rows 4 to 39. Business Class XL seats (Rows 1 to 3) are restricted to Business passengers.'}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="fss-actions-row">
              <button
                type="button"
                className="fss-back-btn"
                onClick={() => router.push('/home/ride/flight/PassengerDetails')}
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
                Check-in: {bookingData.checkInBaggage} | Hand bag: {bookingData.handBaggage}
              </span>
            </div>

            {/* Passenger Selection Card */}
            <div className="fss-pax-card">
              <div className="fss-pax-header">
                <span>{passengers.length} Passenger{passengers.length > 1 ? 's' : ''} travelling</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>
                  {bookingData.cabinClass}
                </span>
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

            {/* Exclusive Benefits */}
            <div className="fss-benefits-wrap">
              <h4 className="fss-benefits-title">Our Exclusive Benefits</h4>
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

              <div className="fss-benefit-hotel">
                <h5 className="fss-hotel-title">Hotels on IndiGo</h5>
                <p className="fss-hotel-sub">Earn IndiGo BluChips on hotels and redeem for flights.</p>
                <div className="fss-hotel-discount">Up to 30% off*</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
