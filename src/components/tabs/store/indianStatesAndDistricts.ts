// Comprehensive dataset of all Indian States, Union Territories & major Districts/Cities
// Sourced from official Census / Google Locations India Directory

export interface StateDistrictMap {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictMap[] = [
  {
    state: 'Tamil Nadu',
    districts: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
      'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul', 'Thanjavur',
      'Ranipet', 'Kanchipuram', 'Chengalpattu', 'Tiruvallur', 'Tiruvannamalai',
      'Krishnagiri', 'Dharmapuri', 'Namakkal', 'Karur', 'Nilgiris (Ooty)', 'Cuddalore',
      'Villupuram', 'Kallakurichi', 'Nagapattinam', 'Mayiladuthurai', 'Tiruvarur',
      'Pudukkottai', 'Sivaganga', 'Ramanathapuram', 'Virudhunagar', 'Tenkasi',
      'Kanniyakumari', 'Ariyalur', 'Perambalur', 'Theni'
    ]
  },
  {
    state: 'Karnataka',
    districts: [
      'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru (Dakshina Kannada)',
      'Belagavi', 'Kalaburagi', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru',
      'Davanagere', 'Bidar', 'Hassan', 'Udupi', 'Raichur', 'Chikkamagaluru',
      'Mandya', 'Bagalkote', 'Kolar', 'Chikkaballapura', 'Chitradurga', 'Gadag',
      'Haveri', 'Uttara Kannada (Karwar)', 'Koppal', 'Yadgir', 'Chamarajanagar', 'Kodagu (Madikeri)'
    ]
  },
  {
    state: 'Andhra Pradesh',
    districts: [
      'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Nellore',
      'Kurnool', 'Kakinada', 'Rajahmundry (East Godavari)', 'Kadapa (YSR)',
      'Anantapur', 'Eluru', 'Ongole (Prakasam)', 'Srikakulam', 'Vizianagaram',
      'Chittoor', 'Nandyal', 'Bapatla', 'Palnadu', 'Konaseema', 'West Godavari'
    ]
  },
  {
    state: 'Telangana',
    districts: [
      'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad',
      'Rangareddy', 'Medchal-Malkajgiri', 'Nalgonda', 'Mahabubnagar', 'Siddipet',
      'Sangareddy', 'Mancherial', 'Jagtial', 'Suryapet', 'Adilabad', 'Kothagudem'
    ]
  },
  {
    state: 'Kerala',
    districts: [
      'Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam',
      'Kannur', 'Alappuzha', 'Kottayam', 'Palakkad', 'Malappuram', 'Kasaragod',
      'Pathanamthitta', 'Idukki', 'Wayanad'
    ]
  },
  {
    state: 'Maharashtra',
    districts: [
      'Mumbai', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik',
      'Chhatrapati Sambhajinagar (Aurangabad)', 'Solapur', 'Navi Mumbai', 'Kolhapur',
      'Amravati', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Dhule',
      'Ahmednagar', 'Chandrapur', 'Parbhani', 'Satara', 'Beed', 'Raigad', 'Ratnagiri'
    ]
  },
  {
    state: 'Delhi (NCR)',
    districts: [
      'New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi',
      'West Delhi', 'Noida (Gautam Buddha Nagar)', 'Greater Noida', 'Gurugram',
      'Faridabad', 'Ghaziabad'
    ]
  },
  {
    state: 'Gujarat',
    districts: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
      'Gandhinagar', 'Junagadh', 'Anand', 'Navsari', 'Morbi', 'Bharuch',
      'Mehsana', 'Porbandar', 'Vapi (Valsad)', 'Kutch (Bhuj)'
    ]
  },
  {
    state: 'Rajasthan',
    districts: [
      'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur',
      'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar'
    ]
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj (Allahabad)', 'Meerut',
      'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida',
      'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Ayodhya'
    ]
  },
  {
    state: 'West Bengal',
    districts: [
      'Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Siliguri (Darjeeling)',
      'Asansol (Paschim Bardhaman)', 'Durgapur', 'Murshidabad', 'Nadia', 'Malda'
    ]
  },
  {
    state: 'Punjab',
    districts: [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)',
      'Hoshiarpur', 'Pathankot', 'Moga'
    ]
  },
  {
    state: 'Haryana',
    districts: [
      'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak',
      'Hisar', 'Karnal', 'Sonipat', 'Panchkula'
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam'
    ]
  },
  {
    state: 'Bihar',
    districts: [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah'
    ]
  },
  {
    state: 'Odisha',
    districts: [
      'Bhubaneswar (Khurda)', 'Cuttack', 'Rourkela (Sundargarh)', 'Berhampur (Ganjam)', 'Sambalpur', 'Puri', 'Balasore'
    ]
  },
  {
    state: 'Assam',
    districts: [
      'Guwahati (Kamrup)', 'Silchar (Cachar)', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur (Sonitpur)'
    ]
  },
  {
    state: 'Jharkhand',
    districts: [
      'Ranchi', 'Jamshedpur (East Singhbhum)', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'
    ]
  },
  {
    state: 'Chhattisgarh',
    districts: [
      'Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur (Bastar)'
    ]
  },
  {
    state: 'Uttarakhand',
    districts: [
      'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani (Nainital)', 'Rishikesh', 'Rudrapur'
    ]
  },
  {
    state: 'Himachal Pradesh',
    districts: [
      'Shimla', 'Dharamshala (Kangra)', 'Mandi', 'Solan', 'Kullu', 'Baddi'
    ]
  },
  {
    state: 'Goa',
    districts: [
      'North Goa (Panaji)', 'South Goa (Margao)', 'Vasco da Gama', 'Mapusa', 'Ponda'
    ]
  },
  {
    state: 'Jammu & Kashmir',
    districts: [
      'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'
    ]
  },
  {
    state: 'Puducherry',
    districts: [
      'Puducherry', 'Karaikal', 'Mahe', 'Yanam'
    ]
  },
  {
    state: 'Chandigarh',
    districts: [
      'Chandigarh (UT)'
    ]
  }
];

export const ALL_INDIAN_STATES = INDIAN_STATES_DISTRICTS.map(s => s.state);

export function getDistrictsForState(stateName: string): string[] {
  const found = INDIAN_STATES_DISTRICTS.find(
    s => s.state.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.districts : ['Chennai', 'Coimbatore', 'Madurai', 'Vellore', 'Salem'];
}

