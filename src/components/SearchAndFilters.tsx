import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, Star, Lock, Heart, ArrowUpDown, Filter } from 'lucide-react';
import { FilterType, SortType } from '../types';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: { name: string; count: number }[];
  sortType: SortType;
  setSortType: (s: SortType) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortType,
  setSortType,
  onReset,
  isFiltered,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar and Sort */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            id="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari preset, template, atau kode asset (cth: XML, Jedag Jedug, 001)..."
            className="w-full pl-10 pr-20 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-neutral-500 bg-neutral-800 border border-neutral-700 rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <select
              id="sort-select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="w-full appearance-none pl-9 pr-8 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all"
            >
              <option value="newest">🕒 Terbaru Ditambahkan</option>
              <option value="popular">🔥 Paling Banyak Didownload</option>
              <option value="name-asc">🔤 Nama A - Z</option>
              <option value="code-asc">🏷️ Urutkan Berdasarkan Kode</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="px-3.5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => setActiveFilter('free')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'free'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-emerald-300'
          }`}
        >
          Gratis
        </button>

        <button
          onClick={() => setActiveFilter('pro')}
          className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'pro'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-600/30'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-purple-300'
          }`}
        >
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>Pro</span>
        </button>

        <button
          onClick={() => setActiveFilter('paid')}
          className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'paid'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-rose-300'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>Paid</span>
        </button>

        <button
          onClick={() => setActiveFilter('new')}
          className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'new'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-300'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Baru</span>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'fav' ? 'all' : 'fav')}
          className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'fav'
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-rose-300'
          }`}
        >
          <Heart className={`w-3 h-3 ${activeFilter === 'fav' ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>Favorit</span>
        </button>
      </div>

      {/* Category Horizontal Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-neutral-500 text-[11px] font-medium shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                : 'bg-neutral-950/60 hover:bg-neutral-900 text-neutral-400 border border-neutral-800/80'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-neutral-950/60 hover:bg-neutral-900 text-neutral-400 border border-neutral-800/80 hover:text-neutral-300'
              }`}
            >
              {cat.name} <span className="text-[10px] text-neutral-500 ml-1">({cat.count})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
