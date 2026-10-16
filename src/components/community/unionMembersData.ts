export interface PublicUnionMember {
  id: string;
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  fullAddress: string;
  addressType: 'Permanent' | 'Temporary' | 'Both';
  licenseNumber: string;
  issuingRto: string;
  issueDate: string;
  expiryDate: string;
  vehicleType: string;
  experienceYears: number;
  currentFleet: string;
  cleanRecord: boolean;
  unionName: string;
  badgeNumber: string;
  membershipPlan: string;
  membershipFee: number;
  registeredDate: string;
  status: 'Active' | 'On Trip' | 'Waiting in Stand' | 'Off Duty';
  currentLocation: string;
  assignedVehicle: string;
  photoUrl?: string;
}

export const INITIAL_UNION_MEMBERS: PublicUnionMember[] = [
  {
    id: 'MEM-ADWA-101',
    fullName: 'Rajesh Kumar Sharma',
    fatherName: 'Ram Avatar Sharma',
    dob: '1988-04-12',
    gender: 'Male',
    mobile: '9840199999',
    alternateMobile: '9840188888',
    email: 'rajesh.sharma@driverwelfare.org',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600003',
    fullAddress: 'Plot 18, Wall Tax Road, Near Central Railway Station, Park Town',
    addressType: 'Permanent',
    licenseNumber: 'TN-01-20100012345',
    issuingRto: 'Chennai Central (TN-01)',
    issueDate: '2010-06-15',
    expiryDate: '2030-06-14',
    vehicleType: 'Heavy Truck Driver (HGV / Trailer)',
    experienceYears: 14,
    currentFleet: 'All India Drivers Welfare Stand (Central Depot)',
    cleanRecord: true,
    unionName: 'Heavy Truckers Association',
    badgeNumber: 'ADWA-TN-8821',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '12-Oct-2026',
    status: 'Waiting in Stand',
    currentLocation: 'Chennai Central Goods Stand, Gate 2',
    assignedVehicle: 'TN-01-AB-1234 (Tata Multi-Axle 28T)'
  },
  {
    id: 'MEM-ADWA-102',
    fullName: 'Mohammad Farooq',
    fatherName: 'Abdul Rahim',
    dob: '1992-09-21',
    gender: 'Male',
    mobile: '9876543210',
    email: 'farooq.driver@gmail.com',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600107',
    fullAddress: 'No. 44, Flower Market Road, Koyambedu Wholesale Market',
    addressType: 'Permanent',
    licenseNumber: 'TN-02-20140098765',
    issuingRto: 'Chennai North West (TN-02)',
    issueDate: '2014-03-10',
    expiryDate: '2034-03-09',
    vehicleType: 'Mini-Truck / LCV / Tata Ace Driver',
    experienceYears: 10,
    currentFleet: 'Koyambedu Commercial Vehicle Stand',
    cleanRecord: true,
    unionName: 'Auto Stand Union',
    badgeNumber: 'ADWA-TN-4412',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '14-Oct-2026',
    status: 'On Trip',
    currentLocation: 'En route: Koyambedu → Sriperumbudur Industrial Corridor (KM 28)',
    assignedVehicle: 'TN-02-XY-9876 (Mahindra Bolero Maxi Truck)'
  },
  {
    id: 'MEM-ADWA-103',
    fullName: 'Siva Prakash Sundaram',
    fatherName: 'Sundaram Pillai',
    dob: '1995-11-05',
    gender: 'Male',
    mobile: '9443210987',
    alternateMobile: '9443210988',
    email: 'siva.prakash@sartstand.in',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    city: 'Sriperumbudur',
    pincode: '602105',
    fullAddress: 'Door 12, SIPCOT Industrial Park Phase 2, Mambakkam Road',
    addressType: 'Permanent',
    licenseNumber: 'TN-11-20160033211',
    issuingRto: 'Tambaram (TN-11)',
    issueDate: '2016-08-20',
    expiryDate: '2036-08-19',
    vehicleType: 'Container Truck / Refrigerated Cold Chain Driver',
    experienceYears: 8,
    currentFleet: 'Sriperumbudur Auto & LCV Stand Union',
    cleanRecord: true,
    unionName: 'City Taxi Drivers Union',
    badgeNumber: 'ADWA-TN-3091',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '15-Oct-2026',
    status: 'Active',
    currentLocation: 'Sriperumbudur Dispatch Bay 4 (Standby for Next Consignment)',
    assignedVehicle: 'TN-11-EF-7788 (Tata Ultra T.7 Reefer)'
  },
  {
    id: 'MEM-ADWA-104',
    fullName: 'Gurpreet Singh Gill',
    fatherName: 'Harbhajan Singh',
    dob: '1985-02-17',
    gender: 'Male',
    mobile: '9815012345',
    email: 'gurpreet.gill@nationalhaul.com',
    state: 'Punjab',
    district: 'Ludhiana',
    city: 'Ludhiana',
    pincode: '141003',
    fullAddress: 'G.T. Road, Near Transport Nagar Overbridge',
    addressType: 'Permanent',
    licenseNumber: 'PB-10-20050044123',
    issuingRto: 'Ludhiana RTO (PB-10)',
    issueDate: '2005-01-22',
    expiryDate: '2028-01-21',
    vehicleType: 'Trailer / Multi-Axle Heavy Articulated Specialist',
    experienceYears: 19,
    currentFleet: 'National Highway Drivers Welfare Union',
    cleanRecord: true,
    unionName: 'Heavy Truckers Association',
    badgeNumber: 'ADWA-PB-9910',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '08-Oct-2026',
    status: 'On Trip',
    currentLocation: 'NH44 North-South Corridor (KM 840, Near Nagpur Bypass)',
    assignedVehicle: 'PB-10-CZ-8821 (Ashok Leyland 4220 14-Wheeler)'
  },
  {
    id: 'MEM-ADWA-105',
    fullName: 'Anand Pandian',
    fatherName: 'Pandian Muthiah',
    dob: '1997-07-30',
    gender: 'Male',
    mobile: '9789012345',
    email: 'anand.pandian@adwa.org',
    state: 'Tamil Nadu',
    district: 'Madurai',
    city: 'Madurai',
    pincode: '625001',
    fullAddress: '15/2, Mattuthavani Integrated Bus Terminal Road',
    addressType: 'Both',
    licenseNumber: 'TN-58-20180055123',
    issuingRto: 'Madurai North (TN-58)',
    issueDate: '2018-09-12',
    expiryDate: '2038-09-11',
    vehicleType: 'Commercial Bus / Heavy Passenger Vehicle Driver',
    experienceYears: 6,
    currentFleet: 'Madurai Stand Welfare Association',
    cleanRecord: true,
    unionName: 'Private Bus Owners Club',
    badgeNumber: 'ADWA-TN-1144',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '16-Oct-2026',
    status: 'Waiting in Stand',
    currentLocation: 'Madurai Central Stand (Queue Rank #1)',
    assignedVehicle: 'TN-58-AB-9900 (Volvo B11R Multi-Axle)'
  },
  {
    id: 'MEM-ADWA-106',
    fullName: 'Kiran Deepu Gowda',
    fatherName: 'Deepu Gowda',
    dob: '1993-03-14',
    gender: 'Male',
    mobile: '9845098765',
    email: 'kiran.gowda@ka-drivers.in',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    pincode: '560058',
    fullAddress: '4th Cross, Peenya 3rd Phase Industrial Area',
    addressType: 'Permanent',
    licenseNumber: 'KA-04-20150077889',
    issuingRto: 'Bengaluru North (KA-04)',
    issueDate: '2015-05-18',
    expiryDate: '2035-05-17',
    vehicleType: 'Heavy Truck Driver (HGV / 10-Wheeler)',
    experienceYears: 9,
    currentFleet: 'Peenya Industrial Truckers Union',
    cleanRecord: true,
    unionName: 'Heavy Truckers Association',
    badgeNumber: 'ADWA-KA-5512',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '11-Oct-2026',
    status: 'On Trip',
    currentLocation: 'Electronic City Flyover Corridor (Speed: 52 km/h)',
    assignedVehicle: 'KA-04-E-4422 (Tata Prima 3530)'
  },
  {
    id: 'MEM-ADWA-107',
    fullName: 'Muthu Krishnan Raman',
    fatherName: 'Ramanathan Chettiar',
    dob: '1990-12-08',
    gender: 'Male',
    mobile: '9940123456',
    email: 'muthu.krishnan@sart.in',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    city: 'Coimbatore',
    pincode: '641018',
    fullAddress: 'Avanashi Road, Near Hope College Overbridge',
    addressType: 'Permanent',
    licenseNumber: 'TN-37-20120011998',
    issuingRto: 'Coimbatore South (TN-37)',
    issueDate: '2012-02-14',
    expiryDate: '2032-02-13',
    vehicleType: 'Industrial Heavy Equipment & Tipper Pilot',
    experienceYears: 12,
    currentFleet: 'Coimbatore Heavy Vehicle Welfare Trust',
    cleanRecord: true,
    unionName: 'Heavy Truckers Association',
    badgeNumber: 'ADWA-TN-9902',
    membershipPlan: 'ADWA Annual Membership + Digital Smart Card',
    membershipFee: 352.82,
    registeredDate: '13-Oct-2026',
    status: 'Waiting in Stand',
    currentLocation: 'Hope College Logistics Terminal (Standby)',
    assignedVehicle: 'TN-37-ZZ-7711 (BharatBenz 3528C Tipper)'
  }
];
