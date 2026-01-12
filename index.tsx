
import './index.css';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Role, TravelPackage, Lead } from './types';
import { PACKAGES, ICONS } from './constants';
import { PackageCard } from './components/PackageCard';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginView } from './components/LoginView';
import { Roadmap } from './components/Roadmap';
import { PrayerGuide } from './components/PrayerGuide';
import { InfoHub } from './components/InfoHub';
import { StatusChecker } from './components/StatusChecker';
import { AIAssistant } from './components/AIAssistant';

const DUMMY_LEADS: Lead[] = [
  {
    id: '1',
    packageId: '1',
    packageName: 'Umroh Reguler Syawal',
    fullName: 'Ahmad Subarjo',
    whatsappNumber: '081234567890',
    numberOfPax: 2,
    hasPassport: 'YES',
    isFirstTime: true,
    roomPreference: 'DOUBLE',
    status: 'Completed',
    paymentStatus: 'PAID',
    amountPaid: 57000000,
    checkoutCode: 'ALB-K9X2P1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    packageId: '3',
    packageName: 'Haji Furoda 2024',
    fullName: 'Hj. Siti Aminah',
    whatsappNumber: '08567891234',
    numberOfPax: 1,
    hasPassport: 'YES',
    isFirstTime: false,
    roomPreference: 'QUAD',
    status: 'FollowedUp',
    paymentStatus: 'PARTIAL',
    amountPaid: 100000000,
    checkoutCode: 'ALB-M7Z8L3',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    packageId: '2',
    packageName: 'Umroh Plus Turki',
    fullName: 'Budi Hartono',
    whatsappNumber: '08771234567',
    numberOfPax: 4,
    hasPassport: 'NO',
    isFirstTime: true,
    roomPreference: 'QUAD',
    status: 'Pending',
    paymentStatus: 'UNPAID',
    amountPaid: 0,
    checkoutCode: 'ALB-R2W9Q4',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    packageId: '1',
    packageName: 'Umroh Reguler Syawal',
    fullName: 'Rina Kartika',
    whatsappNumber: '08111222333',
    numberOfPax: 3,
    hasPassport: 'YES',
    isFirstTime: false,
    roomPreference: 'TRIPLE',
    status: 'Completed',
    paymentStatus: 'PAID',
    amountPaid: 85500000,
    checkoutCode: 'ALB-T5Y8U2',
    adminNotes: 'Sudah berangkat tanggal 10 Syawal',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    packageId: '2',
    packageName: 'Umroh Plus Turki',
    fullName: 'Dr. Rahman Hakim',
    whatsappNumber: '08122334455',
    numberOfPax: 2,
    hasPassport: 'EXPIRED',
    isFirstTime: true,
    roomPreference: 'DOUBLE',
    healthNotes: 'Alergi makanan laut',
    status: 'FollowedUp',
    paymentStatus: 'PARTIAL',
    amountPaid: 72000000,
    checkoutCode: 'ALB-F4H7J1',
    adminNotes: 'Perlu perpanjangan passport',
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
];

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('JAMAAH');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [recentNotification, setRecentNotification] = useState<{name: string, package: string} | null>(null);

  useEffect(() => {
    try {
      const savedLeads = localStorage.getItem('albarkah_leads');

      if (savedLeads) {
        const parsedLeads = JSON.parse(savedLeads);

        // Check if leads have payment fields, if not reset with new data
        const hasPaymentData = parsedLeads.length > 0 &&
          parsedLeads[0].hasOwnProperty('paymentStatus') &&
          parsedLeads[0].hasOwnProperty('amountPaid');

        if (hasPaymentData) {
          setLeads(parsedLeads);
        } else {
          // Old data format, reset with new dummy data
          console.log('Resetting lead data with payment information...');
          setLeads(DUMMY_LEADS);
          localStorage.setItem('albarkah_leads', JSON.stringify(DUMMY_LEADS));
        }
      } else {
        // No data exists, use dummy data
        setLeads(DUMMY_LEADS);
        localStorage.setItem('albarkah_leads', JSON.stringify(DUMMY_LEADS));
      }

      if (localStorage.getItem('albarkah_auth') === 'true') {
        setIsLoggedIn(true);
        setRole('ADMIN');
      }
    } catch (e) {
      console.error(e);
      // Fallback to dummy data on error
      setLeads(DUMMY_LEADS);
      localStorage.setItem('albarkah_leads', JSON.stringify(DUMMY_LEADS));
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      ['home', 'packages', 'doa', 'status'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 250 && el.getBoundingClientRect().bottom >= 250) setActiveSection(id);
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Social Proof Logic
    const notificationInterval = setInterval(() => {
      const names = ['Hj. Fatimah', 'Bpk. Ridwan', 'Ibu Sarah', 'Ust. Mansyur', 'H. Junaidi'];
      const pkgs = ['Umroh Ramadhan', 'Haji Furoda', 'Umroh Syawal'];
      setRecentNotification({ 
        name: names[Math.floor(Math.random() * names.length)], 
        package: pkgs[Math.floor(Math.random() * pkgs.length)] 
      });
      setTimeout(() => setRecentNotification(null), 5000);
    }, 20000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(notificationInterval);
    };
  }, []);

  const handleLeadSubmission = (leadData: any) => {
    const fullLead = { ...leadData, id: Math.random().toString(36).substr(2, 9), paymentStatus: 'UNPAID', amountPaid: 0 };
    setLeads([fullLead, ...leads]);
    localStorage.setItem('albarkah_leads', JSON.stringify([fullLead, ...leads]));
  };

  const scrollToId = (id: string) => {
    if (role === 'ADMIN') setRole('JAMAAH');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> },
    { id: 'packages', label: 'Paket', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { id: 'doa', label: 'Doa', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
    { id: 'status', label: 'Status', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Social Proof Toast */}
      {recentNotification && role === 'JAMAAH' && !showLogin && (
        <div className="fixed bottom-[13rem] left-4 z-[250] bg-white border border-slate-100 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-left-10 duration-500 max-w-xs">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black">
            {recentNotification.name.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Baru Saja Daftar</p>
            <p className="text-xs font-bold text-slate-900">{recentNotification.name} <span className="text-slate-400 font-medium">memilih</span> {recentNotification.package}</p>
          </div>
        </div>
      )}

      {role !== 'ADMIN' && (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top print:hidden ${scrolled || showLogin ? 'glass shadow-sm py-3' : 'bg-transparent py-6'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { if(showLogin) setShowLogin(false); scrollToId('home'); }}>
              <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                <ICONS.Moon className="w-5 h-5" />
              </div>
              <h1 className="font-extrabold text-xl tracking-tighter text-emerald-950 uppercase">Al-Barkah</h1>
            </div>
            {!showLogin && (
              <button onClick={() => isLoggedIn ? setRole('ADMIN') : setShowLogin(true)} className="px-6 py-2.5 bg-emerald-950 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
                {isLoggedIn ? 'Console' : 'Admin Area'}
              </button>
            )}
          </div>
        </header>
      )}

      <main className={`${showLogin ? 'min-h-screen bg-[#F8FAFC]' : role === 'ADMIN' ? 'pt-0' : 'pb-40 pt-28'}`}>
        {showLogin ? (
          <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-emerald-50/30">
            <LoginView 
              onLogin={() => { 
                setIsLoggedIn(true); 
                setRole('ADMIN'); 
                setShowLogin(false); 
                localStorage.setItem('albarkah_auth', 'true'); 
              }} 
              onCancel={() => setShowLogin(false)} 
            />
          </div>
        ) : role === 'JAMAAH' ? (
          <>
            <div className="space-y-20 animate-slide-up relative z-10">
              <section id="home" className="px-6 max-w-7xl mx-auto scroll-mt-32">
                <div className="relative rounded-[3rem] bg-emerald-950 p-10 md:p-24 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#10b981,transparent_70%)] opacity-30"></div>
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-10 border border-white/10">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      1,240+ Jamaah Terdaftar Musim Ini
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8">Elevated <br/> <span className="text-emerald-400">Spirituality.</span></h2>
                    <p className="text-emerald-100/60 text-lg md:text-xl font-medium leading-relaxed mb-14">Ibadah tenang dengan pendampingan teknologi & bimbingan sunnah yang terpercaya.</p>
                    <div className="flex gap-5">
                      <button onClick={() => scrollToId('packages')} className="px-10 py-5 bg-white text-emerald-950 font-black rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 text-xs uppercase tracking-widest">Browse Packages</button>
                      <button onClick={() => scrollToId('status')} className="px-10 py-5 bg-emerald-900/30 text-white font-bold rounded-2xl border border-white/10 text-xs">Cek Status</button>
                    </div>
                  </div>
                </div>
              </section>

              <InfoHub />
              <Roadmap />

              <section id="packages" className="px-6 max-w-7xl mx-auto pb-10 scroll-mt-32">
                <div className="mb-16">
                  <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Pilihan Terbaik</p>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Paket Ibadah</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelectedPackage} />)}
                </div>
              </section>

              <PrayerGuide />
              <StatusChecker leads={leads} />
            </div>
            <AIAssistant />
          </>
        ) : (
          <AdminDashboard leads={leads} onUpdateLeads={(l) => { setLeads(l); localStorage.setItem('albarkah_leads', JSON.stringify(l)); }} onBackToSite={() => setRole('JAMAAH')} onLogout={() => { setIsLoggedIn(false); setRole('JAMAAH'); localStorage.removeItem('albarkah_auth'); }} />
        )}
      </main>

      {!showLogin && role === 'JAMAAH' && (
        <nav className="md:hidden fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none">
          <div className="bg-emerald-900/95 backdrop-blur-2xl border border-white/10 h-14 w-full max-w-[320px] rounded-full flex items-center justify-between px-1.5 shadow-2xl pointer-events-auto">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button key={item.id} onClick={() => scrollToId(item.id)} className={`flex items-center justify-center gap-2 h-11 transition-all rounded-full ${active ? 'bg-white text-emerald-950 px-5 flex-[1.6] shadow-lg' : 'text-white/40 flex-1'}`}>
                  {item.icon(active)}
                  {active && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {selectedPackage && <CheckoutModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} onSubmit={handleLeadSubmission} />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
