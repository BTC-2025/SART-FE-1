'use client';

import React, { useState } from 'react';
import './CitySelectorModal.css';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOP_CITIES = [
  { name: 'Chennai', active: true },
  { name: 'Bangalore' },
  { name: 'Goa' },
  { name: 'Hyderabad' },
  { name: 'Kolkata' },
  { name: 'Mumbai' },
  { name: 'Pune' }
];

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ALL_CITIES_DICT: Record<string, string[]> = {
  'A': ['Abohar', 'Abu Road', 'Achampet', 'Acharapakkam', 'Addanki', 'Adilabad', 'Adipur', 'Adoni', 'Adoor', 'Agar', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmedgarh', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akbarpur'],
  'B': ['Badami', 'Baddi', 'Badlapur', 'Badrinath', 'Bagalkot', 'Baghpat', 'Bahadurgarh', 'Baharampur', 'Baheri', 'Bahraich', 'Bajpe', 'Bakhtiarpur', 'Balaghat', 'Balasore', 'Ballia', 'Bally', 'Balrampur', 'Banda', 'Bandikui', 'Bandi'],
  'C': ['Cachar', 'Calicut', 'Cambay', 'Canning', 'Canacona', 'Canning', 'Captainganj', 'Caranzalem', 'Chabua', 'Chaibasa', 'Chakradharpur', 'Chalisgaon', 'Chamba', 'Chamoli', 'Champawat', 'Chamrajnagar', 'Chandanagar', 'Chandigarh', 'Chandrapur'],
  'D': ['Dabhoi', 'Dabra', 'Dahanu', 'Dahod', 'Dalhousie', 'Dalkhola', 'Dalli Rajhara', 'Dalsinghsarai', 'Daltonganj', 'Daman', 'Damoh', 'Dandeli', 'Darbhanga', 'Darjeeling', 'Daryapur', 'Dasua', 'Datia', 'Daund', 'Dausa'],
  'E': ['Edappal', 'Edar', 'Edathala', 'Egra', 'Elamakkara', 'Elanthoor', 'Elayirampannai', 'Eluru', 'Emmiganur', 'Erattupetta', 'Eraviperoor', 'Ernakulam', 'Erode', 'Errum Manzil', 'Erumely', 'Etah', 'Etawah', 'Ettumanoor'],
  'F': ['Faizabad', 'Faizpur', 'Falaknuma', 'Falakata', 'Faridabad', 'Faridkot', 'Farrukhabad', 'Fatehabad', 'Fatehgarh Sahib', 'Fatehpur', 'Fazilka', 'Firozabad', 'Firozpur', 'Firozpur Cantt', 'Forbesganj'],
  'G': ['Gachibowli', 'Gadag', 'Gadarwara', 'Gadchiroli', 'Gadhinglaj', 'Gadwal', 'Gagret', 'Gajraula', 'Gajuwaka', 'Galiakot', 'Ganderbal', 'Gandhidham', 'Gandhinagar', 'Gangapur', 'Gangarampur', 'Gangavati', 'Gangtok', 'Gannavaram'],
  'H': ['Habra', 'Hagaribommanahalli', 'Hajo', 'Haldia', 'Haldwani', 'Haliyal', 'Halol', 'Hampi', 'Hansi', 'Hanumangarh', 'Hapur', 'Harda', 'Hardoi', 'Haridwar', 'Harihar', 'Hasanpur', 'Hassan', 'Hathras', 'Havelock'],
  'I': ['Ibrahimpatnam', 'Ichalkaranji', 'Idappadi', 'Idukki', 'Igatpuri', 'Ikkadu', 'Ilkal', 'Imphal', 'Indapur', 'Indi', 'Indiranagar', 'Indore', 'Indravati', 'Irinjalakuda', 'Islampur', 'Itanagar', 'Itarsi'],
  'J': ['Jabalpur', 'Jadugora', 'Jagalur', 'Jagatdal', 'Jagdalpur', 'Jagraon', 'Jagtial', 'Jaipur', 'Jaisalmer', 'Jajpur', 'Jalalabad', 'Jalandhar', 'Jalaun', 'Jalgaon', 'Jalna', 'Jalpaiguri', 'Jamalpur', 'Jamkhandi', 'Jammu'],
  'K': ['Kadapa', 'Kadi', 'Kadiri', 'Kadirur', 'Kagaznagar', 'Kailashahar', 'Kaithal', 'Kakinada', 'Kalady', 'Kalamassery', 'Kalamboli', 'Kalimpong', 'Kalka', 'Kallakurichi', 'Kalpetta', 'Kalyan', 'Kamakshyanagar', 'Kamareddy', 'Kanchipuram'],
  'L': ['Lachung', 'Ladwa', 'Lahar', 'Laharpur', 'Lakhimpur', 'Lakhisarai', 'Lakshadweep', 'Lalkuan', 'Lalitpur', 'Lalganj', 'Lalgudi', 'Latur', 'Leh', 'Lonavala', 'Lucknow', 'Ludhiana', 'Lumding', 'Lunawada'],
  'M': ['Macherla', 'Machilipatnam', 'Madanapalle', 'Madgaon', 'Madhubani', 'Madikeri', 'Madurai', 'Mahabaleshwar', 'Mahabubnagar', 'Mahad', 'Maharajganj', 'Mahasamund', 'Mahbubabad', 'Mahe', 'Mahoba', 'Mahuva', 'Maihar', 'Mainpuri', 'Malappuram', 'Mumbai'],
  'N': ['Nabadwip', 'Nabarangpur', 'Nabha', 'Nadia', 'Nadiad', 'Nagaon', 'Nagapattinam', 'Nagaur', 'Nagda', 'Nagercoil', 'Nagpur', 'Nahan', 'Naharlagun', 'Naihati', 'Nainital', 'Najibabad', 'Nakodar', 'Nalbari', 'Nalgonda'],
  'O': ['Obra', 'Odalavarevu', 'Olandai', 'Olavakkode', 'Old Goa', 'Olpad', 'Omalur', 'Omerga', 'Omkareshwar', 'Ond', 'Ongole', 'Ooty', 'Orai', 'Orathanadu', 'Osmanabad', 'Ottapalam', 'Ozar'],
  'P': ['Pachmarhi', 'Padmanabhapuram', 'Padra', 'Padrauna', 'Pahalgam', 'Pakaur', 'Palakkad', 'Palampur', 'Palanpur', 'Palghar', 'Pali', 'Palwal', 'Panaji', 'Panchkula', 'Pandharpur', 'Panipat', 'Panna', 'Panvel', 'Pune'],
  'Q': ['Qadian', 'Qazigund', 'Quilandy', 'Quilon', 'Quthbullapur'],
  'R': ['Raebareli', 'Raichur', 'Raiganj', 'Raigarh', 'Raipur', 'Rajahmundry', 'Rajapalayam', 'Rajgarh', 'Rajkot', 'Rajnandgaon', 'Rajouri', 'Rajpura', 'Rajsamand', 'Ramagundam', 'Ramanagara', 'Ramanathapuram', 'Ramgarh', 'Rampur', 'Ranchi'],
  'S': ['Sabroom', 'Sadasivpet', 'Sagar', 'Saharanpur', 'Saharsa', 'Salem', 'Samastipur', 'Sambalpur', 'Sambhal', 'Sangareddy', 'Sangli', 'Sangrur', 'Satara', 'Satna', 'Secunderabad', 'Sehore', 'Seoni', 'Shahdol', 'Shahjahanpur'],
  'T': ['Tadepalligudem', 'Tadipatri', 'Tambaram', 'Tamluk', 'Tandur', 'Tarn Taran', 'Tezpur', 'Thalassery', 'Thane', 'Thanjavur', 'Theni', 'Thiruvananthapuram', 'Thoothukudi', 'Thrissur', 'Tindivanam', 'Tinsukia', 'Tiptur', 'Tiruchirappalli', 'Tirunelveli'],
  'U': ['Udaipur', 'Udgir', 'Udhagamandalam', 'Udhampur', 'Udupi', 'Ujjain', 'Ulhasnagar', 'Uluberia', 'Umaria', 'Una', 'Unjha', 'Unnao', 'Upleta', 'Uran', 'Uran Islampur', 'Uravakonda', 'Urmar Tanda', 'Usilampatti', 'Utraula'],
  'V': ['Vadakara', 'Vadalur', 'Vadipatti', 'Vadnagar', 'Vadodara', 'Vaikom', 'Valparai', 'Valsad', 'Vandavasi', 'Vaniyambadi', 'Vapi', 'Varanasi', 'Varkala', 'Vasai', 'Vasco Da Gama', 'Vellore', 'Vidisha', 'Vijayawada', 'Viluppuram'],
  'W': ['Wadgaon Road', 'Wadhwan', 'Wadi', 'Wai', 'Wanaparthy', 'Wani', 'Wankaner', 'Wara Seoni', 'Warangal', 'Wardha', 'Warhapur', 'Warisaliganj', 'Warora', 'Warud', 'Washim', 'Wayanad', 'Wokha'],
  'X': ['Xeldem', 'Xerxes (Historical site)'],
  'Y': ['Yadgir', 'Yamunanagar', 'Yanam', 'Yavatmal', 'Yawal', 'Yellandu', 'Yemmiganur', 'Yerraguntla', 'Yevla'],
  'Z': ['Zahirabad', 'Zaidpur', 'Zamania', 'Zira', 'Zirakpur', 'Zunheboto']
};

