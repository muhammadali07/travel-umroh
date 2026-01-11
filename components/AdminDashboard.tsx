
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { summarizeLeadData } from '../services/geminiService';

interface AdminDashboardProps {
  leads: Lead[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ leads }) => {
  const [aiSummary, setAiSummary] = useState<string>('Crunching data points...');

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await summarizeLeadData(leads);
      setAiSummary(summary || 'Insufficient data for predictive insights.');
    };
    fetchSummary();
  }, [leads]);

  const stats = [
    { label: 'Total Inflow', val: leads.length, icon: '⚡' },
    { label: 'Pipeline', val: leads.filter(l => l.status === 'Pending').length, icon: '⏳' },
    { label: 'Conversion', val: leads.filter(l => l.status === 'Completed').length, icon: '✅' },
    { label: 'Volume', val: leads.reduce((acc, curr) => acc + curr.numberOfPax, 0), icon: '👥' }
  ];

  return (
    <div className="px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Analytics</h2>
          <p className="text-slate-500 font-medium">Real-time performance monitoring.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all">Export CSV</button>
          <button className="px-4 py-2.5 bg-emerald-950 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-950/20 active:scale-95 transition-all">+ Add Lead</button>
        </div>
      </div>

      {/* Modern SaaS Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 startup-shadow relative overflow-hidden group hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{s.label}</span>
               <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{s.val}</div>
            <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              +12.5% vs last week
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight Bar */}
      <div className="bg-[#111] p-6 rounded-[2rem] shadow-2xl mb-12 flex flex-col md:flex-row items-center gap-6 border border-white/5">
        <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div className="flex-grow">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Predictive AI (Gemini 3 Flash)</p>
          <p className="text-emerald-50 text-sm font-medium italic">"{aiSummary}"</p>
        </div>
      </div>

      {/* Lead Feed (Mobile Friendly Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="font-extrabold text-lg text-slate-900">Activity Feed</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {leads.length} results</span>
        </div>
        
        {leads.length === 0 ? (
          <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
             <div className="text-4xl mb-4">📭</div>
             <p className="text-sm font-bold uppercase tracking-widest">No leads captured yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 startup-shadow hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-sm">
                      {lead.fullName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 leading-none mb-1">{lead.fullName}</h5>
                      <p className="text-xs text-slate-400 font-bold">{lead.packageName} • {lead.checkoutCode}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      lead.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-xs font-black text-slate-900">{lead.numberOfPax} Pax</span>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
