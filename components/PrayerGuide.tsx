
import React, { useState } from 'react';
import { PRAYERS } from '../constants';

export const PrayerGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Umum' | 'Umroh' | 'Haji'>('Umum');
  const filteredPrayers = PRAYERS.filter(p => p.category === activeTab);

  return (
    <section id="doa" className="px-6 max-w-7xl mx-auto py-24">
      <div className="text-center mb-16">
        <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Panduan Ibadah</p>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8">Doa-Doa Utama</h3>
        
        <div className="inline-flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200">
          {(['Umum', 'Umroh', 'Haji'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full text-xs font-black transition-all ${activeTab === tab ? 'bg-emerald-950 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrayers.map(prayer => (
          <div key={prayer.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 startup-shadow hover:border-emerald-200 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">{prayer.title}</h4>
            </div>
            
            <div className="mb-6">
              <p className="text-right text-3xl font-serif text-emerald-900 mb-4 leading-[1.8]" dir="rtl">
                {prayer.arabic}
              </p>
              <p className="text-sm font-bold text-emerald-600 italic leading-relaxed mb-4">
                "{prayer.latin}"
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Terjemahan</p>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {prayer.translation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
