import React from 'react';
import { Download, Calendar, Copy, Check, Heart, Star, Lock, Sparkles, Flame } from 'lucide-react';
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
      className="flex flex-col justify-between p-5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/90 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-indigo-500/5 hover:-translate-y-1"
    >
      <div>
        {/* Card Header: Code, Badges, Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
              #{asset.Kode}
            </span>

            {/* Type Badges */}
            {type === 'paid' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Lock className="w-2.5 h-2.5" /> Paid
              </span>
            )}
            {type === 'pro' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> Pro
              </span>
            )}
            {type === 'free' && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Gratis
              </span>
            )}

            {isTrending && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}

            {isNew && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                <Sparkles className="w-2.5 h-2.5" /> Baru
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => onToggleFavorite(asset.Kode, e)}
            className={`p-1.5 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30'
            }`}
            title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Asset Title */}
        <h3 className="font-bold text-base text-neutral-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1">
          {asset.Nama || 'Untitled Asset'}
        </h3>

        {/* Category */}
        <p className="text-xs text-neutral-400 font-medium mb-3">
          {asset.Kategori || 'General'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-800/60 text-neutral-400 border border-neutral-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Downloads, Date, Copy Code */}
      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono text-[11px]">
            <Download className="w-3.5 h-3.5" />
            {downloadCount}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
            <Calendar className="w-3 h-3" />
            {formatDateIndonesian(asset.Tanggal)}
          </span>
        </div>

        <button
          onClick={(e) => onCopyCode(asset.Kode, e)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-indigo-600 hover:text-white text-neutral-300 text-[11px] font-mono transition-colors"
          title="Salin Kode Asset"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>{asset.Kode}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
