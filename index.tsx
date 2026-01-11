
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
import './index.css';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('JAMAAH');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    try {
      const savedLeads = localStorage.getItem('albarkah_leads');
      if (savedLeads) setLeads(JSON.parse(savedLeads));
      
      if (localStorage.getItem('albarkah_auth') === 'true') {
        setIsLoggedIn(true);
        setRole('ADMIN');
      }
    } catch (e) {
      console.error("Storage sync failed", e);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section for mobile nav highlight
      const sections = ['home', 'packages', 'doa'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLeadSubmission = (leadData: any) => {
    const updated = [leadData, ...leads];
    setLeads(updated);
    localStorage.setItem('albarkah_leads', JSON.stringify(updated));
  };

  const scrollToId = (id: string) => {
    if (role === 'ADMIN') {
      setRole('JAMAAH');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleConsole = () => {
    if (isLoggedIn) {
      setRole(role === 'ADMIN' ? 'JAMAAH' : 'ADMIN');
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('JAMAAH');
    localStorage.removeItem('albarkah_auth');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-emerald-100 selection:text-emerald-900">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${
        scrolled || showLogin ? 'glass shadow-[0_1px_0_0_rgba(0,0,0,0.05)] py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setRole('JAMAAH'); setShowLogin(false); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20 group-active:scale-90 transition-all duration-300">
              <ICONS.Moon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tighter text-emerald-950 leading-none uppercase">Al-Barkah</h1>
              <p className="text-[9px] font-bold text-emerald-600/60 tracking-[0.2em] uppercase mt-0.5">Technology Driven</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleConsole}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 ${
                role === 'ADMIN' 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' 
                : 'bg-emerald-950 text-white shadow-lg shadow-emerald-900/10'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              {isLoggedIn ? (role === 'ADMIN' ? 'Back to Site' : 'Console') : 'Console'}
            </button>

            {isLoggedIn && (
              <button onClick={handleLogout} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 transition-colors shadow-sm active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={`${showLogin ? '' : 'pb-32 pt-28'}`}>
        {showLogin ? (
          <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
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
          <div className="space-y-20 animate-slide-up">
            <section id="home" className="px-6 max-w-7xl mx-auto scroll-mt-32">
              <div className="relative rounded-[3rem] bg-emerald-950 p-10 md:p-24 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#10b981,transparent_70%)]"></div>
                </div>
                
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-10 border border-white/10">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                    Pendaftaran Dibuka Musim 1446H
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8">
                    Elevated <br/> <span className="text-emerald-400">Spirituality.</span>
                  </h2>
                  <p className="text-emerald-100/60 text-lg md:text-xl font-medium leading-relaxed mb-14 max-w-lg">
                    Ibadah tenang dengan pendampingan teknologi & bimbingan sunnah yang terpercaya.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <button 
                      onClick={() => scrollToId('packages')}
                      className="px-12 py-5 bg-white text-emerald-950 font-black rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all active:scale-95 text-center text-sm uppercase tracking-wider"
                    >
                      Browse Packages
                    </button>
                    <button 
                      onClick={() => scrollToId('doa')}
                      className="px-12 py-5 bg-emerald-900/30 text-white font-bold rounded-2xl border border-white/10 hover:bg-emerald-900/50 transition-all text-center backdrop-blur-sm text-sm"
                    >
                      Panduan Doa
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <Roadmap />

            <section id="packages" className="px-6 max-w-7xl mx-auto pb-10 scroll-mt-32">
              <div className="mb-16">
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Pilih Keberangkatan</p>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Paket Tersedia</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {PACKAGES.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelectedPackage} />
                ))}
              </div>
            </section>

            <PrayerGuide />
          </div>
        ) : (
          <div className="animate-slide-up">
            <AdminDashboard leads={leads} />
          </div>
        )}
      </main>

      {!showLogin && (
        <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="glass-dark px-2.5 py-2.5 rounded-[2.5rem] flex items-center gap-1.5 shadow-2xl border border-white/10 ring-1 ring-white/10">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => { setRole('JAMAAH'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500 ${role === 'JAMAAH' ? 'bg-white text-emerald-950 shadow-lg' : 'text-white/40'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={role === 'JAMAAH' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                  {role === 'JAMAAH' && <span className="text-xs font-black uppercase tracking-widest">Home</span>}
                </button>
                <button 
                  onClick={toggleConsole}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500 ${role === 'ADMIN' ? 'bg-white text-emerald-950 shadow-lg' : 'text-white/40'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={role === 'ADMIN' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  {role === 'ADMIN' && <span className="text-xs font-black uppercase tracking-widest">Admin</span>}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => scrollToId('home')}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500 ${activeSection === 'home' ? 'bg-white text-emerald-950 shadow-lg' : 'text-white/40'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={activeSection === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                  {activeSection === 'home' && <span className="text-xs font-black uppercase tracking-widest">Home</span>}
                </button>
                <button 
                  onClick={() => scrollToId('packages')}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500 ${activeSection === 'packages' ? 'bg-white text-emerald-950 shadow-lg' : 'text-white/40'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={activeSection === 'packages' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  {activeSection === 'packages' && <span className="text-xs font-black uppercase tracking-widest">Paket</span>}
                </button>
                <button 
                  onClick={() => scrollToId('doa')}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500 ${activeSection === 'doa' ? 'bg-white text-emerald-950 shadow-lg' : 'text-white/40'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={activeSection === 'doa' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  {activeSection === 'doa' && <span className="text-xs font-black uppercase tracking-widest">Doa</span>}
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      {selectedPackage && (
        <CheckoutModal 
          pkg={selectedPackage} 
          onClose={() => setSelectedPackage(null)} 
          onSubmit={handleLeadSubmission} 
        />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
