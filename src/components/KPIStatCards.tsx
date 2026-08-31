import React from 'react';
import { Users, AlertTriangle, Home, ClipboardCheck, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface KPIStatCardsProps {
  totalAtRiskPop?: number;
  criticalHabitationsCount?: number;
  totalShelterCapacity?: number;
  availableShelterCapacity?: number;
  activeResponsePlansCount?: number;
  plansRequiringReviewCount?: number;
  onCardClick?: (type: 'population' | 'habitations' | 'shelters' | 'plans') => void;
}

export const KPIStatCards: React.FC<KPIStatCardsProps> = ({
  totalAtRiskPop = 1240,
  criticalHabitationsCount = 6,
  totalShelterCapacity = 8200,
  availableShelterCapacity = 3150,
  activeResponsePlansCount = 18,
  plansRequiringReviewCount = 6,
  onCardClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. At-Risk Population */}
      <div 
        id="kpi-card-population"
        onClick={() => onCardClick?.('population')}
        className="bg-white rounded-xl p-5 border border-[#D9DEE7] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              AT-RISK POPULATION
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                {totalAtRiskPop.toLocaleString()}
              </span>
              <span className="text-xs text-[#667085] font-medium">People</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[#D97706] font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12% from yesterday</span>
          </div>
          <span className="text-[#667085] text-[11px]">Requires monitoring</span>
        </div>
      </div>

      {/* 2. Critical Habitations */}
      <div 
        id="kpi-card-habitations"
        onClick={() => onCardClick?.('habitations')}
        className="bg-white rounded-xl p-5 border border-[#D9DEE7] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              CRITICAL HABITATIONS
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#C62828] tracking-tight font-mono">
                {criticalHabitationsCount < 10 ? `0${criticalHabitationsCount}` : criticalHabitationsCount}
              </span>
              <span className="text-xs text-[#667085] font-medium">Habitations</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#C62828] group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-[#C62828] border border-red-200">
            Immediate Attention
          </span>
          <span className="text-[#667085] text-[11px]">High flood risk</span>
        </div>
      </div>

      {/* 3. Shelter Capacity */}
      <div 
        id="kpi-card-shelters"
        onClick={() => onCardClick?.('shelters')}
        className="bg-white rounded-xl p-5 border border-[#D9DEE7] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              SHELTER CAPACITY
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                {totalShelterCapacity.toLocaleString()}
              </span>
              <span className="text-xs text-[#667085] font-medium">People Capacity</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#15803D] group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#15803D] font-bold">
            {availableShelterCapacity.toLocaleString()} Available
          </span>
          <span className="text-[#667085] text-[11px]">38% Free Space</span>
        </div>
      </div>

      {/* 4. Active Response Plans */}
      <div 
        id="kpi-card-plans"
        onClick={() => onCardClick?.('plans')}
        className="bg-white rounded-xl p-5 border border-[#D9DEE7] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              ACTIVE RESPONSE PLANS
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                {activeResponsePlansCount}
              </span>
              <span className="text-xs text-[#667085] font-medium">Plans Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#D97706] font-semibold">
            {plansRequiringReviewCount} Require Review
          </span>
          <span className="text-[#15803D] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 12 Dispatched
          </span>
        </div>
      </div>
    </div>
  );
};
