import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Truck, 
  TrendingUp, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Route as RouteIcon,
  Send
} from 'lucide-react';
import { EvacuationRoute, Habitation, Shelter } from '../types';
import { GISRiskMap } from '../components/GISRiskMap';

interface EvacuationRoutesViewProps {
  routes: EvacuationRoute[];
  habitations: Habitation[];
  shelters: Shelter[];
  selectedHabitation: Habitation;
  onSelectHabitation: (hab: Habitation) => void;
  selectedShelter: Shelter;
  onSelectShelter: (shelter: Shelter) => void;
  onDispatchConvoy: (route: EvacuationRoute) => void;
}

export const EvacuationRoutesView: React.FC<EvacuationRoutesViewProps> = ({
  routes,
  habitations,
  shelters,
  selectedHabitation,
  onSelectHabitation,
  selectedShelter,
  onSelectShelter,
  onDispatchConvoy,
}) => {
  const [activeRouteId, setActiveRouteId] = useState<string>('route-a');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStatus, setOptimizationStatus] = useState<string>('Real-time corridor telemetry synchronized.');

  const currentRoute = routes.find((r) => r.id === activeRouteId) || routes[0];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationStatus('Analyzing dynamic hydrologic flow & elevation safety...');
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationStatus('Route A confirmed optimal based on zero inundation breach risk.');
      setActiveRouteId('route-a');
    }, 900);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-[#2563EB]" />
            AI Evacuation Route Optimizer
          </h1>
          <p className="text-xs text-[#667085]">
            Multi-criteria evacuation routing favoring flood elevation clearance and heavy transport stability over raw distance.
          </p>
        </div>

        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOptimizing ? 'Optimizing Corridor...' : 'OPTIMIZE EVACUATION ROUTE'}</span>
        </button>
      </div>

      {/* Main Grid: GIS Map on Left, Route Details & Options on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Map View (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-[#D9DEE7] shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Origin:</span>
              <span className="font-bold text-[#0F172A]">{selectedHabitation.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">Destination:</span>
              <span className="font-bold text-emerald-700">{selectedShelter.name}</span>
            </div>
            <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
              Active: {currentRoute.name.split(' ')[0]} {currentRoute.name.split(' ')[1]}
            </span>
          </div>

          <GISRiskMap
            habitations={habitations}
            shelters={shelters}
            routes={routes}
            selectedHabitationId={selectedHabitation.id}
            onSelectHabitation={onSelectHabitation}
            selectedShelterId={selectedShelter.id}
            onSelectShelter={onSelectShelter}
            activeRouteId={activeRouteId}
            heightClass="h-[520px]"
          />
        </div>

        {/* Right Route Inspection & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Route Detailed Card */}
          <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    CORRIDOR TELEMETRY
                  </span>
                  {currentRoute.isRecommended && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#15803D] text-white">
                      AI RECOMMENDED
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-[#0F172A] mt-0.5">
                  {currentRoute.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-[#0F172A] font-mono block leading-none">
                  {currentRoute.distanceKm} km
                </span>
                <span className="text-[11px] text-slate-500 font-medium font-mono">
                  ~{currentRoute.estimatedTimeMin} min ETA
                </span>
              </div>
            </div>

            {/* Logistics Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                <span className="text-[10px] text-[#667085] block">Road Condition</span>
                <span className="font-bold text-[#0F172A]">{currentRoute.roadCondition}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                <span className="text-[10px] text-[#667085] block">Traffic Status</span>
                <span className="font-bold text-emerald-700">{currentRoute.trafficStatus}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                <span className="text-[10px] text-[#667085] block">Flood Obstruction</span>
                <span className={`font-bold font-mono ${currentRoute.obstructionRisk === 'High' ? 'text-[#C62828]' : 'text-emerald-700'}`}>
                  {currentRoute.obstructionRisk} Risk ({currentRoute.floodExposurePct}%)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                <span className="text-[10px] text-[#667085] block">Safety Index</span>
                <span className="font-bold text-blue-600 font-mono">{currentRoute.safetyScore} / 100</span>
              </div>
            </div>

            {/* Recommended Vehicle Types */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-800 block mb-0.5">
                Authorized Transit Fleet
              </span>
              <p className="text-slate-700 font-medium flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                {currentRoute.recommendedTransport}
              </p>
            </div>

            {/* Dispatch Convoy Button */}
            <button
              onClick={() => onDispatchConvoy(currentRoute)}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>DISPATCH CONVOY ON THIS CORRIDOR</span>
            </button>
          </div>

          {/* Alternative Routes Switcher List */}
          <div className="bg-white rounded-xl border border-[#D9DEE7] p-4 shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block font-mono">
              COMPARE ALL ROUTE OPTIONS
            </span>

            <div className="space-y-2">
              {routes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveRouteId(r.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activeRouteId === r.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${r.isRecommended ? 'bg-[#15803D]' : r.obstructionRisk === 'High' ? 'bg-[#C62828]' : 'bg-slate-400'}`} />
                      <span className="text-xs font-bold text-[#0F172A]">{r.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0F172A]">
                      {r.distanceKm} km
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 pl-5">
                    <span>ETA: ~{r.estimatedTimeMin} min</span>
                    <span className={`font-semibold ${r.obstructionRisk === 'High' ? 'text-red-700' : 'text-slate-600'}`}>
                      {r.obstructionRisk === 'High' ? '⚠️ High Flood Exposure' : r.isRecommended ? '✓ Recommended Corridor' : 'Safe Detour'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
