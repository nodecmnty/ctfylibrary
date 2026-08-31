import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { WA_NUMBER, ORDER_EMAIL } from '../services/api';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-[#252A34] bg-[#0B0D11] py-3 text-xs font-mono text-gray-500">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold text-[10px]">
            &gt;_
          </div>
          <div>
            <span className="font-bold text-gray-300">CTFY_ASSET_REPOSITORY</span>
            <span className="text-gray-600 text-[10px] ml-2">v3.2.0-HIGH_DENSITY</span>
          </div>
        </div>

        {/* Social / Contact Links */}
        <div className="flex items-center gap-3 text-[11px]">
          <a
            href="https://tiktok.com/@imctfy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-400 hover:text-pink-400 border border-[#252A34] transition-colors"
          >
            TIKTOK
          </a>

          <a
            href="https://instagram.com/imctfy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-400 hover:text-purple-400 border border-[#252A34] transition-colors"
          >
            INSTAGRAM
          </a>

          <a
            href="https://youtube.com/@imctfy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-400 hover:text-red-400 border border-[#252A34] transition-colors"
          >
            YOUTUBE
          </a>

          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-400 hover:text-green-400 border border-[#252A34] transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WA</span>
          </a>

          <a
            href={`mailto:${ORDER_EMAIL}`}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#161B22] hover:bg-[#1C212B] text-gray-400 hover:text-blue-400 border border-[#252A34] transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span>EMAIL</span>
          </a>
        </div>

        <div className="text-[10px] text-gray-600">
          DATA_STREAM: GOOGLE_SHEETS // NO_SCRIPT_MUTATION
        </div>
      </div>
    </footer>
  );
};

