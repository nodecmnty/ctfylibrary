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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 mb-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded bg-[#11141A] border border-[#252A34] animate-pulse space-y-2.5"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-12 bg-[#1C212B] rounded" />
              <div className="h-4 w-8 bg-[#1C212B] rounded" />
            </div>
            <div className="h-4 w-3/4 bg-[#1C212B] rounded" />
            <div className="h-3 w-1/2 bg-[#1C212B]/70 rounded" />
            <div className="flex gap-1">
              <div className="h-3 w-10 bg-[#1C212B] rounded" />
              <div className="h-3 w-10 bg-[#1C212B] rounded" />
            </div>
            <div className="pt-2 border-t border-[#252A34] flex justify-between">
              <div className="h-3 w-14 bg-[#1C212B] rounded" />
              <div className="h-3 w-10 bg-[#1C212B] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError && assets.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded bg-[#11141A] border border-[#252A34] my-6 font-mono text-xs">
        <div className="w-10 h-10 mx-auto mb-2 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-gray-200 mb-1">PIPELINE ERROR: SYNC FAILED</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-4 text-[11px]">
          Unable to establish connection to Google Sheets stream. Verify connection parameters or retry pipeline.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-white text-xs font-mono font-bold transition-colors"
          >
            RETRY STREAM
          </button>
        )}
      </div>
    );
  }

  // Empty Filter Results
  if (assets.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded bg-[#11141A] border border-[#252A34] my-6 font-mono text-xs">
        <div className="w-10 h-10 mx-auto mb-2 rounded bg-[#161B22] text-gray-400 flex items-center justify-center">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-gray-200 mb-1">NO MATCHING ASSETS FOUND</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-4 text-[11px]">
          No assets match current query filter parameters. Reset active search or filters.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-gray-300 text-xs font-mono transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET FILTERS</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 mb-8">
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

