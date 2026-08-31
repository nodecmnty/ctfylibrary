import React from 'react';
import { Sparkles, Download, Flame } from 'lucide-react';
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
    <div className="mb-4 bg-[#11141A] p-3 rounded border border-[#252A34]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-green-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E5E7EB]">
            FEATURED & RECENT RELEASES
          </h2>
        </div>
        <span className="text-[10px] font-mono text-gray-500">SCROLL HORIZONTAL &rarr;</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {assets.map((item) => {
          const type = getItemType(item);
          const dlCount = downloads[item.Kode] || 0;
          const isTrending = dlCount > 30;

          return (
            <div
              key={item.Kode}
              onClick={() => onSelectAsset(item)}
              className="flex-none w-52 p-2.5 rounded bg-[#161B22] hover:bg-[#1C212B] border border-[#252A34] hover:border-green-500/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] font-bold text-green-400">
                  #{item.Kode}
                </span>

                <div className="flex items-center gap-1">
                  {type === 'paid' && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                      PAID
                    </span>
                  )}
                  {type === 'pro' && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                      PRO
                    </span>
                  )}
                  {type === 'free' && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      FREE
                    </span>
                  )}
                  {dlCount > 25 && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> HOT
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-xs text-[#E5E7EB] group-hover:text-green-300 line-clamp-1 mb-1 transition-colors">
                {item.Nama || 'Untitled Asset'}
              </h3>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1.5 border-t border-[#252A34]">
                <span className="text-gray-500 truncate max-w-[100px]">
                  {item.Kategori || 'General'}
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                  <Download className="w-2.5 h-2.5" />
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

