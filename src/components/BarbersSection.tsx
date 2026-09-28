import React from 'react';
import { Barber } from '../types.ts';
import { Scissors, Star, Calendar, Users, ShieldCheck, Zap, Briefcase, Mail } from 'lucide-react';
import { BARBERSHOP_WORKERS_CREW_IMAGE, SHOP_INFO } from '../data/mockData.ts';

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
          <div className="lg:col-span-7 relative overflow-hidden bg-black">
            <img
              src="/team.jpg"
              alt="Mwingi Team"
              className="w-full h-[500px] object-cover rounded-xl"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = '/team.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#121217]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#DFB76C]/50 text-[#DFB76C] text-[11px] font-semibold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Team Active Today · Mwingi</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-zinc-800 text-xs text-zinc-300">
              <span className="font-semibold text-[#DFB76C]">Mwingi Home Boyz</span> · 4 Kenyan Master Barbers Since 2019
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Artisan Collective</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">
              Mwingi Home Boyz Master Team
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-light">
              Master specialists in surgical fades, hot-lather razor contouring, beard architecture, and restorative ozone scalp therapy in our Mwingi executive shop along Mwingi Level IV Hospital. Every station is equipped with medical-grade UV sterilization.
            </p>

            {/* Quick visual preview of Shop & Cut */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black group">
                <img
                  src="/shop.jpg"
                  alt="Shop Interior"
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/shop.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <span className="text-[10px] font-medium text-[#DFB76C]">4-Chair Interior</span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black group">
                <img
                  src="/cut.jpg"
                  alt="Fresh Fade Cut"
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/cut.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <span className="text-[10px] font-medium text-[#DFB76C]">Fresh Fade Craft</span>
                </div>
              </div>
            </div>

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
                onError={(e) => {
                  e.currentTarget.src = '/team.jpg';
                }}
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

      {/* Careers & Job Inquiries Banner */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#14141C] via-[#1A1A24] to-[#14141C] border border-[#DFB76C]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DFB76C]/10 border border-[#DFB76C]/40 flex items-center justify-center text-[#DFB76C] shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#DFB76C]">
                Join Our Master Team
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                Open Positions
              </span>
            </div>
            <h4 className="text-lg font-serif font-bold text-white">
              Are you an experienced barber in Mwingi or Kitui County?
            </h4>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl font-light">
              Workstation: Mwingi Kitui County along Mwingi level IV hospital. Send your portfolio and background directly to our Managing Director.
            </p>
          </div>
        </div>

        <a
          href="mailto:bannermwangi0@gmail.com?subject=Job%20Application%20-%20Barber%20Position%20at%20Mwingi%20Home%20Boyz&body=Dear%20Banner%20Mwangi,%0A%0AI%20am%20interested%20in%20joining%20the%20Mwingi%20Home%20Boyz%20Executive%20Barbershop%20team%20at%20the%20Mwingi%20workstation%20(along%20Mwingi%20level%20IV%20hospital).%0A%0AMy%20Full%20Name:%0APhone%20Number:%0APortfolio/Instagram:%0AYears%20of%20Experience:%0AClipper%20Skills%20(Fades,%20Beard,%20Waves,%20Dreadlocks):%0A%0AThank%20you!"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
        >
          <Mail className="w-4 h-4 text-black" />
          <span>Apply to bannermwangi0@gmail.com</span>
        </a>
      </div>
    </section>
  );
};
