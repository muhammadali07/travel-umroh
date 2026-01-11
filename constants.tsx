
import React from 'react';
import { TravelPackage, RoadmapStep, Prayer } from './types';

export const ADMIN_WA_NUMBER = "6281553335534";

export const PRAYERS: Prayer[] = [
  {
    id: '1',
    category: 'Umum',
    title: 'Niat Umroh',
    arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
    // Fixed: Escaped single quote to prevent syntax error
    latin: 'Labbaykallahumma \'umratan',
    translation: 'Aku datang memenuhi panggilan-Mu ya Allah untuk berumroh.'
  },
  {
    id: '2',
    category: 'Umum',
    title: 'Bacaan Talbiyah',
    arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيْكَ لَكَ',
    latin: 'Labbaykallahumma labbayk, labbayka laa syariika laka labbayk. Innal hamda wan ni\'mata laka wal mulk, laa syariika lak.',
    translation: 'Aku datang memenuhi panggilan-Mu ya Allah, aku datang memenuhi panggilan-Mu. Aku datang memenuhi panggilan-Mu, tiada sekutu bagi-Mu, aku datang memenuhi panggilan-Mu. Sesungguhnya segala puji, nikmat dan segenap kekuasaan adalah milik-Mu, tiada sekutu bagi-Mu.'
  },
  {
    id: '3',
    category: 'Umroh',
    title: 'Doa Masuk Masjidil Haram',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaftahlii abwaaba rahmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.'
  },
  {
    id: '4',
    category: 'Umroh',
    title: 'Doa Antara Rukun Yamani & Hajar Aswad',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbana aatina fiddunya hasanah wa fil akhirati hasanah wa qina adzaban naar.',
    translation: 'Wahai Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari azab neraka.'
  },
  {
    id: '5',
    category: 'Haji',
    title: 'Doa Wukuf (Singkat)',
    arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
    latin: 'Laa ilaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'ala kulli syai\'in qadiir.',
    translation: 'Tiada Tuhan selain Allah yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya segala kekuasaan dan bagi-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu.'
  }
];

export const UMROH_ROADMAP: RoadmapStep[] = [
  { title: "Persiapan & Manasik", description: "Pembekalan tata cara ibadah sesuai sunnah dan pengecekan dokumen.", icon: "📚" },
  { title: "Keberangkatan", description: "Pelepasan jamaah di bandara dan perjalanan menuju Jeddah/Madinah.", icon: "✈️" },
  { title: "Miqat & Ihram", description: "Niat umroh dan mengenakan pakaian ihram di titik yang ditentukan.", icon: "🕋" },
  { title: "Tawaf & Sa'i", description: "Mengelilingi Ka'bah 7 kali dan berlari kecil antara bukit Safa & Marwah.", icon: "🏃" },
  { title: "Tahallul", description: "Memotong rambut sebagai simbol berakhirnya rangkaian ibadah Umroh.", icon: "✂️" },
  { title: "Ziarah & City Tour", description: "Mengunjungi tempat bersejarah di Mekkah dan Madinah.", icon: "🕌" }
];

export const HAJI_ROADMAP: RoadmapStep[] = [
  { title: "Niat & Persiapan", description: "Pendaftaran, pelunasan, dan persiapan fisik/mental yang matang.", icon: "📝" },
  { title: "Wukuf di Arafah", description: "Puncak ibadah haji dengan berdiam diri dan berdoa di Padang Arafah.", icon: "☀️" },
  { title: "Muzdalifah", description: "Mabit (bermalam) dan mengambil batu kerikil untuk melempar jumrah.", icon: "🌙" },
  { title: "Lempar Jumrah", description: "Simbol perlawanan terhadap godaan setan di Mina.", icon: "☄️" },
  { title: "Tawaf Ifadah", description: "Tawaf wajib sebagai rukun haji setelah kembali dari Mina.", icon: "🕋" }
];

export const PACKAGES: TravelPackage[] = [
  {
    id: '1',
    title: 'Umroh Reguler Syawal',
    category: 'Umroh',
    price: 28500000,
    duration: '9 Days',
    hotelStar: 4,
    description: 'Perjalanan ibadah Umroh nyaman dengan hotel bintang 4 di Mekkah dan Madinah.',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '2',
    title: 'Umroh Plus Turki',
    category: 'Umroh',
    price: 36000000,
    duration: '12 Days',
    hotelStar: 5,
    description: 'Nikmati ibadah Umroh sekaligus tadabbur alam di keindahan sejarah Turki.',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Haji Furoda 2024',
    category: 'Haji',
    price: 250000000,
    duration: '25 Days',
    hotelStar: 5,
    description: 'Ibadah Haji tanpa antre dengan visa resmi Furoda dari Pemerintah Saudi.',
    image: 'https://images.unsplash.com/photo-1564767609342-620cb19b2357?q=80&w=800&auto=format&fit=crop',
    isPopular: true
  }
];

export const ICONS = {
  Moon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  ),
  Star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  ),
  Shield: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
  )
};
