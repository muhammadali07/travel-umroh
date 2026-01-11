
import React, { useState } from 'react';
import { UMROH_ROADMAP, HAJI_ROADMAP } from '../constants';

export const Roadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UMROH' | 'HAJI'>('UMROH');
  const steps = activeTab === 'UMROH' ? UMROH_ROADMAP : HAJI_ROADMAP;

  return (
    <section className="px-6 max-w-7xl mx-auto py-20">
      <div className="text-center mb-16">
        <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">First Time Pilgrim Guide</p>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8">Peta Jalan Ibadah</h3>
        
        <div className="inline-flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200">
          <button 
            onClick={() => setActiveTab('UMROH')}
            className={`px-8 py-3 rounded-full text-xs font-black transition-all ${activeTab === 'UMROH' ? 'bg-emerald-950 text-white shadow-xl' : 'text-slate-400'}`}
          >
            UMROH
          </button>
          <button 
            onClick={() => setActiveTab('HAJI')}
            className={`px-8 py-3 rounded-full text-xs font-black transition-all ${activeTab === 'HAJI' ? 'bg-emerald-950 text-white shadow-xl' : 'text-slate-400'}`}
          >
            HAJI
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Connector Line */}
        <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 hidden md:block"></div>
        
        <div className="grid gap-12 md:gap-24">
          {steps.map((step, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              {/* Icon Node */}
              <div className="absolute left-0 md:left-1/2 w-16 h-16 bg-white border-4 border-slate-50 shadow-xl rounded-2xl flex items-center justify-center text-3xl z-10 -translate-x-1/2 md:block hidden">
                {step.icon}
              </div>
              <div className="w-16 h-16 bg-white border-2 border-emerald-100 shadow-lg rounded-xl flex items-center justify-center text-2xl z-10 md:hidden">
                {step.icon}
              </div>

              {/* Content Card */}
              <div className={`flex-1 w-full md:w-[45%] bg-white p-8 rounded-[2.5rem] border border-slate-100 startup-shadow hover:border-emerald-200 transition-all group`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Langkah {index + 1}</span>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-emerald-800 transition-colors">{step.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{step.description}</p>
              </div>
              
              <div className="hidden md:block flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
