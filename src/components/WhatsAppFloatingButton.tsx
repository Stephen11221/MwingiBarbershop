import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const quickMessages = [
    'Hello! Is a barber chair free right now in Mwingi?',
    'I want to book an executive fade & beard lineup today.',
    'Do you have wave pomade or beard growth oil in stock?',
    'What time do you close today in Mwingi?'
  ];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${SHOP_INFO.phoneInternational}?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Dialog Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#121217] border border-[#272733] shadow-2xl p-5 text-left animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-serif tracking-wide">
                  Mwingi Home Boyz Desk
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · {SHOP_INFO.phone}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 my-3 leading-relaxed">
            Habari! Chat directly with Banner Mwangi and our crew on WhatsApp for fast chair bookings and questions.
          </p>

          <div className="space-y-1.5 mb-3">
            <div className="text-[10px] uppercase font-semibold text-[#DFB76C] tracking-wider">
              Quick Questions
            </div>
            {quickMessages.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(msg)}
                className="w-full text-left text-xs p-2 rounded-lg bg-[#0E0E12] hover:bg-[#1B1B24] border border-zinc-800/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                "{msg}"
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customMessage.trim()) handleSend(customMessage);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
        aria-label="Direct WhatsApp Contact"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          WhatsApp 0746145712
        </span>
      </button>
    </div>
  );
};
