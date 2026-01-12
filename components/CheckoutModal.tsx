
import React, { useState, useEffect } from 'react';
import { TravelPackage } from '../types';
import { ADMIN_WA_NUMBER } from '../constants';

interface CheckoutModalProps {
  pkg: TravelPackage;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ pkg, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
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
  const [totalPrice, setTotalPrice] = useState(pkg.price);

  useEffect(() => {
    // Room surcharges (Commercial value: Automatic pricing calculation)
    const surcharges = { QUAD: 0, TRIPLE: 2500000, DOUBLE: 5000000 };
    setTotalPrice((pkg.price + surcharges[formData.roomPreference]) * formData.numberOfPax);
  }, [formData.roomPreference, formData.numberOfPax, pkg.price]);

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'ALB-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setCheckoutCode(code);
    onSubmit({ ...formData, packageId: pkg.id, packageName: pkg.title, checkoutCode: code, amountPaid: 0, status: 'Pending', createdAt: new Date().toISOString() });
    setStep(4);
  };

  const handleWA = () => {
    const message = `*KONFIRMASI PENDAFTARAN AL-BARKAH*\nKode: *${checkoutCode}*\nPaket: *${pkg.title}*\nJamaah: ${formData.fullName}\nKamar: ${formData.roomPreference}\nTotal: ${formatIDR(totalPrice)}`;
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-end md:items-center justify-center z-[250] p-0 md:p-6">
      <div className="bg-white w-full max-w-xl rounded-t-[3rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
        <div className="p-8 md:p-12">
          {step < 4 && (
            <div className="flex justify-between items-center mb-10">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-emerald-600' : 'w-4 bg-slate-100'}`}></div>)}
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Siapa yang berangkat?</h3>
              <div className="space-y-6">
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Nama Lengkap Sesuai Paspor" />
                <input required type="tel" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="WhatsApp Aktif" />
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                  <span className="text-xs font-black text-emerald-900 uppercase">Jumlah Pax</span>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setFormData({...formData, numberOfPax: Math.max(1, formData.numberOfPax - 1)})} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">-</button>
                    <span className="font-black text-emerald-950">{formData.numberOfPax}</span>
                    <button type="button" onClick={() => setFormData({...formData, numberOfPax: formData.numberOfPax + 1})} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Preferensi Kamar</h3>
              <div className="grid grid-cols-1 gap-4">
                {(['QUAD', 'TRIPLE', 'DOUBLE'] as const).map(v => (
                  <button key={v} type="button" onClick={() => setFormData({...formData, roomPreference: v})} className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${formData.roomPreference === v ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100'}`}>
                    <div className="text-left">
                      <p className="font-black text-slate-900">{v} ROOM</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{v === 'QUAD' ? 'Standard' : v === 'TRIPLE' ? '+Rp 2.5jt / pax' : '+Rp 5jt / pax'}</p>
                    </div>
                    {formData.roomPreference === v && <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Review Pendaftaran</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">Mohon periksa kembali estimasi biaya Anda.</p>
              <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 text-left border border-slate-100 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Paket</span>
                  <span className="text-xs font-black text-slate-900">{pkg.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Kamar</span>
                  <span className="text-xs font-black text-slate-900">{formData.roomPreference}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black text-emerald-950 uppercase">Total Estimasi</span>
                  <span className="text-xl font-black text-emerald-600">{formatIDR(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 ? (
            <div className="text-center py-10 animate-in zoom-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-6"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Alhamdulillah!</h2>
              <div className="bg-emerald-950 p-6 rounded-[2rem] mb-8 text-white">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">KODE BOOKING</p>
                <p className="text-3xl font-mono font-black tracking-widest">{checkoutCode}</p>
              </div>
              <button onClick={handleWA} className="w-full bg-[#25D366] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest">Konfirmasi WhatsApp</button>
              <button onClick={onClose} className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tutup</button>
            </div>
          ) : (
            <div className="mt-10 flex gap-4">
              {step > 1 && <button onClick={() => setStep(step - 1)} className="px-8 py-5 text-xs font-black uppercase text-slate-400">Back</button>}
              <button onClick={() => step < 3 ? setStep(step + 1) : handleSubmit({} as any)} className="flex-grow py-5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                {step === 3 ? 'Kirim Pendaftaran' : 'Lanjutkan'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
