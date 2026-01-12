
import React from 'react';

export const InfoHub: React.FC = () => {
  return (
    <section className="px-6 max-w-7xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Makkah */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 startup-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Current Weather</p>
              <h4 className="text-xl font-black text-slate-900">Makkah, SA</h4>
            </div>
            <span className="text-3xl">☀️</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-slate-900">34°C</span>
            <span className="text-slate-400 font-bold mb-1">Clear Sky</span>
          </div>
        </div>

        {/* Currency SAR to IDR */}
        <div className="bg-emerald-950 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Exchange Rate</p>
            <h4 className="text-xl font-black text-white">1 SAR to IDR</h4>
          </div>
          <div className="mt-6">
            <span className="text-3xl font-black text-white tracking-tighter">Rp 4.215,-</span>
            <p className="text-emerald-500 text-[10px] font-bold mt-1">Last update: Today 09:00</p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 startup-shadow flex flex-col justify-between group cursor-pointer hover:border-emerald-200 transition-all">
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Travel Tip</p>
            <h4 className="text-xl font-black text-slate-900">Health First</h4>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Pastikan membawa botol semprot air untuk menjaga kelembapan wajah saat di Masjidil Haram.</p>
        </div>
      </div>
    </section>
  );
};
