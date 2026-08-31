import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Download,
  Calendar,
  ExternalLink,
  MessageCircle,
  Mail,
  Lock,
  Star,
  Sparkles,
  ShieldCheck,
  Video,
  Heart,
  FolderDown,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Asset } from '../types';
import {
  getItemType,
  getTags,
  formatDateIndonesian,
  WA_NUMBER,
  ORDER_EMAIL
} from '../services/api';

interface AssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  downloadCount: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTrackDownload: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  asset,
  isOpen,
  onClose,
  downloadCount,
  isFavorite,
  onToggleFavorite,
  onTrackDownload,
  showToast,
}) => {
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isAdUnlocked, setIsAdUnlocked] = useState(false);

  useEffect(() => {
    if (!asset) return;

    // Check if ad was completed for this code
    const isUnlocked = sessionStorage.getItem(`ad_done_${asset.Kode}`) === 'true';
    setIsAdUnlocked(isUnlocked);

    // Update URL query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('code', asset.Kode);
    window.history.replaceState({}, '', url.toString());

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [asset, onClose]);

  if (!isOpen || !asset) return null;

  const type = getItemType(asset);
  const tags = getTags(asset);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(asset.Kode);
    setIsCopiedCode(true);
    showToast(`📋 Kode #${asset.Kode} disalin ke clipboard!`);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(asset.Kode)}`;
    navigator.clipboard.writeText(url);
    setIsCopiedLink(true);
    showToast(`🔗 Link asset #${asset.Kode} berhasil disalin!`);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(asset.Kode)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CTFY - ${asset.Nama}`,
          text: `Download asset preset/template ${asset.Nama} (#${asset.Kode}) di CTFY!`,
          url: url,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const triggerDownloadConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981'],
      });
    } catch (e) {}
  };

  const handleDownloadClick = async (url: string) => {
    triggerDownloadConfetti();
    await onTrackDownload(asset.Kode);
    showToast(`⬇️ Mengunduh asset #${asset.Kode}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAdUnlock = () => {
    const adUrl = asset.Link5MB && asset.Link5MB !== '#' ? asset.Link5MB : '#';
    if (adUrl && adUrl !== '#') {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    }
    sessionStorage.setItem(`ad_done_${asset.Kode}`, 'true');
    setIsAdUnlocked(true);
    showToast('✨ Link berhasil dibuka! Silakan unduh asset Anda.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                #{asset.Kode}
              </span>

              {type === 'paid' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                  <Lock className="w-3 h-3" /> Paid Asset
                </span>
              )}
              {type === 'pro' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Pro (Iklan)
                </span>
              )}
              {type === 'free' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  Gratis
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-tight">
              {asset.Nama || 'Detail Asset'}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onToggleFavorite(asset.Kode, e)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-rose-400'
              }`}
              title="Favorit"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/80"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Details Table */}
          <div className="rounded-2xl bg-neutral-950/60 border border-neutral-800/80 p-3.5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-neutral-300">
              <span className="text-neutral-500 font-medium">Kategori:</span>
              <span className="font-semibold">{asset.Kategori || 'General Motion'}</span>
            </div>

            <div className="flex justify-between items-center text-neutral-300">
              <span className="text-neutral-500 font-medium">Total Downloads:</span>
              <span className="font-semibold text-emerald-400 font-mono flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> {downloadCount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center text-neutral-300">
              <span className="text-neutral-500 font-medium">Tanggal Diperbarui:</span>
              <span className="flex items-center gap-1 text-neutral-400">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {formatDateIndonesian(asset.Tanggal)}
              </span>
            </div>

            <div className="flex justify-between items-center text-neutral-300">
              <span className="text-neutral-500 font-medium">Kode Asset:</span>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-indigo-300 font-mono transition-colors"
              >
                {isCopiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{asset.Kode}</span>
              </button>
            </div>
          </div>

          {/* Action Links Section */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Pilihan Unduh & Akses
            </h4>

            {/* PAID ASSET FLOW */}
            {type === 'paid' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Asset ini adalah produk premium/berbayar. Hubungi kreator untuk pemesanan.</span>
                </div>

                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    `Halo, saya mau order ${asset.Kode} - ${asset.Nama}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp ({WA_NUMBER})</span>
                </a>

                <a
                  href={`mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
                    `Order ${asset.Kode} - ${asset.Nama}`
                  )}&body=${encodeURIComponent(
                    `Halo,\n\nSaya tertarik untuk membeli asset:\nKode: ${asset.Kode}\nNama: ${asset.Nama}\nKategori: ${asset.Kategori || 'Umum'}\n\nMohon informasi metode pembayaran dan pengiriman file. Terima kasih.`
                  )}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs border border-neutral-700 transition-all"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Order via Email ({ORDER_EMAIL})</span>
                </a>
              </div>
            )}

            {/* PRO ASSET FLOW (Ad-gated) */}
            {type === 'pro' && (
              <div>
                {!isAdUnlocked ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/30 to-indigo-950/20 border border-purple-800/40 text-center space-y-3">
                    <div className="inline-flex p-2 rounded-xl bg-purple-500/10 text-purple-300">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-xs text-neutral-300">
                      <p className="font-semibold text-sm text-neutral-100 mb-1">Asset Pro Eksklusif</p>
                      <p className="text-neutral-400">
                        Klik tombol di bawah untuk membuka akses download melalui link sponsor kami.
                      </p>
                    </div>
                    <button
                      onClick={handleAdUnlock}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>🔗 Buka Link Iklan & Buka Kunci</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Akses terbuka! Silakan klik link unduh di bawah:</span>
                    </div>

                    {asset.LinkDrive && asset.LinkDrive !== '#' && (
                      <button
                        onClick={() => handleDownloadClick(asset.LinkDrive!)}
                        className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-900/20"
                      >
                        <span className="flex items-center gap-2">
                          <FolderDown className="w-4 h-4" /> Link Google Drive
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </button>
                    )}

                    {asset.LinkAsset && asset.LinkAsset !== '#' && (
                      <button
                        onClick={() => handleDownloadClick(asset.LinkAsset!)}
                        className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-purple-400" /> Link File Asset
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </button>
                    )}

                    {asset.LinkTiktok && asset.LinkTiktok !== '#' && (
                      <a
                        href={asset.LinkTiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-pink-400" /> Tutorial di TikTok
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* FREE ASSET FLOW */}
            {type === 'free' && (
              <div className="space-y-2">
                {asset.Link5MB && asset.Link5MB !== '#' && (
                  <button
                    onClick={() => handleDownloadClick(asset.Link5MB!)}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/20"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download Preset / XML (&lt; 5MB)
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}

                {asset.LinkDrive && asset.LinkDrive !== '#' && (
                  <button
                    onClick={() => handleDownloadClick(asset.LinkDrive!)}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <FolderDown className="w-4 h-4 text-indigo-400" /> Download via Google Drive
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}

                {asset.LinkAsset && asset.LinkAsset !== '#' && (
                  <button
                    onClick={() => handleDownloadClick(asset.LinkAsset!)}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-400" /> Download Direct File
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}

                {asset.LinkTiktok && asset.LinkTiktok !== '#' && (
                  <a
                    href={asset.LinkTiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-pink-400" /> Lihat Video Preview di TikTok
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}

                {!asset.Link5MB && !asset.LinkDrive && !asset.LinkAsset && !asset.LinkTiktok && (
                  <div className="p-4 rounded-xl bg-neutral-800/60 text-center text-xs text-neutral-400 border border-neutral-700">
                    Link download untuk asset ini akan segera ditambahkan oleh kreator.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer: Share & Copy Link */}
        <div className="pt-4 mt-2 border-t border-neutral-800 flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedLink ? 'Link Tersalin' : 'Salin Link'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