export default function CitySelectorModal({ isOpen, onClose }: CitySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlphabet, setSelectedAlphabet] = useState('A');

  if (!isOpen) return null;

  const handleCitySelect = (cityName: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('updateLocation', { detail: cityName }));
    }
    onClose();
  };

  const visibleCities = ALL_CITIES_DICT[selectedAlphabet] || [];

  return (
    <div className="sart-modal-backdrop" style={{ display: 'flex', zIndex: 1000 }} onClick={onClose}>
      <div className="new-city-modal" onClick={e => e.stopPropagation()}>

        {/* Header Section */}
        <div className="new-city-header">
          <h2 className="new-city-title">Select Location</h2>
          <button className="new-city-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="new-city-body">

          <div className="new-city-search">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search city, area or locality"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="use-current-location" onClick={() => {
            alert('GPS Location requested');
            onClose();
          }}>
            <i className="fa-solid fa-location-crosshairs"></i>
            <span>Use Current Location</span>
          </div>

          <div className="new-cities-grid">
            {TOP_CITIES.map((city) => (
              <div key={city.name} className={`new-city-card ${city.active ? 'active' : ''}`} onClick={() => handleCitySelect(city.name)}>
                <i className="fa-solid fa-location-dot city-pin"></i>
                <span className="city-name">{city.name}</span>
              </div>
            ))}
          </div>

          <h3 className="all-cities-title">All Cities</h3>

          <div className="alphabet-row">
            {ALPHABETS.map((letter) => (
              <span
                key={letter}
                className={`alphabet-letter ${selectedAlphabet === letter ? 'active' : ''}`}
                onClick={() => setSelectedAlphabet(letter)}
              >
                {letter}
              </span>
            ))}
          </div>

          {visibleCities.length > 0 && (
            <div className="alphabet-cities-container" style={{ marginTop: '20px' }}>
              <h4 style={{ color: '#4b5563', marginBottom: '15px' }}>{selectedAlphabet}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {visibleCities.map((city, index) => (
                  <div key={`${city}-${index}`} onClick={() => handleCitySelect(city)} style={{ cursor: 'pointer', color: '#4b5563', fontSize: '14px', padding: '5px 0' }} className="alphabet-city-item">
                    {city}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
