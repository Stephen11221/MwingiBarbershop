import React, { useState } from 'react';
import { Service } from '../types.ts';
import { Clock, Check, ArrowRight, Sparkles } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'cuts', label: 'Cuts & Fades' },
    { id: 'beards', label: 'Beard & Shaves' },
    { id: 'facials', label: 'Facial & Skin Care' },
    { id: 'packages', label: 'VIP Packages' }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>Mwingi Executive Menu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
            Categorized Grooming & Rates
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Clear Kenyan Shillings pricing, estimated chair duration, and professional hygiene standards.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-[#131317] border border-[#22222A] rounded-xl overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#272732] text-white shadow-sm border border-zinc-700 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#121216] border border-[#22222A] hover:border-[#DFB76C]/60 transition-all hover:-translate-y-1 shadow-lg"
          >
            <div>
              {/* Category & Duration Row */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                <span className="text-[#DFB76C] font-medium tracking-wide uppercase text-[11px]">
                  {service.categoryTitle}
                </span>
                <span className="flex items-center gap-1 text-zinc-400 font-mono tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {service.durationMinutes} mins
                </span>
              </div>

              {/* Title & Price in Kenyan Shillings */}
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <h3 className="text-base font-semibold font-serif text-white group-hover:text-[#DFB76C] transition-colors leading-snug">
                  {service.name}
                </h3>
                <span className="text-lg font-bold font-serif text-[#DFB76C] tabular-nums shrink-0">
                  {SHOP_INFO.currency} {service.price.toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                {service.description}
              </p>

              {/* Ritual Highlights */}
              <div className="space-y-1.5 mb-6 pt-4 border-t border-[#1C1C24]">
                {service.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onSelectService(service)}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#1B1B22] hover:bg-gradient-to-r hover:from-[#C5A059] hover:to-[#DFB76C] text-zinc-200 hover:text-black font-semibold text-xs tracking-wider uppercase border border-zinc-800 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book This Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
