import React from 'react';
import { ArrowRight, AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react';
import { Habitation } from '../types';

interface PriorityHabitationsCardProps {
  habitations: Habitation[];
  onSelectHabitation: (hab: Habitation) => void;
  onViewAll: () => void;
}

export const PriorityHabitationsCard: React.FC<PriorityHabitationsCardProps> = ({
  habitations,
  onSelectHabitation,
  onViewAll,
}) => {
  // Sort habitations by risk score descending and take top 4
  const topPriorities = [...habitations]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-[#C62828] bg-red-50 border-red-200';
    if (score >= 60) return 'text-[#D97706] bg-amber-50 border-amber-200';
    if (score >= 40) return 'text-[#2563EB] bg-blue-50 border-blue-200';
    return 'text-[#15803D] bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            TOP PRIORITY HABITATIONS
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#C62828]">
            CRITICAL QUEUE
          </span>
        </div>

        {/* Ranked list */}
        <div className="divide-y divide-slate-100 mt-2">
          {topPriorities.map((hab, index) => (
            <div
              key={hab.id}
              onClick={() => onSelectHabitation(hab)}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1.5 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-slate-400 font-mono">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                    {hab.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {hab.population.toLocaleString()} residents • {hab.hazard}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${getRiskColor(hab.riskScore)}`}>
                  {hab.riskScore}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group transition-colors"
        >
          <span>View all priorities</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
