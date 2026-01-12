
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

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
    const ws = XLSX.utils.json_to_sheet(leads.map(l => ({
      'Kode': l.checkoutCode,
      'Nama': l.fullName,
      'WhatsApp': l.whatsappNumber,
      'Paket': l.packageName,
      'Pax': l.numberOfPax,
      'Status': l.status,
      'Payment Status': l.paymentStatus,
      'Amount Paid': l.amountPaid,
      'Passport': l.hasPassport,
      'Room': l.roomPreference
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jemaah");
    XLSX.writeFile(wb, "Laporan_AlBarkah.xlsx");
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    const updatedLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    onUpdateLeads(updatedLeads);
    setShowEditModal(false);
    setEditingLead(null);
  };

  const handleDeleteLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setShowDeleteModal(true);
  };

  const confirmDeleteLead = () => {
    if (selectedLeadId) {
      const updatedLeads = leads.filter(l => l.id !== selectedLeadId);
      onUpdateLeads(updatedLeads);
      setShowDeleteModal(false);
      setSelectedLeadId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FAFAFA] overflow-hidden">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 p-8 pt-10">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20"></div>
            <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Al-Barkah</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Travel Console</p>
          </div>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            {
              id: 'analytics',
              label: 'Insights',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
            {
              id: 'bookings',
              label: 'Database',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              )
            },
            {
              id: 'payments',
              label: 'Payments',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-200'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="space-y-2 pt-6 border-t border-slate-50">
          <button onClick={onBackToSite} className="w-full px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 hover:bg-slate-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Site
          </button>
          <button onClick={onLogout} className="w-full px-6 py-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 hover:bg-red-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 pb-40 pt-24 md:pt-12 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-6 md:mb-10">
            <div className="flex-1">
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1">Management Hub</p>
              <h3 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight capitalize">{activeTab}</h3>
            </div>
            <button onClick={exportToExcel} className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:shadow-xl transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export XLSX
            </button>
          </header>

          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Registrations',
                    val: leads.length,
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    ),
                    color: 'from-blue-500 to-blue-600',
                    bg: 'bg-blue-50'
                  },
                  {
                    label: 'Paid Leads',
                    val: leads.filter(l => l.paymentStatus === 'PAID').length,
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    color: 'from-emerald-500 to-emerald-600',
                    bg: 'bg-emerald-50'
                  },
                  {
                    label: 'Revenue',
                    val: formatIDR(leads.reduce((a, b) => a + b.amountPaid, 0)),
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    color: 'from-amber-500 to-amber-600',
                    bg: 'bg-amber-50'
                  },
                  {
                    label: 'Conversion',
                    val: ((leads.filter(l => l.paymentStatus === 'PAID').length / leads.length) * 100).toFixed(1) + '%',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ),
                    color: 'from-purple-500 to-purple-600',
                    bg: 'bg-purple-50'
                  }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                      {s.icon}
                    </div>
                    <p className="text-[9px] uppercase font-black text-slate-400 mb-2">{s.label}</p>
                    <div className="text-xl font-black text-slate-900">{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[3rem] shadow-2xl shadow-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 flex items-center gap-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      Gemini AI Insights
                    </p>
                    <p className="text-white text-lg font-medium italic">"{aiSummary}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search jemaah or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-5 bg-white border border-slate-100 rounded-2xl outline-none font-bold shadow-sm"
                />
              </div>
              {filteredLeads.map(lead => (
                <div key={lead.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400">{lead.fullName.charAt(0)}</div>
                    <div>
                      <h5 className="font-black text-slate-900">{lead.fullName}</h5>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{lead.packageName} • {lead.checkoutCode}</p>
                      <p className="text-[9px] text-slate-300 font-medium">{lead.numberOfPax} Pax • {lead.roomPreference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{lead.status}</span>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          lead.paymentStatus === 'PAID' ? 'bg-blue-100 text-blue-600' :
                          lead.paymentStatus === 'PARTIAL' ? 'bg-purple-100 text-purple-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>{lead.paymentStatus}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">{formatIDR(lead.amountPaid)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              {/* Payment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Paid', val: formatIDR(leads.reduce((a, b) => a + (b.paymentStatus === 'PAID' ? b.amountPaid : 0), 0)), color: 'bg-emerald-50 border-emerald-100' },
                  { label: 'Partial Payments', val: formatIDR(leads.reduce((a, b) => a + (b.paymentStatus === 'PARTIAL' ? b.amountPaid : 0), 0)), color: 'bg-amber-50 border-amber-100' },
                  { label: 'Outstanding', val: formatIDR(leads.reduce((a, b) => {
                    const pkg = PACKAGES.find(p => p.id === b.packageId);
                    const total = pkg ? pkg.price * b.numberOfPax : 0;
                    return a + (total - b.amountPaid);
                  }, 0)), color: 'bg-red-50 border-red-100' }
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-[2rem] border ${stat.color}`}>
                    <p className="text-[9px] uppercase font-black text-slate-500 mb-2">{stat.label}</p>
                    <p className="text-lg font-black text-slate-900">{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Payment List */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <input type="text" placeholder="Search payments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold" />
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredLeads.map(lead => {
                    const pkg = PACKAGES.find(p => p.id === lead.packageId);
                    const totalAmount = pkg ? pkg.price * lead.numberOfPax : 0;
                    const remainingAmount = totalAmount - lead.amountPaid;
                    const paymentProgress = (lead.amountPaid / totalAmount) * 100;

                    return (
                      <div key={lead.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg ${
                              lead.paymentStatus === 'PAID' ? 'bg-emerald-500' :
                              lead.paymentStatus === 'PARTIAL' ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`}>
                              {lead.fullName.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-black text-slate-900 text-base">{lead.fullName}</h5>
                              <p className="text-[10px] text-slate-400 font-black uppercase">{lead.packageName} • {lead.checkoutCode}</p>
                              <p className="text-[9px] text-slate-300 font-medium mt-1">{lead.numberOfPax} Pax • {lead.roomPreference} Room</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              lead.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                              lead.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {lead.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Payment Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                            <span className="text-slate-400">Payment Progress</span>
                            <span className={paymentProgress >= 100 ? 'text-emerald-600' : 'text-amber-600'}>
                              {paymentProgress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                paymentProgress >= 100 ? 'bg-emerald-500' :
                                paymentProgress >= 50 ? 'bg-amber-500' :
                                'bg-slate-400'
                              }`}
                              style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-500">Paid: <span className="text-emerald-600">{formatIDR(lead.amountPaid)}</span></span>
                            <span className="text-slate-500">Total: <span className="text-slate-900">{formatIDR(totalAmount)}</span></span>
                            {remainingAmount > 0 && (
                              <span className="text-red-500">Remaining: {formatIDR(remainingAmount)}</span>
                            )}
                          </div>
                        </div>

                        {/* Admin Notes */}
                        {lead.adminNotes && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">Admin Notes</p>
                            <p className="text-[10px] text-amber-800 font-medium">{lead.adminNotes}</p>
                          </div>
                        )}

                        {/* Health Notes */}
                        {lead.healthNotes && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-[9px] font-black text-blue-700 uppercase tracking-wider mb-1">Health Notes</p>
                            <p className="text-[10px] text-blue-800 font-medium">{lead.healthNotes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Mobile Dock (Compact) */}
      <nav className="md:hidden fixed bottom-6 left-0 right-0 z-[300] flex justify-center px-6 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-3xl border border-slate-200 h-20 w-full max-w-[380px] rounded-3xl flex items-center justify-around px-4 shadow-2xl pointer-events-auto">
          {[
            {
              id: 'analytics',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              label: 'Insights'
            },
            {
              id: 'bookings',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              label: 'Data'
            },
            {
              id: 'payments',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              ),
              label: 'Payments'
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center gap-1.5 py-2 px-4 rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-200'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span className="text-[8px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[290] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">Al-Barkah</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Console</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button onClick={onLogout} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">Edit Jemaah</h3>
              <p className="text-slate-400 text-sm mt-1">{editingLead.checkoutCode}</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateLead(editingLead);
            }} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editingLead.fullName}
                    onChange={(e) => setEditingLead({...editingLead, fullName: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={editingLead.whatsappNumber}
                    onChange={(e) => setEditingLead({...editingLead, whatsappNumber: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({...editingLead, status: e.target.value as any})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="FollowedUp">Followed Up</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Payment Status</label>
                  <select
                    value={editingLead.paymentStatus}
                    onChange={(e) => setEditingLead({...editingLead, paymentStatus: e.target.value as any})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="UNPAID">Unpaid</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Amount Paid (IDR)</label>
                  <input
                    type="number"
                    value={editingLead.amountPaid}
                    onChange={(e) => setEditingLead({...editingLead, amountPaid: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Admin Notes</label>
                <textarea
                  value={editingLead.adminNotes || ''}
                  onChange={(e) => setEditingLead({...editingLead, adminNotes: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  rows={3}
                  placeholder="Catatan admin..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-emerald-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingLead(null); }}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
              🗑️
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Jemaah?</h3>
            <p className="text-slate-400 text-sm mb-8">This action cannot be undone. All data for this jemaah will be permanently deleted.</p>
            <div className="flex gap-4">
              <button
                onClick={confirmDeleteLead}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setSelectedLeadId(null); }}
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
