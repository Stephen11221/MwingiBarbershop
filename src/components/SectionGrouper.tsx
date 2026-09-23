import React from 'react';
import { Users, Scissors, Image as ImageIcon, ShoppingBag, Crown, Layers } from 'lucide-react';

export type GroupSectionId = 'all' | 'crew' | 'services' | 'gallery' | 'shop' | 'loyalty';

interface SectionGrouperProps {
  activeSection: GroupSectionId;
  onSelectSection: (section: GroupSectionId) => void;
}

export const SectionGrouper: React.FC<SectionGrouperProps> = ({
  activeSection,
  onSelectSection
}) => {
  const sections: { id: GroupSectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'crew', label: 'The Crew Only', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Services & Pricing', icon: <Scissors className="w-3.5 h-3.5" /> },
    { id: 'gallery', label: 'Recent Styles', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'shop', label: 'Apothecary Shop', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'loyalty', label: 'Loyalty Club', icon: <Crown className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="sticky top-20 z-30 py-3.5 bg-[#0B0B0D]/95 backdrop-blur-md border-y border-[#1E1E26] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold hidden md:flex items-center gap-1.5 shrink-0">
          <span>Filter Page:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSection(s.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === s.id
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black shadow-md shadow-[#C5A059]/20'
                  : 'bg-[#15151C] text-zinc-400 hover:text-white hover:bg-[#1E1E28] border border-zinc-800'
              }`}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
