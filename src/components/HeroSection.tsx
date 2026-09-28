import React from 'react';
import { Calendar, MessageSquare, ArrowRight, Star, ShieldCheck, MapPin, Phone, Sparkles, Cog } from 'lucide-react';
import { HERO_IMAGE, BARBER_3D_MECHANIC_IMAGE, SHOP_INFO } from '../data/mockData.ts';

interface HeroSectionProps {
  onBookNow: () => void;
  onExploreServices: () => void;
  onTrackOrPay: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookNow,
  onExploreServices,
  onTrackOrPay
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16 z-10">
      {/* Background Hero Image with Warm Obsidian Scrim & 3D Mechanic Gold Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/shop.jpg"
          alt="MWINGI HOME BOYZ Luxury Barbershop Interior Mwingi"
          referrerPolicy="no-referrer"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = '/shop.jpg';
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-105"
        />
        {/* 3D Mechanic Barber Shovel & Gold Products Backdrop Blend */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen bg-cover bg-center filter saturate-125 pointer-events-none"
          style={{ backgroundImage: `url(/cut.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0B0B0D]/60 to-[#0B0B0D]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* Location & Status Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#181822]/90 border border-[#C5A059]/40 text-[#DFB76C] text-xs font-medium mb-6 backdrop-blur-md shadow-lg animate-in fade-in duration-500">
          <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span className="font-semibold text-white">Station:</span>
          <span>Mwingi Kitui County along Mwingi level IV hospital</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300">Open · Est. 2019</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
          MWINGI HOME BOYZ <span className="text-[#DFB76C] italic font-serif">EXECUTIVE</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed mb-6">
          Mwingi's premier executive grooming sanctuary. Razor-sharp African skin fades, 360 wave care, hot towel beard sculpting, and restorative facial therapies. Black & gold luxury since 2019.
        </p>

        {/* Workstation & Careers Quick Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 mb-8">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
            Mwingi Kitui County along Mwingi level IV hospital
          </span>
          <span className="text-zinc-600">·</span>
          <a
            href="mailto:bannermwangi0@gmail.com?subject=Barber%20Job%20Application%20-%20Mwingi%20Home%20Boyz&body=Hello%20Banner%20Mwangi,%0A%0AI%20am%20applying%20for%20a%20Barber%20/%20Stylist%20position%20at%20Mwingi%20Home%20Boyz%20Executive%20Barbershop%20(Mwingi%20Kitui%20County%20along%20Mwingi%20level%20IV%20hospital).%0A%0AName:%0APhone:%0AYears%20of%20Experience:%0A%0AThank%20you."
            className="text-[#DFB76C] hover:underline flex items-center gap-1 font-medium bg-[#14141A] px-2.5 py-1 rounded-full border border-[#DFB76C]/30 hover:border-[#DFB76C]"
          >
            <span>Hiring Barbers:</span>
            <span className="text-white">bannermwangi0@gmail.com</span>
          </a>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-14">
          <button
            onClick={onBookNow}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-xl shadow-[#C5A059]/25 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Book Your Barber</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={`https://wa.me/${SHOP_INFO.phoneInternational}?text=Hello%20Mwingi%20Home%20Boyz%20Cut,%20I%20would%20like%20to%20book%20a%20chair%20session`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp 0746145712</span>
          </a>

          <button
            onClick={onTrackOrPay}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#14141A]/90 hover:bg-[#1E1E26] border border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs tracking-wider uppercase backdrop-blur-md transition-colors"
          >
            Track / Pay Online
          </button>
        </div>

        {/* Executive Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-zinc-800/80">
          <div className="text-center p-3 rounded-xl bg-[#111116]/80 border border-zinc-800/60 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold font-serif text-white tabular-nums">
              KSh 300+
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Accessible Luxury Cuts
            </div>
          </div>

          <div className="text-center p-3 rounded-xl bg-[#111116]/80 border border-zinc-800/60 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#DFB76C] flex items-center justify-center gap-1">
              <span>4.98</span>
              <Star className="w-4 h-4 fill-current inline" />
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              1,240+ Verified Clients
            </div>
          </div>

          <div className="text-center p-3 rounded-xl bg-[#111116]/80 border border-zinc-800/60 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold font-serif text-white tabular-nums">
              4 Artisans
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Dedicated Master Crew
            </div>
          </div>

          <div className="text-center p-3 rounded-xl bg-[#111116]/80 border border-zinc-800/60 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-400">
              Instant SMS
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Automated Reminders
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
