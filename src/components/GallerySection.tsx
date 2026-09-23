import React, { useState } from 'react';
import { GalleryItem } from '../types.ts';
import { ZoomIn, X, Sparkles } from 'lucide-react';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  onBookStyle: (styleName: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  onBookStyle
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [inspectedItem, setInspectedItem] = useState<GalleryItem | null>(null);

  const filters = [
    { id: 'all', label: 'All Styles' },
    { id: 'fades', label: 'Precision Fades' },
    { id: 'beard', label: 'Beard Sculpting' },
    { id: 'facials', label: 'Crew At Work' }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-[#0E0E12] border-y border-[#1E1E24] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Mwingi Master Cuts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
              Recent Styles & Lineups
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Authentic African tapers, skin drop fades, deep 360 wave sculpting, and sharp beard architecture.
            </p>
          </div>

          {/* Interactive Filters */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-[#141419] border border-[#22222A] rounded-xl overflow-x-auto">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#252530] text-white shadow-sm border border-zinc-700 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-[#131317] border border-[#22222A] flex flex-col justify-between hover:border-[#DFB76C]/50 transition-all hover:-translate-y-1 shadow-xl"
            >
              {/* Image with Scrim and Hover Zoom */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131317] via-transparent to-transparent opacity-80" />

                <button
                  onClick={() => setInspectedItem(item)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
                  aria-label="Inspect style"
                >
                  <ZoomIn className="w-4 h-4 text-[#DFB76C]" />
                </button>
              </div>

              {/* Content Block */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                    <span className="text-[#DFB76C] uppercase tracking-wider font-semibold">
                      {item.categoryLabel}
                    </span>
                    <span>by {item.barberName}</span>
                  </div>

                  <h3 className="text-sm font-semibold font-serif text-white group-hover:text-[#DFB76C] transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1E1E26] flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400 truncate max-w-[160px]">
                    {item.productUsed}
                  </div>
                  <button
                    onClick={() => onBookStyle(item.title)}
                    className="text-xs text-[#DFB76C] hover:text-white font-medium hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Request Cut</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#121217] border border-[#272733] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setInspectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[16/10] w-full bg-black">
              <img
                src={inspectedItem.image}
                alt={inspectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="text-xs text-[#DFB76C] uppercase tracking-wider font-semibold mb-1">
                {inspectedItem.categoryLabel} · Crafted by {inspectedItem.barberName}
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">
                {inspectedItem.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {inspectedItem.description}
              </p>
              <button
                onClick={() => {
                  onBookStyle(inspectedItem.title);
                  setInspectedItem(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer"
              >
                Book This Specific Cut & Style
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
