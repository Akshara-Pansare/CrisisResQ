import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Flame, 
  Sliders, 
  ShieldAlert, 
  Waves, 
  Eye, 
  Compass, 
  Navigation,
  Download,
  AlertOctagon,
  Search,
  Filter
} from 'lucide-react';
import { Habitation, Shelter, EvacuationRoute } from '../types';
import { GISRiskMap } from '../components/GISRiskMap';
import { HabitationDetailPanel } from '../components/HabitationDetailPanel';

interface RiskMapViewProps {
  habitations: Habitation[];
  shelters: Shelter[];
  routes: EvacuationRoute[];
  selectedHabitation: Habitation;
  onSelectHabitation: (hab: Habitation) => void;
  selectedShelter: Shelter;
  onSelectShelter: (shelter: Shelter) => void;
  onGeneratePlan: () => void;
}

export const RiskMapView: React.FC<RiskMapViewProps> = ({
  habitations = [],
  shelters = [],
  routes = [],
  selectedHabitation,
  onSelectHabitation,
  selectedShelter,
  onSelectShelter,
  onGeneratePlan,
}) => {
  const safeHabitations = habitations || [];
  const [floodSurgeMeters, setFloodSurgeMeters] = useState<number>(0.82);
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHabitations = safeHabitations.filter((hab) => {
    const matchesRisk = filterRisk === 'All' || hab.riskLevel === filterRisk;
    const matchesSearch = hab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hab.subdivision.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-[#2563EB]" />
            GIS Hazard & Risk Intelligence Map
          </h1>
          <p className="text-xs text-[#667085]">
            Multi-spectral spatial modeling of Brahmaputra basin inundation, terrain contours, and habitation vulnerabilities.
          </p>
        </div>

        {/* Live Simulation Controls Bar */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D9DEE7] shadow-2xs">
          <Waves className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Simulated Surge:</span>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={floodSurgeMeters}
            onChange={(e) => setFloodSurgeMeters(parseFloat(e.target.value))}
            className="w-24 accent-blue-600 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#C62828] min-w-[50px]">
            +{floodSurgeMeters.toFixed(2)}m
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#D9DEE7] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search habitation or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Risk Filter:
          </span>
          {['All', 'Critical', 'High', 'Moderate', 'Low'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filterRisk === level
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <GISRiskMap
            habitations={filteredHabitations}
            shelters={shelters}
            routes={routes}
            selectedHabitationId={selectedHabitation?.id || null}
            onSelectHabitation={onSelectHabitation}
            selectedShelterId={selectedShelter?.id || null}
            onSelectShelter={onSelectShelter}
            heightClass="h-[560px] lg:h-[620px]"
          />
        </div>

        <div className="lg:col-span-4">
          <HabitationDetailPanel
            habitation={selectedHabitation}
            shelter={selectedShelter}
            onGeneratePlan={onGeneratePlan}
          />
        </div>
      </div>
    </div>
  );
};
