
import React, { useState } from 'react';
import { TravelPackage } from '../types';
import { ADMIN_WA_NUMBER } from '../constants';

interface CheckoutModalProps {
  pkg: TravelPackage;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

type Step = 1 | 2 | 3 | 4;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ pkg, onClose, onSubmit }) => {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    numberOfPax: 1,
    hasPassport: 'YES' as 'YES' | 'NO' | 'EXPIRED',
    isFirstTime: true,
    roomPreference: 'QUAD' as 'QUAD' | 'TRIPLE' | 'DOUBLE',
    healthNotes: ''
  });
  const [checkoutCode, setCheckoutCode] = useState('');

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ALB-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const nextStep = () => setStep((s) => (s + 1) as Step);
  const prevStep = () => setStep((s) => (s - 1) as Step);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateCode();
    setCheckoutCode(code);
    
    const lead = {
      ...formData,
      packageId: pkg.id,
      packageName: pkg.title,
      checkoutCode: code,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    onSubmit(lead);
    setStep(4);
  };

  const handleWA = () => {
    const message = `*KONFIRMASI PENDAFTARAN AL-BARKAH*\n\n` +
      `Kode Booking: *${checkoutCode}*\n` +
      `--------------------------------\n` +
      `Paket: *${pkg.title}*\n` +
      `Nama Jamaah: ${formData.fullName}\n` +
      `Nomor WA: ${formData.whatsappNumber}\n` +
      `Jumlah Pax: ${formData.numberOfPax}\n\n` +
      `*DETAIL TAMBAHAN:*\n` +
      `- Paspor: ${formData.hasPassport === 'YES' ? 'Sudah Ada' : formData.hasPassport === 'NO' ? 'Belum Ada' : 'Sudah Expired'}\n` +
      `- Pengalaman: ${formData.isFirstTime ? 'Jamaah Pertama Kali' : 'Sudah Pernah Sebelumnya'}\n` +
      `- Kamar: ${formData.roomPreference}\n` +
      `- Catatan Medis: ${formData.healthNotes || '-'}\n\n` +
      `Mohon dibantu proses selanjutnya, Jazakallah Khairan.`;
    
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Siapa yang akan berangkat?</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Kami butuh data kontak utama Anda.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nama Lengkap Sesuai Paspor</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold" placeholder="Contoh: Muhammad Ali" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">WhatsApp Aktif</label>
                <input required type="tel" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold" placeholder="08123xxx" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Status Dokumen</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Ini membantu kami mempercepat proses administrasi.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Apakah sudah memiliki Paspor?</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['YES', 'NO', 'EXPIRED'] as const).map(v => (
                    <button key={v} type="button" onClick={() => setFormData({...formData, hasPassport: v})} className={`py-3 rounded-xl text-[10px] font-black transition-all border ${formData.hasPassport === v ? 'bg-emerald-950 text-white border-emerald-950 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                      {v === 'YES' ? 'SUDAH' : v === 'NO' ? 'BELUM' : 'EXPIRED'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Pengalaman Ibadah</label>
                <button type="button" onClick={() => setFormData({...formData, isFirstTime: !formData.isFirstTime})} className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${formData.isFirstTime ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100'}`}>
                  <div className="text-left">
                    <p className={`font-black text-sm ${formData.isFirstTime ? 'text-emerald-900' : 'text-slate-900'}`}>Pertama Kali</p>
                    <p className="text-[10px] text-slate-500 font-medium">Saya belum pernah melakukan Umroh/Haji sebelumnya.</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.isFirstTime ? 'bg-emerald-600 border-emerald-600' : 'border-slate-200'}`}>
                    {formData.isFirstTime && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Kebutuhan Khusus</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Agar perjalanan Anda lebih personal dan nyaman.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Preferensi Kamar Hotel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['QUAD', 'TRIPLE', 'DOUBLE'] as const).map(v => (
                    <button key={v} type="button" onClick={() => setFormData({...formData, roomPreference: v})} className={`py-3 rounded-xl text-[10px] font-black transition-all border ${formData.roomPreference === v ? 'bg-emerald-950 text-white border-emerald-950' : 'bg-white text-slate-400 border-slate-100'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Catatan Kesehatan (Opsional)</label>
                <textarea value={formData.healthNotes} onChange={e => setFormData({...formData, healthNotes: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm h-24 resize-none" placeholder="Contoh: Membutuhkan kursi roda, alergi seafood, dll." />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-8 pb-12 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Masya Allah, {formData.fullName.split(' ')[0]}!</h2>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed px-4">Niat suci Anda telah tercatat dalam sistem kami. Selesaikan konfirmasi terakhir via WhatsApp.</p>
            
            <div className="bg-emerald-950 p-8 rounded-[2.5rem] mb-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="text-[10px] text-emerald-400 uppercase font-black block mb-2 tracking-widest">KODE BOOKING</span>
              <span className="text-4xl font-mono font-black text-white tracking-[0.2em]">{checkoutCode}</span>
            </div>

            <div className="space-y-4">
              <button onClick={handleWA} className="w-full bg-[#25D366] hover:scale-[1.02] active:scale-95 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl text-sm uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Konfirmasi WhatsApp
              </button>
              
              <button onClick={onClose} className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-950 transition-colors">
                Selesai & Tutup
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-end md:items-center justify-center z-[100] p-0 md:p-6">
      <div className="bg-white w-full max-w-xl rounded-t-[3rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
        {step < 4 && (
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-emerald-600' : 'w-4 bg-slate-100'}`}></div>
                ))}
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); if(step < 3) nextStep(); else handleSubmit(e); }}>
              {renderStep()}
              
              <div className="mt-12 flex items-center gap-4">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-900 transition-colors">Back</button>
                )}
                <button type="submit" className="flex-grow py-5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95 transition-all">
                  {step === 3 ? 'Selesaikan Pendaftaran' : 'Lanjutkan'}
                </button>
              </div>
            </form>
          </div>
        )}
        {step === 4 && renderStep()}
      </div>
    </div>
  );
};
