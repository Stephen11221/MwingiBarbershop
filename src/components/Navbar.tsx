import React, { useState } from 'react';
import { Scissors, ShoppingBag, ShieldCheck, Phone, Calendar, Menu, X, MessageSquare, MapPin } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  activeGroupTab?: string;
  onSelectGroupTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenBooking,
  onOpenTracking,
  onOpenAdmin,
  activeGroupTab,
  onSelectGroupTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Crew', id: 'crew' },
    { label: 'Services & Pricing', id: 'services' },
    { label: 'Recent Styles', id: 'gallery' },
    { label: 'Products', id: 'shop' },
    { label: 'Loyalty Club', id: 'loyalty' }
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onSelectGroupTab) {
      onSelectGroupTab(id);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[#1E1E24]">
      {/* Top micro-banner */}
      <div className="bg-[#121217] border-b border-zinc-800/80 py-1 px-4 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1 text-[#DFB76C]">
          <MapPin className="w-3 h-3" />
          <span>Mwingi, Kitui County</span>
        </span>
        <span className="text-zinc-600">|</span>
        <a
          href={`tel:${SHOP_INFO.phone}`}
          className="hover:text-white transition-colors flex items-center gap-1 text-zinc-300"
        >
          <Phone className="w-3 h-3 text-[#DFB76C]" />
          <span>Call: {SHOP_INFO.phone}</span>
        </a>
        <span className="text-zinc-600 hidden sm:inline">|</span>
        <a
          href={`https://wa.me/${SHOP_INFO.phoneInternational}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-emerald-400 transition-colors hidden sm:flex items-center gap-1 text-emerald-400"
        >
          <MessageSquare className="w-3 h-3" />
          <span>WhatsApp Concierge</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ZONE 1: BRAND IDENTITY */}
          <a
            href="#"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A1A22] to-[#121216] border border-[#C5A059]/40 flex items-center justify-center text-[#DFB76C] group-hover:border-[#DFB76C] transition-colors shadow-sm">
              <Scissors className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold font-serif tracking-wider text-white uppercase group-hover:text-[#DFB76C] transition-colors">
                Mwingi Home Boyz
              </span>
              <span className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase font-mono">
                Executive Cut & Lounge
              </span>
            </div>
          </a>

          {/* ZONE 2: PRIMARY NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors py-1 cursor-pointer ${
                  activeGroupTab === link.id
                    ? 'text-[#DFB76C] font-semibold border-b border-[#DFB76C]'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ZONE 3: ACTIONS & UTILITIES */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Track / Pay Button */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-[#14141A] transition-colors"
            >
              Track / Pay
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
              aria-label="View grooming bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A059] text-black font-bold text-[10px] flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Book Now Primary CTA */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md shadow-[#C5A059]/20"
            >
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span>Book Barber</span>
            </button>

            {/* Admin Lock Portal */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors"
              title="Staff Portal (Director & Barbers)"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101014] border-b border-[#22222A] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="py-2.5 px-3 rounded-lg bg-[#16161D] text-left text-zinc-300 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase text-center"
            >
              Book Your Barber
            </button>

            <a
              href={`https://wa.me/${SHOP_INFO.phoneInternational}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Direct (0746145712)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
