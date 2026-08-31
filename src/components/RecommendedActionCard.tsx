import React from 'react';
import { AlertOctagon, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

interface RecommendedActionCardProps {
  onViewActionPlan: () => void;
  criticalHabitationsCount?: number;
  atRiskPopulationCount?: number;
}

export const RecommendedActionCard: React.FC<RecommendedActionCardProps> = ({
  onViewActionPlan,
  criticalHabitationsCount = 6,
  atRiskPopulationCount = 1240,
}) => {
  return (
    <div className="bg-gradient-to-br from-red-50/70 via-white to-amber-50/40 rounded-xl border-2 border-red-200 p-5 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/50 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between pb-3 border-b border-red-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C62828] uppercase font-mono">
            <ShieldAlert className="w-4 h-4 text-[#C62828]" />
            <span>RECOMMENDED ACTION</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#C62828] text-white animate-pulse">
            URGENT
          </span>
        </div>

        <div className="mt-3">
          <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight flex items-center gap-1.5">
            Immediate Relocation
          </h3>
          <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
            <strong className="text-[#C62828]">{criticalHabitationsCount} habitations</strong> require immediate evacuation. <strong className="text-[#0F172A]">{atRiskPopulationCount.toLocaleString()} people</strong> are currently classified as high risk.
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-slate-700 bg-white/80 p-2 rounded-lg border border-red-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Corridor A (NH-27) is cleared for heavy transit</span>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-red-100">
        <button
          onClick={onViewActionPlan}
          className="w-full py-2 px-3 rounded-lg bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.99]"
        >
          <span>View Action Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
