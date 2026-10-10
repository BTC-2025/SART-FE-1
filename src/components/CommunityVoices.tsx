import React from 'react';
import './CommunityVoices.css';

const communityData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    title: 'Hear it from those who booked their first luxury ride',
    name: 'Priya from Chennai',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    title: 'Rajesh is all in on the seamless logistics platform',
    name: 'Rajesh from Bengaluru',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    title: 'Karthik has already made the switch. When are you getting your membership?',
    name: 'Karthik from Hyderabad',
  }
];

export default function CommunityVoices() {
  return (
    <div className="sart-community-wrapper">
      <div className="sart-community-header">
        <h2>Voices of our SART Community</h2>
        <p>From first rides to everyday logistics. SART Community shares their seamless journey.</p>
      </div>

      <div className="sart-community-grid">
        {communityData.map((item) => (
          <div key={item.id} className="sart-community-card">
            <div className="sart-community-img-wrapper">
              <img src={item.image} alt={item.name} />
              <div className="sart-community-play">
                <i className="fa-solid fa-play"></i>
              </div>
            </div>
            <div className="sart-community-content">
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
