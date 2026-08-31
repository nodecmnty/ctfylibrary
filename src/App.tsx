import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchAndFilters } from './components/SearchAndFilters';
import { StatsBar } from './components/StatsBar';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { AssetGrid } from './components/AssetGrid';
import { AssetModal } from './components/AssetModal';
import { Footer } from './components/Footer';
import { Asset, FilterType, SortType, SyncStatusType } from './types';
import {
  fetchAssetsFromGoogleSheets,
  getCachedAssets,
  loadFirestoreDownloads,
  trackAssetDownload,
  getStoredDownloads,
  getItemType,
  isNewItem,
  FAVORITES_KEY
} from './services/api';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>('connecting');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast notification trigger
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Theme Init & Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('ctfy_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ctfy_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    showToast(`Tema ${nextTheme === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'} diaktifkan`);
  };

  // Load Favorites from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  }, []);

  // Save Favorites
  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      const isAdding = !next.has(id);
      if (isAdding) {
        next.add(id);
        showToast(`❤️ Asset #${id} ditambahkan ke favorit`);
      } else {
        next.delete(id);
        showToast(`💔 Asset #${id} dihapus dari favorit`);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  }, [showToast]);

  // Load Stored & Remote Downloads
  useEffect(() => {
    const stored = getStoredDownloads();
    setDownloads(stored);

    loadFirestoreDownloads()
      .then((remote) => {
        setDownloads((prev) => ({ ...prev, ...remote }));
        setSyncStatus('live');
      })
      .catch(() => {
        setSyncStatus('local');
      });
  }, []);

  // Fetch Data from Google Sheets API
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsError(false);

    try {
      const fetched = await fetchAssetsFromGoogleSheets();
      setAssets(fetched);
      setSyncStatus('live');
      if (!isSilent) {
        showToast(`✓ ${fetched.length} asset siap dijelajahi`);
      }
    } catch (err) {
      console.warn('Google Sheets API fallback to cache:', err);
      const cached = getCachedAssets();
      if (cached && cached.length > 0) {
        setAssets(cached);
        setSyncStatus('local');
        if (!isSilent) {
          showToast(`⚠️ Menggunakan ${cached.length} asset tersimpan offline`);
        }
      } else {
        setIsError(true);
        setSyncStatus('offline');
      }
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [showToast]);

  // Initial Data Load (Instant Cached + Live Fetch)
  useEffect(() => {
    const cached = getCachedAssets();
    if (cached && cached.length > 0) {
      setAssets(cached);
      setSyncStatus('local');
      // Fetch fresh in background
      loadData(true);
    } else {
      loadData(false);
    }
  }, [loadData]);

  // Handle URL Query deep-linking `?code=ABC`
  useEffect(() => {
    if (assets.length === 0) return;

    const checkUrlCode = () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        const found = assets.find(
          (a) => String(a.Kode).toLowerCase() === String(code).toLowerCase()
        );
        if (found) {
          setSelectedAsset(found);
          setIsModalOpen(true);
        }
      } else {
        setIsModalOpen(false);
      }
    };

    checkUrlCode();
    window.addEventListener('popstate', checkUrlCode);
    return () => window.removeEventListener('popstate', checkUrlCode);
  }, [assets]);

  // Fuzzy Search Engine with Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(assets, {
      keys: [
        { name: 'Kode', weight: 0.5 },
        { name: 'Nama', weight: 0.35 },
        { name: 'Kategori', weight: 0.15 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [assets]);

  // Dynamic Categories with Count
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      const cat = a.Kategori?.trim() || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [assets]);

  // Filter and Sort Asset List
  const filteredAssets = useMemo(() => {
    let result = assets;

    // Search query with Fuse.js
    if (searchQuery.trim().length > 1) {
      result = fuse.search(searchQuery.trim()).map((res) => res.item);
    }

    // Filter Type
    if (activeFilter === 'free') {
      result = result.filter((a) => getItemType(a) === 'free');
    } else if (activeFilter === 'pro') {
      result = result.filter((a) => getItemType(a) === 'pro');
    } else if (activeFilter === 'paid') {
      result = result.filter((a) => getItemType(a) === 'paid');
    } else if (activeFilter === 'new') {
      result = result.filter((a) => isNewItem(a.Tanggal));
    } else if (activeFilter === 'fav') {
      result = result.filter((a) => favorites.has(a.Kode));
    }

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (a) => (a.Kategori?.trim() || 'General') === selectedCategory
      );
    }

    // Sorting
    const sorted = [...result];
    if (sortType === 'newest') {
      sorted.sort((a, b) => new Date(b.Tanggal || 0).getTime() - new Date(a.Tanggal || 0).getTime());
    } else if (sortType === 'popular') {
      sorted.sort((a, b) => (downloads[b.Kode] || 0) - (downloads[a.Kode] || 0));
    } else if (sortType === 'name-asc') {
      sorted.sort((a, b) => (a.Nama || '').localeCompare(b.Nama || ''));
    } else if (sortType === 'code-asc') {
      sorted.sort((a, b) => (a.Kode || '').localeCompare(b.Kode || '', undefined, { numeric: true }));
    }

    return sorted;
  }, [assets, searchQuery, activeFilter, selectedCategory, sortType, favorites, downloads, fuse]);

  // Featured Editor's Choice Items (Top 6 latest)
  const featuredAssets = useMemo(() => {
    return [...assets]
      .sort((a, b) => new Date(b.Tanggal || 0).getTime() - new Date(a.Tanggal || 0).getTime())
      .slice(0, 6);
  }, [assets]);

  // Track Download
  const handleTrackDownload = async (id: string) => {
    const newCount = await trackAssetDownload(id);
    setDownloads((prev) => ({ ...prev, [id]: newCount }));
  };

  // Copy Code Handler
  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`📋 Kode #${code} berhasil disalin!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setSelectedCategory('all');
    setSortType('newest');
    showToast('Semua filter direset');
  };

  const isFiltered =
    Boolean(searchQuery) ||
    activeFilter !== 'all' ||
    selectedCategory !== 'all' ||
    sortType !== 'newest';

  // Total downloads sum
  const totalDownloadsSum = useMemo(() => {
    return Object.values(downloads).reduce<number>((a, b) => a + (Number(b) || 0), 0);
  }, [downloads]);

  // Modal open
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // Modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D11] text-[#E5E7EB] font-sans selection:bg-green-500/30 selection:text-green-200">
      {/* Header Navigation */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        favoritesCount={favorites.size}
        isFavFilterActive={activeFilter === 'fav'}
        toggleFavFilter={() => setActiveFilter(activeFilter === 'fav' ? 'all' : 'fav')}
        syncStatus={syncStatus}
        onRefresh={() => loadData(false)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 py-2 sm:py-3">
        {/* Hero Section */}
        <Hero onQuickCategorySelect={(tag) => setSearchQuery(tag)} />

        {/* Search, Filter Tabs & Category Pills */}
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categoriesWithCounts}
          sortType={sortType}
          setSortType={setSortType}
          onReset={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Stats Metrics Bar */}
        <StatsBar
          totalAssets={assets.length}
          filteredCount={filteredAssets.length}
          totalCategories={categoriesWithCounts.length}
          totalDownloads={totalDownloadsSum}
          syncStatus={syncStatus}
        />

        {/* Featured Latest Carousel */}
        {!isFiltered && featuredAssets.length > 0 && (
          <FeaturedCarousel
            assets={featuredAssets}
            downloads={downloads}
            onSelectAsset={handleSelectAsset}
          />
        )}

        {/* Asset Collection Section Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider">
              ASSET_INDEX
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#161B22] text-green-400 border border-[#252A34]">
              {filteredAssets.length} ITEMS
            </span>
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-green-400 hover:underline transition-colors"
            >
              [RESET FILTERS]
            </button>
          )}
        </div>

        {/* Responsive Asset Grid */}
        <AssetGrid
          assets={filteredAssets}
          isLoading={isLoading}
          downloads={downloads}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelectAsset={handleSelectAsset}
          onCopyCode={handleCopyCode}
          copiedCode={copiedCode}
          onResetFilters={handleResetFilters}
          isError={isError}
          onRetry={() => loadData(false)}
        />
      </main>

      {/* Detail Modal */}
      <AssetModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        downloadCount={selectedAsset ? downloads[selectedAsset.Kode] || 0 : 0}
        isFavorite={selectedAsset ? favorites.has(selectedAsset.Kode) : false}
        onToggleFavorite={toggleFavorite}
        onTrackDownload={handleTrackDownload}
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded bg-[#11141A] border border-green-500/40 text-gray-200 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
