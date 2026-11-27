'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import FlightDobCalendarModal from './FlightDobCalendarModal';
import FlightPassengerSummarySidebar from './FlightPassengerSummarySidebar';
import './flightpassenger.css';

export interface PassengerFormData {
  id: string;
  type: 'adult' | 'senior' | 'child' | 'infant';
  typeLabel: string;
  passengerIndex: number;
  gender: 'Male' | 'Female';
  firstName: string;
  lastName: string;
  nationality: string;
  dob: string;
  seniorId?: string; // For Senior Citizens (Image 2)
  isAuthorizedGuardian?: boolean; // For Child / Infant (Image 3, 4)
  taggedAdultId?: string; // For Infant (Image 4)
  specialAssistanceOpen?: boolean;
  specialAssistanceNotes?: string;
  frequentFlyerOpen?: boolean;
  frequentFlyerNo?: string;
}

export interface FlightPassengerProps {
  initialFlightData?: any;
}

export default function FlightPassenger({ initialFlightData }: FlightPassengerProps) {
  const router = useRouter();

  // Booking Data
  const [flightData, setFlightData] = useState<any>({
    airline: 'IndiGo',
    flightNo: '6E 6047',
    aircraft: 'A321',
    source: 'Delhi',
    sourceAirport: 'DEL',
    sourceTerminal: 'T1',
    destination: 'Mumbai',
    destinationAirport: 'BOM',
    destinationTerminal: 'T2',
    depTime: '11:00',
    depDate: 'Tue, Dec 1 2026',
    arrTime: '13:25',
    arrDate: 'Tue, Dec 1 2026',
    travelTime: '02h 25m',
    fareTier: 'Saver | Economy',
    fare: 7098,
    totalFare: 7098,
    cabinBaggage: 'Upto 7 KG',
    checkInBaggage: '15 KG',
    travelers: {
      adults: 1,
      seniors: 1,
      children: 1,
      infants: 1,
      total: 4,
      summary: '1 Adult, 1 Senior Citizen, 1 Child, 1 Infant'
    }
  });

  // Accordion active open states
  const [openCardIds, setOpenCardIds] = useState<Record<string, boolean>>({});

  // Dynamic passenger list generated from travelers count
  const [passengersList, setPassengersList] = useState<PassengerFormData[]>([]);

  // Keep nationality same for all passengers checkbox
  const [keepSameNationality, setKeepSameNationality] = useState(true);

  // EU / Minor traveler question
  const [isMinorEUOrIndian, setIsMinorEUOrIndian] = useState<'yes' | 'no'>('no');

  // Contact Details
  const [contact, setContact] = useState({
    countryCode: '+91',
    mobile: '9876543210',
    email: 'fullname@gmail.com'
  });
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false);

  // Date of Birth Interactive Calendar Picker Modal State
  const [activeDobPax, setActiveDobPax] = useState<PassengerFormData | null>(null);
  const [calDay, setCalDay] = useState<number>(15);
  const [calMonth, setCalMonth] = useState<number>(0);
  const [calYear, setCalYear] = useState<number>(1998);

  const openDobPicker = (pax: PassengerFormData) => {
    setActiveDobPax(pax);
    if (pax.dob && (pax.dob.includes('-') || pax.dob.includes('/'))) {
      const sep = pax.dob.includes('-') ? '-' : '/';
      const parts = pax.dob.split(sep);
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 1920) {
          setCalDay(d);
          setCalMonth(Math.max(0, Math.min(11, m)));
          setCalYear(y);
          return;
        }
      }
    }
    const curYear = new Date().getFullYear();
    const defaultYear =
      pax.type === 'senior'
        ? curYear - 65
        : pax.type === 'child'
          ? curYear - 7
          : pax.type === 'infant'
            ? curYear - 1
            : curYear - 25;
    setCalDay(15);
    setCalMonth(0);
    setCalYear(defaultYear);
  };

  // Addons (Image 5)
  const [addons, setAddons] = useState({
    smartCancellation: false,
    smartCancellationPrice: 2397,
    indigoSwitch: false,
    indigoSwitchPrice: 1197
  });

  // Consents (Image 5)
  const [consents, setConsents] = useState({
    agreeTerms: true,
    receiveOffers: false,
    whatsappUpdates: false
  });

  // Form Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // On Mount: Load saved booking details from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_flight_booking');
      let adultsCount = 1;
      let seniorsCount = 1;
      let childrenCount = 1;
      let infantsCount = 1;
      let currentFlight = { ...flightData };

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const cCabin = parsed.cabinClass || (parsed.fareTier?.includes('Business') ? 'Business' : parsed.fareTier?.includes('Premium') ? 'Premium Economy' : 'Economy');
          currentFlight = {
            ...currentFlight,
            airline: parsed.airline || currentFlight.airline,
            flightNo: parsed.flightNo || currentFlight.flightNo,
            source: parsed.source || currentFlight.source,
            sourceAirport: parsed.sourceAirport || currentFlight.sourceAirport,
            destination: parsed.destination || currentFlight.destination,
            destinationAirport: parsed.destinationAirport || currentFlight.destinationAirport,
            depTime: parsed.depTime || currentFlight.depTime,
            arrTime: parsed.arrTime || currentFlight.arrTime,
            fareTier: parsed.fareTier || `${currentFlight.fareTier} | ${cCabin}`,
            cabinClass: cCabin,
            checkInBaggage: parsed.checkInBaggage || (cCabin === 'Business' ? '40 KG' : cCabin === 'Premium Economy' ? '25 KG' : '15 KG'),
            cabinBaggage: parsed.cabinBaggage || (cCabin === 'Business' ? '12 KG' : cCabin === 'Premium Economy' ? '10 KG' : '7 KG'),
            fare: Number(parsed.fare) || currentFlight.fare,
            totalFare: Number(parsed.totalFare || parsed.fare) || currentFlight.totalFare,
            travelers: parsed.travelers || currentFlight.travelers
          };

          if (parsed.travelers) {
            adultsCount = parsed.travelers.adults ?? 1;
            seniorsCount = parsed.travelers.seniors ?? 0;
            childrenCount = parsed.travelers.children ?? 0;
            infantsCount = parsed.travelers.infants ?? 0;
          }
        } catch (e) {
          console.error('Failed to parse flight booking in FlightPassenger', e);
        }
      }

      setFlightData(currentFlight);

      // Construct passenger list based on counts matching images (Adult 1, Senior Citizen 1, Child 1, Infant 1)
      const list: PassengerFormData[] = [];
      let globalIdx = 1;

      // Ensure at least 1 adult
      const effectiveAdults = Math.max(1, adultsCount);
      for (let i = 1; i <= effectiveAdults; i++) {
        list.push({
          id: `adult_${i}`,
          type: 'adult',
          typeLabel: `Adult ${i}`,
          passengerIndex: globalIdx++,
          gender: 'Male',
          firstName: '',
          lastName: '',
          nationality: 'India',
          dob: ''
        });
      }

      for (let i = 1; i <= seniorsCount; i++) {
        list.push({
          id: `senior_${i}`,
          type: 'senior',
          typeLabel: `Senior Citizen ${i}`,
          passengerIndex: globalIdx++,
          gender: 'Male',
          firstName: '',
          lastName: '',
          nationality: 'India',
          dob: '',
          seniorId: ''
        });
      }

      for (let i = 1; i <= childrenCount; i++) {
        list.push({
          id: `child_${i}`,
          type: 'child',
          typeLabel: `Child ${i}`,
          passengerIndex: globalIdx++,
          gender: 'Male',
          firstName: '',
          lastName: '',
          nationality: 'India',
          dob: '',
          isAuthorizedGuardian: true
        });
      }

      for (let i = 1; i <= infantsCount; i++) {
        list.push({
          id: `infant_${i}`,
          type: 'infant',
          typeLabel: `Infant ${i}`,
          passengerIndex: globalIdx++,
          gender: 'Male',
          firstName: '',
          lastName: '',
          nationality: 'India',
          dob: '',
          taggedAdultId: 'Adult 1',
          isAuthorizedGuardian: true
        });
      }

      setPassengersList(list);

      // Open all cards by default so user sees full fields
      const openState: Record<string, boolean> = {};
      list.forEach((p) => {
        openState[p.id] = true;
      });
      setOpenCardIds(openState);
    }
  }, []);

  // Update specific passenger field
  const handlePassengerChange = (id: string, field: keyof PassengerFormData, value: any) => {
    setPassengersList((prev) => {
      const updatedList = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          return updated;
        }
        if (field === 'nationality' && keepSameNationality) {
          return { ...p, nationality: value };
        }
        return p;
      });

      // Auto-update email to fullname@gmail.com when Primary Passenger enters first/last name
      if (!emailManuallyEdited && (field === 'firstName' || field === 'lastName')) {
        const p1 = updatedList[0];
        if (p1) {
          const rawFirst = field === 'firstName' && p1.id === id ? value : p1.firstName;
          const rawLast = field === 'lastName' && p1.id === id ? value : p1.lastName;
          const cleanName = `${rawFirst || ''}${rawLast || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');
          setContact((prevContact) => ({
            ...prevContact,
            email: cleanName ? `${cleanName}@gmail.com` : 'fullname@gmail.com'
          }));
        }
      }

      return updatedList;
    });
  };

  // Toggle card accordion
  const toggleCard = (id: string) => {
    setOpenCardIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Validation
  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    passengersList.forEach((p) => {
      if (!p.firstName.trim()) {
        errs[`${p.id}_firstName`] = 'First & Middle Name is required';
      }
      if (!p.lastName.trim()) {
        errs[`${p.id}_lastName`] = 'Last Name is required';
      }
      if (!p.dob.trim()) {
        errs[`${p.id}_dob`] = 'Date of birth is mandatory';
      }
      if (p.type === 'senior' && !p.seniorId?.trim()) {
        errs[`${p.id}_seniorId`] = 'Senior Citizen ID proof is required';
      }
    });

    if (!contact.mobile.trim() || contact.mobile.length < 10) {
      errs.mobile = 'Valid 10-digit primary mobile number is mandatory';
    }
    if (!contact.email.trim() || !contact.email.includes('@')) {
      errs.email = 'Valid primary email address is mandatory';
    }
    if (!consents.agreeTerms) {
      errs.agreeTerms = 'Please agree to Conditions of Carriage & Privacy Policy';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit and route to Review Journey
  const handleProceed = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    if (typeof window !== 'undefined') {
      const pendingData = {
        ...flightData,
        passengersList,
        primaryPassenger: passengersList[0],
        passenger: {
          title: passengersList[0]?.gender === 'Female' ? 'Ms' : 'Mr',
          fullName: `${passengersList[0]?.firstName} ${passengersList[0]?.lastName}`.trim(),
          age: '28',
          gender: passengersList[0]?.gender || 'Male',
          seatPreference: 'Window Seat',
          mealChoice: 'Vegetarian Meal'
        },
        contact,
        addons,
        consents
      };
      localStorage.setItem('sart_pending_flight_booking', JSON.stringify(pendingData));
    }

    router.push('/home/ride/flight/PassengerDetails/SeatSelection');
  };

  // Construct readable passenger breakdown summary
  const summaryPill = flightData.travelers?.summary || '1 Adult';

  return (
    <div className="fp-page-container">
      {/* Sticky Top Header */}
      <div className="fp-sticky-header">
        <Navbar />
        <SubNavbar />
      </div>

      {/* Main Content Area */}
      <main className="fp-main-wrapper">
        <div className="fp-layout-grid">
          {/* ================================================================
              LEFT COLUMN: PASSENGER FORMS (Images 1, 2, 3, 4, 5)
              ================================================================ */}
          <div className="fp-left-col">
            {/* Page Header */}
            <div className="fp-page-title-wrap">
              <h2 className="fp-page-title">Enter customer details</h2>
              <p className="fp-page-subtitle">
                <span className="fp-login-link">Login</span> to book with your saved details
              </p>
            </div>

            {/* Global Error Banner */}
            {Object.keys(errors).length > 0 && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Please complete all required fields highlighted in red below.</span>
              </div>
            )}

            {/* Render Each Passenger Card Accordion (Adult, Senior, Child, Infant) */}
            {passengersList.map((pax) => {
              const isOpen = !!openCardIds[pax.id];

              return (
                <div key={pax.id} className="fp-card">
                  {/* Card Header */}
                  <div className="fp-card-header" onClick={() => toggleCard(pax.id)}>
                    <div className="fp-header-left">
                      <div className="fp-accent-bar"></div>
                      <div className="fp-pax-title-wrap">
                        <span className="fp-pax-title">{pax.typeLabel}</span>
                        <span className="fp-pax-subtitle">Passenger {pax.passengerIndex}</span>
                      </div>
                    </div>
                    <i className={`fa-solid fa-chevron-up fp-header-toggle-icon ${isOpen ? 'open' : ''}`}></i>
                  </div>

                  {/* Card Body */}
                  {isOpen && (
                    <div className="fp-card-body">
                      {/* Gender Selector */}
                      <div className="fp-gender-row">
                        <label className="fp-radio-label">
                          <input
                            type="radio"
                            name={`gender_${pax.id}`}
                            className="fp-radio-input"
                            checked={pax.gender === 'Male'}
                            onChange={() => handlePassengerChange(pax.id, 'gender', 'Male')}
                          />
                          <span>Male</span>
                        </label>
                        <label className="fp-radio-label">
                          <input
                            type="radio"
                            name={`gender_${pax.id}`}
                            className="fp-radio-input"
                            checked={pax.gender === 'Female'}
                            onChange={() => handlePassengerChange(pax.id, 'gender', 'Female')}
                          />
                          <span>Female</span>
                        </label>
                      </div>

                      {/* Official Guidance Note Box (Image 1, 2, 3, 4) */}
                      <div className="fp-note-box">
                        <div className="fp-note-title">Note:</div>
                        <div className="fp-note-text">
                          *Important: For International Travel and Foreign Nationals travelling within India, enter your
                          first, middle and last name exactly as shown on your Passport or Travel Document. For Domestic
                          Travelers, enter your name as per your Government-issued ID.
                        </div>
                        <div className="fp-note-text">
                          *Enter Name and surname as they appear on your passport or travel documents.
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          For detailed info, <span className="fp-note-link">Click Here</span>
                        </div>
                      </div>

                      {/* Name Inputs */}
                      <div className="fp-form-row">
                        <div className="fp-field-group">
                          <input
                            type="text"
                            className={`fp-input ${errors[`${pax.id}_firstName`] ? 'has-error' : ''}`}
                            placeholder="First And Middle Name"
                            value={pax.firstName}
                            onChange={(e) => handlePassengerChange(pax.id, 'firstName', e.target.value)}
                          />
                          {errors[`${pax.id}_firstName`] && (
                            <span className="fp-err-text">{errors[`${pax.id}_firstName`]}</span>
                          )}
                        </div>

                        <div className="fp-field-group">
                          <input
                            type="text"
                            className={`fp-input ${errors[`${pax.id}_lastName`] ? 'has-error' : ''}`}
                            placeholder="Last Name"
                            value={pax.lastName}
                            onChange={(e) => handlePassengerChange(pax.id, 'lastName', e.target.value)}
                          />
                          {errors[`${pax.id}_lastName`] && (
                            <span className="fp-err-text">{errors[`${pax.id}_lastName`]}</span>
                          )}
                        </div>
                      </div>

                      {/* Nationality & Date Of Birth */}
                      <div className="fp-form-row">
                        <div className="fp-field-group">
                          <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                            Nationality
                          </label>
                          <select
                            className="fp-select"
                            value={pax.nationality}
                            onChange={(e) => handlePassengerChange(pax.id, 'nationality', e.target.value)}
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Australia">Australia</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>

                        <div className="fp-field-group">
                          <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                            Date Of Birth (Mandatory)
                          </label>
                          <input
                            type="text"
                            className={`fp-input ${errors[`${pax.id}_dob`] ? 'has-error' : ''}`}
                            placeholder="Date Of Birth (Mandatory)"
                            value={pax.dob}
                            onChange={(e) => handlePassengerChange(pax.id, 'dob', e.target.value)}
                          />
                          <span className="fp-hint-text">
                            *Please enter date of birth in (DD-MM-YYYY)
                          </span>
                          {errors[`${pax.id}_dob`] && (
                            <span className="fp-err-text">{errors[`${pax.id}_dob`]}</span>
                          )}
                        </div>
                      </div>

                      {/* Adult 1: Keep nationality same checkbox (Image 1) */}
                      {pax.passengerIndex === 1 && (
                        <div className="fp-checkbox-row">
                          <input
                            type="checkbox"
                            id="keep_nationality"
                            className="fp-checkbox"
                            checked={keepSameNationality}
                            onChange={(e) => setKeepSameNationality(e.target.checked)}
                          />
                          <label htmlFor="keep_nationality" className="fp-checkbox-text">
                            Keep nationality same for all passengers
                          </label>
                        </div>
                      )}

                      {/* Senior Citizen: ID Proof Field (Image 2) */}
                      {pax.type === 'senior' && (
                        <div style={{ marginBottom: '16px' }}>
                          <input
                            type="text"
                            className={`fp-input ${errors[`${pax.id}_seniorId`] ? 'has-error' : ''}`}
                            placeholder="Senior Citizen ID"
                            value={pax.seniorId || ''}
                            onChange={(e) => handlePassengerChange(pax.id, 'seniorId', e.target.value)}
                          />
                          <span className="fp-hint-text">*Present the ID proof at the time of check-in</span>
                          {errors[`${pax.id}_seniorId`] && (
                            <span className="fp-err-text">{errors[`${pax.id}_seniorId`]}</span>
                          )}
                        </div>
                      )}

                      {/* Child & Infant: Authorized by Parent Checkbox (Image 3, 4) */}
                      {(pax.type === 'child' || pax.type === 'infant') && (
                        <div className="fp-checkbox-row">
                          <input
                            type="checkbox"
                            id={`auth_${pax.id}`}
                            className="fp-checkbox"
                            checked={pax.isAuthorizedGuardian ?? true}
                            onChange={(e) => handlePassengerChange(pax.id, 'isAuthorizedGuardian', e.target.checked)}
                          />
                          <label htmlFor={`auth_${pax.id}`} className="fp-checkbox-text">
                            This booking is authorised by parent/legal guardian.
                          </label>
                        </div>
                      )}

                      {/* Child Note Box (Image 3) */}
                      {pax.type === 'child' && (
                        <div className="fp-note-box" style={{ background: '#f0f9ff' }}>
                          <div className="fp-note-title">Note:</div>
                          <div className="fp-note-text">
                            Adults travelling with a child/children can pre-book preferred seats for a smooth journey
                            together. Alternatively, one of the adults and the child will be given auto-selected seats
                            together during airport check-in.
                          </div>
                        </div>
                      )}

                      {/* Infant: Tagged to Adult Box (Image 4) */}
                      {pax.type === 'infant' && (
                        <div className="fp-infant-tagged-box">
                          <div className="fp-tagged-title">Tagged to</div>
                          <div className="fp-tagged-sub">(Infant must be tagged to an adult):</div>
                          <div className="fp-tagged-card">
                            <input
                              type="radio"
                              checked={true}
                              readOnly
                              className="fp-radio-input"
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#002970' }}>
                              {pax.taggedAdultId || 'Adult 1'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Special Assistance Blue Pill */}
                      <div
                        className="fp-addon-pill"
                        onClick={() =>
                          handlePassengerChange(pax.id, 'specialAssistanceOpen', !pax.specialAssistanceOpen)
                        }
                      >
                        <span className="fp-addon-pill-text">Special Assistance</span>
                        <i
                          className={`fa-solid fa-circle-plus fp-addon-pill-icon ${pax.specialAssistanceOpen ? 'fa-circle-minus' : ''
                            }`}
                        ></i>
                      </div>
                      {pax.specialAssistanceOpen && (
                        <div className="fp-addon-expand-content">
                          <span style={{ color: '#475569' }}>
                            Wheelchair assistance and medical assistance can be requested at check-in or pre-booked with
                            the airline counter.
                          </span>
                        </div>
                      )}

                      {/* Add Frequent Flyer Number Pill (Image 1, 2) */}
                      {(pax.type === 'adult' || pax.type === 'senior') && (
                        <>
                          <div
                            className="fp-addon-pill"
                            onClick={() =>
                              handlePassengerChange(pax.id, 'frequentFlyerOpen', !pax.frequentFlyerOpen)
                            }
                          >
                            <span className="fp-addon-pill-text">Add Frequent Flyer Number</span>
                            <i
                              className={`fa-solid fa-circle-plus fp-addon-pill-icon ${pax.frequentFlyerOpen ? 'fa-circle-minus' : ''
                                }`}
                            ></i>
                          </div>
                          {pax.frequentFlyerOpen && (
                            <div className="fp-addon-expand-content">
                              <input
                                type="text"
                                className="fp-input"
                                placeholder="Enter Frequent Flyer / BluChip ID"
                                value={pax.frequentFlyerNo || ''}
                                onChange={(e) => handlePassengerChange(pax.id, 'frequentFlyerNo', e.target.value)}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* EU Minor Question Box (Image 1) */}
            <div className="fp-question-box">
              <span className="fp-question-text">
                Are there Indian citizens ?
              </span>
              <div className="fp-question-radios">
                <label className="fp-radio-label">
                  <input
                    type="radio"
                    name="eu_minor"
                    className="fp-radio-input"
                    checked={isMinorEUOrIndian === 'yes'}
                    onChange={() => setIsMinorEUOrIndian('yes')}
                  />
                  <span>Yes</span>
                </label>
                <label className="fp-radio-label">
                  <input
                    type="radio"
                    name="eu_minor"
                    className="fp-radio-input"
                    checked={isMinorEUOrIndian === 'no'}
                    onChange={() => setIsMinorEUOrIndian('no')}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Contact Details Card (Image 5) */}
            <div className="fp-contact-card">
              <h3 className="fp-contact-title">Contact details</h3>
              <p className="fp-contact-desc">
                The flyer must have access to the mobile number submitted below for mandatory travel updates.
              </p>

              <div className="fp-contact-inputs-row">
                <div className="fp-phone-input-wrap">
                  <div className="fp-phone-flag">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    className="fp-phone-input"
                    placeholder="Flyer's primary mobile number"
                    value={contact.mobile}
                    onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    className="fp-input"
                    placeholder="Email Id"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="fp-add-contact-link">
                <i className="fa-solid fa-plus"></i> Add another contact
              </div>

              {/* Hotels on IndiGo Promo Banner (Image 5) */}


              {/* Protection Cards (Smart Cancellation & Switch) (Image 5) */}
              <div className="fp-protection-grid">
                {/* Smart Cancellation */}
                <div className="fp-protection-card">
                  <div>
                    <h5 className="fp-protection-title">
                      Sart<span>Smart</span> Cancellation
                    </h5>
                    <p className="fp-protection-desc">
                      Cancel your flight without any cancellation fee (fare rules may still apply).{' '}
                      <span className="fp-note-link">Learn More</span>
                    </p>
                  </div>
                  <div className="fp-protection-bottom">
                    <span className="fp-protection-price">₹{addons.smartCancellationPrice}</span>
                    <button
                      type="button"
                      className={`fp-protection-btn ${addons.smartCancellation ? 'added' : ''}`}
                      onClick={() =>
                        setAddons({ ...addons, smartCancellation: !addons.smartCancellation })
                      }
                    >
                      {addons.smartCancellation ? 'Added ✓' : 'Add'}
                    </button>
                  </div>
                </div>

                {/* IndiGo Switch */}
                <div className="fp-protection-card">
                  <div>
                    <h5 className="fp-protection-title">
                      Sart <span>Switch</span>
                    </h5>
                    <p className="fp-protection-desc">
                      Change your travel date free of charge up to 72 hours before departure. T&Cs apply.{' '}
                      <span className="fp-note-link">Learn More</span>
                    </p>
                  </div>
                  <div className="fp-protection-bottom">
                    <span className="fp-protection-price">₹{addons.indigoSwitchPrice}</span>
                    <button
                      type="button"
                      className={`fp-protection-btn ${addons.indigoSwitch ? 'added' : ''}`}
                      onClick={() => setAddons({ ...addons, indigoSwitch: !addons.indigoSwitch })}
                    >
                      {addons.indigoSwitch ? 'Added ✓' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Consent Checkboxes (Image 5) */}
              <div className="fp-consent-section">
                <label className="fp-consent-label">
                  <input
                    type="checkbox"
                    className="fp-checkbox"
                    checked={consents.agreeTerms}
                    onChange={(e) => setConsents({ ...consents, agreeTerms: e.target.checked })}
                  />
                  <span>
                    I have read and agree to Sart <a>Conditions of Carriage</a>. I further agree to the{' '}
                    <a>Privacy Policy</a> and consent to the processing of the personal data.
                  </span>
                </label>

                <label className="fp-consent-label">
                  <input
                    type="checkbox"
                    className="fp-checkbox"
                    checked={consents.receiveOffers}
                    onChange={(e) => setConsents({ ...consents, receiveOffers: e.target.checked })}
                  />
                  <span>
                    I would like to receive the latest offers and deals from Sart and its partners. I can
                    unsubscribe from all marketing communications at any time.
                  </span>
                </label>

                <label className="fp-consent-label">
                  <input
                    type="checkbox"
                    className="fp-checkbox"
                    checked={consents.whatsappUpdates}
                    onChange={(e) => setConsents({ ...consents, whatsappUpdates: e.target.checked })}
                  />
                  <span>
                    Get updates on <strong style={{ color: '#16a34a' }}>WhatsApp</strong>
                    <br />
                    By subscribing to this, you agree to the terms and conditions of WhatsApp and to Sart Privacy
                    Policy.
                  </span>
                </label>
              </div>

              {/* GST Details Box (Image 5) */}
              <div className="fp-gst-card">
                <div className="fp-gst-left">
                  <div className="fp-gst-icon-box">
                    <i className="fa-solid fa-file-invoice"></i>
                  </div>
                  <div>
                    <h5 className="fp-gst-title">GST Details</h5>
                    <p className="fp-gst-sub">Add GST details to claim funds</p>
                  </div>
                </div>
                <i className="fa-solid fa-plus" style={{ color: '#0084ff', fontSize: '18px' }}></i>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="fp-bottom-actions">
              <button type="button" className="fp-back-btn" onClick={() => router.back()}>
                Back
              </button>
              <button type="button" className="fp-continue-btn" onClick={handleProceed}>
                Continue
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: TRIP & FLIGHT SUMMARY */}
          <FlightPassengerSummarySidebar
            flightData={flightData}
            summaryPill={summaryPill}
          />
        </div>
      </main>

      {/* Date of Birth Calendar Picker Modal */}
      <FlightDobCalendarModal
        activeDobPax={activeDobPax}
        onClose={() => setActiveDobPax(null)}
        onSelectDob={(paxId, formatted) => {
          handlePassengerChange(paxId, 'dob', formatted);
          setErrors((prev) => {
            const copy = { ...prev };
            delete copy[`${paxId}_dob`];
            return copy;
          });
          setActiveDobPax(null);
        }}
      />

      <Footer />
    </div>
  );
}
