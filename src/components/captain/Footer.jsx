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

    </footer>
  );
}
