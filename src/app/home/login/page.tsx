'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import UserSideBitTool from '@/components/UserSideBitTool';
import './LoginPage.css';

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'register_mobile' | 'register_otp' | 'register_account'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [personName, setPersonName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Auto generated @bnxmail.com
  const generatedBnxEmail = personName && birthYear 
    ? `${personName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}${birthYear.trim()}@bnxmail.com`
    : personName
      ? `${personName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@bnxmail.com`
      : '';

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already logged in, show user info or redirect
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sart_user_session');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.email) {
          setLoginEmail(u.email);
        }
      }
    } catch (e) {}
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    // Check credentials from registered users or create active session
    let registeredUsers: any[] = [];
    try {
      const stored = localStorage.getItem('sart_registered_users');
      if (stored) registeredUsers = JSON.parse(stored);
    } catch (e) {}

    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.password === loginPassword
    );

    if (matched) {
      const userSession = {
        name: matched.name,
        email: matched.email,
        phone: matched.phone || '',
        token: `b2auth_tk_${Date.now()}`
      };
      localStorage.setItem('sart_user_session', JSON.stringify(userSession));
      window.dispatchEvent(new CustomEvent('user-session-changed', { detail: userSession }));
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/home';
      }, 800);
      return;
    }

    // If matches default test session or demo bnxmail
    if (loginEmail.toLowerCase().includes('@bnxmail.com') || loginEmail.includes('@')) {
      const userSession = {
        name: loginEmail.split('@')[0],
        email: loginEmail.trim(),
        phone: '9876543210',
        token: `b2auth_tk_${Date.now()}`
      };
      localStorage.setItem('sart_user_session', JSON.stringify(userSession));
      window.dispatchEvent(new CustomEvent('user-session-changed', { detail: userSession }));
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/home';
      }, 800);
      return;
    }

    setErrorMsg('Invalid email or password. Please try again or create an account.');
  };

  const handleSendMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setView('register_otp');
    setSuccessMsg('OTP sent to +91 ' + mobileNumber);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }
    setView('register_account');
    setSuccessMsg('Mobile verified! Set up your BNXmail and password.');
  };

  const handleRegisterAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!personName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!birthYear.trim() || birthYear.length !== 4) {
      setErrorMsg('Please enter a valid 4-digit birth year.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const newAccount = {
      name: personName.trim(),
      year: birthYear.trim(),
      phone: mobileNumber.trim(),
      email: generatedBnxEmail,
      password: regPassword,
      createdAt: new Date().toISOString()
    };

    // Save to local registered list
    let registeredUsers: any[] = [];
    try {
      const stored = localStorage.getItem('sart_registered_users');
      if (stored) registeredUsers = JSON.parse(stored);
    } catch (e) {}

    registeredUsers.push(newAccount);
    localStorage.setItem('sart_registered_users', JSON.stringify(registeredUsers));

    // Save current session & log in
    const userSession = {
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      token: `b2auth_tk_${Date.now()}`
    };
    localStorage.setItem('sart_user_session', JSON.stringify(userSession));
    window.dispatchEvent(new CustomEvent('user-session-changed', { detail: userSession }));

    setLoginEmail(newAccount.email);
    setSuccessMsg(`Account created! Your email is ${newAccount.email}. Redirecting...`);
    setTimeout(() => {
      window.location.href = '/home';
    }, 1200);
  };

  return (
    <div className="web-app-layout b2auth-page-root">
      <Navbar />
      <SubNavbar />
      <UserSideBitTool isOpen={false} />

      <main className="b2auth-page-main">
        {/* Exact Center Card styled to Match Image 1 */}
        <div className="b2auth-card-container">
          
          {/* VIEW 1: SIGN IN TO B2AUTH (Exact match Image 1) */}
          {view === 'login' && (
            <div className="b2auth-card">
              {/* Back Link */}
              <div className="b2auth-card-top-nav">
                <button
                  type="button"
                  className="b2auth-back-link"
                  onClick={() => window.location.href = '/home'}
                >
                  <i className="fa-solid fa-chevron-left"></i> Back
                </button>
              </div>

              {/* Brand B Serif Logo with Underline */}
              <div className="b2auth-brand-logo-wrap">
                <span className="b2auth-brand-letter">B</span>
              </div>

              {/* Header Titles */}
              <h1 className="b2auth-title">Sign in to B2Auth</h1>
              <p className="b2auth-subtitle">Use your BETA Account</p>

              {/* Alert Banners */}
              {errorMsg && (
                <div className="b2auth-alert error">
                  <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="b2auth-alert success">
                  <i className="fa-solid fa-circle-check"></i> {successMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="b2auth-form">
                {/* Email Field */}
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Email:</label>
                  <input
                    type="text"
                    className="b2auth-input"
                    placeholder="Enter email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Password:</label>
                  <div className="b2auth-password-wrapper">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      className="b2auth-input password-input"
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="b2auth-pwd-toggle-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fa-regular ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Forgot Password link */}
                <div className="b2auth-forgot-link-wrap">
                  <button
                    type="button"
                    className="b2auth-text-link"
                    onClick={() => alert('Password reset link sent to your registered BNXmail.')}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign in with saved account */}
                <div className="b2auth-saved-account-wrap">
                  <button
                    type="button"
                    className="b2auth-text-link primary"
                    onClick={() => {
                      try {
                        const saved = localStorage.getItem('sart_user_session');
                        if (saved) {
                          const u = JSON.parse(saved);
                          if (u.email) setLoginEmail(u.email);
                        } else {
                          setLoginEmail('alexcarter2026@bnxmail.com');
                        }
                      } catch (e) {}
                    }}
                  >
                    Sign in with a saved account
                  </button>
                </div>

                {/* Login Button */}
                <button type="submit" className="b2auth-submit-btn">
                  Login
                </button>
              </form>

              {/* Card Footer */}
              <div className="b2auth-card-footer">
                <div className="b2auth-footer-links-left">
                  <a href="#help" onClick={(e) => { e.preventDefault(); alert('Help Center: support@bnxmail.com'); }}>Help</a>
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('B2Auth Privacy Policy protected.'); }}>Privacy</a>
                  <a href="#terms" onClick={(e) => { e.preventDefault(); alert('B2Auth Terms & Service.'); }}>Terms</a>
                  <a href="#report" onClick={(e) => { e.preventDefault(); alert('Issue reported.'); }}>Report Issue</a>
                </div>

                <div className="b2auth-footer-links-right">
                  <button
                    type="button"
                    className="b2auth-create-account-btn"
                    onClick={() => {
                      setErrorMsg('');
                      setSuccessMsg('');
                      setView('register_mobile');
                    }}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: REGISTER STEP 1 - MOBILE NUMBER */}
          {view === 'register_mobile' && (
            <div className="b2auth-card">
              <div className="b2auth-card-top-nav">
                <button
                  type="button"
                  className="b2auth-back-link"
                  onClick={() => setView('login')}
                >
                  <i className="fa-solid fa-chevron-left"></i> Back to Login
                </button>
              </div>

              <div className="b2auth-brand-logo-wrap">
                <span className="b2auth-brand-letter">B</span>
              </div>

              <h1 className="b2auth-title">Create BETA Account</h1>
              <p className="b2auth-subtitle">Step 1: Enter your mobile number</p>

              {errorMsg && (
                <div className="b2auth-alert error">
                  <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSendMobileOtp} className="b2auth-form">
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Mobile Number:</label>
                  <div className="b2auth-mobile-input-wrapper">
                    <span className="b2auth-country-code">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="b2auth-input"
                      placeholder="Enter 10-digit mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="b2auth-submit-btn">
                  Send OTP Code
                </button>
              </form>

              <div className="b2auth-card-footer justify-center">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="b2auth-text-link primary"
                    onClick={() => setView('login')}
                  >
                    Sign in
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* VIEW 3: REGISTER STEP 2 - OTP VERIFICATION */}
          {view === 'register_otp' && (
            <div className="b2auth-card">
              <div className="b2auth-card-top-nav">
                <button
                  type="button"
                  className="b2auth-back-link"
                  onClick={() => setView('register_mobile')}
                >
                  <i className="fa-solid fa-chevron-left"></i> Change Number
                </button>
              </div>

              <div className="b2auth-brand-logo-wrap">
                <span className="b2auth-brand-letter">B</span>
              </div>

              <h1 className="b2auth-title">Verify Phone</h1>
              <p className="b2auth-subtitle">Enter the 4-digit code sent to +91 {mobileNumber}</p>

              {errorMsg && (
                <div className="b2auth-alert error">
                  <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="b2auth-alert success">
                  <i className="fa-solid fa-circle-check"></i> {successMsg}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="b2auth-form">
                <div className="b2auth-otp-row">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-box-${idx}`}
                      type="text"
                      maxLength={1}
                      className="b2auth-otp-digit"
                      value={otp[idx]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        if (val && idx < 3) {
                          const next = document.getElementById(`otp-box-${idx + 1}`);
                          if (next) next.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          const prev = document.getElementById(`otp-box-${idx - 1}`);
                          if (prev) prev.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <div className="text-center mt-2">
                  <span className="text-xs text-slate-400">Test default OTP: <strong>1234</strong></span>
                </div>

                <button type="submit" className="b2auth-submit-btn mt-4">
                  Verify & Continue
                </button>
              </form>
            </div>
          )}

          {/* VIEW 4: REGISTER STEP 3 - BNXMAIL & PASSWORD CREATION */}
          {view === 'register_account' && (
            <div className="b2auth-card">
              <div className="b2auth-card-top-nav">
                <button
                  type="button"
                  className="b2auth-back-link"
                  onClick={() => setView('register_otp')}
                >
                  <i className="fa-solid fa-chevron-left"></i> Back
                </button>
              </div>

              <div className="b2auth-brand-logo-wrap">
                <span className="b2auth-brand-letter">B</span>
              </div>

              <h1 className="b2auth-title">Setup BNXmail & Password</h1>
              <p className="b2auth-subtitle">Create your personal BETA ecosystem identity</p>

              {errorMsg && (
                <div className="b2auth-alert error">
                  <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                </div>
              )}

              <form onSubmit={handleRegisterAccount} className="b2auth-form">
                {/* Person Name */}
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Person Name:</label>
                  <input
                    type="text"
                    className="b2auth-input"
                    placeholder="e.g. vasanth, alex"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    required
                  />
                </div>

                {/* Birth Year */}
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Year:</label>
                  <input
                    type="text"
                    maxLength={4}
                    className="b2auth-input"
                    placeholder="e.g. 2002, 1998"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                {/* Auto Generated BNXmail Display */}
                <div className="b2auth-generated-email-box">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Assigned BNXmail</span>
                    <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Automated</span>
                  </div>
                  <div className="b2auth-assigned-email-display">
                    <i className="fa-solid fa-envelope text-blue-600 mr-2"></i>
                    <strong>{generatedBnxEmail || 'nameyear@bnxmail.com'}</strong>
                  </div>
                </div>

                {/* Password Field */}
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Set Password:</label>
                  <div className="b2auth-password-wrapper">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      className="b2auth-input password-input"
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="b2auth-pwd-toggle-btn"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                    >
                      <i className={`fa-regular ${showRegPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="b2auth-field-group">
                  <label className="b2auth-label">Confirm Password:</label>
                  <input
                    type="password"
                    className="b2auth-input"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Account Registration */}
                <button type="submit" className="b2auth-submit-btn">
                  Complete Registration & Login
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
