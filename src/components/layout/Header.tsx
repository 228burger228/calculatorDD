import React from 'react';
import { DMITRY_DIMA_STUDIO } from '../../types/studio';
import { Sparkles, ExternalLink, ShieldCheck, Send } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Studio Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">
                  D&D
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Dmitry & Dima <span className="text-violet-400 font-mono text-xs px-1.5 py-0.5 rounded bg-violet-950/60 border border-violet-800/40">v{DMITRY_DIMA_STUDIO.version}</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Pricing Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Персональный калькулятор стоимости digital-проектов
              </p>
            </div>
          </div>

          {/* Quick Studio Contacts & Trust */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Поэтапная оплата по спринтам</span>
            </div>

            <a
              href={`https://t.me/${DMITRY_DIMA_STUDIO.leadDmitry.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/50 hover:bg-violet-900/60 border border-violet-800/40 text-violet-200 transition-colors"
              title="Написать Дмитрию в Telegram"
            >
              <Send className="w-3 h-3 text-violet-400" />
              <span>Дмитрий: {DMITRY_DIMA_STUDIO.leadDmitry.telegram}</span>
            </a>

            <a
              href={DMITRY_DIMA_STUDIO.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <span>Портфолио</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
