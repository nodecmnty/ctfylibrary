import React from 'react';
import { Sun, Moon, Heart, RefreshCw, Activity, Database } from 'lucide-react';
import { SyncStatusType } from '../types';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  favoritesCount: number;
  isFavFilterActive: boolean;
  toggleFavFilter: () => void;
  syncStatus: SyncStatusType;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  favoritesCount,
  isFavFilterActive,
  toggleFavFilter,
  syncStatus,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="h-14 border-b border-[#252A34] bg-[#11141A] flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 select-none">
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-bold text-white shadow-md shadow-green-900/30 text-xs font-mono tracking-tighter">
            CT
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight uppercase text-[#E5E7EB]">
                CTFY &bull; Motion Hub
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#1C212B] border border-[#2D333E] text-green-400">
                v9.0
              </span>
            </div>
            <span className="text-[10px] text-green-500 font-mono flex items-center gap-1 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {syncStatus === 'live' ? 'SHEET SYNC ACTIVE' : 'CACHE MODE ACTIVE'}
            </span>
          </div>
        </a>
      </div>

      {/* Right Actions & Density Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Environment Status Badge */}
        <div className="hidden lg:flex items-center gap-4 border-r border-[#252A34] pr-4">
          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">
              Data Pipeline
            </div>
            <div className="text-xs font-mono text-gray-300 flex items-center gap-1 justify-end">
              <Database className="w-3 h-3 text-blue-400" /> Google Sheets
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">
              Sync Mode
            </div>
            <div className={`text-xs font-mono ${syncStatus === 'live' ? 'text-green-400' : 'text-yellow-400'}`}>
              {syncStatus === 'live' ? 'Live Stream' : 'Local Fallback'}
            </div>
          </div>
        </div>

        {/* Sync Indicator Pill */}
        <div
          className={`flex items-center gap-1.5 bg-[#1C212B] px-2.5 py-1 rounded border border-[#2D333E] text-[11px] font-mono ${
            syncStatus === 'live'
              ? 'text-green-400'
              : syncStatus === 'offline'
              ? 'text-yellow-400'
              : 'text-gray-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === 'live'
                ? 'bg-green-500'
                : syncStatus === 'offline'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
            }`}
          />
          <span className="uppercase text-[10px] font-bold tracking-wider">
            {syncStatus === 'live' ? 'ONLINE' : syncStatus === 'offline' ? 'OFFLINE' : 'LOCAL'}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          id="header-refresh-btn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Perbarui Data dari Google Sheets"
          className="h-8 px-2.5 rounded bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-gray-300 hover:text-green-400 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-green-400' : ''}`} />
          <span className="hidden sm:inline text-[11px]">SYNC</span>
        </button>

        {/* Favorites Toggle */}
        <button
          id="header-fav-btn"
          onClick={toggleFavFilter}
          className={`h-8 px-2.5 rounded border text-xs font-mono flex items-center gap-1.5 transition-colors ${
            isFavFilterActive
              ? 'bg-[#2D1B24] border-red-500/50 text-red-400'
              : 'bg-[#161B22] hover:bg-[#1C212B] border-[#30363D] text-gray-300'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isFavFilterActive ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
          <span className="hidden xs:inline text-[11px]">FAV</span>
          {favoritesCount > 0 && (
            <span className="bg-red-500/20 text-red-300 text-[10px] font-mono px-1 rounded">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          id="header-theme-toggle"
          onClick={toggleTheme}
          className="h-8 w-8 rounded bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-gray-400 hover:text-yellow-400 flex items-center justify-center transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-300" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
        </button>
      </div>
    </header>
  );
};

