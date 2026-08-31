import React from 'react';
import { Search, RotateCcw, AlertCircle } from 'lucide-react';
import { Asset } from '../types';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  isLoading: boolean;
  downloads: Record<string, number>;
  favorites: Set<string>;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectAsset: (asset: Asset) => void;
  onCopyCode: (code: string, e: React.MouseEvent) => void;
  copiedCode: string | null;
  onResetFilters: () => void;
  isError?: boolean;
  onRetry?: () => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  isLoading,
  downloads,
  favorites,
  onToggleFavorite,
  onSelectAsset,
  onCopyCode,
  copiedCode,
  onResetFilters,
  isError,
  onRetry,
}) => {
  // Loading Shimmer Skeletons
  if (isLoading && assets.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 animate-pulse space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-16 bg-neutral-800 rounded-md" />
              <div className="h-5 w-12 bg-neutral-800 rounded-md" />
            </div>
            <div className="h-6 w-3/4 bg-neutral-800 rounded-md" />
            <div className="h-4 w-1/2 bg-neutral-800/80 rounded-md" />
            <div className="flex gap-2">
              <div className="h-4 w-14 bg-neutral-800 rounded-md" />
              <div className="h-4 w-14 bg-neutral-800 rounded-md" />
            </div>
            <div className="pt-3 border-t border-neutral-800 flex justify-between">
              <div className="h-4 w-20 bg-neutral-800 rounded-md" />
              <div className="h-4 w-12 bg-neutral-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError && assets.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 my-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-100 mb-1">Gagal Memuat Data</h3>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-5">
          Tidak dapat terhubung ke server Google Sheets. Periksa koneksi internet Anda atau coba lagi.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Muat Ulang Data
          </button>
        )}
      </div>
    );
  }

  // Empty Filter Results
  if (assets.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 my-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-100 mb-1">Tidak Ada Asset Ditemukan</h3>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-5">
          Coba kata kunci pencarian lain atau reset filter untuk melihat semua koleksi.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Filter</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-12">
      {assets.map((asset) => (
        <AssetCard
          key={asset.Kode}
          asset={asset}
          downloadCount={downloads[asset.Kode] || 0}
          isFavorite={favorites.has(asset.Kode)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelectAsset}
          onCopyCode={onCopyCode}
          isCopied={copiedCode === asset.Kode}
        />
      ))}
    </div>
  );
};
