import React from 'react';
import { Sparkles, Download, Flame, ChevronRight } from 'lucide-react';
import { Asset } from '../types';
import { getItemType } from '../services/api';

interface FeaturedCarouselProps {
  assets: Asset[];
  downloads: Record<string, number>;
  onSelectAsset: (asset: Asset) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  assets,
  downloads,
  onSelectAsset,
}) => {
  if (!assets || assets.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-neutral-100 tracking-tight">
            Terbaru & Pilihan Editor
          </h2>
        </div>
        <span className="text-xs text-neutral-500 font-medium">Geser untuk melihat</span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {assets.map((item) => {
          const type = getItemType(item);
          const dlCount = downloads[item.Kode] || 0;
          const isTrending = dlCount > 30;

          return (
            <div
              key={item.Kode}
              onClick={() => onSelectAsset(item)}
              className="flex-none w-56 sm:w-64 p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer group shadow-sm hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-semibold text-neutral-400 group-hover:text-indigo-300 transition-colors">
                  #{item.Kode}
                </span>

                <div className="flex items-center gap-1">
                  {type === 'paid' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                      Paid
                    </span>
                  )}
                  {type === 'pro' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                      ⭐ Pro
                    </span>
                  )}
                  {type === 'free' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      Gratis
                    </span>
                  )}
                  {isTrending && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Hot
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-sm text-neutral-200 group-hover:text-white line-clamp-1 mb-1.5 transition-colors">
                {item.Nama || 'Untitled Asset'}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
                <span className="text-neutral-500 truncate max-w-[120px]">
                  {item.Kategori || 'General'}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium font-mono">
                  <Download className="w-3 h-3" />
                  {dlCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
