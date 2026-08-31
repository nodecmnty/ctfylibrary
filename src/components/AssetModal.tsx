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
  Terminal,
  Activity
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
    showToast(`📋 Code #${asset.Kode} copied`);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(asset.Kode)}`;
    navigator.clipboard.writeText(url);
    setIsCopiedLink(true);
    showToast(`🔗 Link #${asset.Kode} copied`);
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
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#3b82f6', '#a855f7', '#eab308'],
      });
    } catch (e) {}
  };

  const handleDownloadClick = async (url: string) => {
    triggerDownloadConfetti();
    await onTrackDownload(asset.Kode);
    showToast(`⬇️ Downloading asset #${asset.Kode}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAdUnlock = () => {
    const adUrl = asset.Link5MB && asset.Link5MB !== '#' ? asset.Link5MB : '#';
    if (adUrl && adUrl !== '#') {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    }
    sessionStorage.setItem(`ad_done_${asset.Kode}`, 'true');
    setIsAdUnlocked(true);
    showToast('✨ Access unlocked! Proceed with download.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn font-mono"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded bg-[#11141A] border border-[#252A34] shadow-2xl p-4 sm:p-5 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top High Density Bar */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#252A34] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              ASSET_INSPECTOR // #{asset.Kode}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onToggleFavorite(asset.Kode, e)}
              className={`p-1 rounded border transition-colors ${
                isFavorite
                  ? 'bg-[#2D1B24] border-red-500/50 text-red-400'
                  : 'bg-[#161B22] hover:bg-[#1C212B] border-[#30363D] text-gray-400 hover:text-red-400'
              }`}
              title="Favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded bg-[#161B22] hover:bg-[#1C212B] border border-[#30363D] text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Header Title */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#1C212B] text-green-400 border border-[#2D333E]">
              #{asset.Kode}
            </span>

            {type === 'paid' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Lock className="w-2.5 h-2.5" /> PAID ASSET
              </span>
            )}
            {type === 'pro' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> PRO (AD-GATED)
              </span>
            )}
            {type === 'free' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                FREE ASSET
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#E5E7EB] font-sans leading-tight">
            {asset.Nama || 'Detail Asset'}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1 text-xs font-mono">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.2 rounded text-[10px] bg-[#161B22] text-gray-400 border border-[#252A34]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Details Table */}
          <div className="rounded bg-[#161B22] border border-[#252A34] p-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">CATEGORY:</span>
              <span className="font-bold text-gray-200">{asset.Kategori || 'General Motion'}</span>
            </div>

            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">TOTAL DOWNLOADS:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Download className="w-3 h-3" /> {downloadCount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">DATE MODIFIED:</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3 h-3 text-gray-500" />
                {formatDateIndonesian(asset.Tanggal)}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">CODE ID:</span>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1C212B] hover:bg-[#252A34] text-green-400 border border-[#2D333E] transition-colors"
              >
                {isCopiedCode ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{asset.Kode}</span>
              </button>
            </div>
          </div>

          {/* Action Links Section */}
          <div className="pt-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              DISPATCH & ACCESS PIPELINE:
            </h4>

            {/* PAID ASSET FLOW */}
            {type === 'paid' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Asset berbayar / premium. Hubungi kreator langsung untuk akses lisensi:</span>
                </div>

                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    `Halo, saya mau order ${asset.Kode} - ${asset.Nama}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ORDER VIA WHATSAPP ({WA_NUMBER})</span>
                </a>

                <a
                  href={`mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
                    `Order ${asset.Kode} - ${asset.Nama}`
                  )}&body=${encodeURIComponent(
                    `Halo,\n\nSaya tertarik untuk membeli asset:\nKode: ${asset.Kode}\nNama: ${asset.Nama}\nKategori: ${asset.Kategori || 'Umum'}\n\nMohon informasi metode pembayaran dan pengiriman file. Terima kasih.`
                  )}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 font-medium text-xs border border-[#30363D] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>ORDER VIA EMAIL ({ORDER_EMAIL})</span>
                </a>
              </div>
            )}

            {/* PRO ASSET FLOW (Ad-gated) */}
            {type === 'pro' && (
              <div>
                {!isAdUnlocked ? (
                  <div className="p-3 rounded bg-[#161B22] border border-purple-800/40 text-center space-y-2">
                    <div className="inline-flex p-1.5 rounded bg-purple-500/10 text-purple-300">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-[11px] text-gray-300">
                      <p className="font-bold text-xs text-gray-100 mb-0.5">PRO SPONSORED ASSET</p>
                      <p className="text-gray-400 text-[10px]">
                        Klik tombol di bawah untuk membuka link sponsor dan membuka akses file download.
                      </p>
                    </div>
                    <button
                      onClick={handleAdUnlock}
                      className="w-full py-2 px-3 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>UNLOCK ACCESS (OPEN SPONSOR LINK)</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Access unlocked. Select download target:</span>
                    </div>

                    {asset.LinkDrive && asset.LinkDrive !== '#' && (
                      <button
                        onClick={() => handleDownloadClick(asset.LinkDrive!)}
                        className="flex items-center justify-between w-full py-2 px-3 rounded bg-green-600 hover:bg-green-500 text-white font-bold text-xs transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <FolderDown className="w-3.5 h-3.5" /> GOOGLE DRIVE MIRROR
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </button>
                    )}

                    {asset.LinkAsset && asset.LinkAsset !== '#' && (
                      <button
                        onClick={() => handleDownloadClick(asset.LinkAsset!)}
                        className="flex items-center justify-between w-full py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 font-bold text-xs border border-[#30363D] transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-purple-400" /> DIRECT ASSET FILE
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </button>
                    )}

                    {asset.LinkTiktok && asset.LinkTiktok !== '#' && (
                      <a
                        href={asset.LinkTiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 font-bold text-xs border border-[#30363D] transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-pink-400" /> TIKTOK TUTORIAL / PREVIEW
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* FREE ASSET FLOW */}
            {type === 'free' && (
              <div className="space-y-1.5">
                {asset.Link5MB && asset.Link5MB !== '#' && (
                  <button
                    onClick={() => handleDownloadClick(asset.Link5MB!)}
                    className="flex items-center justify-between w-full py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD PRESET / XML (&lt; 5MB)
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>
                )}

                {asset.LinkDrive && asset.LinkDrive !== '#' && (
                  <button
                    onClick={() => handleDownloadClick(asset.LinkDrive!)}
                    className="flex items-center justify-between w-full py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 font-bold text-xs border border-[#30363D] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <FolderDown className="w-3.5 h-3.5 text-green-400" /> GOOGLE DRIVE MIRROR
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>
                )}

                {asset.LinkAsset && asset.LinkAsset !== '#' && (
                  <button
                    onClick={() => handleDownloadClick(asset.LinkAsset!)}
                    className="flex items-center justify-between w-full py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 font-bold text-xs border border-[#30363D] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-purple-400" /> DIRECT FILE
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>
                )}

                {asset.LinkTiktok && asset.LinkTiktok !== '#' && (
                  <a
                    href={asset.LinkTiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 font-bold text-xs border border-[#30363D] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-pink-400" /> TIKTOK TUTORIAL / PREVIEW
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                )}

                {!asset.Link5MB && !asset.LinkDrive && !asset.LinkAsset && !asset.LinkTiktok && (
                  <div className="p-3 rounded bg-[#161B22] text-center text-xs text-gray-400 border border-[#252A34]">
                    Download link will be attached soon by creator.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 mt-2 border-t border-[#252A34] flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 text-xs font-mono font-bold border border-[#30363D] transition-colors"
          >
            {isCopiedLink ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            <span>{isCopiedLink ? 'LINK COPIED' : 'COPY LINK'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-200 text-xs font-mono font-bold border border-[#30363D] transition-colors"
          >
            <Share2 className="w-3 h-3 text-blue-400" />
            <span>SHARE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

