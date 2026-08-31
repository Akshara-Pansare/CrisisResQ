import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  HeartPulse, 
  Utensils, 
  Droplets, 
  Zap, 
  Accessibility, 
  ShieldCheck,
  Filter
} from 'lucide-react';
import { Shelter } from '../types';

interface SheltersViewProps {
  shelters: Shelter[];
  onSelectShelter: (shelter: Shelter) => void;
  onUpdateShelterCapacity?: (shelterId: string, delta: number) => void;
}

export const SheltersView: React.FC<SheltersViewProps> = ({
  shelters = [],
  onSelectShelter,
  onUpdateShelterCapacity,
}) => {
  const safeShelters = shelters || [];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeShelterId, setActiveShelterId] = useState<string>(safeShelters[0]?.id || '');

  const filtered = safeShelters.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = safeShelters.reduce((sum, s) => sum + s.totalCapacity, 0);
  const totalAssigned = safeShelters.reduce((sum, s) => sum + s.assignedCount, 0);
  const totalRemaining = safeShelters.reduce((sum, s) => sum + s.remainingCapacity, 0);
  const occupancyPct = Math.round((totalAssigned / totalCapacity) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-[#15803D] text-white';
      case 'Limited':
        return 'bg-[#D97706] text-white';
      case 'Full':
        return 'bg-[#C62828] text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#2563EB]" />
            Relief Shelter Capacity & Camp Logistics
          </h1>
          <p className="text-xs text-[#667085]">
            Real-time occupancy tracking, ration reserves, sanitation facilities, and intake registration.
          </p>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D9DEE7] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#667085] uppercase">Total Capacity</span>
          <div className="text-2xl font-extrabold text-[#0F172A] font-mono mt-0.5">
            {totalCapacity.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">{shelters.length} Designated Relief Hubs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9DEE7] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#667085] uppercase">Assigned / Occupied</span>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-0.5">
            {totalAssigned.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">{occupancyPct}% District Occupancy</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9DEE7] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#667085] uppercase">Available Capacity</span>
          <div className="text-2xl font-extrabold text-[#15803D] font-mono mt-0.5">
            {totalRemaining.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Immediate Space</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9DEE7] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#667085] uppercase">Ration Reserves</span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-0.5">
            6.2 Days
          </div>
          <span className="text-[10px] text-slate-500">Average Supply Buffer</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#D9DEE7] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search shelter name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          {['All', 'Available', 'Limited', 'Full'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                statusFilter === st
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((shelter) => {
          const occPct = Math.round((shelter.assignedCount / shelter.totalCapacity) * 100);

          return (
            <div
              key={shelter.id}
              onClick={() => {
                setActiveShelterId(shelter.id);
                onSelectShelter(shelter);
              }}
              className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                activeShelterId === shelter.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-[#D9DEE7]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">ID: {shelter.id}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${getStatusBadge(shelter.status)}`}>
                      {shelter.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0F172A] mt-1">
                    {shelter.name}
                  </h3>
                  <p className="text-xs text-[#667085] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {shelter.location} • <strong className="text-[#0F172A]">{shelter.distanceKm} km</strong> from centroid
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#15803D]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#667085]">Occupancy ({occPct}%)</span>
                  <span className="font-mono text-[#0F172A] font-bold">
                    {shelter.assignedCount.toLocaleString()} / {shelter.totalCapacity.toLocaleString()} Beds
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occPct > 85 ? 'bg-[#D97706]' : occPct > 95 ? 'bg-[#C62828]' : 'bg-[#15803D]'
                    }`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="text-emerald-700 font-bold">
                    {shelter.remainingCapacity.toLocaleString()} beds free
                  </span>
                  <span>{shelter.suppliesDaysRemaining} days food/water buffer</span>
                </div>
              </div>

              {/* Facilities Matrix */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-2 font-mono">
                  VERIFIED FACILITIES ON SITE
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 p-1.5 rounded ${shelter.facilities.medical ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Medical Post</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded ${shelter.facilities.food ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Utensils className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Kitchen/Food</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded ${shelter.facilities.water ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Droplets className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Potable Water</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded ${shelter.facilities.power ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Gen-Set Power</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded ${shelter.facilities.accessibility ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Accessibility className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">PwD Ramps</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded ${shelter.facilities.sanitation ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Sanitation Units</span>
                  </div>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{shelter.contactPerson}</span>
                </div>
                <span className="font-mono text-[11px] text-blue-600 font-bold">
                  {shelter.contactPhone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
