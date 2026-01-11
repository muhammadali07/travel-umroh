
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated login logic
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        setError('Username atau password salah.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(6,95,70,0.1)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-800 text-white rounded-2xl mb-6 shadow-lg shadow-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Gunakan kredensial Anda untuk mengakses <br/> dashboard manajemen Al-Barkah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-2 animate-in fade-in zoom-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
            <input 
              autoFocus
              required
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold"
              placeholder="Masukkan username"
            />
          </div>

          {/* Progressive Disclosure: Password field appears only after username is typed */}
          {username.length > 0 && (
            <div className="space-y-1.5 animate-in slide-in-from-top-4 fade-in duration-500 fill-mode-both">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold"
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            <button 
              type="submit"
              disabled={isLoading || username.length === 0 || (username.length > 0 && password.length === 0)}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                isLoading || username.length === 0 || (username.length > 0 && password.length === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-200'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Masuk Ke Dashboard'
              )}
            </button>
            
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-800 transition-colors"
            >
              Kembali Ke Beranda
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
        Secured by Al-Barkah Enterprise Auth
      </div>
    </div>
  );
};
