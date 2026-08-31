import React from 'react';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-[#D9DEE7] bg-white text-[#667085] py-4 px-6 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#172B4D] text-blue-400 flex items-center justify-center font-bold text-[10px]">
            CR
          </div>
          <span className="font-bold text-[#0F172A]">CrisisResQ</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px]">AI-powered disaster intelligence & relocation decision support</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">SOP Guidelines</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy & Data Governance</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">EOC Support</span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          © 2026 CrisisResQ • Simulated Operational Platform
        </div>
      </div>
    </footer>
  );
};
