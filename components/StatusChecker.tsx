
import React, { useState } from 'react';
import { Lead } from '../types';

interface StatusCheckerProps {
  leads: Lead[];
}

export const StatusChecker: React.FC<StatusCheckerProps> = ({ leads }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Lead | null>(null);
  const [searched, setSearched] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const found = leads.find(l => l.checkoutCode.toUpperCase() === code.toUpperCase());
    setResult(found || null);
    setSearched(true);
  };

  return (
    <section id="status" className="px-6 max-w-3xl mx-auto py-24 scroll-mt-32">
      <div className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-slate-100 startup-shadow text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Cek Status Booking</h3>
        <p className="text-slate-500 font-medium mb-10">Masukkan kode booking yang Anda terima via WhatsApp untuk melihat progres pendaftaran.</p>
        
        <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Contoh: ALB-XXXXXX" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-black text-lg uppercase tracking-widest"
          />
          <button type="submit" className="px-10 py-5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">
            Periksa
          </button>
        </form>

        {searched && (
          <div className="mt-12 animate-in fade-in zoom-in duration-500">
            {result ? (
              <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status Saat Ini</p>
                    <h4 className="text-2xl font-black text-emerald-950">{result.status}</h4>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                    {result.status === 'Completed' ? '✅' : '⏳'}
                  </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-emerald-200/50">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Jamaah</span>
                    <span className="text-xs font-black text-emerald-900">{result.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Paket</span>
                    <span className="text-xs font-black text-emerald-900">{result.packageName}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-[2.5rem] bg-red-50 border border-red-100">
                <p className="text-red-600 font-bold text-sm">Kode booking tidak ditemukan. Mohon periksa kembali.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
