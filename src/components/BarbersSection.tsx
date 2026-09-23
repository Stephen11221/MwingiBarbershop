import React from 'react';
import { Barber } from '../types.ts';
import { Scissors, Star, Calendar } from 'lucide-react';

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
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFB76C] mb-2 flex items-center justify-center gap-1.5">
          <Scissors className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span>The Master Crew</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
          Select Your Barber
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-zinc-400">
          Choose your craftsman below to reserve your dedicated chair.
        </p>
      </div>

      {/* Focused Crew Grid - Clean, no unnecessary text clutter */}
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
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/10 to-transparent" />

              {/* Star rating overlay */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-zinc-800 text-[11px] font-medium text-[#DFB76C] flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>{barber.rating}</span>
              </div>
            </div>

            {/* Profile Info - Focused only on Name, Specialty & Direct Booking */}
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
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md shadow-[#C5A059]/20 flex items-center justify-center gap-2"
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
