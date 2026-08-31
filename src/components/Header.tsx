import React from 'react';
import { Sun, Moon, Heart, RefreshCw, Radio, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 bg-neutral-950/80 border-neutral-800/80 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <a
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            <div className="relative flex items-center">
              <svg
                className="h-9 w-auto transform transition-transform group-hover:scale-105"
                viewBox="0 0 500 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                  <path d="M1 1823 l0 -178 20 62 c23 74 67 134 134 185 91 69 116 73 420 73 260 0 272 -1 328 -23 81 -33 166 -114 203 -194 l29 -63 3 -287 3 -288 -160 0 -159 0 -4 193 c-3 216 -10 242 -84 307 -51 44 -93 60 -161 60 -100 -1 -175 -46 -219 -132 l-24 -47 0 -493 c0 -476 1 -493 21 -534 74 -153 275 -186 396 -65 61 61 68 87 71 299 l4 192 159 0 160 0 -3 -293 -3 -292 -29 -60 c-38 -76 -105 -143 -181 -181 l-60 -29 -290 0 -290 0 -60 28 c-103 48 -190 151 -214 254 -6 27 -9 -13 -10 -139 l-1 -178 2500 0 2500 0 -1 553 c0 303 -4 541 -8 527 -14 -45 -39 -84 -73 -116 -60 -57 -92 -68 -215 -72 l-113 -4 0 -429 0 -429 -160 0 -160 0 0 429 0 429 -112 4 c-125 4 -168 19 -227 79 -68 67 -66 54 -69 489 l-3 396 23 33 c39 58 72 76 137 76 48 0 64 -5 96 -29 61 -47 65 -67 65 -319 0 -265 7 -302 74 -371 98 -100 254 -98 353 6 57 59 61 82 64 328 1 123 6 242 11 264 11 51 60 103 109 118 74 22 158 -15 189 -85 l20 -42 0 83 0 82 -2500 0 -2500 0 1 -177z m1639 -148 l0 -295 405 0 405 0 0 -135 0 -135 -405 0 -405 0 0 -302 c0 -341 2 -351 80 -422 130 -117 337 -62 396 106 10 29 14 89 14 219 l0 179 161 0 160 0 -3 -307 -3 -308 -28 -53 c-37 -70 -97 -128 -166 -161 l-56 -26 -315 0 -315 0 -49 25 c-77 39 -132 94 -168 168 l-33 67 -3 837 -3 838 166 0 165 0 0 -295z m1798 277 c118 -37 197 -116 234 -234 14 -46 18 -92 18 -199 l0 -139 -164 0 -164 0 -4 64 c-8 126 -98 216 -223 224 -78 5 -120 -8 -174 -54 -76 -65 -85 -96 -89 -281 l-4 -163 411 0 411 0 0 -140 0 -140 -410 0 -410 0 0 -430 0 -430 -160 0 -160 0 0 830 c0 812 0 830 21 884 24 66 96 149 153 178 84 43 110 47 388 47 232 1 274 -1 326 -17z"/>
                </g>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                MOTION ASSETS
              </span>
              <span className="text-[10px] text-neutral-400 font-mono leading-none">by @imctfy</span>
            </div>
          </a>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                syncStatus === 'live'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : syncStatus === 'offline'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncStatus === 'live'
                    ? 'bg-emerald-400 animate-pulse'
                    : syncStatus === 'offline'
                    ? 'bg-amber-400'
                    : 'bg-neutral-500'
                }`}
              />
              <span className="capitalize">{syncStatus === 'live' ? 'Online Sync' : syncStatus}</span>
            </div>

            {/* Refresh Button */}
            <button
              id="header-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              title="Perbarui Data dari Google Sheets"
              className="p-2 rounded-xl text-neutral-400 hover:text-indigo-400 hover:bg-neutral-800/80 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            {/* Favorites Toggle */}
            <button
              id="header-fav-btn"
              onClick={toggleFavFilter}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isFavFilterActive
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/10'
                  : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavFilterActive ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                }`}
              />
              <span className="hidden xs:inline">Favorit</span>
              {favoritesCount > 0 && (
                <span className="bg-rose-500/30 text-rose-200 text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              id="header-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 transition-all active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
