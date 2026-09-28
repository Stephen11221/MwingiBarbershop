import React from 'react';
import { Sparkles, ShieldCheck, Scissors, Award, MapPin, Camera } from 'lucide-react';

interface ExecutiveVisualShowcaseProps {
  onBookNow?: () => void;
  onOpenPhotoUpload?: () => void;
}

export const ExecutiveVisualShowcase: React.FC<ExecutiveVisualShowcaseProps> = ({ onBookNow, onOpenPhotoUpload }) => {
  return (
    <section className="py-16 bg-[#0B0B0E] relative z-10 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181822] border border-[#DFB76C]/40 text-[#DFB76C] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>MWINGI HOME BOYZ · EST. 2019</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Mwingi's Executive <span className="text-[#DFB76C] italic">Black & Gold</span> Sanctuary
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light max-w-2xl mx-auto">
            Experience premier Kenyan craftsmanship in Mwingi. Meet our resident 4-man master barber team, step inside our luxury 4-chair lounge, and see millimeter precision fades in action.
          </p>
        </div>

        {/* 1. Primary Feature: Team Photo with Exact User-Requested Specifications */}
        <div className="mb-8">
          <div className="relative group overflow-hidden rounded-2xl bg-[#121217] border border-[#DFB76C]/40 shadow-2xl">
            {/* The exact requested code structure */}
            <div className="w-full relative overflow-hidden bg-black">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Badges and Caption */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#DFB76C]/60 text-[#DFB76C] text-xs font-semibold shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Resident Master Crew
                </span>
                <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-zinc-200 text-xs font-medium items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
                  Mwingi Kitui County along Mwingi level IV hospital
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <div className="text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-1">
                    The Craftsmen
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
                    4 Kenyan Master Barbers in Signature Uniforms
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 line-clamp-2 sm:line-clamp-none font-light">
                    Decked in bespoke black leather & cloth aprons with the Mwingi Home Boyz embroidered gold crest. Over 30 years of combined grooming expertise.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
                  {onOpenPhotoUpload && (
                    <button
                      onClick={onOpenPhotoUpload}
                      className="px-4 py-2.5 rounded-xl border border-[#DFB76C]/40 bg-[#DFB76C]/10 hover:bg-[#DFB76C]/20 text-[#DFB76C] font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Upload and replace website photos with your real WhatsApp photos"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Real Photos</span>
                    </button>
                  )}

                  {onBookNow && (
                    <button
                      onClick={onBookNow}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer"
                    >
                      Reserve A Chair
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Secondary Showcase Grid: Shop Interior & Barber Cutting Fade in Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Shop Interior */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#121217] border border-[#262633] hover:border-[#DFB76C]/60 transition-all shadow-xl">
            <div className="w-full relative overflow-hidden bg-black">
              <img
                src="/shop.jpg"
                alt="Mwingi Home Boyz Shop Interior"
                className="w-full h-[280px] sm:h-[350px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/shop.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#DFB76C]/40 text-[#DFB76C] text-xs font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Luxury 4-Chair Studio
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="text-[11px] font-semibold text-[#DFB76C] uppercase tracking-wider mb-0.5">
                  The Atmosphere
                </div>
                <h4 className="text-lg sm:text-xl font-bold font-serif text-white">
                  Executive Black & Gold Interior
                </h4>
                <p className="text-xs text-zinc-300 mt-1 line-clamp-2 font-light">
                  4 ergonomic reclining chairs, black polished marble with gold veining, ambient backlight mirrors, and medical-grade sterilization.
                </p>
              </div>
            </div>
          </div>

          {/* Barber Cutting Fresh Fade */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#121217] border border-[#262633] hover:border-[#DFB76C]/60 transition-all shadow-xl">
            <div className="w-full relative overflow-hidden bg-black">
              <img
                src="/cut.jpg"
                alt="Barber Cutting Fresh Fade Haircut"
                className="w-full h-[280px] sm:h-[350px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/cut.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#DFB76C]/40 text-[#DFB76C] text-xs font-semibold flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  Surgical Fade Detailing
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="text-[11px] font-semibold text-[#DFB76C] uppercase tracking-wider mb-0.5">
                  The Craft
                </div>
                <h4 className="text-lg sm:text-xl font-bold font-serif text-white">
                  Fresh Fade & Razor Lineup in Progress
                </h4>
                <p className="text-xs text-zinc-300 mt-1 line-clamp-2 font-light">
                  Seamless skin tapers, 360 wave enhancement, hot lather straight-razor contours, and crisp beard definition on African hair textures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="p-3 rounded-xl bg-[#121217] border border-zinc-800 text-center">
            <div className="text-xs font-bold text-white">Verified Brand</div>
            <div className="text-[11px] text-[#DFB76C] mt-0.5">Since 2019</div>
          </div>
          <div className="p-3 rounded-xl bg-[#121217] border border-zinc-800 text-center">
            <div className="text-xs font-bold text-white">4 Master Barbers</div>
            <div className="text-[11px] text-[#DFB76C] mt-0.5">Kenyan Artisans</div>
          </div>
          <div className="p-3 rounded-xl bg-[#121217] border border-zinc-800 text-center">
            <div className="text-xs font-bold text-white">Black & Gold Theme</div>
            <div className="text-[11px] text-[#DFB76C] mt-0.5">Executive Standard</div>
          </div>
          <div className="p-3 rounded-xl bg-[#121217] border border-zinc-800 text-center">
            <div className="text-xs font-bold text-white">100% Sanitized</div>
            <div className="text-[11px] text-[#DFB76C] mt-0.5">UV Sterilized Tools</div>
          </div>
        </div>
      </div>
    </section>
  );
};
