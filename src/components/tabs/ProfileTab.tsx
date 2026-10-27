'use client';
import React, { useEffect, useState } from 'react';
import './ProfileTab.css'; 
import { useSartStore } from '@/store/useSartStore';

export default function ProfileTab() {
  const { activeTab } = useSartStore();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('privacy');
  const [safetyCheckDone, setSafetyCheckDone] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [sosAlerts, setSosAlerts] = useState(true);
  const [cookiesAllowed, setCookiesAllowed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!mounted) return null;

  const navItems = [
    { id: 'privacy', label: 'Privacy & Security', icon: 'fa-shield-halved', badge: 'Recommended' },
    { id: 'autofill', label: 'Autofill & Passwords', icon: 'fa-key' },
    { id: 'rides', label: 'Ride & Safety Preferences', icon: 'fa-car' },
    { id: 'payments', label: 'Linked Payments & Wallets', icon: 'fa-credit-card' },
    { id: 'documents', label: 'Documents & DigiLocker', icon: 'fa-folder-open' },
    { id: 'appearance', label: 'Appearance & Theme', icon: 'fa-palette' },
    { id: 'languages', label: 'Languages & Localization', icon: 'fa-language' },
    { id: 'accessibility', label: 'Accessibility & Display', icon: 'fa-universal-access' },
    { id: 'performance', label: 'Performance & Data Saver', icon: 'fa-gauge-high' },
    { id: 'system', label: 'System & Legal Policy', icon: 'fa-gear' },
    { id: 'reset', label: 'Reset Settings & Cache', icon: 'fa-arrow-rotate-left' }
  ];

  return (
    <section className={`tab-screen ${activeTab === 'profile' ? 'active' : ''}`} id="tab-profile">
      <div className="settings-page-wrapper">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="settings-toast-notice">
            <i className="fa-solid fa-circle-check"></i>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top User Header Bar */}
        <div className="settings-top-user-banner">
          <div className="settings-banner-left">
            <div className="settings-avatar-wrap">
              <span>AC</span>
              <span className="settings-avatar-online"></span>
            </div>
            <div className="settings-user-info">
              <div className="settings-user-name-line">
                <h2>Alex Carter</h2>
                <span className="settings-elite-badge"><i className="fa-solid fa-crown"></i> SART TEAL ELITE</span>
              </div>
              <p>alex.carter@sart.com • +91 98765 43210</p>
            </div>
          </div>
          <div className="settings-banner-stats">
            <div className="settings-mini-stat">
              <span className="stat-value">142</span>
              <span className="stat-label">Total Trips</span>
            </div>
            <div className="settings-mini-stat">
              <span className="stat-value">₹15,000.00</span>
              <span className="stat-label">Wallet Balance</span>
            </div>
            <div className="settings-mini-stat">
              <span className="stat-value">85%</span>
              <span className="stat-label">Trust Score</span>
            </div>
          </div>
        </div>

        {/* Main Settings Split View (Chrome/SaaS layout matching image) */}
        <div className="settings-browser-layout">
          
          {/* Left Sidebar Navigation */}
          <aside className="settings-sidebar">
            <div className="settings-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="search-clear-btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <nav className="settings-nav-list">
              {navItems
                .filter(item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`settings-nav-item ${activeCategory === item.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(item.id)}
                  >
                    <i className={`fa-solid ${item.icon} settings-nav-icon`}></i>
                    <span className="settings-nav-label">{item.label}</span>
                    {item.badge && <span className="settings-nav-badge">{item.badge}</span>}
                  </button>
                ))}
            </nav>
          </aside>

          {/* Right Content Panel */}
          <main className="settings-main-panel">

            {/* TAB: Privacy & Security (Matches the user's provided UI) */}
            {activeCategory === 'privacy' && (
              <div className="settings-section-container">
                
                {/* 1. Privacy Guide Hero Card */}
                <div className="settings-guide-card">
                  <div className="guide-card-content">
                    <h3>Take the SART Privacy &amp; Security Guide</h3>
                    <p>Review key passenger privacy controls, travel protection shields &amp; encryption for your SART account.</p>
                    <div className="guide-card-actions">
                      <button 
                        type="button" 
                        className="btn-guide-start"
                        onClick={() => showToast('Privacy Guide launched. All permissions are secured.')}
                      >
                        Get started
                      </button>
                      <button 
                        type="button" 
                        className="btn-guide-dismiss"
                        onClick={() => showToast('Notice dismissed')}
                      >
                        No thanks
                      </button>
                    </div>
                  </div>
                  <div className="guide-card-graphic">
                    <div className="guide-shield-illustration">
                      <i className="fa-solid fa-shield-halved shield-base-icon"></i>
                      <i className="fa-solid fa-check shield-check-icon"></i>
                    </div>
                  </div>
                </div>

                {/* 2. Safety Check Banner */}
                <div className="settings-block-heading">Safety Check</div>
                <div className="settings-safety-card">
                  <div className="safety-left">
                    <div className="safety-icon-box">
                      <i className="fa-solid fa-shield-cat"></i>
                    </div>
                    <div className="safety-text">
                      <h4>{safetyCheckDone ? 'All Safety & Security checks are verified' : 'SART found some safety recommendations for your review'}</h4>
                      <p>{safetyCheckDone ? 'No security breaches or exposed passwords found.' : 'Passwords, 2-Factor authentication and live trip emergency relays.'}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-safety-action"
                    onClick={() => {
                      setSafetyCheckDone(true);
                      showToast('Safety Check complete! All systems secure.');
                    }}
                  >
                    {safetyCheckDone ? 'Review Again' : 'Go to Safety Check'}
                  </button>
                </div>

                {/* 3. Settings Group: Privacy & Security Items */}
                <div className="settings-block-heading">Privacy and security</div>
                <div className="settings-group-card">

                  <div className="settings-row-item" onClick={() => showToast('Cached route history & search data cleared!')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-trash-can"></i></div>
                      <div className="settings-row-info">
                        <h4>Delete browsing data</h4>
                        <p>Delete trip search history, cache, saved destinations, and session cookies</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Opening Privacy Guide overview...')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-sliders"></i></div>
                      <div className="settings-row-info">
                        <h4>Privacy Guide</h4>
                        <p>Review key travel data privacy, location sharing &amp; analytics controls</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                  <div className="settings-row-item" onClick={() => { setCookiesAllowed(!cookiesAllowed); showToast(cookiesAllowed ? 'Third-party cookies blocked.' : 'Third-party cookies allowed.'); }}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-cookie-bite"></i></div>
                      <div className="settings-row-info">
                        <h4>Third-party cookies</h4>
                        <p>{cookiesAllowed ? 'Third-party cookies are allowed for live flight & rail APIs' : 'Strict blocking enabled — some live tracking widgets may require sign-in'}</p>
                      </div>
                    </div>
                    <label className="settings-switch" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={cookiesAllowed} 
                        onChange={(e) => setCookiesAllowed(e.target.checked)} 
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Security protocols are active with 256-bit AES SSL.')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-lock"></i></div>
                      <div className="settings-row-info">
                        <h4>Security</h4>
                        <p>Safe Browsing (protection from malicious phishing payment gateways) and TLS 1.3</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Managing site permissions...')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-gear"></i></div>
                      <div className="settings-row-info">
                        <h4>Site settings &amp; Device permissions</h4>
                        <p>Controls GPS location, camera for document scanning, microphone &amp; notifications</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: Autofill & Passwords */}
            {activeCategory === 'autofill' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Autofill and passwords</div>
                <div className="settings-group-card">
                  <div className="settings-row-item" onClick={() => showToast('Password Manager: 3 credentials saved safely.')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-key"></i></div>
                      <div className="settings-row-info">
                        <h4>SART Password Manager</h4>
                        <p>Saved passwords for IRCTC, Airline loyalty clubs &amp; SART Fleet portal</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Primary Card: Visa Ending in 4242')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-credit-card"></i></div>
                      <div className="settings-row-info">
                        <h4>Payment methods &amp; UPI handles</h4>
                        <p>Save and fill payment cards &amp; UPI IDs for one-click express booking</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Address: H-402, Cyber Heights, Hyderabad')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-location-dot"></i></div>
                      <div className="settings-row-info">
                        <h4>Saved Addresses &amp; Hubs</h4>
                        <p>Saved home, office, and frequent delivery pickup/drop locations</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Ride & Safety Preferences */}
            {activeCategory === 'rides' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Ride Safety &amp; Protection</div>
                <div className="settings-group-card">
                  <div className="settings-row-item">
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-person-shelter"></i></div>
                      <div className="settings-row-info">
                        <h4>Women &amp; Senior Citizen Protection Shield</h4>
                        <p>Prioritize top-rated verified 5-star drivers and enable route audio monitor</p>
                      </div>
                    </div>
                    <label className="settings-switch">
                      <input 
                        type="checkbox" 
                        checked={sosAlerts} 
                        onChange={(e) => { setSosAlerts(e.target.checked); showToast('Protection preference updated'); }} 
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  <div className="settings-row-item">
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-satellite-dish"></i></div>
                      <div className="settings-row-info">
                        <h4>Live GPS Location Sharing with Trusted Contacts</h4>
                        <p>Automatically SMS live route URL to emergency contacts when trip starts</p>
                      </div>
                    </div>
                    <label className="settings-switch">
                      <input 
                        type="checkbox" 
                        checked={locationSharing} 
                        onChange={(e) => { setLocationSharing(e.target.checked); showToast('Location sharing updated'); }} 
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('SOS Contacts: +91 98765 00000')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-phone-volume"></i></div>
                      <div className="settings-row-info">
                        <h4>Emergency Contacts List</h4>
                        <p>Configure family contacts, local police dispatch &amp; SART 24x7 control room</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Linked Payments */}
            {activeCategory === 'payments' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Linked Payments &amp; Wallets</div>
                <div className="settings-group-card">
                  <div className="settings-row-item" onClick={() => showToast('Balance: ₹15,000.00')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-wallet"></i></div>
                      <div className="settings-row-info">
                        <h4>SART Cash Wallet</h4>
                        <p>Current balance: ₹15,000.00 • Auto-recharge enabled below ₹500</p>
                      </div>
                    </div>
                    <span className="settings-badge-green">Active</span>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Opening Bank accounts list...')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-building-columns"></i></div>
                      <div className="settings-row-info">
                        <h4>Bank Accounts &amp; UPI Mandates</h4>
                        <p>HDFC Bank (A/C ...8821), Google Pay UPI (alex@oksbi)</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Documents & DigiLocker */}
            {activeCategory === 'documents' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Documents &amp; DigiLocker Verification</div>
                <div className="settings-group-card">
                  <div className="settings-row-item">
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-id-card"></i></div>
                      <div className="settings-row-info">
                        <h4>Driving License (DL)</h4>
                        <p>DL No: DL-042011002345 • Verified with Govt. Parivahan portal</p>
                      </div>
                    </div>
                    <span className="settings-badge-green"><i className="fa-solid fa-circle-check"></i> Verified</span>
                  </div>

                  <div className="settings-row-item">
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-file-shield"></i></div>
                      <div className="settings-row-info">
                        <h4>Aadhaar DigiLocker e-KYC</h4>
                        <p>Aadhaar verified via OTP • Required for intercity self-drive rentals</p>
                      </div>
                    </div>
                    <span className="settings-badge-green"><i className="fa-solid fa-circle-check"></i> Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Appearance */}
            {activeCategory === 'appearance' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Appearance &amp; Theme</div>
                <div className="settings-group-card">
                  <div className="settings-theme-selector">
                    <div 
                      className="theme-card-option" 
                      onClick={() => {
                        document.body.classList.remove('light-theme');
                        localStorage.setItem('sart-theme', 'dark');
                        showToast('Dark theme activated');
                      }}
                    >
                      <div className="theme-preview-box dark-preview">
                        <div className="preview-nav"></div>
                        <div className="preview-card"></div>
                      </div>
                      <span className="theme-opt-label">Dark Theme (Default)</span>
                    </div>

                    <div 
                      className="theme-card-option"
                      onClick={() => {
                        document.body.classList.add('light-theme');
                        localStorage.setItem('sart-theme', 'light');
                        showToast('Light theme activated');
                      }}
                    >
                      <div className="theme-preview-box light-preview">
                        <div className="preview-nav"></div>
                        <div className="preview-card"></div>
                      </div>
                      <span className="theme-opt-label">Light Theme</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Languages & Localization */}
            {activeCategory === 'languages' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Languages &amp; Localization</div>
                <div className="settings-group-card">
                  <div className="settings-row-item" onClick={() => showToast('Language set to English (United Kingdom)')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-globe"></i></div>
                      <div className="settings-row-info">
                        <h4>Preferred Language</h4>
                        <p>English (United Kingdom) • Used across trip receipts and notifications</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Currency set to INR (₹)')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-indian-rupee-sign"></i></div>
                      <div className="settings-row-info">
                        <h4>Currency &amp; Region</h4>
                        <p>Indian Rupee (INR ₹) • India (GMT+05:30)</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Accessibility */}
            {activeCategory === 'accessibility' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Accessibility &amp; Display</div>
                <div className="settings-group-card">
                  <div className="settings-row-item">
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-font"></i></div>
                      <div className="settings-row-info">
                        <h4>High-Contrast Font Rendering</h4>
                        <p>Increases UI contrast for easy reading during bright sunny daylight travel</p>
                      </div>
                    </div>
                    <label className="settings-switch">
                      <input type="checkbox" defaultChecked onChange={() => showToast('Contrast setting saved')} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Performance */}
            {activeCategory === 'performance' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Performance &amp; Data Saver</div>
                <div className="settings-group-card">
                  <div className="settings-row-item">
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-bolt"></i></div>
                      <div className="settings-row-info">
                        <h4>Low-Data Live Map Tracking</h4>
                        <p>Optimizes tile caching to save mobile data while live tracking buses &amp; trains</p>
                      </div>
                    </div>
                    <label className="settings-switch">
                      <input type="checkbox" defaultChecked onChange={() => showToast('Data saver enabled')} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: System & Legal */}
            {activeCategory === 'system' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">About SART &amp; System Info</div>
                <div className="settings-group-card">
                  <div className="settings-row-item" onClick={() => showToast('SART Web Platform v2.4.0-Beta (Turbopack Engine)')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-circle-info"></i></div>
                      <div className="settings-row-info">
                        <h4>Universal SART Platform</h4>
                        <p>Version 2.4.0-Beta • Integrated Urban Multi-Modal Transport System</p>
                      </div>
                    </div>
                    <span className="settings-badge-gray">v2.4.0</span>
                  </div>

                  <div className="settings-row-item" onClick={() => showToast('Opening Privacy Policy')}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon"><i className="fa-solid fa-file-contract"></i></div>
                      <div className="settings-row-info">
                        <h4>Terms of Service &amp; Privacy Policy</h4>
                        <p>Read passenger legal terms, driver union charters &amp; refund guidelines</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right settings-row-arrow"></i>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Reset Settings */}
            {activeCategory === 'reset' && (
              <div className="settings-section-container">
                <div className="settings-block-heading">Reset and Clean</div>
                <div className="settings-group-card">
                  <div className="settings-row-item" onClick={() => {
                    localStorage.removeItem('sart_web_state');
                    showToast('Settings restored to initial factory defaults!');
                  }}>
                    <div className="settings-row-left">
                      <div className="settings-row-icon icon-danger"><i className="fa-solid fa-rotate-left"></i></div>
                      <div className="settings-row-info">
                        <h4>Restore default settings</h4>
                        <p>Reset all custom preferences, view states and theme overrides</p>
                      </div>
                    </div>
                    <button type="button" className="btn-reset-danger">Reset</button>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </section>
  );
}
