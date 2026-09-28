import React from 'react';
import { Barber } from '../types.ts';
import { Scissors, Star, Calendar, Users, ShieldCheck, Zap } from 'lucide-react';
import { BARBERSHOP_WORKERS_CREW_IMAGE } from '../data/mockData.ts';

interface BarbersSectionProps {
  barbers: Barber[];
  onBookBarber: (barber: Barber) => void;
}

export const BarbersSection: React.FC<BarbersSectionProps> = ({
  barbers,
  onBookBarber
}) => {
  return (
    <section id="crew" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Clean, high-impact header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFB76C] mb-2 flex items-center justify-center gap-1.5">
          <Scissors className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span>The Master Crew & Workers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
          Craftsmen On Duty
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-zinc-400">
          Our licensed resident barbers and grooming specialists dedicated to your sharpest look.
        </p>
      </div>

      {/* Featured Master Workers Team Showcase Banner */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-[#121217] via-[#1A1A24] to-[#121217] border border-[#C5A059]/30 overflow-hidden shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={BARBERSHOP_WORKERS_CREW_IMAGE}
              alt="Mwingi Home Boyz Cut Barber Team and Workers"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#121217]/40 to-[#121217]" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#DFB76C]/40 text-[#DFB76C] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Team Active Today</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Artisan Collective</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">
              Mwingi Home Boyz Craftsmen
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-light">
              Master specialists in surgical fades, hot-lather razor contouring, beard architecture, and restorative ozone scalp therapy. Every station is equipped with medical-grade UV sterilization.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-1.5 text-[#DFB76C] text-xs font-medium mb-0.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>High-Speed Chair</span>
                </div>
                <div className="text-white font-semibold text-sm">30–45 Mins</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-1.5 text-[#DFB76C] text-xs font-medium mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sterilized Tools</span>
                </div>
                <div className="text-white font-semibold text-sm">100% Certified</div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#DFB76C] text-[#DFB76C]" />
              <span>4.98 Collective Rating from 1,240+ client sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Barber Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {barbers.map(barber => (
          <div
            key={barber.id}
            className="group relative flex flex-col justify-between rounded-2xl bg-[#121217] border border-[#22222A] overflow-hidden hover:border-[#DFB76C]/60 transition-all hover:-translate-y-1.5 shadow-xl"
          >
            {/* Barber Portrait */}
            <div className="relative aspect-[1/1] w-full overflow-hidden bg-black/60">
              <img
                src={barber.image}
                alt={barber.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/10 to-transparent" />

              {/* Star rating overlay */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-zinc-800 text-[11px] font-medium text-[#DFB76C] flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>{barber.rating}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif text-white group-hover:text-[#DFB76C] transition-colors leading-snug">
                  {barber.name}
                </h3>
                <div className="text-xs text-[#DFB76C] font-medium mt-0.5 mb-1.5">
                  {barber.role}
                </div>
                <div className="text-[12px] text-zinc-400 leading-snug mb-5">
                  {barber.specialty}
                </div>
              </div>

              {/* Dedicated Barber Booking Button */}
              <button
                onClick={() => onBookBarber(barber)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md shadow-[#C5A059]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-black" />
                <span>Book {barber.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
