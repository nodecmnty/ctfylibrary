import React from 'react';
import { Download, Calendar, Copy, Check, Heart, Star, Lock, Sparkles, Flame, Terminal } from 'lucide-react';
import { Asset } from '../types';
import { getItemType, getTags, formatDateIndonesian, isNewItem } from '../services/api';

interface AssetCardProps {
  asset: Asset;
  downloadCount: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (asset: Asset) => void;
  onCopyCode: (code: string, e: React.MouseEvent) => void;
  isCopied: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  downloadCount,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onCopyCode,
  isCopied,
}) => {
  const type = getItemType(asset);
  const tags = getTags(asset);
  const isTrending = downloadCount > 25;
  const isNew = isNewItem(asset.Tanggal);

  return (
    <div
      onClick={() => onSelect(asset)}
      className="flex flex-col justify-between p-3 rounded bg-[#11141A] hover:bg-[#161B22] border border-[#252A34] hover:border-green-500/40 transition-colors cursor-pointer group select-none relative"
    >
      <div>
        {/* Card Header: Code, Badges, Favorite */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#1C212B] text-green-400 border border-[#2D333E]">
              #{asset.Kode}
            </span>

            {/* Type Badges */}
            {type === 'paid' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Lock className="w-2.5 h-2.5" /> PAID
              </span>
            )}
            {type === 'pro' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> PRO
              </span>
            )}
            {type === 'free' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                FREE
              </span>
            )}

            {isTrending && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Flame className="w-2.5 h-2.5" /> HOT
              </span>
            )}

            {isNew && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-mono font-bold bg-green-500/15 border border-green-500/30 text-green-300">
                <Sparkles className="w-2.5 h-2.5" /> NEW
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => onToggleFavorite(asset.Kode, e)}
            className={`p-1 rounded border transition-colors ${
              isFavorite
                ? 'bg-[#2D1B24] border-red-500/50 text-red-400'
                : 'bg-[#161B22] hover:bg-[#1C212B] border-[#30363D] text-gray-500 hover:text-red-400'
            }`}
            title={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Asset Title */}
        <h3 className="font-semibold text-xs text-[#E5E7EB] group-hover:text-green-300 transition-colors line-clamp-2 mb-1">
          {asset.Nama || 'Untitled Asset'}
        </h3>

        {/* Category */}
        <p className="text-[10px] font-mono text-gray-500 mb-2">
          DIR: {asset.Kategori || 'General'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#161B22] text-gray-400 border border-[#252A34]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Downloads, Date, Copy Code */}
      <div className="pt-2 border-t border-[#252A34] flex items-center justify-between text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
            <Download className="w-2.5 h-2.5" />
            {downloadCount}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500 text-[9px]">
            {formatDateIndonesian(asset.Tanggal)}
          </span>
        </div>

        <button
          onClick={(e) => onCopyCode(asset.Kode, e)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#161B22] hover:bg-green-600 hover:text-white border border-[#30363D] text-gray-300 text-[10px] font-mono transition-colors"
          title="Salin Kode Asset"
        >
          {isCopied ? (
            <>
              <Check className="w-2.5 h-2.5 text-green-300" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-2.5 h-2.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

