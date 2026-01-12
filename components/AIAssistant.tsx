
import React, { useState, useRef, useEffect } from 'react';
import { startAIChat } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Assalamu\'alaikum! Saya Asisten Mutawwif Al-Barkah. Ada yang bisa saya bantu terkait rencana ibadah Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show welcome bubble after a short delay on first mount
    const timer = setTimeout(() => {
      setIsWelcomeVisible(true);
    }, 1500);

    // Hide welcome bubble after 8 seconds
    const hideTimer = setTimeout(() => {
      setIsWelcomeVisible(false);
    }, 9500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);
    setIsWelcomeVisible(false); // Close bubble if they actually open/interact

    try {
      const chat = await startAIChat([]);
      if (chat) {
        const result = await chat.sendMessage({ message: userMessage });
        setMessages(prev => [...prev, { role: 'model', text: result.text || 'Maaf, saya sedang mengalami kendala teknis.' }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsWelcomeVisible(false);
  };

  return (
    // Fixed position strictly relative to viewport
    <div className="fixed bottom-[6.5rem] right-4 md:bottom-10 md:right-10 z-[200] pointer-events-none print:hidden">
      {isOpen ? (
        <div className="pointer-events-auto w-[calc(100vw-2rem)] md:w-96 bg-white rounded-[2.5rem] shadow-[0_30px_70px_-10px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden flex flex-col h-[500px] md:h-[650px] animate-in slide-in-from-bottom-10 fade-in duration-500 origin-bottom-right">
          <div className="bg-emerald-950 p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl shadow-inner">🕋</div>
              <div>
                <h5 className="text-white font-black text-sm tracking-tight leading-none mb-1">Mutawwif AI</h5>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Always Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-5 bg-[#FAFAFA]/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm font-semibold leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-600/10' 
                  : 'bg-white text-slate-700 rounded-bl-none border border-slate-100 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soal Umroh/Haji..."
              className="flex-grow px-5 py-4 bg-slate-100/50 border border-slate-200/50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
            <button type="submit" className="w-14 h-14 bg-emerald-950 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-emerald-900/20 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-3">
          {/* Standing Alone Welcome Bubble */}
          {isWelcomeVisible && (
            <div className="pointer-events-auto bg-emerald-950 text-white px-5 py-3 rounded-2xl rounded-br-none shadow-2xl animate-in slide-in-from-right-4 fade-in duration-500 mb-1 border border-emerald-800/50">
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Asisten Mutawwif AI</p>
              <p className="text-xs font-medium text-emerald-100/80">Butuh bimbingan ibadah? Tanya saya saja!</p>
            </div>
          )}
          
          <button 
            onClick={openChat}
            className="pointer-events-auto w-14 h-14 md:w-16 md:h-16 bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-110 hover:bg-emerald-900 active:scale-95 transition-all group relative border-2 border-white/10"
          >
            {/* Notification Badge with Pulse */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-emerald-950 rounded-full animate-ping opacity-75"></span>
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-emerald-950 rounded-full shadow-sm"></span>
            
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-8 md:h-8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      )}
    </div>
  );
};
