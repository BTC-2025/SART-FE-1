'use client';

import React from 'react';
import { TrainItem } from '../trainData';

interface TrainRouteModalProps {
  train: TrainItem;
  onClose: () => void;
}

export default function TrainRouteModal({ train, onClose }: TrainRouteModalProps) {
  const serviceDays = (train.runningDays || 'M T W T F S S').split(' ');

  // Compute total distance or fallback
  const totalDistance = train.distance || '2684 kms';
  const totalStops = train.stops.length;
  const classesList = Array.from(new Set(train.classes.map(c => c.code))).join(', ') || '2A, 3A, 1A, 3E, SL';

  return (
    <div className="tb-route-modal-backdrop" onClick={onClose}>
      <div className="tb-route-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="tb-route-modal-header">
          <div>
            <h2 className="tb-route-modal-title">
              {train.number} {train.name.toUpperCase()}
            </h2>
          </div>
          <button className="tb-route-modal-close" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body: Left Timeline, Right Details */}
        <div className="tb-route-modal-body">
          {/* Left: Interactive Timeline */}
          <div className="tb-route-timeline-container">
            {/* Date pill above timeline */}
            <div className="tb-route-date-pill-wrapper">
              <span className="tb-route-date-pill">Sat, 14 Nov</span>
            </div>

            <div className="tb-route-timeline">
              {train.stops.map((stop, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === train.stops.length - 1;

                return (
                  <div key={idx} className="tb-route-stop-row">
                    {/* Vertical line and node */}
                    <div className="tb-route-track">
                      <div className={`tb-route-node ${isFirst ? 'start' : isLast ? 'end' : ''}`}></div>
                      {!isLast && <div className="tb-route-line"></div>}
                    </div>

                    {/* Stop Details Card */}
                    <div className="tb-route-stop-card">
                      <div className="tb-route-stop-top">
                        <div className="tb-route-station-meta">
                          <span className="tb-route-station-code">{stop.code}</span>
                          <span className="tb-route-station-name">{stop.station.toUpperCase()}</span>
                        </div>
                        <div className="tb-route-halt-info">
                          {isFirst ? (
                            <span className="tb-route-tag-pill">Train source • 0 km</span>
                          ) : isLast ? (
                            <span className="tb-route-tag-pill">Last station • {stop.distance || totalDistance}</span>
                          ) : (
                            <span className="tb-route-tag-pill">
                              {stop.halt.includes('halt') ? stop.halt : `${stop.halt} halt`} • {stop.distance || `${(idx + 1) * 35} km`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="tb-route-times-grid">
                        <div className="tb-route-time-col">
                          <span className="tb-route-label">Arrival</span>
                          <span className="tb-route-time-val">{stop.arr === '--' ? '—' : stop.arr}</span>
                        </div>
                        <div className="tb-route-time-col">
                          <span className="tb-route-label">Departure</span>
                          <span className="tb-route-time-val dep">{stop.dep === '--' ? '—' : stop.dep}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Train Details Grid */}
          <div className="tb-route-details-sidebar">
            <h3 className="tb-route-sidebar-title">Train details</h3>

            {/* Service days */}
            <div className="tb-route-detail-box">
              <span className="tb-route-box-label">Service days</span>
              <div className="tb-service-days-row">
                {serviceDays.map((d, i) => (
                  <span key={i} className="tb-service-day active">{d}</span>
                ))}
              </div>
            </div>

            {/* Train type */}
            <div className="tb-route-detail-box">
              <span className="tb-route-box-label">Train type</span>
              <span className="tb-route-box-val">{train.trainType || 'SUF'}</span>
            </div>

            {/* Classes available */}
            <div className="tb-route-detail-box">
              <span className="tb-route-box-label">Classes available</span>
              <span className="tb-route-box-val">{classesList}</span>
            </div>

            {/* Travel time */}
            <div className="tb-route-detail-box">
              <span className="tb-route-box-label">Travel time</span>
              <span className="tb-route-box-val">{train.duration}</span>
            </div>

            {/* Distance */}
            <div className="tb-route-detail-box">
              <span className="tb-route-box-label">Distance</span>
              <span className="tb-route-box-val">{train.distance || totalDistance}</span>
            </div>

            {/* Total stops */}
            <div className="tb-route-detail-box">
              <span className="tb-route-box-label">Total stops</span>
              <span className="tb-route-box-val">{totalStops}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

