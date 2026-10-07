'use client';

import React from 'react';

export default function NewsFeed() {
  return (
    <div className="home-map-wrapper">
      <div className="home-map-title-row">
        <h2>Latest Transit Ecosystem News</h2>
        <span className="action-link" onClick={() => alert('Auto News RSS Feed connected.')}>See All Feed</span>
      </div>
      <div className="dashboard-card" id="news-section-div" style={{ height: '400px', margin: 0, overflowY: 'auto' }}>
        <div className="web-news-row" id="news-cards-container">
          {/* Loaded dynamically via JS for now */}
        </div>
      </div>
    </div>
  );
}
