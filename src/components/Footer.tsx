import React from 'react';
import { Mail, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { WA_NUMBER, ORDER_EMAIL } from '../services/api';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-neutral-800/80 bg-neutral-950/60 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              CTFY
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300 font-medium">Motion Design Assets</span>
          </div>

          <p className="text-neutral-400 max-w-md text-xs leading-relaxed">
            Kumpulan preset Alight Motion, CapCut, Premiere Pro & After Effects berkualitas untuk kreator konten dan motion designer Indonesia.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 py-2">
            <a
              href="https://tiktok.com/@imctfy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-pink-400 border border-neutral-800 transition-colors"
              aria-label="TikTok @imctfy"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.35a6.34 6.34 0 0 0-.85-.06A6.34 6.34 0 0 0 3.14 15.6a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9a8.28 8.28 0 0 0 4.86 1.57V7.12c-.38-.01-.76-.16-1.09-.43z" />
              </svg>
            </a>

            <a
              href="https://instagram.com/imctfy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-purple-400 border border-neutral-800 transition-colors"
              aria-label="Instagram @imctfy"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href="https://youtube.com/@imctfy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-red-500 border border-neutral-800 transition-colors"
              aria-label="YouTube @imctfy"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 border border-neutral-800 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${ORDER_EMAIL}`}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-indigo-400 border border-neutral-800 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()} CTFY by <span className="text-neutral-400 font-medium">@imctfy</span>. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Dibuat dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk Kreator Indonesia
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
