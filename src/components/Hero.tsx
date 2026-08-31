import React from 'react';
import { Sparkles, Video, Flame, Film, Layers } from 'lucide-react';

interface HeroProps {
  onQuickCategorySelect: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickCategorySelect }) => {
  return (
    <section className="relative pt-8 pb-6 sm:pt-12 sm:pb-8 text-center px-4 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Hub Resource Motion Design No. 1 Indonesia</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Asset Pilihan untuk{' '}
          <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Motion Designer
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Preset, Template & Asset yang Dipakai Kreator Nyata — Temukan preset Alight Motion, CapCut, Premiere Pro, dan After Effects pilihanmu.
        </p>

        {/* Quick Tag Shortcuts */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Populer:
          </span>
          <button
            onClick={() => onQuickCategorySelect('Alight Motion')}
            className="px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 hover:border-indigo-500/40 border border-neutral-800 text-neutral-400 transition-colors"
          >
            #Alight Motion
          </button>
          <button
            onClick={() => onQuickCategorySelect('CapCut')}
            className="px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 hover:border-indigo-500/40 border border-neutral-800 text-neutral-400 transition-colors"
          >
            #CapCut
          </button>
          <button
            onClick={() => onQuickCategorySelect('Transition')}
            className="px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 hover:border-indigo-500/40 border border-neutral-800 text-neutral-400 transition-colors"
          >
            #Transition
          </button>
          <button
            onClick={() => onQuickCategorySelect('Velocity')}
            className="px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 hover:border-indigo-500/40 border border-neutral-800 text-neutral-400 transition-colors"
          >
            #Velocity
          </button>
          <button
            onClick={() => onQuickCategorySelect('Sound Effect')}
            className="px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 hover:border-indigo-500/40 border border-neutral-800 text-neutral-400 transition-colors"
          >
            #SFX
          </button>
        </div>
      </div>
    </section>
  );
};
