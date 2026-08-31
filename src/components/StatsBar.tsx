import React from 'react';
import { Layers, Search, Tag, Download, Wifi, WifiOff } from 'lucide-react';
import { SyncStatusType } from '../types';

interface StatsBarProps {
  totalAssets: number;
  filteredCount: number;
  totalCategories: number;
  totalDownloads: number;
  syncStatus: SyncStatusType;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalAssets,
  filteredCount,
  totalCategories,
  totalDownloads,
  syncStatus,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 mb-6 text-xs text-neutral-400">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Total Asset:</span>
          <span className="font-semibold text-neutral-200">{totalAssets}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Hasil Filter:</span>
          <span className="font-semibold text-indigo-400">{filteredCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          <span>Kategori:</span>
          <span className="font-semibold text-neutral-200">{totalCategories}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Total Downloads:</span>
          <span className="font-semibold text-emerald-400">{totalDownloads.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px]">
        {syncStatus === 'live' ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        ) : syncStatus === 'offline' ? (
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
            <WifiOff className="w-3 h-3" />
            Mode Offline
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-neutral-400">
            <Wifi className="w-3 h-3" />
            Local Cache
          </span>
        )}
      </div>
    </div>
  );
};
