import React, { useState } from 'react';
import { 
  Boxes, 
  Bus, 
  Package, 
  Droplets, 
  HeartPulse, 
  LifeBuoy, 
  Tent, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesViewProps {
  resources: ResourceItem[];
  onAllocateResource: (resourceId: string, amount: number) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources = [],
  onAllocateResource,
}) => {
  const safeResources = resources || [];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAllocatingModalOpen, setIsAllocatingModalOpen] = useState<boolean>(false);
  const [allocatingItem, setAllocatingItem] = useState<ResourceItem | null>(null);
  const [allocateAmount, setAllocateAmount] = useState<number>(5);

  const categories = ['All', 'Transport', 'Food', 'Water', 'Medical', 'Rescue Teams', 'Shelter Kits'];

  const filtered = safeResources.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase()) ||
      res.assignedZone.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sufficient':
        return 'bg-[#15803D] text-white';
      case 'Low':
        return 'bg-[#D97706] text-white';
      case 'Critical Shortage':
        return 'bg-[#C62828] text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Transport':
        return Bus;
      case 'Food':
        return Package;
      case 'Water':
        return Droplets;
      case 'Medical':
        return HeartPulse;
      case 'Rescue Teams':
        return LifeBuoy;
      default:
        return Tent;
    }
  };

  const handleOpenAllocate = (item: ResourceItem) => {
    setAllocatingItem(item);
    setAllocateAmount(Math.min(10, item.available - item.allocated > 0 ? item.available - item.allocated : 1));
    setIsAllocatingModalOpen(true);
  };

  const handleConfirmAllocate = () => {
    if (allocatingItem) {
      onAllocateResource(allocatingItem.id, allocateAmount);
      setIsAllocatingModalOpen(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-[#2563EB]" />
            Emergency Supply Logistics & Resource Inventory
          </h1>
          <p className="text-xs text-[#667085]">
            Real-time requisition, multi-agency stockpile telemetry, fleet dispatch, and shortage mitigation.
          </p>
        </div>

        <button
          onClick={() => handleOpenAllocate(resources[0])}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Resources</span>
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#D9DEE7] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search supply or hub..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-xl border border-[#D9DEE7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#172B4D] text-white uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Supply / Asset Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stockpile Available</th>
                <th className="py-3.5 px-4">Allocated / Required</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4">Assigned Base / Hub</th>
                <th className="py-3.5 px-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((res) => {
                const Icon = getCategoryIcon(res.category);
                const allocPct = Math.min(100, Math.round((res.allocated / res.required) * 100));

                return (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{res.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Unit: {res.unit}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {res.category}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">
                      {res.available.toLocaleString()} {res.unit}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs">
                        <span className="font-bold text-blue-600">{res.allocated.toLocaleString()}</span> / {res.required.toLocaleString()} {res.unit}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${allocPct === 100 ? 'bg-[#15803D]' : 'bg-[#D97706]'}`}
                          style={{ width: `${allocPct}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadge(res.status)}`}>
                        {res.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {res.assignedZone}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAllocate(res)}
                        className="px-3 py-1 rounded bg-white border border-[#D9DEE7] hover:bg-blue-50 hover:border-blue-300 text-blue-600 font-bold text-[11px] transition-colors"
                      >
                        Reallocate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocate Resources Modal */}
      {isAllocatingModalOpen && allocatingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#D9DEE7] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#0F172A]">
              Reallocate Supply: {allocatingItem.name}
            </h3>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Available Reserve:</span>
                <span className="font-bold font-mono">{allocatingItem.available.toLocaleString()} {allocatingItem.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currently Allocated:</span>
                <span className="font-bold font-mono text-blue-600">{allocatingItem.allocated.toLocaleString()} {allocatingItem.unit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Additional Allocation Units ({allocatingItem.unit}):
              </label>
              <input
                type="number"
                min="1"
                max={allocatingItem.available}
                value={allocateAmount}
                onChange={(e) => setAllocateAmount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAllocatingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAllocate}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase rounded-lg shadow-sm"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
