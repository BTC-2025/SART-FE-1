'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plane,
  Scale,
  Edit,
  User,
  Phone,
  FileText
} from 'lucide-react';

function HelicopterPassengerDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Current Step: 1 = Passenger Details, 2 = Review Journey, 3 = Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Helicopter metadata from query or fallback
  const operatorName = searchParams.get('operator') || 'Pawan Hans Charters';
  const heliNo = searchParams.get('heliNo') || 'PH-702';
  const sourceName = searchParams.get('source') || 'Dehradun (Sahastradhara)';
  const destName = searchParams.get('destination') || 'Kedarnath (Sirsi Helipad)';
  const sourceCode = searchParams.get('sourceCode') || 'DED';
  const destCode = searchParams.get('destCode') || 'KDN';
  const journeyDate = searchParams.get('date') || '26 Nov, 2026';
  const depTime = searchParams.get('depTime') || '08:30 AM';
  const arrTime = searchParams.get('arrTime') || '09:15 AM';
  const heliModel = searchParams.get('model') || 'Bell 407 (6-Seater Shuttle)';
  const baseFare = Number(searchParams.get('fare')) || 8500;

  // Contact & Profile Details
  const [emailAddress, setEmailAddress] = useState('saikumar@example.com');
  const [addressLine, setAddressLine] = useState('Plot 42, Jubilee Hills Road No 10');
  const [pincode, setPincode] = useState('500033');

  // Multi-passenger support (Up to 6 passengers per ticket)
  const [passengersList, setPassengersList] = useState<any[]>([
    {
      id: 'p1',
      title: 'Mr',
      firstName: 'sai',
      lastName: 'kumar',
      fullName: 'Mr sai kumar',
      dob: '1998-05-14',
      age: '28',
      gender: 'Male',
      idType: 'Aadhaar Card',
      idNumber: '5432 9876 1234',
      weight: 72,
      hasInfant: false,
      infantWeight: 8,
      seat: 'Seat H-01 (Window)'
    }
  ]);

  const addPassenger = () => {
    if (passengersList.length >= 6) {
      alert('Maximum 6 passengers allowed per ticket as per DGCA regulations.');
      return;
    }
    const nextIdx = passengersList.length + 1;
    setPassengersList(prev => [
      ...prev,
      {
        id: `p${Date.now()}`,
        title: 'Mrs',
        firstName: '',
        lastName: '',
        fullName: `Passenger ${nextIdx}`,
        dob: '',
        age: '26',
        gender: 'Female',
        idType: 'Aadhaar Card',
        idNumber: '',
        weight: 65,
        hasInfant: false,
        infantWeight: 8,
        seat: `Seat H-0${nextIdx}`
      }
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengersList.length <= 1) return;
    setPassengersList(prev => prev.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: string, value: any) => {
    setPassengersList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === 'firstName' || field === 'lastName' || field === 'title') {
        const title = field === 'title' ? value : copy[index].title;
        const fn = field === 'firstName' ? value : copy[index].firstName;
        const ln = field === 'lastName' ? value : copy[index].lastName;
        copy[index].fullName = `${title} ${fn} ${ln}`.trim();
      }
      return copy;
    });
  };

  // Helpers & Aliases for primary passenger & calculations
  const primaryPass = passengersList[0] || {};
  const fullName = primaryPass.fullName || 'sai kumar';
  const age = primaryPass.age || '28';
  const gender = primaryPass.gender || 'Male';
  const passengerWeight = primaryPass.weight ?? 72;
  const setPassengerWeight = (w: number) => updatePassenger(0, 'weight', w);
  const hasInfant = Boolean(primaryPass.hasInfant);
  const setHasInfant = (val: boolean) => updatePassenger(0, 'hasInfant', val);
  const infantWeight = primaryPass.infantWeight ?? 8;
  const setInfantWeight = (val: number) => updatePassenger(0, 'infantWeight', val);

  // Passenger 1 form state sync
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [emergencyName, setEmergencyName] = useState('Sunita (Spouse)');
  const [emergencyMobile, setEmergencyMobile] = useState('+91 98765 43211');

  // Aggregate weight calculations
  const totalPassengerEffectiveWeight = passengersList.reduce((acc, p) => acc + Number(p.weight || 70) + (p.hasInfant ? Number(p.infantWeight || 8) : 0), 0);
  const baseWeightAllowance = 80 * passengersList.length; // 80 kg allowance per passenger
  const excessWeightKg = passengersList.reduce((acc, p) => {
    const pw = Number(p.weight || 70) + (p.hasInfant ? Number(p.infantWeight || 8) : 0);
    return acc + Math.max(0, pw - 80);
  }, 0);
  const excessWeightRate = 150; // ₹150 per extra kg above 80 kg
  const excessWeightCharge = excessWeightKg * excessWeightRate;
  const [handbagIncluded, setHandbagIncluded] = useState(true);
  const [declarationChecked, setDeclarationChecked] = useState(true);

  // Static / Regulatory Fees
  const terminalDgcaFee = 450 * passengersList.length;
  const taxesFee = 150 * passengersList.length;
  const totalFareAll = baseFare * passengersList.length;
  const totalEstimate = totalFareAll + excessWeightCharge + terminalDgcaFee + taxesFee;

  // Sync with localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sart_selected_heli');
      if (stored) {
        const h = JSON.parse(stored);
        // values available if needed
      }
    } catch (e) { }
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 20px 60px 20px' }}>
        {/* Stepper Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Step 1 */}
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => setCurrentStep(1)}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: currentStep > 1 ? '#391E84' : currentStep === 1 ? '#391E84' : '#e2e8f0',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                {currentStep > 1 ? <CheckCircle2 size={18} /> : '1'}
              </div>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: currentStep >= 1 ? '#391E84' : '#94a3b8'
                }}
              >
                Passenger Details
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                width: '60px',
                height: '2px',
                backgroundColor: currentStep >= 2 ? '#391E84' : '#e2e8f0',
                marginBottom: '18px'
              }}
            />

            {/* Step 2 */}
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => {
                if (currentStep >= 1) setCurrentStep(2);
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === 2 ? '#391E84' : currentStep > 2 ? '#391E84' : '#f1f5f9',
                  color: currentStep >= 2 ? '#ffffff' : '#64748b',
                  border: currentStep < 2 ? '1.5px solid #cbd5e1' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                {currentStep > 2 ? <CheckCircle2 size={18} /> : '2'}
              </div>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: currentStep >= 2 ? '#391E84' : '#94a3b8'
                }}
              >
                Review Journey
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                width: '60px',
                height: '2px',
                backgroundColor: currentStep >= 3 ? '#391E84' : '#e2e8f0',
                marginBottom: '18px'
              }}
            />

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === 3 ? '#391E84' : '#f1f5f9',
                  color: currentStep === 3 ? '#ffffff' : '#64748b',
                  border: '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                3
              </div>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: currentStep === 3 ? '#391E84' : '#94a3b8'
                }}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* ======================= STEP 1: PASSENGER DETAILS ======================= */}
        {currentStep === 1 && (
          <div>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#09090b', margin: '0 0 6px 0' }}>
                  Book Helipad Seat - Passenger Details
                </h1>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  Enter passenger information, weight details, and identity documents required for DGCA helicopter safety clearance.
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  border: '1px solid #bae6fd',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                🚁 Helipad Booking
              </span>
            </div>

            {/* Main Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
              {/* Left Column: Form & Weight Declaration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Helicopter Flight Header Bar matching image 1 UI */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '16px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Left: Helicopter Icon + Operator Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#fff7ed',
                        border: '1px solid #ffedd5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}
                    >
                      🚁
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', lineHeight: '1.2' }}>
                        {operatorName} • {heliNo}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px', fontWeight: 500 }}>
                        {heliModel} • Helicopter Shuttle
                      </div>
                    </div>
                  </div>

                  {/* Middle: Origin Helipad -> Helicopter Direct -> Destination Helipad */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Origin Helipad */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          Origin Helipad
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#475569'
                          }}
                        >
                          {sourceCode ? `${sourceCode}-HP-H1` : 'MAA-HP-H1'}
                        </span>
                      </div>

                      {/* Flight Path with Animated Arrow / Helicopter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                        <div style={{ width: '28px', height: '1px', backgroundColor: '#cbd5e1' }} />
                        <span style={{ fontSize: '15px', opacity: 0.75 }}>🚁</span>
                        <div style={{ width: '28px', height: '1px', backgroundColor: '#cbd5e1' }} />
                        <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '-2px' }}>→</span>
                      </div>

                      {/* Destination Helipad */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          Destination Helipad
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#475569'
                          }}
                        >
                          {destCode ? `${destCode}-HP-H2` : 'MAA-HP-H2'}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                      Shuttle Service • Direct 25 min
                    </div>
                  </div>

                  {/* Right-Mid: Date & Departure Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '16px', color: '#64748b' }}>📅</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                        {journeyDate},
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                        {depTime}
                      </div>
                    </div>
                  </div>

                  {/* Far Right: Scheduled Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <span
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      ✓ Scheduled • 1 Seat
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                      Helipad Departure: {depTime}
                    </span>
                  </div>
                </div>



                {/* Card: Passenger Information */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={18} color="#391E84" />
                      <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Passenger Information ({passengersList.length}/6 Passengers)
                      </h3>
                    </div>

                    {passengersList.length < 6 && (
                      <button
                        type="button"
                        onClick={addPassenger}
                        style={{
                          backgroundColor: '#f5f3ff',
                          color: '#391E84',
                          border: '1px solid #ddd6fe',
                          borderRadius: '8px',
                          padding: '6px 14px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        + Add Passenger
                      </button>
                    )}
                  </div>

                  {/* Multi-Passenger Forms */}
                  {passengersList.map((pass, pIdx) => (
                    <div
                      key={pass.id}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                          Passenger {pIdx + 1} {pIdx === 0 ? '(Primary Traveler)' : ''}
                        </span>
                        {pIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => removePassenger(pIdx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      {/* Personal Info: Title, First Name, Last Name, DOB, Gender, Age */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1.6fr 1.4fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Title</label>
                          <select
                            value={pass.title}
                            onChange={(e) => updatePassenger(pIdx, 'title', e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
                          >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Master">Master</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>First Name *</label>
                          <input
                            type="text"
                            value={pass.firstName}
                            placeholder="First Name"
                            onChange={(e) => updatePassenger(pIdx, 'firstName', e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Last Name *</label>
                          <input
                            type="text"
                            value={pass.lastName}
                            placeholder="Last Name"
                            onChange={(e) => updatePassenger(pIdx, 'lastName', e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Date of Birth</label>
                          <input
                            type="date"
                            value={pass.dob}
                            onChange={(e) => updatePassenger(pIdx, 'dob', e.target.value)}
                            style={{ width: '100%', padding: '8px 6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Gender *</label>
                          <select
                            value={pass.gender}
                            onChange={(e) => updatePassenger(pIdx, 'gender', e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Age *</label>
                          <input
                            type="number"
                            value={pass.age}
                            onChange={(e) => updatePassenger(pIdx, 'age', e.target.value)}
                            style={{ width: '100%', padding: '8px 6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'center' }}
                          />
                        </div>
                      </div>

                      {/* ID Proof & Body Weight Per Passenger */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 2fr 1.4fr 1.6fr', gap: '12px', alignItems: 'center' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>ID Type *</label>
                          <select
                            value={pass.idType}
                            onChange={(e) => updatePassenger(pIdx, 'idType', e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', backgroundColor: '#ffffff' }}
                          >
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="Driving License">Driving License</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>ID / Aadhaar Number *</label>
                          <input
                            type="text"
                            value={pass.idNumber}
                            placeholder="Enter Govt ID Number"
                            onChange={(e) => updatePassenger(pIdx, 'idNumber', e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Weight (kg) *</label>
                          <input
                            type="number"
                            value={pass.weight}
                            onChange={(e) => updatePassenger(pIdx, 'weight', Number(e.target.value) || 0)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Assigned Helipad Seat</span>
                          <strong style={{ fontSize: '12.5px', color: '#0284c7' }}>{pass.seat}</strong>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Contact & Profile Details Section */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Phone size={16} color="#391E84" />
                      <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Contact &amp; Profile Details
                      </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Phone Number (OTP Verified) *</label>
                          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>✓ Verified</span>
                        </div>
                        <input
                          type="text"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Email Address (for e-Ticket &amp; Manifest) *</label>
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Permanent / Communication Address *</label>
                        <input
                          type="text"
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Pincode *</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Emergency Contact Name &amp; Relation *</label>
                        <input
                          type="text"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Emergency Mobile Number *</label>
                        <input
                          type="text"
                          value={emergencyMobile}
                          onChange={(e) => setEmergencyMobile(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card: Weight Declaration (DGCA Helicopter Safety Requirement) */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Scale size={18} color="#391E84" />
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Weight Declaration (DGCA Helicopter Safety Requirement) <span style={{ color: '#ef4444' }}>*</span>
                    </h3>
                  </div>

                  {/* DGCA Alert Box */}
                  <div
                    style={{
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      marginBottom: '18px',
                      fontSize: '12.5px',
                      color: '#92400e',
                      lineHeight: '1.6'
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⚠️ <strong>Mandatory DGCA Passenger Weight &amp; Tariff Regulations</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>
                        <strong>Maximum Standard Weight:</strong> <strong>80 kg</strong> per passenger (if carrying an child under, the infant's weight is added to yours).
                      </li>
                      <li>
                        <strong>Extra Weight Charge:</strong> <strong>₹150 per extra kg</strong> above 80 kg.
                      </li>
                      <li>
                        <strong>Important Rules:</strong> Weight is calculated <strong>individually</strong> and cannot be averaged out with other family members. If you refuse to pay the extra charge at the helipad, your ticket is <strong>canceled without a refund</strong>.
                      </li>
                      <li style={{ color: '#b45309', fontSize: '11.5px' }}>
                        <em>Note: Full-charter multi-day packages like Char Dham have a lower limit of 75 kg and charge ₹2,000–₹2,500 per extra kg.</em>
                      </li>
                    </ul>
                  </div>

                  {/* Infant toggle row */}
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={hasInfant}
                        onChange={(e) => setHasInfant(e.target.checked)}
                        style={{ accentColor: '#391E84', width: '16px', height: '16px' }}
                      />
                      <span>Carrying an child under  (&lt; 2 years)? (child weight is added to passenger total)</span>
                    </label>
                    {hasInfant && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Infant Weight:</span>
                        <input
                          type="number"
                          value={infantWeight}
                          onChange={(e) => setInfantWeight(Math.max(2, Math.min(20, Number(e.target.value) || 0)))}
                          style={{
                            width: '60px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            fontWeight: 700,
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>kg</span>
                      </div>
                    )}
                  </div>

                  {/* Weight Controls & Calculation Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr 1.6fr', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    {/* Passenger Body Weight */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Passenger Body Weight (in kg) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={passengerWeight}
                          onChange={(e) => setPassengerWeight(Math.max(20, Math.min(150, Number(e.target.value) || 0)))}
                          style={{
                            width: '100%',
                            padding: '10px 40px 10px 14px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '15px',
                            fontWeight: 800,
                            backgroundColor: '#f8fafc',
                            outline: 'none'
                          }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '11px', fontSize: '12px', color: '#64748b' }}>
                          kg
                        </span>
                      </div>
                    </div>

                    {/* Base Weight Allowance */}
                    <div>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Base Weight Allowance</span>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>80 kg</strong>
                    </div>

                    {/* Excess Weight */}
                    <div>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Excess Weight</span>
                      <strong style={{ fontSize: '16px', color: excessWeightKg > 0 ? '#ea580c' : '#16a34a' }}>
                        +{excessWeightKg} kg
                      </strong>
                    </div>

                    {/* Extra Weight Charge */}
                    <div>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Extra Weight Charge</span>
                      <div>
                        <strong style={{ fontSize: '16px', color: '#0f172a' }}>₹{excessWeightCharge.toLocaleString()}</strong>
                        <span style={{ display: 'block', fontSize: '10.5px', color: '#64748b' }}>({excessWeightKg} kg × ₹150/kg)</span>
                      </div>
                    </div>

                    {/* Handbag Weight */}
                    <div>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                        Carry-on Handbag Weight (Max 5 kg)
                      </span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={handbagIncluded}
                          onChange={(e) => setHandbagIncluded(e.target.checked)}
                          style={{ accentColor: '#391E84', width: '16px', height: '16px' }}
                        />
                        <span>Handbag under 5 kg (Included)</span>
                      </label>
                    </div>
                  </div>

                  {/* Slider for Weight Adjustment */}
                  <div style={{ marginTop: '10px', marginBottom: '18px' }}>
                    <input
                      type="range"
                      min={40}
                      max={120}
                      value={passengerWeight}
                      onChange={(e) => setPassengerWeight(Number(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: '#391E84',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Declaration & Consent */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      Declaration & Consent
                    </span>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#475569', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={declarationChecked}
                        onChange={(e) => setDeclarationChecked(e.target.checked)}
                        style={{ accentColor: '#391E84', width: '16px', height: '16px', marginTop: '2px' }}
                      />
                      <span>
                        I declare that the passenger details and weight provided above are accurate as per official identification and personal re-weighing.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Journey & Fare Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Journey Summary */}
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                    Journey Summary
                  </h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>
                      {sourceName} ⇄ {destName}
                    </div>
                    <div>{journeyDate} | {depTime}</div>
                    <div>{heliModel}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>Sahastradhara Helipad Terminal</div>
                  </div>

                  {/* Fare Summary */}
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    Fare Summary
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Base Helicopter Fare (1 Adult, ≤80kg)</span>
                      <strong style={{ color: '#0f172a' }}>₹ {baseFare.toLocaleString('en-IN')}.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Excess Weight Charge (+{excessWeightKg} kg × ₹150)</span>
                      <strong style={{ color: excessWeightCharge > 0 ? '#ea580c' : '#0f172a' }}>
                        ₹ {excessWeightCharge.toLocaleString('en-IN')}.00
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Helipad Terminal & DGCA Fee</span>
                      <strong style={{ color: '#0f172a' }}>₹ {terminalDgcaFee.toLocaleString('en-IN')}.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Taxes & Convenience Charges</span>
                      <strong style={{ color: '#0f172a' }}>₹ {taxesFee.toLocaleString('en-IN')}.00</strong>
                    </div>
                  </div>

                  {/* Total Estimate */}
                  <div
                    style={{
                      borderTop: '1.5px dashed #cbd5e1',
                      paddingTop: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total Estimate</span>
                    <strong style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                      ₹ {totalEstimate.toLocaleString('en-IN')}.00
                    </strong>
                  </div>

                  {/* Safe & Secure Tag */}
                  <div
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#16a34a',
                      marginBottom: '20px'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>100% Safe & Secure Transaction</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Back to Routes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!declarationChecked) {
                          alert('Please confirm the weight declaration checkbox to proceed.');
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      style={{
                        flex: 1.6,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#391E84',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(57, 30, 132, 0.25)'
                      }}
                    >
                      <span>Continue to Review Journey</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= STEP 2: REVIEW HELICOPTER BOOKING ======================= */}
        {currentStep === 2 && (
          <div>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#09090b', margin: '0 0 6px 0' }}>
                  Review Helicopter Booking
                </h1>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  Please verify your helicopter flight schedule, helipad information, and passenger details before payment
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  border: '1px solid #bae6fd',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                🚁 Helipad Booking
              </span>
            </div>

            {/* Main Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
              {/* Left Column: Flight Schedule Card & Verified Passenger Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Helicopter Flight Route Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Top Cyan / Blue Header */}
                  <div
                    style={{
                      backgroundColor: '#0284c7',
                      padding: '12px 20px',
                      color: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      fontWeight: 700
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🚁</span>
                      <span>{operatorName} • {heliNo}</span>
                    </div>
                    <span style={{ fontSize: '12px', opacity: 0.95 }}>
                      Helipad Seat • Regular Shuttle
                    </span>
                  </div>

                  {/* Route & Timing Visualization */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      {/* Departure Node */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a' }}>{depTime.split(' ')[0]}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{sourceCode}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{sourceName}</div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>{journeyDate}</div>
                      </div>

                      {/* Flight Path Graphic */}
                      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>45m</span>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                          <div style={{ flex: 1, height: '1.5px', backgroundColor: '#cbd5e1', margin: '0 4px', borderTop: '1px dashed #0284c7' }} />
                          <span style={{ fontSize: '14px', margin: '0 4px' }}>🚁</span>
                          <div style={{ flex: 1, height: '1.5px', backgroundColor: '#cbd5e1', margin: '0 4px', borderTop: '1px dashed #0284c7' }} />
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                        </div>
                        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                          Direct Flight
                        </div>
                        <span style={{ fontSize: '10.5px', color: '#64748b' }}>Non-stop</span>
                      </div>

                      {/* Arrival Node */}
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a' }}>{arrTime.split(' ')[0]}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{destCode}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{destName}</div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>{journeyDate}</div>
                      </div>
                    </div>

                    {/* Badge Row */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🧳 Luggage: <strong>Max 5 kg</strong>
                      </span>
                      <span style={{ fontSize: '12px', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        ⚖️ Base Limit: <strong>Up to 80 kg</strong>
                      </span>
                      <span style={{ fontSize: '12px', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🚁 Helicopter: <strong>{heliModel}</strong>
                      </span>
                      <span style={{ fontSize: '12px', color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                        <ShieldCheck size={14} /> DGCA Approved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Passenger Information Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={18} color="#391E84" />
                      <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Passenger Information
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#0284c7',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit size={14} /> Edit
                    </button>
                  </div>

                  {/* 4 Details Columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 1.4fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Passenger Name</span>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{fullName}</strong>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b' }}>{age} yrs • {gender}</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Seat Assignment</span>
                      <strong style={{ fontSize: '13.5px', color: '#0284c7' }}>{fullName}: Seat H-03</strong>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b' }}>Confirmed Window</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Helipad Weight & Check-in</span>
                      <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>
                        {totalPassengerEffectiveWeight} kg {hasInfant && `(incl. infant)`} {excessWeightKg > 0 ? `(Excess: +${excessWeightKg} kg)` : '(Standard ≤80 kg)'}
                      </strong>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b' }}>Verified via ID: Aadhaar</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Contact Details</span>
                      <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{mobileNumber}</strong>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b' }}>Emergency: {emergencyName}</span>
                    </div>
                  </div>

                  {/* Weight Declaration Callout in Review */}
                  <div
                    style={{
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      fontSize: '12px',
                      color: '#92400e',
                      lineHeight: '1.5'
                    }}
                  >
                    <div>
                      ⚠️ <strong>Helicopter Payload &amp; Weight Regulations:</strong> Standard maximum weight is <strong>80 kg</strong> per passenger (infant included). Weight exceeding 80 kg incurs <strong>₹150 per extra kg</strong>. Calculated weight: <strong>{totalPassengerEffectiveWeight} kg</strong> {excessWeightKg > 0 ? `(+${excessWeightKg} kg excess = ₹${excessWeightCharge.toLocaleString()})` : `(within standard 80 kg)`}.
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '11px', color: '#b45309' }}>
                      <em>* Weight is calculated individually and cannot be pooled. Non-payment at helipad leads to ticket cancellation without refund. Char Dham charters have 75 kg limit.</em>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Fare Summary & Proceed to Payment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                    Fare Summary
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Base Helicopter Fare (1 Adult, ≤80kg)</span>
                      <strong style={{ color: '#0f172a' }}>₹ {baseFare.toLocaleString('en-IN')}.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Excess Weight Charge (+{excessWeightKg} kg × ₹150)</span>
                      <strong style={{ color: excessWeightCharge > 0 ? '#ea580c' : '#0f172a' }}>
                        ₹ {excessWeightCharge.toLocaleString('en-IN')}.00
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Helipad Terminal & DGCA Fee</span>
                      <strong style={{ color: '#0f172a' }}>₹ {terminalDgcaFee.toLocaleString('en-IN')}.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Taxes & Convenience Charges</span>
                      <strong style={{ color: '#0f172a' }}>₹ {taxesFee.toLocaleString('en-IN')}.00</strong>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div
                    style={{
                      borderTop: '1.5px dashed #cbd5e1',
                      paddingTop: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
                    <strong style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                      ₹ {totalEstimate.toLocaleString('en-IN')}.00
                    </strong>
                  </div>

                  {/* Safe & Secure Tag */}
                  <div
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#16a34a',
                      marginBottom: '20px'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>100% Safe & Secure Transaction</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const bookingPayload = {
                          operator: operatorName,
                          heliNo,
                          source: sourceName,
                          destination: destName,
                          sourceCode,
                          destCode,
                          date: journeyDate,
                          depTime,
                          arrTime,
                          model: heliModel,
                          passengerName: passengersList[0]?.fullName || 'sai kumar',
                          passengers: passengersList,
                          email: emailAddress,
                          address: addressLine,
                          pincode,
                          weight: String(totalPassengerEffectiveWeight),
                          excess: String(excessWeightKg),
                          excessCharge: excessWeightCharge,
                          baseFare: totalFareAll,
                          totalFare: totalEstimate
                        };

                        try {
                          localStorage.setItem('sart_pending_heli_booking', JSON.stringify(bookingPayload));
                        } catch (e) { }

                        const qp = new URLSearchParams({
                          operator: operatorName,
                          heliNo,
                          source: sourceName,
                          destination: destName,
                          sourceCode,
                          destCode,
                          date: journeyDate,
                          depTime,
                          arrTime,
                          model: heliModel,
                          passengerName: passengersList[0]?.fullName || 'sai kumar',
                          weight: String(totalPassengerEffectiveWeight),
                          excess: String(excessWeightKg),
                          totalFare: String(totalEstimate)
                        });

                        router.push(`/home/ride/helicopter/payment?${qp.toString()}`);
                      }}
                      style={{
                        flex: 1.6,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#391E84',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(57, 30, 132, 0.25)'
                      }}
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function HelicopterPassengerDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading helicopter details...</div>}>
      <HelicopterPassengerDetailsContent />
    </Suspense>
  );
}
