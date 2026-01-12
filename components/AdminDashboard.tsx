
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { summarizeLeadData } from '../services/geminiService';
import { PACKAGES } from '../constants';
import * as XLSX from 'https://esm.sh/xlsx';

interface AdminDashboardProps {
  leads: Lead[];
  onUpdateLeads: (updatedLeads: Lead[]) => void;
  onBackToSite: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ leads, onUpdateLeads, onBackToSite, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'payments'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSummary, setAiSummary] = useState<string>('Analysing operational metrics...');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await summarizeLeadData(leads);
      setAiSummary(summary || 'Data stream too low for inference.');
    };
    fetchSummary();
  }, [leads]);

  const filteredLeads = leads.filter(l => l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || l.checkoutCode.toLowerCase().includes(searchQuery.toLowerCase()));
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(leads.map(l => ({ 'Kode': l.checkoutCode, 'Nama': l.fullName, 'Status': l.status, 'Total': l.amountPaid })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jemaah");
    XLSX.writeFile(wb, "Laporan_AlBarkah.xlsx");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FAFAFA] overflow-hidden">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 p-8 pt-10">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-950 rounded-lg flex items-center justify-center text-white text-sm shadow-lg">🕋</div>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Console</h2>
        </div>
        <nav className="space-y-2 flex-grow">
          {['analytics', 'bookings', 'payments'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${activeTab === id ? 'bg-emerald-950 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
              {id === 'analytics' ? 'Insights' : id === 'bookings' ? 'Database' : 'Payments'}
            </button>
          ))}
        </nav>
        <div className="space-y-2 pt-6 border-t border-slate-50">
          <button onClick={onBackToSite} className="w-full px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Back to Site</button>
          <button onClick={onLogout} className="w-full px-6 py-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Sign Out</button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 pb-40 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-10">
            <div>
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1">Management Hub</p>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight capitalize">{activeTab}</h3>
            </div>
            <button onClick={exportToExcel} className="hidden md:block px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Export XLSX</button>
          </header>

          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Registrations', val: leads.length, icon: '⚡' },
                  { label: 'Paid Leads', val: leads.filter(l => l.paymentStatus === 'PAID').length, icon: '✅' },
                  { label: 'Revenue', val: formatIDR(leads.reduce((a, b) => a + b.amountPaid, 0)), icon: '💰' },
                  { label: 'Conversion', val: ((leads.filter(l => l.paymentStatus === 'PAID').length / leads.length) * 100).toFixed(1) + '%', icon: '📈' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <p className="text-[9px] uppercase font-black text-slate-400 mb-4">{s.label}</p>
                    <div className="text-xl font-black text-slate-900">{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-8">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl">🤖</div>
                  <div>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Gemini AI Insights</p>
                    <p className="text-white text-lg font-medium italic">"{aiSummary}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <input type="text" placeholder="Search jemaah or code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none font-bold shadow-sm mb-6" />
              {filteredLeads.map(lead => (
                <div key={lead.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400">{lead.fullName.charAt(0)}</div>
                    <div>
                      <h5 className="font-black text-slate-900">{lead.fullName}</h5>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{lead.packageName} • {lead.checkoutCode}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{lead.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Admin Mobile Dock (Compact) */}
      <nav className="md:hidden fixed bottom-6 left-0 right-0 z-[300] flex justify-center px-6 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-3xl border border-slate-200 h-14 w-full max-w-[320px] rounded-full flex items-center justify-between px-1.5 shadow-2xl pointer-events-auto">
          {['analytics', 'bookings', 'payments'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex items-center justify-center gap-2 h-11 transition-all rounded-full ${activeTab === id ? 'bg-emerald-950 text-white px-5 flex-[1.6]' : 'text-slate-400 flex-1'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">{activeTab === id ? id : id.charAt(0)}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
