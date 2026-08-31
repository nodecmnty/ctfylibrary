import React from 'react';
import { Layers, Search, Tag, Download, Wifi, WifiOff, Activity } from 'lucide-react';
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
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2.5 rounded bg-[#11141A] border border-[#252A34] mb-4 text-xs font-mono">
      {/* Metric 1: Total */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#161B22] rounded border border-[#252A34]">
        <Layers className="w-3.5 h-3.5 text-green-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase">TOTAL ITEMS</span>
          <span className="text-xs font-bold text-gray-200">{totalAssets}</span>
        </div>
      </div>

      {/* Metric 2: Filtered */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#161B22] rounded border border-[#252A34]">
        <Search className="w-3.5 h-3.5 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase">FILTERED</span>
          <span className="text-xs font-bold text-blue-400">{filteredCount}</span>
        </div>
      </div>

      {/* Metric 3: Categories */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#161B22] rounded border border-[#252A34]">
        <Tag className="w-3.5 h-3.5 text-purple-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase">CATEGORIES</span>
          <span className="text-xs font-bold text-purple-300">{totalCategories}</span>
        </div>
      </div>

      {/* Metric 4: Downloads */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#161B22] rounded border border-[#252A34]">
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase">DOWNLOADS</span>
          <span className="text-xs font-bold text-emerald-400">{totalDownloads.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Metric 5: Sync Status */}
      <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start gap-2 px-2 py-1 bg-[#161B22] rounded border border-[#252A34]">
        <div className="flex items-center gap-2">
          {syncStatus === 'live' ? (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          ) : syncStatus === 'offline' ? (
            <WifiOff className="w-3.5 h-3.5 text-yellow-400" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-gray-400" />
          )}
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase">STATUS</span>
            <span className={`text-xs font-bold ${syncStatus === 'live' ? 'text-green-400' : 'text-yellow-400'}`}>
              {syncStatus === 'live' ? 'LIVE SHEET' : syncStatus === 'offline' ? 'OFFLINE' : 'LOCAL CACHE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

