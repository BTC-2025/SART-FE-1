'use client';
import React, { useState } from 'react';
import './Footer.css';

export default function Footer({ onNavigate = (_route) => { } }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
    scrollToTop();
  };

  return (
    <footer className="sart-universal-footer">
      {/* Top Value Propositions Ribbon */}
      <div className="sart-footer-features-ribbon">
        <div className="sart-footer-features-container">
          {/* Logo badge in banner */}
          <div className="sart-feature-brand">
            <div className="sart-logo-wordmark">
              <span className="sart-logo-sart">SART</span>
            </div>
            <span className="sart-tagline"></span>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge green">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="sart-feature-text">
              <h4>Safe & Secure</h4>
              <p>Your safety is our priority</p>
            </div>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge teal">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="sart-feature-text">
              <h4>Real-time Tracking</h4>
              <p>Track your journey or shipment</p>
            </div>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge cyan">
              <i className="fa-solid fa-headset"></i>
            </div>
            <div className="sart-feature-text">
              <h4>24/7 Support</h4>
              <p>We're always here to help</p>
            </div>
          </div>

          <div className="sart-feature-item">
            <div className="sart-feature-icon-badge emerald">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <div className="sart-feature-text">
              <h4>Greener Tomorrow</h4>
              <p>Smarter travel, cleaner planet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="sart-footer-main">
        <div className="sart-footer-container">
          {/* Column 1: Brand & Bio */}
          <div className="sart-footer-col sart-footer-brand-col">
            <div className="sart-footer-logo-wrap">
              <div className="sart-logo-wordmark large">
                <span>SART</span>
              </div>
            </div>
            <h3 className="sart-brand-tagline">
              Your One Stop Solution for<br />
              Rides, Cargo, Rentals & More
            </h3>
            <p className="sart-brand-description">
              Book rides, send parcels, rent vehicles, hire drivers and explore more — all in one place. Fast, safe and reliable.
            </p>

            <div className="sart-social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="X / Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="sart-social-btn" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="sart-footer-col">
            <h4 className="sart-col-heading">Quick Links</h4>
            <ul className="sart-col-list">
              <li><button type="button" onClick={() => handleServiceClick('home')}>Home</button></li>
              <li><button type="button" onClick={() => handleServiceClick('profile')}>About Us</button></li>
              <li><button type="button" onClick={() => handleServiceClick('home')}>How It Works</button></li>
              <li><button type="button" onClick={() => handleServiceClick('profile')}>Safety & Trust</button></li>
              <li><button type="button" onClick={() => handleServiceClick('support')}>Help & Support</button></li>
              <li><button type="button" onClick={() => handleServiceClick('support')}>Contact Us</button></li>
              <li><button type="button" onClick={() => handleServiceClick('home')}>Blog</button></li>
              <li><button type="button" onClick={() => handleServiceClick('profile')}>Careers</button></li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="sart-footer-col">
            <h4 className="sart-col-heading">Our Services</h4>
            <ul className="sart-services-list">
              <li>
                <button type="button" onClick={() => handleServiceClick('ride')}>
                  <span className="sart-service-icon green"><i className="fa-solid fa-car-side"></i></span>
                  <span>Rides</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleServiceClick('carrier')}>
                  <span className="sart-service-icon orange"><i className="fa-solid fa-truck"></i></span>
                  <span>Cargo & Carrier</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleServiceClick('rental')}>
                  <span className="sart-service-icon blue"><i className="fa-solid fa-car"></i></span>
                  <span>Vehicle Rental</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleServiceClick('drivers')}>
                  <span className="sart-service-icon purple"><i className="fa-solid fa-user-tie"></i></span>
                  <span>Drivers Hire</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleServiceClick('parking')}>
                  <span className="sart-service-icon teal"><i className="fa-solid fa-square-parking"></i></span>
                  <span>Parking</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleServiceClick('store')}>
                  <span className="sart-service-icon amber"><i className="fa-solid fa-wrench"></i></span>
                  <span>Store & Mechanic</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleServiceClick('community')}>
                  <span className="sart-service-icon red"><i className="fa-solid fa-users"></i></span>
                  <span>Community</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Download Our App */}
          <div className="sart-footer-col">
            <h4 className="sart-col-heading">Download Our App</h4>
            <p className="sart-app-desc">Get the best experience on your mobile device.</p>

            <div className="sart-store-badges">
              {/* Google Play Store Badge */}
              <a href="#play-store" className="sart-store-button">
                <div className="sart-store-icon">
                  <i className="fa-brands fa-google-play"></i>
                </div>
                <div className="sart-store-text">
                  <span className="sart-store-sub">GET IT ON</span>
                  <span className="sart-store-title">Google Play</span>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a href="#app-store" className="sart-store-button">
                <div className="sart-store-icon">
                  <i className="fa-brands fa-apple"></i>
                </div>
                <div className="sart-store-text">
                  <span className="sart-store-sub">Download on the</span>
                  <span className="sart-store-title">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 5: Stay Updated */}
          <div className="sart-footer-col sart-newsletter-col">
            <h4 className="sart-col-heading">Stay Updated</h4>
            <p className="sart-newsletter-desc">Get the latest offers, updates and travel tips.</p>

            <form className="sart-newsletter-form" onSubmit={handleSubscribe}>
              <div className="sart-newsletter-input-box">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="sart-newsletter-submit-btn" aria-label="Subscribe">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
            {subscribed && (
              <span className="sart-newsletter-success">
                <i className="fa-solid fa-circle-check"></i> Subscribed successfully!
              </span>
            )}
          </div>
        </div>

        {/* Bottom copyright & legal bar */}
        <div className="sart-footer-bottom-bar">
          <div className="sart-footer-bottom-container">
            <p className="sart-copyright">
              © 2026 SART. All rights reserved.
            </p>

            <div className="sart-legal-links">
              <button type="button" onClick={() => handleServiceClick('profile')}>Terms & Conditions</button>
              <span className="sart-legal-separator">|</span>
              <button type="button" onClick={() => handleServiceClick('profile')}>Privacy Policy</button>
              <span className="sart-legal-separator">|</span>
              <button type="button" onClick={() => handleServiceClick('support')}>Refund Policy</button>
              <span className="sart-legal-separator">|</span>
              <button type="button" onClick={() => handleServiceClick('home')}>Sitemap</button>
            </div>

            <button type="button" className="sart-scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
