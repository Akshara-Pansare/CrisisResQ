import React, { useState } from 'react';
import { 
  ListOrdered, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  MapPin,
  Building2,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Habitation, Shelter, RiskLevel } from '../types';

interface PriorityHabitationsViewProps {
  habitations: Habitation[];
  shelters: Shelter[];
  onSelectHabitation: (hab: Habitation) => void;
  onGeneratePlan: () => void;
}

export const PriorityHabitationsView: React.FC<PriorityHabitationsViewProps> = ({
  habitations = [],
  shelters = [],
  onSelectHabitation,
  onGeneratePlan,
}) => {
  const safeHabitations = habitations || [];
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [hazardFilter, setHazardFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'riskScore' | 'population' | 'vulnerability' | 'distance'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedHab, setSelectedHab] = useState<Habitation | null>(safeHabitations[0] || null);

  // Filtering
  const filtered = safeHabitations.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.subdivision.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'All' || h.riskLevel === riskFilter;
    const matchesHazard = hazardFilter === 'All' || h.hazard === hazardFilter;
    return matchesSearch && matchesRisk && matchesHazard;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'riskScore') {
      valA = a.riskScore;
      valB = b.riskScore;
    } else if (sortBy === 'population') {
      valA = a.population;
      valB = b.population;
    } else if (sortBy === 'vulnerability') {
      valA = a.factors.vulnerability;
      valB = b.factors.vulnerability;
    } else if (sortBy === 'distance') {
      valA = a.distanceToShelterKm;
      valB = b.distanceToShelterKm;
    }

    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const getRiskBadge = (level: RiskLevel) => {
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

  const toggleSort = (field: 'riskScore' | 'population' | 'vulnerability' | 'distance') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-[#2563EB]" />
            Priority Habitation Triage Matrix
          </h1>
          <p className="text-xs text-[#667085]">
            Algorithmic ranking of settlements based on compound flood risk, vulnerable populations, and emergency egress corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white border border-[#D9DEE7] text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Priority CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search settlement name, circle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500 font-semibold">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical (&gt;75)</option>
              <option value="High">High (60-74)</option>
              <option value="Moderate">Moderate (40-59)</option>
              <option value="Low">Low (&lt;40)</option>
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="riskScore">Highest Risk Score</option>
              <option value="population">Largest Population</option>
              <option value="vulnerability">Highest Vulnerability %</option>
              <option value="distance">Distance to Shelter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-[#D9DEE7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#172B4D] text-white uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Habitation Settlement</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('population')}>
                  <span className="flex items-center gap-1">Population <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-4">Hazard</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('riskScore')}>
                  <span className="flex items-center gap-1">Risk Score <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('vulnerability')}>
                  <span className="flex items-center gap-1">Vulnerability <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-4">Nearest Shelter</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('distance')}>
                  <span className="flex items-center gap-1">Distance <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((hab, idx) => {
                const assignedShelter = shelters.find((s) => s.id === hab.recommendedShelterId) || shelters[0];
                const isSelected = selectedHab?.id === hab.id;

                return (
                  <tr
                    key={hab.id}
                    onClick={() => {
                      setSelectedHab(hab);
                      onSelectHabitation(hab);
                    }}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{hab.name}</div>
                      <div className="text-[11px] text-slate-500">{hab.subdivision}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#0F172A] font-semibold">
                      {hab.population.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        {hab.hazard}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${getRiskBadge(hab.riskLevel)}`}>
                        {hab.riskScore} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] mb-0.5 font-mono">
                          <span>{hab.factors.vulnerability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${hab.factors.vulnerability}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#0F172A] font-medium">
                      {assignedShelter.name}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {hab.distanceToShelterKm} km
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          hab.status === 'Evacuation Required'
                            ? 'bg-red-100 text-[#C62828]'
                            : hab.status === 'Alert Issued'
                            ? 'bg-amber-100 text-[#D97706]'
                            : 'bg-emerald-100 text-[#15803D]'
                        }`}
                      >
                        {hab.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHab(hab);
                          onSelectHabitation(hab);
                          onGeneratePlan();
                        }}
                        className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span>Plan</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
