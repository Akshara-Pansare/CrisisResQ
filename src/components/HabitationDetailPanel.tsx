import React from 'react';
import { 
  AlertOctagon, 
  Users, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  Route, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  Building2,
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Habitation, Shelter } from '../types';

interface HabitationDetailPanelProps {
  habitation: Habitation | null;
  shelter: Shelter | null;
  onGeneratePlan: () => void;
  onClose?: () => void;
}

export const HabitationDetailPanel: React.FC<HabitationDetailPanelProps> = ({
  habitation,
  shelter,
  onGeneratePlan,
  onClose,
}) => {
  if (!habitation) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#D9DEE7] shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">No Habitation Selected</h3>
        <p className="text-xs text-slate-500 max-w-[220px] mt-1">
          Click any habitation marker on the GIS map or choose from the priority list to view real-time risk intelligence.
        </p>
      </div>
    );
  }

  // Calculate Risk Badge Styling
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-[#C62828] text-white';
      case 'High':
        return 'bg-[#D97706] text-white';
      case 'Moderate':
        return 'bg-[#2563EB] text-white';
      case 'Low':
      case 'Safe':
        return 'bg-[#15803D] text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const getProgressBarColor = (val: number) => {
    if (val >= 75) return 'bg-[#C62828]';
    if (val >= 60) return 'bg-[#D97706]';
    if (val >= 40) return 'bg-[#2563EB]';
    return 'bg-[#15803D]';
  };

  return (
    <div 
      id="selected-habitation-panel" 
      className="bg-white rounded-xl border border-[#D9DEE7] shadow-sm p-5 flex flex-col justify-between space-y-4"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] font-mono">
            SELECTED HABITATION
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${getBadgeStyle(habitation.riskLevel)}`}>
            {habitation.riskLevel.toUpperCase()} RISK
          </span>
        </div>

        <div className="mt-1 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              {habitation.name}
            </h2>
            <p className="text-xs text-[#667085] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {habitation.subdivision}
            </p>
          </div>
        </div>

        {/* Basic Stats row */}
        <div className="mt-3 grid grid-cols-2 gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-100 text-xs">
          <div>
            <span className="text-[#667085] text-[11px]">Population</span>
            <div className="font-bold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>{habitation.population.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <span className="text-[#667085] text-[11px]">Primary Hazard</span>
            <div className="font-bold text-[#C62828] flex items-center gap-1.5 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>{habitation.hazard}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score Metric Section */}
      <div className="pt-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            RISK SCORE
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#0F172A] font-mono">
              {habitation.riskScore}
            </span>
            <span className="text-xs text-[#667085] font-semibold">/ 100</span>
          </div>
        </div>

        {/* Horizontal Score Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 border border-slate-200">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${getProgressBarColor(habitation.riskScore)}`}
            style={{ width: `${habitation.riskScore}%` }}
          />
        </div>
      </div>

      {/* "Why This Risk?" 4-Factor Breakdown */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block font-mono">
          WHY THIS RISK?
        </span>

        <div className="space-y-2 text-xs">
          {/* Factor 1: Flood Exposure */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-[#0F172A]">Flood Exposure</span>
              <span className="font-bold text-[#C62828] font-mono">{habitation.factors.floodExposure}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#C62828] rounded-full" style={{ width: `${habitation.factors.floodExposure}%` }} />
            </div>
          </div>

          {/* Factor 2: Population Density */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-[#0F172A]">Population Density</span>
              <span className="font-bold text-[#D97706] font-mono">{habitation.factors.populationDensity}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${habitation.factors.populationDensity}%` }} />
            </div>
          </div>

          {/* Factor 3: Vulnerability */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-[#0F172A]">Vulnerability</span>
              <span className="font-bold text-[#D97706] font-mono">{habitation.factors.vulnerability}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${habitation.factors.vulnerability}%` }} />
            </div>
          </div>

          {/* Factor 4: Historical Incidents */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-[#0F172A]">Historical Incidents</span>
              <span className="font-bold text-[#C62828] font-mono">{habitation.factors.historicalIncidents}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#C62828] rounded-full" style={{ width: `${habitation.factors.historicalIncidents}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerable Population 3-Column Breakdown */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block font-mono mb-2">
          VULNERABLE POPULATION
        </span>

        <div className="grid grid-cols-3 gap-2 text-center bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200/80">
          <div className="border-r border-slate-200 pr-1">
            <span className="text-[10px] uppercase font-semibold text-[#667085] block">Children</span>
            <span className="text-sm font-bold text-[#0F172A] block mt-0.5 font-mono">{habitation.vulnerablePop.childrenPct}%</span>
            <span className="text-[10px] text-slate-500 font-medium">{habitation.vulnerablePop.childrenCount} ppl</span>
          </div>

          <div className="border-r border-slate-200 px-1">
            <span className="text-[10px] uppercase font-semibold text-[#667085] block">Elderly</span>
            <span className="text-sm font-bold text-[#0F172A] block mt-0.5 font-mono">{habitation.vulnerablePop.elderlyPct}%</span>
            <span className="text-[10px] text-slate-500 font-medium">{habitation.vulnerablePop.elderlyCount} ppl</span>
          </div>

          <div className="pl-1">
            <span className="text-[10px] uppercase font-semibold text-[#667085] block">PwD</span>
            <span className="text-sm font-bold text-[#0F172A] block mt-0.5 font-mono">{habitation.vulnerablePop.disabledPct}%</span>
            <span className="text-[10px] text-slate-500 font-medium">{habitation.vulnerablePop.disabledCount} ppl</span>
          </div>
        </div>
      </div>

      {/* AI Relocation Recommendation Box */}
      <div className="bg-gradient-to-b from-blue-50/60 to-slate-50 p-3.5 rounded-xl border border-blue-100 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Relocation Recommendation</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-[#15803D] text-white text-[9px] font-bold tracking-wider">
            AVAILABLE
          </span>
        </div>

        <div>
          <div className="font-bold text-[#0F172A] text-xs">
            {shelter?.name || 'Sonapur Community Hall'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {shelter?.location || 'Sonapur Centre, NH-27 Bypass'}
          </div>
        </div>

        {/* Shelter Capacity Metrics 3 Columns */}
        <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-blue-100/80 text-center text-xs">
          <div>
            <span className="text-[10px] text-[#667085] block">Capacity</span>
            <span className="font-bold text-[#0F172A] font-mono">{shelter?.totalCapacity.toLocaleString() || '1,500'}</span>
          </div>
          <div className="border-x border-slate-100">
            <span className="text-[10px] text-[#667085] block">Assigned</span>
            <span className="font-bold text-blue-600 font-mono">{shelter?.assignedCount.toLocaleString() || '1,240'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#667085] block">Remaining</span>
            <span className="font-bold text-emerald-600 font-mono">{shelter?.remainingCapacity.toLocaleString() || '260'}</span>
          </div>
        </div>

        {/* Travel Logistics row */}
        <div className="flex items-center justify-between text-xs pt-1 text-slate-600 px-1">
          <span className="flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-[#0F172A]">{habitation.distanceToShelterKm} km</strong> distance
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-[#0F172A]">{habitation.travelTimeMin} min</strong> travel time
          </span>
        </div>

        {/* Primary CTA Button: GENERATE RELOCATION PLAN -> */}
        <button
          id="btn-generate-relocation-plan"
          onClick={onGeneratePlan}
          className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-150 active:scale-[0.99]"
        >
          <span>GENERATE RELOCATION PLAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
