import React, { useRef, useEffect } from 'react';
import { Search, X, Star, Lock, Heart, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
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
    <div className="space-y-2.5 mb-4 bg-[#11141A] p-3 rounded border border-[#252A34]">
      {/* Search Bar and Sort Row */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            id="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search query / filter by code (e.g. 001, XML, Jedag Jedug)..."
            className="w-full pl-8 pr-16 py-1.5 rounded bg-[#161B22] border border-[#30363D] text-xs font-mono text-[#E5E7EB] placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-400 hover:text-gray-200 hover:bg-[#1C212B] rounded transition-colors"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-[#1C212B] border border-[#2D333E] rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Sort Selector & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <select
              id="sort-select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="w-full md:w-auto appearance-none pl-7 pr-6 py-1.5 rounded bg-[#161B22] border border-[#30363D] text-[11px] font-mono text-gray-300 focus:outline-none focus:border-green-500 cursor-pointer transition-colors"
            >
              <option value="newest">SORT: NEWEST FIRST</option>
              <option value="popular">SORT: MOST DOWNLOADED</option>
              <option value="name-asc">SORT: NAME (A - Z)</option>
              <option value="code-asc">SORT: CODE INDEX</option>
            </select>
            <ArrowUpDown className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="h-8 px-2.5 rounded bg-[#1C212B] hover:bg-[#252A34] border border-[#2D333E] text-[11px] font-mono text-green-400 hover:text-green-300 transition-colors whitespace-nowrap"
            >
              RESET
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Chips & Categories */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#252A34]/60">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mr-1">
            TYPE:
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              activeFilter === 'all'
                ? 'bg-green-600 text-white font-bold'
                : 'bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-gray-400'
            }`}
          >
            ALL
          </button>

          <button
            onClick={() => setActiveFilter('free')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              activeFilter === 'free'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-emerald-400'
            }`}
          >
            FREE
          </button>

          <button
            onClick={() => setActiveFilter('pro')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              activeFilter === 'pro'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-purple-400'
            }`}
          >
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            PRO
          </button>

          <button
            onClick={() => setActiveFilter('paid')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              activeFilter === 'paid'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-rose-400'
            }`}
          >
            <Lock className="w-2.5 h-2.5" />
            PAID
          </button>

          <button
            onClick={() => setActiveFilter('new')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              activeFilter === 'new'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-amber-400'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            NEW
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'fav' ? 'all' : 'fav')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              activeFilter === 'fav'
                ? 'bg-[#2D1B24] border border-red-500/50 text-red-400 font-bold'
                : 'bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-gray-400'
            }`}
          >
            <Heart className={`w-2.5 h-2.5 ${activeFilter === 'fav' ? 'fill-red-400 text-red-400' : ''}`} />
            FAV
          </button>
        </div>

        {/* Category Horizontal Filter Pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs font-mono max-w-full">
            <span className="text-gray-500 text-[10px] uppercase font-bold shrink-0 mr-1 flex items-center gap-0.5">
              <Filter className="w-2.5 h-2.5" /> CAT:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-1.5 py-0.5 rounded shrink-0 text-[10px] font-mono transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-200 text-gray-900 font-bold'
                  : 'bg-[#161B22] hover:bg-[#1C212B] text-gray-400 border border-[#30363D]'
              }`}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
                className={`px-1.5 py-0.5 rounded shrink-0 text-[10px] font-mono transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-[#1C212B] text-green-400 border border-green-500/50 font-bold'
                    : 'bg-[#161B22] hover:bg-[#1C212B] text-gray-400 border border-[#30363D]'
                }`}
              >
                {cat.name} <span className="text-gray-500">[{cat.count}]</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

