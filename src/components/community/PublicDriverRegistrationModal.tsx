'use client';

import React, { useState } from 'react';
import { PublicUnionMember } from './unionMembersData';

interface PublicDriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (member: PublicUnionMember) => void;
}

export default function PublicDriverRegistrationModal({
  isOpen,
  onClose,
  onRegisterSuccess
}: PublicDriverRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('1992-05-14');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [email, setEmail] = useState('');

  // Step 2: Address Information
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Chennai');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('600001');
  const [fullAddress, setFullAddress] = useState('');
  const [addressType, setAddressType] = useState<'Permanent' | 'Temporary' | 'Both'>('Permanent');

  // Step 3: Driving Information
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issuingRto, setIssuingRto] = useState('Chennai Central RTO (TN-01)');
  const [issueDate, setIssueDate] = useState('2014-06-10');
  const [expiryDate, setExpiryDate] = useState('2034-06-09');
  const [vehicleType, setVehicleType] = useState('Heavy Truck Driver (HGV)');
  const [experienceYears, setExperienceYears] = useState<number>(8);
  const [currentFleet, setCurrentFleet] = useState('Self-Employed / Independent Stand Driver');
  const [cleanRecord, setCleanRecord] = useState(true);
  const [unionName, setUnionName] = useState('Heavy Truckers Association');

  // Step 4: Documents & Fee Confirmation
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [licenseFrontUploaded, setLicenseFrontUploaded] = useState(true);
  const [licenseBackUploaded, setLicenseBackUploaded] = useState(true);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName || !fatherName || !mobile) {
        alert('Please fill Full Name, Father\'s Name, and Mobile Number.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!city || !pincode || !fullAddress) {
        alert('Please fill City, PIN Code, and Full Address.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!licenseNumber) {
        alert('Please enter your Driving License Number.');
        return;
      }
    }
    setCurrentStep((currentStep + 1) as any);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Please agree to ADWA Terms & Conditions to complete membership registration.');
      return;
    }

    const newMemberId = `MEM-ADWA-${Math.floor(100 + Math.random() * 900)}`;
    const newBadge = `ADWA-${state.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMember: PublicUnionMember = {
      id: newMemberId,
      fullName: fullName.trim(),
      fatherName: fatherName.trim(),
      dob,
      gender,
      mobile: mobile.replace(/\D/g, '').slice(-10),
      alternateMobile: alternateMobile.trim(),
      email: email.trim(),
      state,
      district,
      city,
      pincode,
      fullAddress,
      addressType,
      licenseNumber: licenseNumber.toUpperCase().trim(),
      issuingRto,
      issueDate,
      expiryDate,
      vehicleType,
      experienceYears: Number(experienceYears),
      currentFleet,
      cleanRecord,
      unionName,
      badgeNumber: newBadge,
      membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
      membershipFee: 352.82,
      registeredDate: 'Today (Just Now)',
      status: 'Waiting in Stand',
      currentLocation: `${city} Central Transport Stand (Queue Rank #1)`,
      assignedVehicle: 'Assigned upon stand check-in'
    };

    onRegisterSuccess(newMember);
  };

  const fillDemoData = () => {
    setFullName('Santhosh Kumar');
    setFatherName('Dhanapal Kumar');
    setDob('1991-08-15');
    setGender('Male');
    setMobile('9840155555');
    setAlternateMobile('9840144444');
    setEmail('santhosh.k@driverwelfare.org');
    setState('Tamil Nadu');
    setDistrict('Chennai');
    setCity('Chennai');
    setPincode('600008');
    setFullAddress('Door No 14, Gandhi Irwin Road, Egmore Goods Yard, Chennai');
    setLicenseNumber('TN-01-20120088991');
    setIssuingRto('Chennai North (TN-01)');
    setVehicleType('Heavy Truck Driver (HGV)');
    setExperienceYears(11);
    setCurrentFleet('Chennai Central Goods Stand Union');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontWeight: 900 }}>
                ADWA WELFARE PORTAL
              </span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                All Driver Welfare Association — Driver Registration
              </h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Complete government verified driver registration with Smart ID card issuance.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '22px', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          {[
            { s: 1, icon: 'fa-user', label: 'Step 1: Personal Info' },
            { s: 2, icon: 'fa-location-dot', label: 'Step 2: Address Info' },
            { s: 3, icon: 'fa-id-card', label: 'Step 3: Driving Info' },
            { s: 4, icon: 'fa-file-arrow-up', label: 'Step 4: Docs & Fee' }
          ].map(st => (
            <div
              key={st.s}
              onClick={() => setCurrentStep(st.s as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                opacity: currentStep === st.s ? 1 : 0.65
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: currentStep === st.s ? '#10b981' : currentStep > st.s ? '#059669' : '#e2e8f0',
                  color: currentStep >= st.s ? '#ffffff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {currentStep > st.s ? '✓' : st.s}
              </div>
              <span style={{ fontSize: '12px', fontWeight: currentStep === st.s ? 800 : 600, color: currentStep === st.s ? '#065f46' : '#64748b' }}>
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Demo Autofill */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={fillDemoData}
            style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '12px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
          >
            ⚡ Autofill Sample Driver Data
          </button>
        </div>

        {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Full Name * <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>(As per Aadhaar Card)</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar Sharma"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Father's Name * <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>(Father's full name)</span>
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={e => setFatherName(e.target.value)}
                  placeholder="e.g. Ram Avatar Sharma"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Date of Birth *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Gender *</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Mobile Number * <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>(Primary mobile for OTP & login)</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 700, outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Alternate Mobile <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={alternateMobile}
                  onChange={e => setAlternateMobile(e.target.value)}
                  placeholder="Optional emergency number"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                Email Address <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>(For digital card delivery)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. driver.rajesh@gmail.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 2: ADDRESS INFORMATION ================= */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>State *</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                >
                  <option>Tamil Nadu</option>
                  <option>Karnataka</option>
                  <option>Kerala</option>
                  <option>Andhra Pradesh</option>
                  <option>Telangana</option>
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Delhi NCR</option>
                  <option>Punjab</option>
                  <option>West Bengal</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>District *</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="Your district"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>City / Town *</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City or town name"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  placeholder="6-digit PIN"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Full Address *</label>
              <textarea
                rows={2}
                value={fullAddress}
                onChange={e => setFullAddress(e.target.value)}
                placeholder="House No., Street, Area, Landmark..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Address Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['Permanent', 'Temporary', 'Both'] as const).map(at => (
                  <label key={at} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    <input
                      type="radio"
                      name="addrType"
                      checked={addressType === at}
                      onChange={() => setAddressType(at)}
                    />
                    {at}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DRIVING INFORMATION ================= */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Driving License Number *</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  placeholder="e.g. DL-0420110112345"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', textTransform: 'uppercase', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Issuing RTO / State</label>
                <input
                  type="text"
                  value={issuingRto}
                  onChange={e => setIssuingRto(e.target.value)}
                  placeholder="e.g. Delhi RTO / Chennai Central"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Issue Date *</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Expiry Date *</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Primary Vehicle Type *</label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                >
                  <option>Heavy Truck Driver (HGV)</option>
                  <option>Trailer / Multi-Axle Specialist</option>
                  <option>Mini-Truck / LCV / Tata Ace Driver</option>
                  <option>Commercial Bus Driver (PSV)</option>
                  <option>Auto-Rickshaw Driver (3W)</option>
                  <option>City Taxi / Sedan Chauffeur</option>
                  <option>Ambulance Emergency Driver</option>
                  <option>Tractor / Farm Vehicle Driver</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Years of Experience *</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={e => setExperienceYears(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 5"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Current Employer / Fleet</label>
                <input
                  type="text"
                  value={currentFleet}
                  onChange={e => setCurrentFleet(e.target.value)}
                  placeholder="Company name or self-employed"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Select Joining Stand / Union</label>
                <select
                  value={unionName}
                  onChange={e => setUnionName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                >
                  <option value="Heavy Truckers Association">Heavy Truckers Association</option>
                  <option value="Auto Stand Union">Auto Stand Union</option>
                  <option value="City Taxi Drivers Union">City Taxi Drivers Union</option>
                  <option value="Private Bus Owners Club">Private Bus Owners Club</option>
                  <option value="Fishermen Coastal Union">Fishermen Coastal Union</option>
                  <option value="Commercial Drone Pilots">Commercial Drone Pilots</option>
                  <option value="Locomotive Engineers Union">Locomotive Engineers Union</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Do you have a clean driving record?</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>
                  <input
                    type="radio"
                    name="cleanRec"
                    checked={cleanRecord === true}
                    onChange={() => setCleanRecord(true)}
                  />
                  Yes, no major violations
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>
                  <input
                    type="radio"
                    name="cleanRec"
                    checked={cleanRecord === false}
                    onChange={() => setCleanRecord(false)}
                  />
                  No, I have prior cases
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: DOCUMENT UPLOAD & MEMBERSHIP FEE ================= */}
        {currentStep === 4 && (
          <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              📄 Step 4: Document Upload & Verification
            </div>

            {/* Document Upload Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div style={{ border: '1.5px dashed #10b981', background: '#f0fdf4', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Passport Size Photo *</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>JPG/PNG, max 2MB</div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 800, marginTop: '6px', display: 'block' }}>✓ Attached</span>
              </div>

              <div style={{ border: '1.5px dashed #10b981', background: '#f0fdf4', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🪪</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Aadhaar Card (Front & Back) *</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>JPG/PNG/PDF, max 5MB</div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 800, marginTop: '6px', display: 'block' }}>✓ Attached</span>
              </div>

              <div style={{ border: '1.5px dashed #10b981', background: '#f0fdf4', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📄</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Driving License – Front *</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>JPG/PNG, max 3MB</div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 800, marginTop: '6px', display: 'block' }}>✓ Attached</span>
              </div>

              <div style={{ border: '1.5px dashed #10b981', background: '#f0fdf4', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📄</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Driving License – Back *</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>JPG/PNG, max 3MB</div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 800, marginTop: '6px', display: 'block' }}>✓ Attached</span>
              </div>
            </div>

            {/* Membership Fee Breakdown Card */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px' }}>💳</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>Membership Fee</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>ADWA Annual Membership</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>₹299</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Driver ID Card Issuance</span>
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>₹FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Processing Charges</span>
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>₹FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>GST (18%)</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>₹53.82</span>
                </div>
                <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                  <span>Total Payable</span>
                  <span style={{ color: '#10b981' }}>₹352.82</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                style={{ marginTop: '3px' }}
                required
              />
              <span>
                I agree to ADWA's{' '}
                <a
                  href="https://www.alldriverwelfareassociation.com/apply.html#"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0284c7', fontWeight: 700 }}
                >
                  Terms & Conditions
                </a>{' '}
                and confirm that all information provided is accurate and true.
              </span>
            </label>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 8px 18px rgba(16, 185, 129, 0.4)'
              }}
            >
              <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i>
              Complete Registration & Pay ₹352.82
            </button>
          </form>
        )}

        {/* Step Navigation Buttons */}
        {currentStep < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#64748b', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#10b981', color: '#ffffff', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer' }}
            >
              Continue to Step {currentStep + 1} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
