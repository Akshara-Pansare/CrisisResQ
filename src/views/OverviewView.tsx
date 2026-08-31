import React from 'react';
import { Clock, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Habitation, Shelter, EvacuationRoute, ResponsePlan } from '../types';
import { KPIStatCards } from '../components/KPIStatCards';
import { GISRiskMap } from '../components/GISRiskMap';
import { HabitationDetailPanel } from '../components/HabitationDetailPanel';
import { PriorityHabitationsCard } from '../components/PriorityHabitationsCard';
import { ShelterCapacityCard } from '../components/ShelterCapacityCard';
import { ResourceOverviewCard } from '../components/ResourceOverviewCard';
import { RecommendedActionCard } from '../components/RecommendedActionCard';
import { NavSection } from '../components/Sidebar';

interface OverviewViewProps {
  habitations: Habitation[];
  shelters: Shelter[];
  routes: EvacuationRoute[];
  selectedHabitation: Habitation;
  onSelectHabitation: (hab: Habitation) => void;
  selectedShelter: Shelter;
  onSelectShelter: (shelter: Shelter) => void;
  onGeneratePlan: () => void;
  onNavigate: (section: NavSection) => void;
  onViewActionPlan: () => void;
  lastUpdatedText?: string;
  onRefresh?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  habitations = [],
  shelters = [],
  routes = [],
  selectedHabitation,
  onSelectHabitation,
  selectedShelter,
  onSelectShelter,
  onGeneratePlan,
  onNavigate,
  onViewActionPlan,
  lastUpdatedText = '2 minutes ago',
  onRefresh,
}) => {
  const safeHabitations = habitations || [];
  const safeShelters = shelters || [];
  const safeRoutes = routes || [];

  const criticalHabitationsCount = safeHabitations.filter((h) => h.riskLevel === 'Critical' || h.riskScore >= 70).length;
  const totalAtRiskPop = safeHabitations
    .filter((h) => h.riskScore >= 60)
    .reduce((sum, h) => sum + h.population, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Page Heading Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Emergency Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Real-time risk intelligence, vulnerable population analysis and relocation readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#667085]">
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#D9DEE7] shadow-2xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last updated: <strong className="text-[#0F172A]">{lastUpdatedText}</strong>
          </span>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-md hover:bg-slate-200 bg-white border border-[#D9DEE7] text-slate-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Premium KPI Stat Cards */}
      <KPIStatCards
        totalAtRiskPop={totalAtRiskPop || 1240}
        criticalHabitationsCount={criticalHabitationsCount || 6}
        totalShelterCapacity={8200}
        availableShelterCapacity={3150}
        activeResponsePlansCount={18}
        plansRequiringReviewCount={6}
        onCardClick={(type) => {
          if (type === 'habitations') onNavigate('priority');
          if (type === 'shelters') onNavigate('shelters');
          if (type === 'plans') onNavigate('reports');
          if (type === 'population') onNavigate('risk-map');
        }}
      />

      {/* Centerpiece: GIS Risk Map & Right-Side Selected Habitation Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left GIS Risk Map (~68% on large screens) */}
        <div className="lg:col-span-8 space-y-2">
          <GISRiskMap
            habitations={habitations}
            shelters={shelters}
            routes={routes}
            selectedHabitationId={selectedHabitation?.id || null}
            onSelectHabitation={onSelectHabitation}
            selectedShelterId={selectedShelter?.id || null}
            onSelectShelter={onSelectShelter}
            activeRouteId="route-a"
          />
        </div>

        {/* Right Selected Habitation Intelligence Panel (~32%) */}
        <div className="lg:col-span-4">
          <HabitationDetailPanel
            habitation={selectedHabitation}
            shelter={selectedShelter}
            onGeneratePlan={onGeneratePlan}
          />
        </div>
      </div>

      {/* 4 Bottom Cards matching reference grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Top Priority Habitations */}
        <PriorityHabitationsCard
          habitations={habitations}
          onSelectHabitation={onSelectHabitation}
          onViewAll={() => onNavigate('priority')}
        />

        {/* 2. Shelter Capacity Status Donut */}
        <ShelterCapacityCard
          onViewAll={() => onNavigate('shelters')}
        />

        {/* 3. Resources Overview */}
        <ResourceOverviewCard
          onViewAll={() => onNavigate('resources')}
        />

        {/* 4. Recommended Action Card */}
        <RecommendedActionCard
          criticalHabitationsCount={criticalHabitationsCount}
          atRiskPopulationCount={totalAtRiskPop}
          onViewActionPlan={onViewActionPlan}
        />
      </div>
    </div>
  );
};
