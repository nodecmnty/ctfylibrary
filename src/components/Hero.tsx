import React from 'react';
import { Sparkles, Flame, Terminal, Cpu } from 'lucide-react';

interface HeroProps {
  onQuickCategorySelect: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickCategorySelect }) => {
  return (
    <section className="relative py-4 sm:py-6 border-b border-[#252A34] mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Tagline */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1C212B] border border-[#2D333E] text-[10px] font-mono text-green-400 font-bold uppercase tracking-wider">
              <Cpu className="w-3 h-3 text-green-400" />
              HUB RESOURCE v9.0
            </span>
            <span className="text-[11px] font-mono text-gray-500">
              CTFY MOTION DATABASE &bull; INDONESIA
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E5E7EB] font-sans">
            Motion Design Asset Repository
          </h1>

          <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
            Katalog terkurasi preset Alight Motion, CapCut, Premiere Pro & After Effects dengan tautan langsung dan status live sheet.
          </p>
        </div>

        {/* Quick Tag Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[11px] text-gray-500 uppercase font-semibold mr-1 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> Tags:
          </span>
          {['Alight Motion', 'CapCut', 'Transition', 'Velocity', 'Sound Effect'].map((tag) => (
            <button
              key={tag}
              onClick={() => onQuickCategorySelect(tag)}
              className="px-2 py-1 rounded bg-[#161B22] hover:bg-[#1C212B] hover:text-green-400 hover:border-green-500/40 border border-[#252A34] text-gray-400 text-[11px] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

