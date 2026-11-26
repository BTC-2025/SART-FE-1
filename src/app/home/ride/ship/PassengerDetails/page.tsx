'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Utensils,
  CheckSquare,
  Square,
  ChevronDown,
  Info,
  CheckCircle2,
  Trash2,
  Anchor,
  Compass
} from 'lucide-react';

interface PassengerItem {
  id: string;
  title: string;
  fullName: string;
  dob: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  idProofType: string;
  idNumber: string;
}

function ShipPassengerDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Current Step (1: Passenger Details, 2: Review Journey, 3: Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Vessel details from query or defaults matching image
  const shipName = searchParams.get('name') || 'MV Samudra Express';
  const operatorName = searchParams.get('operator') || 'SART Maritime Lines';
  const imoCode = searchParams.get('code') || 'IMO 9842105';
  const deckTitle = searchParams.get('deck') || 'CRUISE FERRY • DECK 4';
  const rating = searchParams.get('rating') || '4.8';
  const depPort = searchParams.get('depPort') || 'Chennai Port\n(Berth 4)';
  const arrPort = searchParams.get('arrPort') || 'Port Blair\n(Haddo Wharf)';
  const depDate = searchParams.get('depDate') || '28 Nov 2026';
  const arrDate = searchParams.get('arrDate') || '30 Nov 2026';
  const depTime = searchParams.get('depTime') || '08:30 AM';
  const arrTime = searchParams.get('arrTime') || '03:00 PM';
  const duration = searchParams.get('duration') || '54h 30m';
  const cabinClass = searchParams.get('cabinType') || 'Deluxe Ocean Cabin';
  const vesselType = searchParams.get('vesselType') || 'High-Speed Cruise Ferry';
  const cruisingSpeed = '22 Knots';
  const capacity = '1,200 Pax • Ro-Ro Deck';
  const baseFare = Number(searchParams.get('fare')) || 6850;

  // Passenger list state
  const [passengers, setPassengers] = useState<PassengerItem[]>([
    {
      id: 'p-1',
      title: 'Mr',
      fullName: 'Arjun Mehta',
      dob: '1994-05-14',
      age: 32,
      gender: 'Male',
      nationality: 'India',
      idProofType: 'Aadhaar',
      idNumber: '4512 8890 3321'
    }
  ]);

  // Contact details
  const [emergencyName, setEmergencyName] = useState<string>('Vikram Mehta');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+91 98409 87654');

  // Preferences & Special Requirements
  const [mealPreference, setMealPreference] = useState<string>('No Meal');
  const [cabinPreference, setCabinPreference] = useState<string>('Window / Ocean View');
  const [specialAssistance, setSpecialAssistance] = useState<{
    wheelchair: boolean;
    seasickness: boolean;
    infant: boolean;
  }>({
    wheelchair: false,
    seasickness: false,
    infant: false
  });

  // Mandatory Declarations
  const [declNameMatch, setDeclNameMatch] = useState<boolean>(true);
  const [declReportEarly, setDeclReportEarly] = useState<boolean>(true);

  // Success Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Add Passenger handler
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      alert('Maximum 6 passengers allowed per booking as per Maritime Port Trust regulations.');
      return;
    }
    const idx = passengers.length + 1;
    setPassengers(prev => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        title: 'Mr',
        fullName: '',
        dob: '1998-08-20',
        age: 28,
        gender: 'Male',
        nationality: 'India',
        idProofType: 'Aadhaar',
        idNumber: ''
      }
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    setPassengers(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePassenger = (id: string, field: keyof PassengerItem, value: any) => {
    setPassengers(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          if (field === 'dob' && value) {
            try {
              const birthYear = new Date(value).getFullYear();
              const currentYear = new Date().getFullYear();
              if (birthYear && currentYear > birthYear) {
                updated.age = currentYear - birthYear;
              }
            } catch (e) { }
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Pricing calculations
  const totalTariff = baseFare * passengers.length;
  const portTax = 450 * passengers.length;
  const maritimeInsurance = 120 * passengers.length;
  const grandTotal = totalTariff + portTax + maritimeInsurance;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: 'inherit' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: '1 0 auto', padding: '24px 20px 60px 20px', width: '100%' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          {/* ================= STEPPER HEADER (MATCHING IMAGE 3) ================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
              padding: '6px 0'
            }}
          >
            {/* Step 1: Passenger Details */}
            <div
              onClick={() => setCurrentStep(1)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '140px' }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: currentStep >= 1 ? '#2b1b7a' : '#f1f5f9',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentStep === 1 ? '0 0 0 5px rgba(43, 27, 122, 0.22)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                1
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: currentStep === 1 ? 800 : 600, color: currentStep === 1 ? '#0f172a' : '#64748b', whiteSpace: 'nowrap' }}>
                Passenger Details
              </span>
            </div>

            {/* Connecting Line 1 */}
            <div
              style={{
                flex: 1,
                height: '2.5px',
                background: currentStep >= 2 ? '#2b1b7a' : '#2b1b7a',
                margin: '-26px 12px 0 12px'
              }}
            />

            {/* Step 2: Review Journey */}
            <div
              onClick={() => {
                if (currentStep >= 1) setCurrentStep(2);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '140px' }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: currentStep >= 2 ? '#2b1b7a' : '#ede9fe',
                  color: currentStep >= 2 ? '#ffffff' : '#4338ca',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentStep === 2 ? '0 0 0 5px rgba(43, 27, 122, 0.22)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                2
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: currentStep === 2 ? 800 : 600, color: currentStep === 2 ? '#0f172a' : '#64748b', whiteSpace: 'nowrap' }}>
                Review Journey
              </span>
            </div>

            {/* Connecting Line 2 */}
            <div
              style={{
                flex: 1,
                height: '2px',
                background: currentStep >= 3 ? '#2b1b7a' : '#cbd5e1',
                margin: '-26px 12px 0 12px'
              }}
            />

            {/* Step 3: Payment */}
            <div
              onClick={() => {
                if (currentStep >= 2) setCurrentStep(3);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: currentStep >= 2 ? 'pointer' : 'default', minWidth: '110px' }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: currentStep === 3 ? '#2b1b7a' : '#f1f5f9',
                  color: currentStep === 3 ? '#ffffff' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentStep === 3 ? '0 0 0 5px rgba(43, 27, 122, 0.22)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                3
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: currentStep === 3 ? 800 : 600, color: currentStep === 3 ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap' }}>
                Payment
              </span>
            </div>
          </div>

          {/* ================= MAIN TWO-COLUMN LAYOUT (MATCHING IMAGES 1 & 2) ================= */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.45fr 1fr',
              gap: '28px',
              alignItems: 'start'
            }}
          >

            {/* ----------------- LEFT COLUMN: PASSENGER DETAILS FORM ----------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* CARD 1: PASSENGER DETAILS MAIN CONTAINER */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1.5px solid #e2e8f0',
                  padding: '24px 26px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                {/* Header with Title and Add Passenger Button */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                        Passenger Details
                      </h3>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                        Enter names exactly as printed on Government ID / Passport
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPassenger}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: '1.5px solid #bfdbfe',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                  >
                    <Plus size={16} />
                    <span>Add Passenger</span>
                  </button>
                </div>

                {/* PASSENGER CARDS LIST */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {passengers.map((p, idx) => (
                    <div
                      key={p.id}
                      style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {/* Passenger Header Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                            Passenger {idx + 1} {idx === 0 && <span style={{ color: '#64748b', fontWeight: 600 }}>(Lead Passenger)</span>}
                          </span>
                          <span
                            style={{
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }}
                          >
                            Adult • {p.age} yrs
                          </span>
                        </div>

                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePassenger(p.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 700
                            }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        )}
                      </div>

                      {/* Row 1: Title, Full Name, Date of Birth */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '90px 1.5fr 1.1fr',
                          gap: '14px',
                          marginBottom: '16px'
                        }}
                      >
                        {/* Title */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            Title <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={p.title}
                              onChange={(e) => handleUpdatePassenger(p.id, 'title', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                paddingRight: '28px',
                                borderRadius: '10px',
                                border: '1.5px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                fontSize: '13.5px',
                                fontWeight: 600,
                                color: '#0f172a',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none'
                              }}
                            >
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                              <option value="Dr">Dr</option>
                            </select>
                            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          </div>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            Full Name (as per Govt. ID / Passport) <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={p.fullName}
                            onChange={(e) => handleUpdatePassenger(p.id, 'fullName', e.target.value)}
                            placeholder="e.g., Arjun Mehta"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1.5px solid #cbd5e1',
                              fontSize: '13.5px',
                              fontWeight: 600,
                              color: '#0f172a',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            Date of Birth <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="date"
                            value={p.dob}
                            onChange={(e) => handleUpdatePassenger(p.id, 'dob', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '10px',
                              border: '1.5px solid #cbd5e1',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>

                      {/* Row 2: Gender, Nationality */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr',
                          gap: '14px',
                          marginBottom: '16px'
                        }}
                      >
                        {/* Gender Pills */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            Gender <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {(['Male', 'Female', 'Other'] as const).map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => handleUpdatePassenger(p.id, 'gender', g)}
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  borderRadius: '20px',
                                  border: p.gender === g ? 'none' : '1.5px solid #cbd5e1',
                                  backgroundColor: p.gender === g ? '#2563eb' : '#ffffff',
                                  color: p.gender === g ? '#ffffff' : '#334155',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Nationality */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            Nationality <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={p.nationality}
                              onChange={(e) => handleUpdatePassenger(p.id, 'nationality', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                paddingRight: '28px',
                                borderRadius: '10px',
                                border: '1.5px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                fontSize: '13.5px',
                                fontWeight: 600,
                                color: '#0f172a',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none'
                              }}
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Singapore">Singapore</option>
                              <option value="UAE">UAE</option>
                              <option value="Other">Other</option>
                            </select>
                            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: ID Proof Type, ID / Passport Number */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1.3fr',
                          gap: '14px'
                        }}
                      >
                        {/* ID Proof Type */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            ID Proof Type <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={p.idProofType}
                              onChange={(e) => handleUpdatePassenger(p.id, 'idProofType', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                paddingRight: '28px',
                                borderRadius: '10px',
                                border: '1.5px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                fontSize: '13.5px',
                                fontWeight: 600,
                                color: '#0f172a',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none'
                              }}
                            >
                              <option value="Aadhaar">Aadhaar</option>
                              <option value="Passport">Passport</option>
                              <option value="Voter ID">Voter ID</option>
                              <option value="Driving License">Driving License</option>
                            </select>
                            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          </div>
                        </div>

                        {/* ID / Passport Number */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                            ID / Passport Number <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={p.idNumber}
                            onChange={(e) => handleUpdatePassenger(p.id, 'idNumber', e.target.value)}
                            placeholder="E.G., 4512 8890 3321"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1.5px solid #cbd5e1',
                              fontSize: '13.5px',
                              fontWeight: 600,
                              color: '#0f172a',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: EMERGENCY CONTACT DETAILS */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1.5px solid #e2e8f0',
                  padding: '20px 24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Emergency Contact Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Full name of relative or contact"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Emergency Contact Phone <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98409 87654"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: ONBOARD PREFERENCES & SPECIAL REQUIREMENTS (MATCHING IMAGE 2) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1.5px solid #e2e8f0',
                  padding: '24px 26px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      Onboard Preferences & Special Requirements
                    </h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                      Optional dining, cabin preference, extra baggage & Ro-Ro vehicle roll-on
                    </p>
                  </div>
                </div>

                {/* Dropdowns: Meal & Cabin Preference */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  {/* Meal Preference */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Meal Preference
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={mealPreference}
                        onChange={(e) => setMealPreference(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          paddingRight: '28px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="No Meal">No Meal</option>
                        <option value="Veg Buffet Pass">Veg Buffet Pass (+₹450)</option>
                        <option value="Non-Veg Coastal Buffet">Non-Veg Coastal Buffet (+₹650)</option>
                        <option value="Jain Meal">Jain Meal (+₹450)</option>
                      </select>
                      <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Cabin / Seat Preference */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Cabin / Seat Preference
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={cabinPreference}
                        onChange={(e) => setCabinPreference(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          paddingRight: '28px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="Window / Ocean View">Window / Ocean View</option>
                        <option value="Upper Promenade Deck">Upper Promenade Deck</option>
                        <option value="Main Deck Center">Main Deck Center</option>
                        <option value="Quiet Berth Zone">Quiet Berth Zone</option>
                      </select>
                      <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </div>

                {/* Special Assistance Checkboxes */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                    Special Assistance
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {/* Wheelchair */}
                    <div
                      onClick={() => setSpecialAssistance(prev => ({ ...prev, wheelchair: !prev.wheelchair }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: specialAssistance.wheelchair ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                        backgroundColor: specialAssistance.wheelchair ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={specialAssistance.wheelchair}
                        onChange={() => { }}
                        style={{ accentColor: '#2563eb' }}
                      />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a', lineHeight: '1.3' }}>
                        Wheelchair / Mobility Aid
                      </span>
                    </div>

                    {/* Seasickness */}
                    <div
                      onClick={() => setSpecialAssistance(prev => ({ ...prev, seasickness: !prev.seasickness }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: specialAssistance.seasickness ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                        backgroundColor: specialAssistance.seasickness ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={specialAssistance.seasickness}
                        onChange={() => { }}
                        style={{ accentColor: '#2563eb' }}
                      />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a', lineHeight: '1.3' }}>
                        Seasickness Assistance
                      </span>
                    </div>

                    {/* Traveling with Infant */}
                    <div
                      onClick={() => setSpecialAssistance(prev => ({ ...prev, infant: !prev.infant }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: specialAssistance.infant ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                        backgroundColor: specialAssistance.infant ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={specialAssistance.infant}
                        onChange={() => { }}
                        style={{ accentColor: '#2563eb' }}
                      />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a', lineHeight: '1.3' }}>
                        Traveling with Infant
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CARD 4: MANDATORY DECLARATIONS (MATCHING IMAGE 2) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1.5px solid #e2e8f0',
                  padding: '24px 26px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ShieldCheck size={18} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Mandatory Declarations
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Declaration 1 */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={declNameMatch}
                      onChange={(e) => setDeclNameMatch(e.target.checked)}
                      style={{ accentColor: '#2563eb', marginTop: '3px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: '1.45' }}>
                      I confirm that all passenger names and ID numbers match their original government-issued ID / Passport.
                    </span>
                  </label>

                  {/* Declaration 2 */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={declReportEarly}
                      onChange={(e) => setDeclReportEarly(e.target.checked)}
                      style={{ accentColor: '#2563eb', marginTop: '3px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: '1.45' }}>
                      I agree to report at the port terminal at least 90 minutes before departure and accept the maritime cancellation & weather-delay policy.
                    </span>
                  </label>
                </div>

                {/* Proceed to Review Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!declNameMatch || !declReportEarly) {
                        alert('Please accept the mandatory declarations to continue.');
                        return;
                      }
                      setIsSuccessModalOpen(true);
                    }}
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 32px',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

              </div>

            </div>

            {/* ----------------- RIGHT COLUMN: VESSEL SHOWCASE CARD (MATCHING IMAGES 1 & 2) ----------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* CARD: VESSEL DETAILS & ITINERARY */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1.5px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)'
                }}
              >
                {/* Ship Vector / Cover Illustration (Exact design from user screenshot) */}
                <div
                  style={{
                    height: '140px',
                    position: 'relative',
                    background: 'linear-gradient(180deg, #bae6fd 0%, #38bdf8 65%, #0369a1 100%)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '10px'
                  }}
                >
                  {/* Deck Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 900,
                      letterSpacing: '0.6px',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      zIndex: 3
                    }}
                  >
                    {deckTitle}
                  </span>

                  {/* Rating Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      zIndex: 3
                    }}
                  >
                    <Star size={13} fill="#eab308" color="#eab308" />
                    <span>{rating}</span>
                  </span>

                  {/* Ship SVG Illustration */}
                  <div style={{ position: 'relative', width: '90%', maxWidth: '340px', zIndex: 2 }}>
                    <svg viewBox="0 0 340 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                      {/* Funnel */}
                      <rect x="120" y="8" width="16" height="20" rx="3" fill="#1e293b" />
                      <line x1="128" y1="2" x2="128" y2="18" stroke="#334155" strokeWidth="2" />
                      <line x1="122" y1="8" x2="134" y2="8" stroke="#334155" strokeWidth="2" />
                      {/* Bridge Deck */}
                      <path d="M70 42 L80 26 L230 26 L245 42 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                      <rect x="90" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      <rect x="110" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      <rect x="130" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      <rect x="150" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      <rect x="170" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      <rect x="190" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      <rect x="210" y="30" width="14" height="8" rx="2" fill="#0284c7" />
                      {/* Main Hull */}
                      <path d="M30 42 L310 42 L280 68 L60 68 Z" fill="#0f172a" />
                      {/* Hull Portholes */}
                      <circle cx="90" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="110" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="130" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="150" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="170" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="190" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="210" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="230" cy="54" r="2.5" fill="#ffffff" />
                      <circle cx="250" cy="54" r="2.5" fill="#ffffff" />
                      {/* Ship Name on Bow */}
                      <text x="170" y="57" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.8">MV SAMUDRA EXPRESS</text>
                      {/* Waves */}
                      <path d="M0 72 Q 40 64, 80 72 T 160 72 T 240 72 T 320 72 T 340 72 L340 90 L0 90 Z" fill="#0369a1" />
                    </svg>
                  </div>
                </div>

                {/* Vessel Header & IMO */}
                <div style={{ padding: '18px 20px 14px 20px' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a', margin: '0 0 3px 0' }}>
                    {shipName}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {operatorName} • {imoCode}
                  </div>
                </div>

                {/* Voyage Itinerary Box (Matching Image 1) */}
                <div style={{ padding: '0 20px 16px 20px' }}>
                  <div
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      {/* Departure */}
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                          Chennai Port
                        </strong>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                          (Berth 4)
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', display: 'block', marginTop: '4px' }}>
                          {depDate} • {depTime}
                        </span>
                      </div>

                      {/* Voyage Duration Pill */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            marginBottom: '4px'
                          }}
                        >
                          {duration}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                          <span>- - -</span>
                          <Anchor size={14} color="#2563eb" />
                          <span>- - -</span>
                        </div>
                      </div>

                      {/* Arrival */}
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                          Port Blair
                        </strong>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                          (Haddo Wharf)
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', display: 'block', marginTop: '4px' }}>
                          {arrDate} • {arrTime}
                        </span>
                      </div>
                    </div>

                    {/* Report Alert Banner */}
                    <div
                      style={{
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fef3c7',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#b45309'
                      }}
                    >
                      <Clock size={15} color="#d97706" />
                      <span>Report at pier 90 mins before departure</span>
                    </div>
                  </div>
                </div>

                {/* Vessel Specs Grid (Cabin Class, Vessel Type, Cruising Speed, Capacity) */}
                <div style={{ padding: '0 20px 18px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                        CABIN CLASS
                      </span>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                        {cabinClass}
                      </strong>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                        VESSEL TYPE
                      </span>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                        {vesselType}
                      </strong>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                        CRUISING SPEED
                      </span>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                        {cruisingSpeed}
                      </strong>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                        CAPACITY
                      </span>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                        {capacity}
                      </strong>
                    </div>
                  </div>

                  {/* Onboard Amenities Chips */}
                  <div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>
                      ONBOARD AMENITIES
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['AC Cabins', 'Dining Hall', 'Medical Bay', 'Lifeboats', 'Sat-WiFi'].map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fare Summary Box */}
                  <div
                    style={{
                      borderTop: '1px solid #e2e8f0',
                      marginTop: '16px',
                      paddingTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Total Estimated Fare ({passengers.length} Pax)</span>
                      <strong style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>₹ {grandTotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>
                      Includes Port Fees &amp; Taxes
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================= SUCCESS MODAL ================= */}
          {isSuccessModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  maxWidth: '480px',
                  width: '100%',
                  padding: '28px',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: '28px'
                  }}
                >
                  ✓
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Voyage Booking Review Ready!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.4' }}>
                  Passenger manifest for <strong>{passengers[0].fullName}</strong> on <strong>{shipName}</strong> ({depDate}) has been verified.
                </p>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', marginBottom: '20px', textAlign: 'left', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Route:</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Chennai Port → Port Blair</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Berth / Class:</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{cabinClass} ({deckTitle})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Total Passengers:</span>
                    <span style={{ fontWeight: 800, color: '#2563eb' }}>{passengers.length} Adults</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Total Fare:</span>
                    <span style={{ fontWeight: 800, color: '#059669' }}>₹ {grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsSuccessModalOpen(false)}
                    style={{
                      flex: 1,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Voyage Ticket Confirmed! Manifest ID: MNF-${Date.now().toString().slice(-6)}. Port QR sent via SMS.`);
                      router.push('/home/ride/ship');
                    }}
                    style={{
                      flex: 1.5,
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Confirm &amp; Issue Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShipPassengerDetailsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading passenger manifest...</p>
      </div>
    }>
      <ShipPassengerDetailsContent />
    </Suspense>
  );
}
