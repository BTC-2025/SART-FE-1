export interface TrainStopScheduleItem {
  station: string;
  code: string;
  arr: string;
  dep: string;
  delay?: string;
  halt: string;
  day: string;
  date: string;
  pf: string;
  distance: string;
  isHalt: boolean;
  isCurrentCrossed?: boolean;
}

export const TRAIN_12007_FULL_SCHEDULE: TrainStopScheduleItem[] = [
  // Major Stop 0: MAS (Starts)
  {
    station: 'PURATCHI THALAIVAR DR. MGR CTL',
    code: 'MAS',
    arr: 'Start',
    dep: '06:00',
    delay: 'RT',
    halt: 'Sch: -- Act: 0m',
    day: 'Day 1',
    date: '16 Nov 2026',
    pf: 'PF 2',
    distance: '0 kms',
    isHalt: true
  },
  // Non-stopping stations between MAS & KPD (39 intermediate stations)
  { station: 'Basin Bridge Jn', code: 'BBQ', arr: '--', dep: '06:01', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '2 kms', isHalt: false },
  { station: 'Vyasarpadi', code: 'VPY', arr: '--', dep: '06:02', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '3 kms', isHalt: false },
  { station: 'Vyasarpadi Jeeva', code: 'VJM', arr: '--', dep: '06:03', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '4 kms', isHalt: false },
  { station: 'Perambur', code: 'PER', arr: '--', dep: '06:04', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '6 kms', isHalt: false },
  { station: 'Perambur Carriage Works', code: 'PCW', arr: '--', dep: '06:04', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '6 kms', isHalt: false },
  { station: 'Perambur Locomotive Works', code: 'PEW', arr: '--', dep: '06:05', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '8 kms', isHalt: false },
  { station: 'Integral Coach Factory', code: 'XX-ICF', arr: '--', dep: '06:06', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '8 kms', isHalt: false },
  { station: 'Villivakkam', code: 'VLK', arr: '--', dep: '06:06', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '9 kms', isHalt: false },
  { station: 'Korattur', code: 'KOTR', arr: '--', dep: '06:08', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '12 kms', isHalt: false },
  { station: 'Pattaravakkam', code: 'PVM', arr: '--', dep: '06:10', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '14 kms', isHalt: false },
  { station: 'Ambattur', code: 'ABU', arr: '--', dep: '06:11', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '16 kms', isHalt: false },
  { station: 'Tirumullaivayil', code: 'TMVL', arr: '--', dep: '06:12', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '17 kms', isHalt: false },
  { station: 'Annanur', code: 'ANNR', arr: '--', dep: '06:12', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '18 kms', isHalt: false },
  { station: 'Avadi', code: 'AVD', arr: '--', dep: '06:14', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '21 kms', isHalt: false },
  { station: 'Hindu College', code: 'HC', arr: '--', dep: '06:16', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '24 kms', isHalt: false },
  { station: 'Pattabiram', code: 'PAB', arr: '--', dep: '06:17', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '25 kms', isHalt: false },
  { station: 'Nemilichery', code: 'NEC', arr: '--', dep: '06:18', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '27 kms', isHalt: false },
  { station: 'Tiruninravur', code: 'TI', arr: '--', dep: '06:20', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '29 kms', isHalt: false },
  { station: 'Veppampattu', code: 'VEU', arr: '--', dep: '06:22', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '32 kms', isHalt: false },
  { station: 'Sevvapet Road', code: 'SVR', arr: '--', dep: '06:24', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '36 kms', isHalt: false },
  { station: 'Putlur Halt', code: 'PTLR', arr: '--', dep: '06:26', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '39 kms', isHalt: false },
  { station: 'Tiruvallur', code: 'TRL', arr: '--', dep: '06:28', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '42 kms', isHalt: false },
  { station: 'Egattur Halt', code: 'EGT', arr: '--', dep: '06:30', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '45 kms', isHalt: false },
  { station: 'Kadambattur', code: 'KBT', arr: '--', dep: '06:32', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '47 kms', isHalt: false },
  { station: 'Senji Panambakkam', code: 'SPAM', arr: '--', dep: '06:34', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '50 kms', isHalt: false },
  { station: 'Manavur', code: 'MAF', arr: '--', dep: '06:37', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '54 kms', isHalt: false },
  { station: 'Tiruvalangadu', code: 'TO', arr: '--', dep: '06:40', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '58 kms', isHalt: false },
  { station: 'Mosur', code: 'MSU', arr: '--', dep: '06:43', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '64 kms', isHalt: false },
  { station: 'Puliyamangalam', code: 'PLMG', arr: '--', dep: '06:45', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '67 kms', isHalt: false },
  { station: 'Arakkonam Electric Loco Shed', code: 'AJLS', arr: '--', dep: '06:46', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '67 kms', isHalt: false },
  { station: 'Arakkonam Jn', code: 'AJJ', arr: '--', dep: '06:47', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '69 kms', isHalt: false },
  { station: 'Melpakkam Cabin', code: 'MLPM', arr: '--', dep: '06:48', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '71 kms', isHalt: false },
  { station: 'Chitteri', code: 'CTRE', arr: '--', dep: '06:52', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '76 kms', isHalt: false },
  { station: 'Anavardikhanpettai', code: 'AVN', arr: '--', dep: '06:55', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '80 kms', isHalt: false },
  { station: 'Mahendra Vadi', code: 'MDVE', arr: '--', dep: '06:59', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '87 kms', isHalt: false },
  { station: 'Sholinghur', code: 'SHU', arr: '--', dep: '07:01', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '90 kms', isHalt: false },
  { station: 'Thalangai', code: 'TUG', arr: '--', dep: '07:06', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '97 kms', isHalt: false },
  { station: 'Marudalam', code: 'MRLM', arr: '--', dep: '07:08', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '100 kms', isHalt: false },
  { station: 'Walajah Road Jn', code: 'WJR', arr: '--', dep: '07:11', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '105 kms', isHalt: false },
  { station: 'Mukundarayapuram', code: 'MCN', arr: '--', dep: '07:17', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '113 kms', isHalt: false },
  { station: 'Tiruvalam', code: 'THL', arr: '--', dep: '07:20', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '118 kms', isHalt: false },
  { station: 'Sevur', code: 'SVUR', arr: '--', dep: '07:24', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '124 kms', isHalt: false },

  // Major Stop 1: KPD
  {
    station: 'KATPADI JN',
    code: 'KPD',
    arr: '07:28 (07:36)',
    dep: '07:30 (07:38)',
    delay: '+8m',
    halt: 'Sch: 2m Act: 2m',
    day: 'Day 1',
    date: '16 Nov 2026',
    pf: 'PF 1',
    distance: '130 kms',
    isHalt: true
  },
  // Non-stopping stations between KPD & SBC (37 intermediate stations)
  { station: 'Latteri', code: 'LTI', arr: '--', dep: '07:36', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '137 kms', isHalt: false },
  { station: 'Virinchipuram', code: 'VJ', arr: '--', dep: '07:39', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '142 kms', isHalt: false },
  { station: 'Kavanur', code: 'KVN', arr: '--', dep: '07:45', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '148 kms', isHalt: false },
  { station: 'Gudiyattam', code: 'GYM', arr: '--', dep: '07:49', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '154 kms', isHalt: false },
  { station: 'Melalathur', code: 'MEH', arr: '--', dep: '07:53', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '159 kms', isHalt: false },
  { station: 'Valathoor', code: 'VLT', arr: '--', dep: '07:57', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '164 kms', isHalt: false },
  { station: 'Melpatti', code: 'MPI', arr: '--', dep: '08:02', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '170 kms', isHalt: false },
  { station: 'Pachchakuppam', code: 'PCKM', arr: '--', dep: '08:06', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '176 kms', isHalt: false },
  { station: 'Ambur', code: 'AB', arr: '--', dep: '08:11', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '182 kms', isHalt: false },
  { station: 'Vinnamangalam', code: 'VGM', arr: '--', dep: '08:17', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '190 kms', isHalt: false },
  { station: 'Vaniyambadi', code: 'VN', arr: '--', dep: '08:24', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '198 kms', isHalt: false },
  { station: 'Kettandapatti', code: 'KDY', arr: '--', dep: '08:31', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '207 kms', isHalt: false },
  { station: 'Jolarpettai Jn', code: 'JTJ', arr: '--', dep: '08:36', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '214 kms', isHalt: false },
  { station: 'Jolarpettai Bypass Cabin', code: 'XX-JTJB', arr: '--', dep: '08:39', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '218 kms', isHalt: false },
  { station: 'Somanayakkanpatti', code: 'SKPT', arr: '--', dep: '08:43', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '223 kms', isHalt: false },
  { station: 'Patchur', code: 'PU', arr: '--', dep: '08:50', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '231 kms', isHalt: false },
  { station: 'Mulanur', code: 'MAR', arr: '--', dep: '08:59', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '242 kms', isHalt: false },
  { station: 'Kuppam', code: 'KPN', arr: '--', dep: '09:08', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '255 kms', isHalt: false, isCurrentCrossed: true },
  { station: 'Gudupalli', code: 'GDP', arr: '--', dep: '09:16', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '265 kms', isHalt: false },
  { station: 'Bisanattam', code: 'BSM', arr: '--', dep: '09:20', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '270 kms', isHalt: false },
  { station: 'Kamasamudram', code: 'KSM', arr: '--', dep: '09:26', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '277 kms', isHalt: false },
  { station: 'Varadapura', code: 'VRDP', arr: '--', dep: '09:29', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '282 kms', isHalt: false },
  { station: 'Bangarapet Jn', code: 'BWT', arr: '--', dep: '09:35', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '289 kms', isHalt: false },
  { station: 'Maralahalli', code: 'MZV', arr: '--', dep: '09:40', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '295 kms', isHalt: false },
  { station: 'Tyakal', code: 'TCL', arr: '--', dep: '09:45', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '301 kms', isHalt: false },
  { station: 'Byatrayanhalli', code: 'BFW', arr: '--', dep: '09:48', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '306 kms', isHalt: false },
  { station: 'Malur', code: 'MLO', arr: '--', dep: '09:56', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '316 kms', isHalt: false },
  { station: 'Devangonthi', code: 'DKN', arr: '--', dep: '10:06', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '328 kms', isHalt: false },
  { station: 'Whitefield', code: 'WFD', arr: '--', dep: '10:12', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '336 kms', isHalt: false },
  { station: 'Whitefield Satellite Goods Terminal', code: 'SGWF', arr: '--', dep: '10:14', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '338 kms', isHalt: false },
  { station: 'Whitefield Panel Cabin', code: 'WHPC', arr: '--', dep: '10:15', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '340 kms', isHalt: false },
  { station: 'Hoodi Halt', code: 'HDIH', arr: '--', dep: '10:15', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '340 kms', isHalt: false },
  { station: 'Krishnarajapuram Diesel Loco Shed', code: 'KJM-DLS', arr: '--', dep: '10:18', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '343 kms', isHalt: false },
  { station: 'Krishnarajapuram', code: 'KJM', arr: '--', dep: '10:19', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '345 kms', isHalt: false },
  { station: 'Baiyyappanahalli Cabin', code: 'BPHI', arr: '--', dep: '10:21', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '347 kms', isHalt: false },
  { station: 'Baiyyappanahalli', code: 'BYPL', arr: '--', dep: '10:21', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '348 kms', isHalt: false },
  { station: 'Baiyyappanahalli West Cabin', code: 'BYPW', arr: '--', dep: '10:23', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '350 kms', isHalt: false },
  { station: 'Bengaluru East', code: 'BNCE', arr: '--', dep: '10:24', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '352 kms', isHalt: false },
  { station: 'Bengaluru Cantt', code: 'BNC', arr: '--', dep: '10:27', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '355 kms', isHalt: false },

  // Major Stop 2: SBC
  {
    station: 'KSR BENGALURU',
    code: 'SBC',
    arr: '10:30 (10:33)',
    dep: '10:35 (10:45)',
    delay: '+10m',
    halt: 'Sch: 5m Act: 12m',
    day: 'Day 1',
    date: '16 Nov 2026',
    pf: 'PF 7',
    distance: '362 kms',
    isHalt: true
  },
  // Non-stopping stations between SBC & MYS (24 intermediate stations)
  { station: 'Krishnadevaraya Halt', code: 'KNDV', arr: '--', dep: '10:40', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '364 kms', isHalt: false },
  { station: 'Nayandahalli', code: 'NYH', arr: '--', dep: '10:43', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '366 kms', isHalt: false },
  { station: 'Jnana Bharati Halt', code: 'GNB', arr: '--', dep: '10:44', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '368 kms', isHalt: false },
  { station: 'Kengeri', code: 'KGI', arr: '--', dep: '10:48', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '371 kms', isHalt: false },
  { station: 'Hejjala', code: 'HJL', arr: '--', dep: '10:59', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '382 kms', isHalt: false },
  { station: 'Bidadi', code: 'BID', arr: '--', dep: '11:06', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '389 kms', isHalt: false },
  { station: 'Ketohalli', code: 'KHLL', arr: '--', dep: '11:14', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '396 kms', isHalt: false },
  { station: 'Ramanagaram', code: 'RMGM', arr: '--', dep: '11:22', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '403 kms', isHalt: false },
  { station: 'Channapatna', code: 'CPT', arr: '--', dep: '11:34', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '415 kms', isHalt: false },
  { station: 'Settihalli', code: 'SET', arr: '--', dep: '11:41', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '422 kms', isHalt: false },
  { station: 'Nidaghatta Halt', code: 'NZH', arr: '--', dep: '11:47', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '428 kms', isHalt: false },
  { station: 'Maddur', code: 'MAD', arr: '--', dep: '11:53', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '433 kms', isHalt: false },
  { station: 'Hanakere', code: 'HNK', arr: '--', dep: '12:02', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '442 kms', isHalt: false },
  { station: 'Mandya', code: 'MYA', arr: '--', dep: '12:13', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '452 kms', isHalt: false },
  { station: 'Yeliyur', code: 'Y', arr: '--', dep: '12:21', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '460 kms', isHalt: false },
  { station: 'Byadarahalli', code: 'BDRL', arr: '--', dep: '12:31', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '469 kms', isHalt: false },
  { station: 'Chandagiri Koppal Halt', code: 'CGKR', arr: '--', dep: '12:36', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '474 kms', isHalt: false },
  { station: 'Pandavapura', code: 'PANP', arr: '--', dep: '12:40', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '478 kms', isHalt: false },
  { station: 'Cauvery North Point', code: 'CNP', arr: '--', dep: '12:44', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '482 kms', isHalt: false },
  { station: 'Shrirangapattana', code: 'S', arr: '--', dep: '12:45', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '482 kms', isHalt: false },
  { station: 'Paschima Vahini Point', code: 'PHVP', arr: '--', dep: '12:46', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '483 kms', isHalt: false },
  { station: 'Palahalli Halt', code: 'PLHL', arr: '--', dep: '12:48', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '485 kms', isHalt: false },
  { station: 'Naganahalli', code: 'NHY', arr: '--', dep: '12:52', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '489 kms', isHalt: false },
  { station: 'Mysore New Goods Terminal', code: 'MNGT', arr: '--', dep: '12:57', halt: '--', day: 'Day 1', date: '16 Nov 2026', pf: '--', distance: '494 kms', isHalt: false },

  // Major Stop 3: MYS
  {
    station: 'MYSURU JN',
    code: 'MYS',
    arr: '13:00 (12:45)',
    dep: 'End',
    delay: 'Early 15m',
    halt: 'Sch: -- Act: 1005m',
    day: 'Day 1',
    date: '16 Nov 2026',
    pf: 'PF 6',
    distance: '500 kms',
    isHalt: true
  }
];

